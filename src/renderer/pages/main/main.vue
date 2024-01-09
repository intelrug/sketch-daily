<template>
  <div class="page-main">
    <div class="page-main__menu">
      <b-side-menu />
    </div>
    <div v-show="!timerStopped" class="page-main__slides-counter">
      {{ currentSlide }} / {{ slidesCount }}
    </div>
    <div class="page-main__content" :style="{ bottom: timerStopped ? 0 : '32px' }">
      <div
        v-if="!timerStopped"
        :class="
          `page-main__images-container page-main__images-container_count_${currentImages.length}`
        "
      >
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
            Выберите папки:
          </div>
          <div v-for="(_, i) of selectedFolders" :key="i" class="page-main__settings-field">
            <div class="page-main__settings-content page-main__settings-content_width_full">
              <select
                :id="`folder_select_${i}`"
                v-model="selectedFolders[i]"
                class="select select_width_full"
                :disabled="folders.length === 0"
              >
                <option v-if="folders.length === 0" value="">Нет доступных папок</option>
                <option
                  v-for="folder of folders"
                  :key="folder.ino.toString()"
                  :value="folder.ino.toString()"
                >
                  {{ folder.path }}
                </option>
              </select>
            </div>
            <b-button
              class="page-main__add-picture"
              icon="remove"
              color="red"
              :disabled="selectedFolders.length <= 1"
              @click="removeSelectedFolder(i)"
            />
          </div>
          <div class="page-main__settings-field">
            <b-button
              class="page-main__add-picture"
              icon="add"
              color="green"
              :disabled="selectedFolders.length >= 4"
              @click="addSelectedFolder"
            />
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
import { Action, Component, Getter, Mutation, State, Vue, Watch } from 'nuxt-property-decorator';
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
  @State folderIds!: string[];
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
  @Action setFolderIds!: ActionMethod;
  @Action startTimer!: ActionMethod;

  private selectedFolders: string[] = [];
  private randomizePictures: boolean = true;

  @Watch('selectedFolders')
  onSelectedFoldersChange() {
    // eslint-disable-next-line no-undef
    this.setFolderIds(Array.from(this.selectedFolders));
  }
  created() {
    this.getImages();
    this.randomizePictures = this.randomizePicturesState;
    this.selectedFolders = this.folderIds.length > 0 ? this.folderIds : [''];
  }

  get images() {
    return this.imagesState.slice(0, 30);
  }

  get timerStopped(): boolean {
    return this.timerStatus === TimerStatus.stopped;
  }

  start() {
    this.startTimer();
  }

  addSelectedFolder(): void {
    this.selectedFolders.push('');
  }

  removeSelectedFolder(i: number): void {
    this.selectedFolders.splice(i, 1);
  }
}
</script>

<style lang="stylus" src="./main.styl"></style>
