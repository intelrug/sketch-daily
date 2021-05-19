<template>
  <!-- begin .app-header-->
  <div class="app-header">
    <div class="app-header__draggable" />
    <div class="app-header__controls">
      <button class="app-header__button" @click="minimize()">
        <svg-icon name="app-header/minimize" />
      </button>
      <button class="app-header__button" @click="expand()">
        <svg-icon name="app-header/expand" />
      </button>
      <button class="app-header__button app-header__button_type_warning" @click="close()">
        <svg-icon name="app-header/close" />
      </button>
    </div>
  </div>
  <!-- end .app-header-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { remote, BrowserWindow } from 'electron';

@Component({
  name: 'b-app-header',
})
export default class AppHeader extends Vue {
  private win!: BrowserWindow | null;

  mounted() {
    this.win = remote.BrowserWindow.getFocusedWindow();
  }

  close() {
    this.win?.close();
  }

  expand() {
    this.win?.isMaximized() ? this.win?.unmaximize() : this.win?.maximize();
  }

  minimize() {
    this.win?.minimize();
  }
}
</script>

<style lang="stylus" src="./app-header.styl" />
