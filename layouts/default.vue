<template>
  <div class="page__container">
    <div class="page__header">
      <b-header />
    </div>
    <div class="page__content">
      <nuxt />
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
@Component({
  components: { BSideMenu, BHeader },
})
export default class Default extends Vue {}
</script>
