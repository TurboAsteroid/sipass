<template>
  <span>
    <v-toolbar>
      <i class="material-icons">fingerprint</i>
      <v-toolbar-title>Информация о пропуске <span v-if="!items.loading">(SAP ERP: № {{ parseInt(items.DATA_CARD.DOKNR) }})</span></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="$router.go(-1)" color="info" flat><i class="material-icons">arrow_back</i>Назад</v-btn>
    </v-toolbar>
    <v-container fluid grid-list-xl v-if="!items.loading">
      <v-layout wrap align-start justify-start row fill-height>
        <v-flex xs12 md3 d-flex>
          <div v-if="photobycardid !== ''">
             <img :src="photobycardid" class="tt">
          </div>
        </v-flex>
        <v-flex xs12 md9 d-flex style="margin-top: 12px;">
          <v-layout wrap align-start justify-start row fill-height>
            <v-flex xs12 md12 d-flex :style="{background: status.color}" class="tt">
              <v-layout wrap align-center>
                <v-flex xs12 d-flex><h2>Информация о пропуске: {{status.text}}</h2></v-flex>
                <v-flex xs12 d-flex>
                  <v-card align-left>
                    <v-data-table :items="card" hide-actions hide-headers>
                      <template slot="items" slot-scope="props">
                        <tr class="nohover">
                          <td class="text-xs-left">{{ props.item.title }}</td>
                          <td class="text-xs-left" >{{ props.item.value }}</td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 md12 d-flex>
              <v-layout wrap align-start justify-center row fill-height>
                <v-flex xs12 d-flex>
                  <h2>Информация об ответственных сотрудниках</h2>
                </v-flex>
                <v-flex xs12 sm6 d-flex>
                  <v-card>
                    <div><h3>Направляется к сотруднику</h3></div>
                    <v-data-table :items="hiUser" hide-actions hide-headers>
                      <template slot="items" slot-scope="props">
                        <tr class="nohover">
                          <td class="text-xs-left">{{ props.item.title }}</td>
                          <td class="text-xs-left">{{ props.item.value }}</td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm6 d-flex>
                  <v-card>
                    <div><h3>Пропуск введен сотрудником</h3></div>
                    <v-data-table :items="writeUser" hide-actions hide-headers>
                      <template slot="items" slot-scope="props">
                          <tr class="nohover">
                          <td class="text-xs-left">{{ props.item.title }}</td>
                          <td class="text-xs-left">{{ props.item.value }}</td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 d-flex>
          <v-expansion-panel>
          <v-expansion-panel-content>
            <div slot="header"><h3>Информация об отметке согласующими</h3></div>
            <v-card>
              <v-card-text>
                <v-data-table :headers="headers"  :items="items.APPRDATA" hide-actions>
                  <template slot="items" slot-scope="props">
                    <tr class="nohover">
                      <td class="text-xs-left">{{ props.item.APRST }}</td>
                      <td class="text-xs-left">{{ props.item.APRNAME_FULL }}</td>
                      <td class="text-xs-left">{{ props.item.CREATED_BY_NAME }}</td>
                      <td class="text-xs-left">{{ M(props.item.CREATED_ON + props.item.CREATED_TM, 'YYYYMMDDHHmmSS').format('DD.MM.YYYY HH:mm:SS') }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-flex>
      </v-layout>
    </v-container>
  </span>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'card',
  data () {
    return {
      M: moment,
      headers: [
        { text: 'Отметка', value: '', sortable: false },
        { text: 'Имя инициатора', value: '', sortable: false },
        { text: 'Имя создателя', value: '', sortable: false },
        { text: 'Дата и время создания', value: '', sortable: false }
      ],
      items: { loading: true },
      card: [],
      hiUser: [],
      writeUser: [],
      status: { text: 'Согласован', value: 1 },
      photobycardid: ''
    }
  },
  created () {
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      if (parseInt(this.$route.params.doknr) > 0) {
        this.items = (await axios.get(`${this.$config.api}/bydoknr?doknr=${this.$route.params.doknr}&kpp=${this.$route.params.kpp}`)).data
      }
      if (parseInt(this.$route.params.propusk) > 0) {
        this.items = (await axios.get(`${this.$config.api}/bycardid?propusk=${this.$route.params.propusk}`)).data
      }
      if (this.items.DATA_CARD.ZPROPUSK !== undefined && this.items.DATA_CARD.ZPROPUSK !== null && this.items.DATA_CARD.ZPROPUSK !== '') {
        this.photobycardid = `${this.$config.api}/photobycardid?jwt=${localStorage.getItem('jwt')}&propusk=${this.items.DATA_CARD.ZPROPUSK}`
      } else {
        this.photobycardid = `${this.$config.api}/photobycardid?jwt=${localStorage.getItem('jwt')}`
      }
      for (let i = 0; i < this.items.APPRDATA.length; i++) {
        let st = this.items.APPRDATA[i].APRST
        if (st === '1') {
          this.items.APPRDATA[i].APRST = 'Согласован'
          if (this.status.value < 1) {
            this.status = { text: 'согласован', value: 1, color: 'red' }
          }
        } else if (st === 'S') {
          this.items.APPRDATA[i].APRST = 'Согласование'
          if (this.status.value < 2) {
            this.status = { text: 'согласование', value: 2, color: 'red' }
          }
        } else if (st === 'IN') {
          this.items.APPRDATA[i].APRST = 'Вход'
          if (this.status.value < 3) {
            this.status = { text: 'отметка вход', value: 3, color: 'red' }
          }
        } else if (st === 'OUT') {
          this.items.APPRDATA[i].APRST = 'Выход'
          if (this.status.value < 4) {
            this.status = { text: 'отметка выход', value: 4, color: 'green' }
          }
        } else if (st === 'P') {
          this.items.APPRDATA[i].APRST = 'Нет'
          if (this.status.value < 5) {
            this.status = { text: 'нет отметки', value: 5, color: 'red' }
          }
        }
      }
      this.card = [
        { title: 'Состояние пропуска', value: this.items.ES_STATUS_T.DOSTX, color: 1 },
        { title: 'Номер пропуска в SAP ERP', value: parseInt(this.items.DATA_CARD.DOKNR) },
        { title: 'Документ удост. личность', value: this.items.DATA_CARD.ID_CARD_NUMB },
        { title: 'ФИО', value: this.items.DATA_CARD.NAME_DRVR },
        { title: 'Дата действия', value: `${this.M(this.items.DATA_CARD.VALID_DATE_FROM, 'YYYYMMDD').format('DD.MM.YYYY')} - ${this.M(this.items.DATA_CARD.VALID_DATE_TO, 'YYYYMMDD').format('DD.MM.YYYY')}` }
      ]
      this.hiUser = [
        { title: 'ФИО', value: this.items.DATA_CARD.INIT_PNM },
        { title: 'Должность', value: this.items.DATA_CARD.INIT_SNM },
        { title: 'Подразделение', value: this.items.DATA_CARD.INIT_ONM }
      ]
      this.writeUser = [
        { title: 'ФИО', value: this.items.DATA_CARD.AUTHOR_PNM },
        { title: 'Должность', value: this.items.DATA_CARD.AUTHOR_SNM },
        { title: 'Подразделение', value: this.items.DATA_CARD.AUTHOR_ONM }
      ]
    }
  },
  watch: {
    '$route.params.doknr' (val, oldVal) {
      this.getData()
    },
    '$route.params.propusk' (val, oldVal) {
      this.getData()
    }
  }
}
</script>

<style scoped>
  .nohover:hover {
    background: white !important;
  }
  img {
    max-width: 100%;
    max-height: 550px;
  }
  .tt {
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0,0,0,0.5);
    color: whitesmoke;
  }
</style>
