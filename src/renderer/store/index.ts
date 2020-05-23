/* eslint-disable no-shadow */
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import Cookies from 'universal-cookie';
import { Context } from '@nuxt/types';
import { RootState, TimerStatus } from '~/types/state';
import Utils from '~/lib/utils';

export const state = (): RootState => ({
  logged: false,
  myId: 0,
  imageId: 0,
  images: [],
  timer: 0,
  timerStatus: TimerStatus.stopped,
  timerDefault: 60,
  timerInterval: undefined,
});

export const getters: GetterTree<RootState, RootState> = {
  currentImage: (state) => state.images[state.imageId] || '',
  isLastImage: (state) => state.imageId === state.images.length - 1,
  isFirstImage: (state) => state.imageId === 0,
};

export const mutations: MutationTree<RootState> = {
  login: (state) => (state.logged = true),
  logout: (state) => (state.logged = false),
  setMyId: (state, myId: number) => (state.myId = myId),
  setImages: (state, images: string[]) => (state.images = images),
  setImageId: (state, imageId: number) => (state.imageId = imageId),
  incrementImageId: (state) => (state.imageId += 1),
  decrementImageId: (state) => (state.imageId -= 1),
  setTimerStatus: (state, status) => (state.timerStatus = status),
  setTimerInterval: (state, interval) => (state.timerInterval = interval),
  setTimerDefault: (state, value) => {
    state.timerDefault = value;
    if (state.timerStatus === TimerStatus.stopped) {
      state.timer = value;
    }
  },
  resetTimer: (state) => (state.timer = state.timerDefault),
  decrementTimer: (state) => (state.timer -= 1),
};

interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(actionContext: ActionContext<S, R>, appContext: Context): void;
}

export const actions: Actions<RootState, RootState> = {
  nuxtServerInit({ commit }, context) {
    const cookies = new Cookies(context.req.headers.cookie);
    const id = cookies.get('id');
    const token = cookies.get('apollo-token');
    if (id) commit('setMyId', parseInt(id, 10));
    if (token) commit('login');
    commit('resetTimer');
  },

  getImages({ commit }) {
    const images = [
      '/img/1.png',
      '/img/2.jpg',
      '/img/3.jpg',
      '/img/4.jpg',
      '/img/5.jpg',
      '/img/6.jpg',
    ];

    commit('setImages', images);
  },

  startTimer({ state, commit, dispatch }) {
    if (state.timerStatus !== TimerStatus.paused) {
      commit('setImages', Utils.shuffle(state.images));
      dispatch('stopTimer');
    }

    commit('setTimerStatus', TimerStatus.running);
    const timerInterval = window.setInterval(() => {
      commit('decrementTimer');
      if (state.timer <= 0) {
        commit('resetTimer');
        if (state.imageId >= state.images.length - 1) {
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
