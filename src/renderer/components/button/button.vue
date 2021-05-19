<template>
  <!-- begin .button-->
  <button class="button" :class="[color ? `button_color_${color}` : '']" @click="$emit('click')">
    <svg-icon v-if="icon" class="button__icon" :name="icon" />
    <slot />
  </button>
  <!-- end .button-->
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'b-button',
})
export default class Button extends Vue {
  @Prop({ required: false, type: String }) icon!: string;
  @Prop({ required: false, type: String }) color!: string;
}
</script>

<style lang="stylus" src="./button.styl" />
