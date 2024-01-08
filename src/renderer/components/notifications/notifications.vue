<template>
  <div class="page-notifications">
    <h1 class="page-notifications__title">Настройки уведомлений</h1>
    <div class="page-notifications__checkBoxContainer">
      <label class="page-notifications__label" for="enableNotifications"
        >Включить уведомления</label
      >
      <input
        id="enableNotifications"
        v-model="enableNotifications"
        class="page-notifications__inputCheckBox"
        type="checkbox"
      />
    </div>
    <br />
    <label class="page-notifications__label" for="notificationTime">Время уведомления</label>
    <input
      id="notificationTime"
      v-model="notificationTime"
      class="page-notifications__inputText"
      type="time"
    />
    <br />
    <label class="page-notifications__label" for="notificationMessage">Текст уведомления</label>
    <input
      id="notificationMessage"
      v-model="notificationText"
      class="page-notifications__inputText"
      type="text"
    />
    <br />
    <b-button class="page-notifications__submit-button" @click="handleSumbit">Применить</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, State, Mutation } from 'nuxt-property-decorator';
import { MutationMethod } from 'vuex/types/index';
import BButton from '~/components/button/button.vue';
import { RootState } from '~/types/state';
import * as NotificationUtils from '~/utils/notifications';

@Component({
  components: { BButton },
  head: {
    htmlAttrs: {
      class: ['page_height_100'],
    },
  },
})
export default class NotificationsSettings extends Vue {
  @State((state: RootState) => state.enableNotifications) enableNotificationState!: boolean;
  @State((state: RootState) => state.notificationTime) notificationTimeState!: string;
  @State((state: RootState) => state.notificationText) notificationTextState!: string;
  @Mutation saveNotificationSettings!: MutationMethod;
  @Mutation setNotificationSettings!: MutationMethod;
  @Mutation setEnableNotifications!: MutationMethod;
  @Mutation setNotificationTime!: MutationMethod;
  @Mutation setNotificationText!: MutationMethod;
  private enableNotifications: boolean = false;
  private notificationTime: string = '00:00';
  private notificationText: string = '';
  private notificationJob: any = null;

  mounted() {
    NotificationUtils.scheduleNotificationIfNeeded(
      this.enableNotificationState,
      this.notificationTextState,
      this.notificationTimeState,
      this.notificationJob,
    );

    this.setNotificationSettings(JSON.parse(localStorage.getItem('notificationSettings')!));

    this.enableNotifications = this.enableNotificationState;
    this.notificationTime = this.notificationTimeState;
    this.notificationText = this.notificationTextState;
  }

  handleSumbit() {
    NotificationUtils.scheduleNotificationIfNeeded(
      this.enableNotifications,
      this.notificationText,
      this.notificationTime,
      this.notificationJob,
    );

    this.setEnableNotifications(this.enableNotifications);
    this.setNotificationTime(this.notificationTime);
    this.setNotificationText(this.notificationText);

    this.saveNotificationSettings();
  }
}
</script>

<style lang="stylus" src="./notifications.styl"></style>
