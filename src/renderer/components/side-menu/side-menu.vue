<template>
  <!-- begin .side-menu-->
  <div class="side-menu">
    <div class="side-menu__timer">
      <div class="side-menu__timer-text">
        {{ timer | toTimer }}
      </div>
      <div class="side-menu__timer-controls">
        <!--        <button class="side-menu__button" @click="toggleSettings()">-->
        <!--          <svg-icon name="settings" class="side-menu__button-icon" />-->
        <!--        </button>-->
        <b-button
          class="side-menu__button"
          :disabled="isFirstImage || timerStopped"
          icon="skip_previous"
          @click="prev()"
        />
        <b-button
          class="side-menu__button"
          :icon="timerPaused ? 'play_arrow' : 'pause'"
          :disabled="timerStopped"
          @click="timerPaused ? start() : pause()"
        />
        <b-button
          class="side-menu__button"
          :disabled="isLastImage || timerStopped"
          icon="skip_next"
          @click="next()"
        />
        <b-button
          class="side-menu__button"
          icon="stop"
          color="red"
          :disabled="timerStopped"
          @click="stop()"
        />
      </div>
    </div>
    <div v-show="settings" class="side-menu__settings">
      <div class="side-menu__settings-title">
        Настройки
      </div>
      <div class="side-menu__field">
        <label class="side-menu__field-label" for="minutes_selector">
          Таймер:
        </label>
        <div class="side-menu__field-content">
          <div class="side-menu__select-wrapper">
            <select
              id="minutes_selector"
              v-model="minutes"
              class="select side-menu__select"
              name="minutes"
            >
              <option v-for="i of 61" :key="i - 1" :value="i - 1">{{ i - 1 }}</option>
            </select>
            <div class="side-menu__select-text">
              мин.
            </div>
          </div>
          <div class="side-menu__select-wrapper">
            <select v-model="seconds" class="select side-menu__select" name="seconds">
              <option v-for="i of 60" :key="i - 1" :value="i - 1">{{ i - 1 }}</option>
            </select>
            <div class="side-menu__select-text">
              сек.
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="side-menu__settings-buttons">
      <b-button
        class="side-menu__button side-menu__button_color_green"
        :disabled="isSaveDisabled"
        @click="save()"
      >
        Сохранить
      </b-button>
    </div>
  </div>
  <!-- end .side-menu-->
</template>

<script lang="ts">
import { Action, Component, Getter, Mutation, State, Vue } from 'nuxt-property-decorator';
import { ActionMethod, MutationMethod } from 'vuex';
import { toTimer } from '~/utils/filters';
import { Folder, TimerStatus } from '~/types/state';
import BButton from '~/components/button/button.vue';

@Component({
  name: 'b-side-menu',
  components: { BButton, Calendar },
  filters: { toTimer },
})
export default class SideMenu extends Vue {
  @State timerStatus!: TimerStatus;
  @State timer!: number;
  @State timerDefault!: number;
  @State folders!: Folder[];
  @State folderId!: bigint;
  @Getter isFirstImage!: boolean;
  @Getter isLastImage!: boolean;
  @Mutation setTimerDefault!: MutationMethod;
  @Action startTimer!: ActionMethod;
  @Action pauseTimer!: ActionMethod;
  @Action stopTimer!: ActionMethod;
  @Action prevImage!: ActionMethod;
  @Action nextImage!: ActionMethod;

  settings = true;
  minutes: string | number = 0;
  seconds: string | number = 1;

  get timerStopped(): boolean {
    return this.timerStatus === TimerStatus.stopped;
  }

  get timerPaused(): boolean {
    return this.timerStatus === TimerStatus.paused;
  }

  get isSaveDisabled(): boolean {
    return (
      this.minutes === Math.floor(this.timerDefault / 60) &&
      this.seconds === Math.floor(this.timerDefault - this.minutes * 60)
    );
  }

  created() {
    this.minutes = Math.floor(this.timerDefault / 60);
    this.seconds = Math.floor(this.timerDefault - this.minutes * 60);
  }

  start() {
    this.startTimer();
  }

  pause() {
    this.pauseTimer();
  }

  prev() {
    this.prevImage();
  }

  next() {
    this.nextImage();
  }

  stop() {
    this.stopTimer();
  }

  save() {
    const time = Number(this.minutes) * 60 + Number(this.seconds);
    this.setTimerDefault(time);
  }

  openSettings() {
    this.settings = true;
  }

  closeSettings() {
    this.settings = false;
  }

  toggleSettings() {
    if (this.settings) {
      this.closeSettings();
    } else {
      this.openSettings();
    }
  }
}
</script>

<style lang="stylus" src="./side-menu.styl" />
