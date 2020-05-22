<template>
  <!-- begin .header-->
  <div class="header" />
  <!-- end .header-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'b-header',
})
export default class Header extends Vue {}
</script>

<style lang="stylus" src="./header.styl" />
