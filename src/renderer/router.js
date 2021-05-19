import Vue from 'vue';
import Router from 'vue-router';

import MainPage from '~/pages/main/main.vue';
import SettingsPage from '~/pages/settings/settings.vue';

Vue.use(Router);

export function createRouter() {
  return new Router({
    routes: [
      {
        path: '/slider',
        name: 'slider',
        component: MainPage,
      },
      {
        path: '/settings',
        name: 'settings',
        component: SettingsPage,
      },
      {
        path: '*',
        redirect: '/slider',
      },
    ],
  });
}
