/* eslint-disable no-shadow */
import { Context } from '@nuxt/types';
import { remote } from 'electron';
import { ensureDirSync, readdirSync, statSync } from 'fs-extra';
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { Folder, RootState, TimerStatus } from '~/types/state';
import Utils from '~/utils/utils';

const isProduction = process.env.NODE_ENV === 'production';
const fileSystemPrefix = isProduction ? 'file:///' : 'http://sketchdaily.local/';

export const state = (): RootState => ({
  logged: false,
  myId: 0,
  path: '',
  folders: [],
  folderIds: [],
  imageId: 0,
  images: [],
  timer: 0,
  timerDefault: 60,
  timerStatus: TimerStatus.stopped,
  timerInterval: undefined,
  randomizePictures: true,
  picturesCount: 1,
  completedDays: new Set(),
  failedDays: new Set(),
  today: new Date(),
});

export const getters: GetterTree<RootState, RootState> = {
  currentImages: (state) =>
    state.images.slice(state.imageId, state.imageId + state.folderIds.length) || [],
  isLastImage: (state) => state.imageId >= state.images.length - (state.folderIds.length * 2 - 1),
  isFirstImage: (state) => state.imageId === 0,
  currentSlide: (state) => state.imageId / state.folderIds.length + 1,
  slidesCount: (state) => state.images.length / state.folderIds.length,
  folder: (state) => (id: string) => state.folders.find((f) => f.ino.toString() === id),
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
  setFolderIds: (state, payload: string[]) => {
    const filteredPayload = payload.filter((p) => p);
    localStorage.setItem('folderIds', JSON.stringify(filteredPayload));
    state.folderIds = filteredPayload;
  },
  setImages: (state, images: string[]) => (state.images = images),
  setImageId: (state, imageId: number) => (state.imageId = imageId),
  incrementImageId: (state) => (state.imageId += state.folderIds.length),
  decrementImageId: (state) => (state.imageId -= state.folderIds.length),
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

  addCompletedDay(state, day) {
    state.completedDays.add(day);
    localStorage.setItem(
      'completedDays',
      Array.from(state.completedDays)
        .map((day) => {
          return day.getTime();
        })
        .join(','),
    );
  },
  removeCompletedDay(state, day) {
    for (const date of state.completedDays) {
      if (date.getTime() === day.getTime()) {
        state.completedDays.delete(date);
        break;
      }
    }
    localStorage.setItem(
      'completedDays',
      Array.from(state.completedDays)
        .map((day) => {
          return day.getTime();
        })
        .join(','),
    );
  },
  setCompletedDays(state, days) {
    state.completedDays! = new Set(
      days.map((day) => {
        return new Date(parseInt(day));
      }),
    );
  },
  setToday(state, day) {
    state.today! = day;
  },
  moveBack(state) {
    const newDate = new Date(state.today.getTime() - 7 * 24 * 60 * 60 * 1000);
    state.today = newDate;
  },
  moveForward(state) {
    const newDate = new Date(state.today.getTime() + 7 * 24 * 60 * 60 * 1000);
    state.today = newDate;
  },
};

interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(actionContext: ActionContext<S, R>, appContext: Context): void;
}

export const actions: Actions<RootState, RootState> = {
  nuxtServerInit() {},

  nuxtClientInit({ commit, dispatch }) {
    const path = localStorage.getItem('path');
    const timerSeconds = localStorage.getItem('timerSeconds');
    const folderIds = localStorage.getItem('folderIds');
    const picturesCount = localStorage.getItem('picturesCount');
    const randomizePictures = localStorage.getItem('randomizePictures');
    const completedDays = localStorage.getItem('completedDays');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (path) commit('setPath', path);
    else commit('setPath', `${remote.app.getPath('documents')}\\${remote.app.getName()}`);
    if (timerSeconds) commit('setTimerDefault', Number(timerSeconds));
    // eslint-disable-next-line no-undef
    if (folderIds) {
      const parsedFolderIds = JSON.parse(folderIds);
      if (parsedFolderIds && Array.isArray(parsedFolderIds)) {
        commit('setFolderIds', parsedFolderIds);
      }
    }
    if (picturesCount) commit('setPicturesCount', Number(picturesCount));
    if (randomizePictures) commit('setRandomizePictures', randomizePictures === 'true');
    if (completedDays) commit('setCompletedDays', completedDays.split(','));

    commit('setToday', today);
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
    const unDuplicatedFoldersIds = [...new Set(state.folderIds)];
    const dirPaths = unDuplicatedFoldersIds.reduce<string[]>((acc, id) => {
      if (getters.folder(id)) {
        acc.push(`${state.path}\\${getters.folder(id).path}`);
      }
      return acc;
    }, []);

    const files: Record<string, string[]> = {};
    dirPaths.forEach((dirPath, i) => {
      const dirContents = readdirSync(dirPath);
      files[unDuplicatedFoldersIds[i]] = dirContents.reduce<string[]>((acc, item) => {
        const filePath = `${dirPath}\\${item}`;
        const stat = statSync(filePath, { bigint: true });
        if (stat.isFile()) acc.push(`${fileSystemPrefix}${filePath}`);
        return acc;
      }, []);
    });

    const filesArray: string[][] = [];
    if (onstart && state.randomizePictures) {
      state.folderIds.forEach((key) => {
        filesArray.push(Utils.shuffle(files[key]));
      });
    } else {
      state.folderIds.forEach((key) => {
        filesArray.push(files[key]);
      });
    }

    const slidesCount = state.folderIds.reduce<number>((acc, id) => {
      if (files[id] && (files[id].length < acc || acc === 0)) {
        return files[id].length;
      }
      return acc;
    }, 0);

    const images: string[] = [];
    for (let i = 0; i < slidesCount; ++i) {
      for (let j = 0; j < state.folderIds.length; ++j) {
        if (filesArray[j]) {
          images.push(filesArray[j][i]);
        }
      }
    }

    commit('setImages', images);
  },

  getFolders({ state, commit }) {
    ensureDirSync(state.path);
    const items = readdirSync(state.path);
    const folders = items.reduce<Folder[]>((acc, item) => {
      const stat = statSync(`${state.path}\\${item}`, { bigint: true });
      if (stat.isDirectory()) acc.push({ ...stat, path: item });
      return acc;
    }, []);
    commit('setFolders', folders);
  },

  setFolderIds({ commit, dispatch }, payload: bigint[]) {
    commit('setFolderIds', payload);
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
