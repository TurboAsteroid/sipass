<template>
  <span>
    <h3>Прикрепленные файлы:<span v-if="documentfiles.length < 1"> отсутствуют</span></h3>
    <v-list class="grey lighten-3">
      <v-list-tile
        v-for="item in documentfiles"
        :key="item.REC_EXT_ID"
        avatar
        @click="load(item.REC_EXT_ID, item.VERSION, item.FILENAME + item.DESCRIPTION)"
      >
        <v-list-tile-avatar>
          <i class="material-icons">
            attach_file
          </i>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.FILENAME + item.DESCRIPTION"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </span>
</template>

<script>
import axios from 'axios'
export default {
  name: 'card_files',
  props: ['documentfiles', 'donkr'],
  methods: {
    load (REC_EXT_ID, VERSION, FILENAME_DESCRIPTION) {
      REC_EXT_ID = REC_EXT_ID.replace(' ', '%20')
      axios({
        url: `${this.$config.api}/filebyrecextidversion?rec_ext_id=${REC_EXT_ID}&version=${VERSION}&doknr=${this.donkr}`,
        method: 'GET',
        responseType: 'blob' // important
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', FILENAME_DESCRIPTION)
        document.body.appendChild(link)
        link.click()
      })
    }
  }

}
</script>

<style scoped>

</style>
