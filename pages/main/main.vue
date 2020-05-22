<template>
  <div class="page-main">
    <div class="page-main__menu">
      <b-side-menu />
    </div>
    <div
      class="page-main__image"
      :style="{ backgroundImage: `url(${currentImage})` }"
    />
  </div>
</template>

<script lang="ts">
import { Action, Component, Getter, Vue } from 'nuxt-property-decorator';
import { ActionMethod } from 'vuex';
import BSideMenu from '~/components/side-menu/side-menu.vue';

@Component({
  components: { BSideMenu },
  head: {
    htmlAttrs: {
      class: ['page_height_100'],
    },
  },
})
export default class MainPage extends Vue {
  @Action getImages!: ActionMethod;
  @Getter currentImage!: string;

  created() {
    this.getImages();
  }
}
</script>

<style lang="stylus" src="./main.styl"></style>
