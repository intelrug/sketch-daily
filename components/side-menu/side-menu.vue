<template>
  <!-- begin .side-menu-->
  <div class="side-menu">
    <div class="side-menu__timer">
      <div class="side-menu__timer-text">
        {{ timer | toTimer }}
      </div>
      <div class="side-menu__timer-controls">
        <button class="side-menu__button" @click="toggleSettings()">
          <svg-icon name="settings" class="side-menu__button-icon" />
        </button>
        <button
          class="side-menu__button"
          :disabled="isFirstImage"
          @click="prev()"
        >
          <svg-icon name="skip_previous" class="side-menu__button-icon" />
        </button>
        <button class="side-menu__button" @click="sliding ? pause() : start()">
          <svg-icon
            :name="sliding ? 'pause' : 'play_arrow'"
            class="side-menu__button-icon"
          />
        </button>
        <button
          class="side-menu__button"
          :disabled="isLastImage"
          @click="next()"
        >
          <svg-icon name="skip_next" class="side-menu__button-icon" />
        </button>
        <button
          class="side-menu__button side-menu__button_color_red"
          @click="stop()"
        >
          <svg-icon name="stop" class="side-menu__button-icon" />
        </button>
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
              class="side-menu__select"
              name="minutes"
            >
              <option v-for="i of 61" :key="i - 1" :value="i - 1">{{
                i - 1
              }}</option>
            </select>
            <div class="side-menu__select-text">
              мин.
            </div>
          </div>
          <div class="side-menu__select-wrapper">
            <select v-model="seconds" class="side-menu__select" name="seconds">
              <option v-for="i of 59" :key="i" :value="i">{{ i }}</option>
            </select>
            <div class="side-menu__select-text">
              сек.
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="settings" class="side-menu__settings-buttons">
      <button class="side-menu__button" @click="closeSettings()">
        Закрыть
      </button>
      <button
        class="side-menu__button side-menu__button_color_green"
        @click="save()"
      >
        Сохранить
      </button>
    </div>
  </div>
  <!-- end .side-menu-->
</template>

<script lang="ts">
import {
  Action,
  Component,
  Getter,
  Mutation,
  State,
  Vue,
} from 'nuxt-property-decorator';
import { ActionMethod, MutationMethod } from 'vuex';
import { toTimer } from '~/lib/filters';
import { TimerStatus } from '~/types/state';

@Component({
  name: 'b-side-menu',
  filters: { toTimer },
})
export default class SideMenu extends Vue {
  @State timerStatus!: TimerStatus;
  @State timer!: number;
  @State timerDefault!: number;
  @Getter isFirstImage!: boolean;
  @Getter isLastImage!: boolean;
  @Mutation setTimerDefault!: MutationMethod;
  @Action startTimer!: ActionMethod;
  @Action pauseTimer!: ActionMethod;
  @Action stopTimer!: ActionMethod;
  @Action prevImage!: ActionMethod;
  @Action nextImage!: ActionMethod;

  settings = false;
  minutes: string | number = 0;
  seconds: string | number = 1;

  get sliding(): boolean {
    return this.timerStatus === TimerStatus.running;
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
