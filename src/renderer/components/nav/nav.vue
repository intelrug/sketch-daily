<template>
  <!-- begin .nav-->
  <nav class="nav">
    <ul class="nav__list">
      <router-link v-for="(item, i) of items" :key="i" tag="li" class="nav__item" :to="item.href">
        <svg-icon class="nav__icon" :name="item.icon" />
        <span class="nav__text">{{ item.text }}</span>
      </router-link>
    </ul>
  </nav>
  <!-- end .nav-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'b-nav',
})
export default class Nav extends Vue {
  items = [
    {
      href: '/slider',
      icon: 'timer',
      text: 'Слайдер',
    },
    {
      href: '/settings',
      icon: 'settings',
      text: 'Настройки',
    },
  ];
}
</script>

<style lang="stylus" src="./nav.styl" />
