<template>
    <v-layout wrap align-start justify-start row fill-height>
      <v-flex xs12 md6 d-flex>
        <v-text-field
          label="Кликните сюда и считайте карту"
          v-model="cardNumber"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 md3 d-flex>
        <v-btn @click="inprp" :disabled="cardNumber.length <= 9" color="info"><i class="material-icons">check_circle</i>&nbsp;Отметить вход</v-btn>
      </v-flex>
      <v-flex xs6 md3 d-flex>
        <v-btn @click="addFiles" color="info"><i class="material-icons">attach_file</i>&nbsp;Прикрепить файл</v-btn>
      </v-flex>
      <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()" v-show="false"/>
      <v-flex xs3 d-flex><h3 class="text-sm-left">
        Подготовленные к отправке файлы:</h3>
      </v-flex>
      <v-flex xs9 d-flex>
        <div class="cont">
          <h3 v-if="files.length === 0">отсутствуют</h3>
          <div v-for="(file, key) in files" class="file" :key="key">{{ file.name }} <v-btn v-on:click="removeFile(key)" color="info">Удалить</v-btn></div>
        </div>
        </v-flex>
      <v-flex xs12 d-flex>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <div slot="header">Вернуть пропуск на доработку</div>
            <v-card>
              <v-card-text>
                <v-textarea v-model="notes" label="Введите причину возврата на доработку" auto-grow></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="retprp"><i class="material-icons">redo</i>&nbsp;На доработку</v-btn>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
</template>

<script>
// нагло спионерено с https://serversideup.net/uploading-files-vuejs-axios/
import axios from 'axios'
export default {
  name: 'provide_a_pass',
  props: ['doc', 'objkey'],
  data () {
    return {
      files: [],
      notes: '',
      cardNumber: ''
    }
  },
  methods: {
    // прикрепляем файлы
    addFiles () {
      this.$refs.files.click()
    },
    // отправляем файлы на сервер
    submitFiles () {
      let formData = new FormData()
      for (var i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i])
      }
      axios.post(`${this.$config.api}/attachfiles?&objkey=${this.objkey}`,
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
    handleFilesUpload () {
      let uploadedFiles = this.$refs.files.files
      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i])
      }
    },
    removeFile (key) {
      this.files.splice(key, 1)
    },
    inprp () {
      this.submitFiles()
      axios.post(`${this.$config.api}/doit`, {doknr: this.$route.params.kpp, ckeckpoint: this.$route.params.doknr, action: 'IN'})
    },
    retprp () {
      axios.post(`${this.$config.api}/doit`, {doknr: this.$route.params.kpp, ckeckpoint: this.$route.params.doknr, action: 'RET'})
    }
  }
}
</script>

<style scoped>
  .cont {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }
  .file{
    /*border: rgba(0,0,0,0.6) solid 1px;*/
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.15);
    background-color: rgba(255,255,255,0.75);
    margin-right: 8px;
    margin-bottom: 8px;
    padding-left: 8px;
  }
</style>
