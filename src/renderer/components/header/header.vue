<template>
  <!-- begin .header-->
  <div class="header">
    <div class="header__nav">
      <b-nav />
    </div>
  </div>
  <!-- end .header-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import BNav from '~/components/nav/nav.vue';

@Component({
  name: 'b-header',
  components: { BNav },
})
export default class Header extends Vue {}
</script>

<style lang="stylus" src="./header.styl" />
