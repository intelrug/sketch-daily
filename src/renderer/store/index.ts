/* eslint-disable no-shadow */
import { join } from 'path';
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { Context } from '@nuxt/types';
import { remote } from 'electron';
import { ensureDirSync, ensureSymlinkSync, readdirSync, statSync, stat } from 'fs-extra';
import { Folder, RootState, TimerStatus } from '~/types/state';
import Utils from '~/utils/utils';

const isProduction = process.env.NODE_ENV === 'production';
const fileSystemPrefix = isProduction ? 'file:///' : 'http://sketchdaily.local/';

export const state = (): RootState => ({
  logged: false,
  myId: 0,
  path: '',
  folders: [],
  folderId: 0n,
  imageId: 0,
  images: [],
  timer: 0,
  timerDefault: 60,
  timerStatus: TimerStatus.stopped,
  timerInterval: undefined,
  randomizePictures: true,
  picturesCount: 1,
});

export const getters: GetterTree<RootState, RootState> = {
  currentImages: (state) =>
    state.images.slice(state.imageId, state.imageId + state.picturesCount) || [],
  isLastImage: (state) => state.imageId >= state.images.length - (state.picturesCount * 2 - 1),
  isFirstImage: (state) => state.imageId === 0,
  currentSlide: (state) => state.imageId / state.picturesCount + 1,
  slidesCount: (state) =>
    Math.floor((state.images.length - (state.picturesCount * 2 - 1)) / state.picturesCount + 1),
  folder: (state) => state.folders.find((f) => f.ino === state.folderId),
};

export const mutations: MutationTree<RootState> = {
  login: (state) => (state.logged = true),
  logout: (state) => (state.logged = false),
  setMyId: (state, myId: number) => (state.myId = myId),
  setPath: (state, path: string) => {
    localStorage.setItem('path', path);
    state.path = path;
  },
  setFolders: (state, folders) => (state.folders = folders),
  setFolderId: (state, folderId: bigint) => {
    localStorage.setItem('folderId', folderId.toString());
    state.folderId = folderId;
  },
  setImages: (state, images: string[]) => (state.images = images),
  setImageId: (state, imageId: number) => (state.imageId = imageId),
  incrementImageId: (state) => (state.imageId += state.picturesCount),
  decrementImageId: (state) => (state.imageId -= state.picturesCount),
  setTimerStatus: (state, status) => (state.timerStatus = status),
  setTimerInterval: (state, interval) => (state.timerInterval = interval),
  setTimerDefault: (state, value) => {
    localStorage.setItem('timerSeconds', value);
    state.timerDefault = value;
    if (state.timerStatus === TimerStatus.stopped) {
      state.timer = value;
    }
  },
  setPicturesCount: (state, value: number) => {
    localStorage.setItem('picturesCount', value.toString());
    state.picturesCount = value;
  },
  setRandomizePictures: (state, value: boolean) => {
    localStorage.setItem('randomizePictures', String(value));
    state.randomizePictures = value;
  },
  resetTimer: (state) => (state.timer = state.timerDefault),
  decrementTimer: (state) => (state.timer -= 1),
};

interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(actionContext: ActionContext<S, R>, appContext: Context): void;
}

export const actions: Actions<RootState, RootState> = {
  nuxtServerInit() {},

  nuxtClientInit({ commit, dispatch }) {
    const path = localStorage.getItem('path');
    const timerSeconds = localStorage.getItem('timerSeconds');
    const folderId = localStorage.getItem('folderId');
    const picturesCount = localStorage.getItem('picturesCount');
    const randomizePictures = localStorage.getItem('randomizePictures');
    if (path) commit('setPath', path);
    else commit('setPath', `${remote.app.getPath('documents')}\\${remote.app.getName()}`);
    if (timerSeconds) commit('setTimerDefault', Number(timerSeconds));
    // eslint-disable-next-line no-undef
    if (folderId) commit('setFolderId', BigInt(folderId));
    if (picturesCount) commit('setPicturesCount', Number(picturesCount));
    if (randomizePictures) commit('setRandomizePictures', randomizePictures === 'true');

    commit('resetTimer');
    dispatch('getFolders');
    setInterval(() => dispatch('getFolders'), 5000);
  },

  async setPath({ commit, dispatch }, path) {
    commit('setPath', path);
    await dispatch('getFolders');
    await dispatch('getImages');
  },

  getImages({ state, commit, getters }, onstart = false) {
    if (!getters.folder) {
      commit('setImages', []);
      return;
    }

    const dirPath = `${state.path}\\${getters.folder.path}`;
    const dirContents = readdirSync(dirPath);
    const files = dirContents.reduce<string[]>((acc, item) => {
      const filePath = `${dirPath}\\${item}`;
      const stat = statSync(filePath, { bigint: true });
      if (stat.isFile()) acc.push(`${fileSystemPrefix}${filePath}`);
      return acc;
    }, []);
    if (onstart && state.randomizePictures) commit('setImages', Utils.shuffle(files));
    else commit('setImages', files);
  },

  getFolders({ state, commit, dispatch, getters }) {
    ensureDirSync(state.path);
    const items = readdirSync(state.path);
    const folders = items.reduce<Folder[]>((acc, item) => {
      const stat = statSync(`${state.path}\\${item}`, { bigint: true });
      if (stat.isDirectory()) acc.push({ ...stat, path: item });
      return acc;
    }, []);
    commit('setFolders', folders);
    if (!getters.folder) {
      const folderId = state.folders[0]?.ino || 0;
      dispatch('setFolderId', folderId);
    }
  },

  setFolderId({ commit, dispatch }, folderId) {
    commit('setFolderId', folderId);
    dispatch('getImages');
  },

  startTimer({ state, getters, commit, dispatch }) {
    if (state.timerStatus !== TimerStatus.paused) {
      dispatch('getImages', true);
      dispatch('stopTimer');
    }

    commit('setTimerStatus', TimerStatus.running);
    const timerInterval = window.setInterval(() => {
      commit('decrementTimer');
      if (state.timer <= 0) {
        commit('resetTimer');
        if (getters.isLastImage) {
          dispatch('stopTimer');
        } else {
          commit('incrementImageId');
        }
      }
    }, 1000);
    commit('setTimerInterval', timerInterval);
  },

  pauseTimer({ state, commit }) {
    commit('setTimerStatus', TimerStatus.paused);
    window.clearInterval(state.timerInterval);
  },

  stopTimer({ state, commit }) {
    commit('setTimerStatus', TimerStatus.stopped);
    window.clearInterval(state.timerInterval);
    commit('resetTimer');
    commit('setImageId', 0);
  },

  prevImage({ getters, commit }) {
    if (!getters.isFirstImage) {
      commit('decrementImageId');
      commit('resetTimer');
    }
  },

  nextImage({ getters, commit }) {
    if (!getters.isLastImage) {
      commit('incrementImageId');
      commit('resetTimer');
    }
  },
};
