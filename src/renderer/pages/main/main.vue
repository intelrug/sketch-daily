<template>
  <div class="page-main">
    <div class="page-main__menu">
      <b-side-menu />
    </div>
    <div v-show="!timerStopped" class="page-main__slides-counter">
      {{ currentSlide }} / {{ slidesCount }}
    </div>
    <div class="page-main__content" :style="{ bottom: timerStopped ? 0 : '32px' }">
      <div v-if="!timerStopped" class="page-main__images-container">
        <img
          v-for="(image, i) of currentImages"
          :key="i"
          :src="image"
          class="page-main__image"
          :class="[
            currentImages.length > 1
              ? `page-main__image_number_${i + 1}`
              : `page-main__image_size_full`,
          ]"
        />
      </div>
      <div v-if="timerStopped" class="page-main__preview-shader" />
      <div v-if="timerStopped" class="page-main__preview">
        <img v-for="(image, i) of images" :key="i" :src="image" class="page-main__preview-item" />
      </div>
      <div v-if="timerStopped" class="page-main__start">
        <div class="page-main__settings">
          <div class="page-main__settings-field">
            <label for="folder_select" class="page-main__settings-label">
              Папка:
            </label>
            <div class="page-main__settings-content">
              <select
                id="folder_select"
                v-model="folder"
                class="select select_width_full"
                :disabled="folders.length === 0"
                @change="changeFolder"
              >
                <option v-if="folders.length === 0" :value="folder">Нет доступных папок</option>
                <option
                  v-for="folder of folders"
                  :key="folder.ino.toString()"
                  :value="folder.ino.toString()"
                >
                  {{ folder.path }}
                </option>
              </select>
            </div>
          </div>
          <div class="page-main__settings-field">
            <label for="pictures_count_select" class="page-main__settings-label">
              Картинок в одном слайде:
            </label>
            <div class="page-main__settings-content">
              <select
                id="pictures_count_select"
                v-model="picturesCount"
                class="select select_width_full"
                @change="setPicturesCount(picturesCount)"
              >
                <option v-for="option of picturesCountOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
          <div class="page-main__settings-field">
            <div class="page-main__settings-content">
              <input
                id="randomize_checkbox"
                v-model="randomizePictures"
                type="checkbox"
                @change="setRandomizePictures(randomizePictures)"
              />
            </div>
            <label for="randomize_checkbox" class="page-main__settings-label">
              В случайном порядке
            </label>
          </div>
        </div>
        <b-button class="page-main__start-button" @click="start">
          Начать
        </b-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Action, Component, Getter, Mutation, State, Vue } from 'nuxt-property-decorator';
import { ActionMethod, MutationMethod } from 'vuex';
import BSideMenu from '~/components/side-menu/side-menu.vue';
import BButton from '~/components/button/button.vue';
import { Folder, RootState, TimerStatus } from '~/types/state';

@Component({
  components: { BButton, BSideMenu },
  head: {
    htmlAttrs: {
      class: ['page_height_100'],
    },
  },
})
export default class MainPage extends Vue {
  @State((state: RootState) => state.images) imagesState!: string[];
  @State folders!: Folder[];
  @State folderId!: bigint;
  @State((state: RootState) => state.picturesCount) picturesCountState!: number;
  @State((state: RootState) => state.randomizePictures)
  randomizePicturesState!: boolean;
  @State timerStatus!: TimerStatus;
  @Getter slidesCount!: number;
  @Getter currentSlide!: number;
  @Getter currentImages!: string[];
  @Mutation setPicturesCount!: MutationMethod;
  @Mutation setRandomizePictures!: MutationMethod;
  @Action getImages!: ActionMethod;
  @Action setFolderId!: ActionMethod;
  @Action startTimer!: ActionMethod;

  private folder: string = '';
  private randomizePictures: boolean = true;
  private picturesCountOptions: number[] = [1, 4];
  private picturesCount: number = this.picturesCountOptions[0];

  created() {
    this.getImages();
    this.folder = this.folderId.toString();
    this.picturesCount = this.picturesCountState;
    this.randomizePictures = this.randomizePicturesState;
  }

  get images() {
    return this.imagesState.slice(0, 30);
  }

  get timerStopped(): boolean {
    return this.timerStatus === TimerStatus.stopped;
  }

  changeFolder() {
    // eslint-disable-next-line no-undef
    this.setFolderId(BigInt(this.folder));
  }

  start() {
    this.startTimer();
  }
}
</script>

<style lang="stylus" src="./main.styl"></style>
