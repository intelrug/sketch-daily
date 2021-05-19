<template>
  <div class="page-settings">
    <div class="page-settings__field">
      <div class="page-settings__text">{{ path }}</div>
      <b-button @click="openSelectFolderDialog()">Select Folder</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Action, Component, State, Vue } from 'nuxt-property-decorator';
import { remote } from 'electron';
import { ActionMethod } from 'vuex';
import BExplorer from '~/components/explorer/explorer.vue';
import BButton from '~/components/button/button.vue';

@Component({
  components: { BButton, BExplorer },
})
export default class GalleryPage extends Vue {
  @State path!: string;
  @Action setPath!: ActionMethod;

  mounted() {}

  async openSelectFolderDialog() {
    try {
      const { canceled, filePaths } = await remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      if (!canceled) {
        await this.setPath(filePaths[0]);
      }
    } catch (e) {}
  }
}
</script>

<style lang="stylus" src="./settings.styl"></style>
