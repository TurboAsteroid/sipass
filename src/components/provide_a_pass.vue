<template>
    <v-layout wrap align-start justify-start row fill-height>
      <!--<v-flex xs12 md6 d-flex>-->
        <!--<v-text-field-->
          <!--label="Кликните сюда и считайте карту"-->
        <!--&gt;</v-text-field>-->
      <!--</v-flex>-->
      <!--<v-flex xs4 md2 d-flex>-->
        <!--<v-btn @click="inprp" color="info"><i class="material-icons">check_circle</i>&nbsp;Отметить вход</v-btn>-->
      <!--</v-flex>-->
      <!--<v-flex xs4 md2 d-flex>-->
        <!--<v-btn @click="retprp" color="info"><i class="material-icons">redo</i>&nbsp;На доработку</v-btn>-->
      <!--</v-flex>-->
      <!--<v-flex xs4 md2 d-flex>-->
        <!--<v-btn @click="upl" color="info"><i class="material-icons">cloud_upload</i>&nbsp;Прикрепить файл</v-btn>-->
      <!--</v-flex>-->
      <!--<div>objkey: {{doc.DATA_CARD.DOKAR + doc.DATA_CARD.DOKNR + doc.DATA_CARD.DOKVR + doc.DATA_CARD.DOKTL}}   objtype: ZCARD7105</div>-->

      <div class="container">
        <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()" v-show="false"/>
        <div v-for="(file, key) in files">{{ file.name }} <v-btn v-on:click="removeFile(key)">Remove</v-btn></div>
        <div>
          <v-btn v-on:click="addFiles()">Add Files</v-btn>
          <v-btn v-on:click="submitFiles()">Submit</v-btn>
        </div>
      </div>

    </v-layout>
</template>

<script>
// нагло спионерено с https://serversideup.net/uploading-files-vuejs-axios/
import axios from 'axios'
export default {
  name: 'provide_a_pass',
  props: ['doc'],
  data () {
    return {
      files: []
    }
  },
  methods: {
    /*
        Adds a file
      */
    addFiles () {
      this.$refs.files.click()
    },

    /*
      Submits files to the server
    */
    submitFiles () {
      let formData = new FormData()
      for (var i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i])
      }
      axios.post(`${this.$config.api}/attachfiles`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(function () {
        console.log('SUCCESS!!')
      })
        .catch(function () {
          console.log('FAILURE!!')
        })
    },

    /*
      Handles the uploading of files
    */
    handleFilesUpload () {
      let uploadedFiles = this.$refs.files.files

      /*
        Adds the uploaded file to the files array
      */
      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i])
      }
    },

    /*
      Removes a select file the user has uploaded
    */
    removeFile (key) {
      this.files.splice(key, 1)
    },
    inprp () {
      // dd
    },
    retprp () {
      // dd
    },
    upl () {
      // dd
    }
  }
}
</script>

<style scoped>
</style>
