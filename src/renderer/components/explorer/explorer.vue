<template>
  <!-- begin .explorer-->
  <div class="explorer">
    <div class="explorer__controls">
      <button class="explorer__button" @click="scan()">
        <svg-icon name="refresh" class="explorer__button-icon" />
        <span class="explorer__button-text">Обновить</span>
      </button>
      <div class="explorer__controls-spacer" />
      <button class="explorer__button explorer__button_color_red">
        <svg-icon name="delete" class="explorer__button-icon" />
        <span class="explorer__button-text">Удалить</span>
      </button>
    </div>

    <ul class="explorer__list">
      <li v-for="(folder, i) of folders" :key="i" class="explorer__item explorer__item_type_folder">
        <svg-icon name="folder" class="explorer__icon" />
        <span class="explorer__text">{{ folder }}</span>
      </li>
      <li
        v-for="(file, i) of files"
        :key="10000 + i"
        class="explorer__item explorer__item_type_file"
      >
        <svg-icon name="image" class="explorer__icon" />
        <span class="explorer__text">{{ file }}</span>
      </li>
    </ul>
  </div>
  <!-- end .explorer-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { remote } from 'electron';
import { ensureDirSync, readdirSync, statSync } from 'fs-extra';

@Component({
  name: 'b-explorer',
})
export default class Explorer extends Vue {
  folders: string[] = [];
  files: string[] = [];
  interval!: number;

  mounted() {
    this.scan();
    this.interval = window.setInterval(() => {
      this.scan();
    }, 1000);
  }

  scan() {
    const path = remote.app.getPath('documents') + '\\Sketch';
    ensureDirSync(path);
    const items = readdirSync(path);
    this.folders = [];
    this.files = [];
    items.forEach((item) => {
      const stat = statSync(path + '\\' + item);
      if (stat.isDirectory()) {
        this.folders.push(item);
      } else {
        this.files.push(item);
      }
    });
  }

  beforeDestroy() {
    window.clearInterval(this.interval);
  }
}
</script>

<style lang="stylus" src="./explorer.styl" />
