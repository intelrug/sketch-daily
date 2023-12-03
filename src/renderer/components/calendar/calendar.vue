<template>
  <div class="calendar-wrapper">
    <div class="controls-wrapper">
      <button class="left-button" @click="handleBackClick"></button>
      <p class="today-date">{{ today.toLocaleDateString('en-GB') }}</p>
      <button class="right-button" @click="handleForwardClick"></button>
    </div>
    <table class="calendar-table">
      <tbody>
        <tr>
          <td
            v-for="(day, index) in dateRange"
            :key="index"
            :class="{
              'week-day': isWeekDay(day),
              'current-day': isCurrentDay(day),
              'completed-day': isCompletedDay(day),
              'failed-day': isFailedDay(day),
            }"
            @mousedown="handleDayClick($event, day)"
          >
            {{ day.getDate() }}
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <p>На этой неделе дней, когда были нарисованы скетчей: {{ completedDaysInCurrentWeek() }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mutation, State, Vue } from 'nuxt-property-decorator';
import { MutationMethod } from 'vuex/types/helpers';

@Component({
  name: 'calendar',
})
export default class Calendar extends Vue {
  @State completedDays!: Set<Date>;
  @State today!: Date;
  @Mutation addCompletedDay!: MutationMethod;
  @Mutation removeCompletedDay!: MutationMethod;
  @Mutation setCompletedDays!: MutationMethod;
  @Mutation moveBack!: MutationMethod;
  @Mutation moveForward!: MutationMethod;

  month: string = '';
  currentDay!: number;
  dateRange: Date[] = [];

  // lifecycle methods
  mounted() {
    this.dateRange = this.generateDateRange();
  }

  // data generation
  generateDateRange() {
    this.today.setHours(0, 0, 0, 0);
    const pastDates = this.getDates(this.today, -7, 0);
    const futureDates = this.getDates(this.today, 1, 2);
    return [...pastDates, ...futureDates];
  }
  getDates(startDate, startOffset, endOffset) {
    const dates: Date[] = [];
    for (let i = startOffset; i <= endOffset; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  // Date checks
  isCurrentDay(date) {
    this.today.setHours(0, 0, 0, 0);
    return date.getTime() === this.today.getTime();
  }
  isCompletedDay(day) {
    return [...this.completedDays].some((date) => date.getTime() === day.getTime());
  }

  isFailedDay(day) {
    return ![...this.completedDays].some((date) => date.getTime() === day.getTime());
  }

  isWeekDay(date) {
    return this.isSameWeek(date, this.today) && date.getDay() >= 0 && date.getDay() <= 7;
  }

  isSameWeek(date1, date2) {
    const clonedDate1 = new Date(date1);
    const clonedDate2 = new Date(date2);

    clonedDate1.setHours(0, 0, 0, 0);
    clonedDate2.setHours(0, 0, 0, 0);

    const differenceInDays = Math.abs(
      (clonedDate2.getTime() - clonedDate1.getTime()) / (1000 * 60 * 60 * 24),
    );
    return clonedDate1 <= clonedDate2 && differenceInDays < 7;
  }

  // calculated props
  completedDaysInCurrentWeek() {
    const currentWeekStartDate = new Date(this.today);
    currentWeekStartDate.setDate(this.today.getDate() - ((this.today.getDay() + 6) % 7));

    const currentWeekEndDate = new Date(currentWeekStartDate);
    currentWeekEndDate.setDate(currentWeekStartDate.getDate() + 6);
    const completedDaysInWeek = [...this.completedDays].filter(
      (date) => date >= currentWeekStartDate && date <= currentWeekEndDate,
    );

    return completedDaysInWeek.length;
  }

  // Action handling
  handleDayClick(event: MouseEvent, day: Date) {
    if (event.button === 0) {
      this.addCompletedDay(day);
    } else if (event.button === 2) {
      this.removeCompletedDay(day);
    }

    this.$forceUpdate();
  }

  handleBackClick() {
    this.moveBack();
    this.dateRange = this.generateDateRange();
  }

  handleForwardClick() {
    this.moveForward();
    this.dateRange = this.generateDateRange();
  }
}
</script>

<style lang="stylus" src="./calendar.styl" />
