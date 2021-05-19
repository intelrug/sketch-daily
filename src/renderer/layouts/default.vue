<template>
  <div class="page__container">
    <div class="page__app-header">
      <b-app-header />
    </div>
    <div class="page__header">
      <div class="container">
        <b-header />
      </div>
    </div>
    <div class="page__content">
      <div class="container">
        <nuxt />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import '~/assets/stylus/normalize.styl';
import '~/assets/stylus/global.styl';
import '~/assets/stylus/colors.styl';
import { Component, Vue } from 'nuxt-property-decorator';
import BHeader from '~/components/header/header.vue';
import BSideMenu from '~/components/side-menu/side-menu.vue';
import BAppHeader from '~/components/app-header/app-header.vue';

@Component({
  components: { BAppHeader, BSideMenu, BHeader },
})
export default class Default extends Vue {}
</script>
