<template>
  <span>
    <v-toolbar>
      <i class="material-icons">fingerprint</i>
      <v-toolbar-title>Информация о пропуске <span v-if="!items.loading">(SAP ERP: № {{ parseInt(items.DATA_CARD.DOKNR) }})</span></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="$router.go(-1)" color="info" flat><i class="material-icons">arrow_back</i>Назад</v-btn>
    </v-toolbar>
    <v-progress-linear :indeterminate="true" v-if="items.loading"></v-progress-linear>
    <v-container fluid grid-list-xl v-if="!items.loading">
      <provideApass v-if="items.STATUS === '57'" :doc="items" :objkey="objkey"/><!-- включаем выдачу пропуска для согласованных пропусков-->
      <v-layout wrap align-start justify-start row fill-height>
        <v-flex xs12 md3 d-flex>
          <div v-if="photobycardid !== ''">
             <img :src="photobycardid" class="tt">
          </div>
        </v-flex>
        <v-flex xs12 md9 d-flex style="margin-top: 12px;">
          <v-layout wrap align-start justify-start row fill-height>
            <v-flex xs12 md12 d-flex :style="{background: status.color}" :class="{tt: status.color, tt2: status.color === undefined}">
              <v-layout wrap align-center>
                <v-flex xs12 d-flex><h2>Информация о пропуске<span v-if="status.color">: {{status.text}}</span></h2></v-flex>
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
                <v-flex xs12 d-flex><h4 v-if="status.color">{{status.additional.full}}</h4></v-flex>
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
          <approveUsersList :doc="items" :headers="headers"/>
        </v-flex>
      </v-layout>
      <cardFiles :documentfiles="items.DOCUMENTFILES" :doknr="items.DATA_CARD.DOKNR"/>
    </v-container>
  </span>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import cardFiles from './card_files'
import provideApass from './provide_a_pass'
import approveUsersList from './approve_users_list'
export default {
  name: 'card',
  components: {approveUsersList, cardFiles, provideApass},
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
      status: { text: '', value: 1, additional: { text: '', full: '' } },
      photobycardid: '',
      objkey: ''
    }
  },
  async mounted () {
    await this.getData()
    if (this.items.RESULT === 'CARD_NOT_FOUND') {
      this.items.loading = false
      this.$router.push('/404')
    }
    this.items.loading = false
  },
  methods: {
    async getData () {
      console.log('kpp n', typeof (this.$route.params.doknr * 1) === 'number')
      console.log('kpp nan', isNaN(this.$route.params.doknr * 1))
      console.log('doknr n', typeof (this.$route.params.doknr * 1) === 'number')
      console.log('doknr nan', isNaN(this.$route.params.doknr * 1))
      console.log('propusk n', typeof (this.$route.params.propusk * 1) === 'number')
      console.log('propusk nan', isNaN(this.$route.params.propusk * 1))
      // проверка на валидность урла
      if (
        (typeof (this.$route.params.kpp * 1) === 'number' && !isNaN(this.$route.params.kpp * 1)) === false ||
        (typeof (this.$route.params.doknr * 1) === 'number' && !isNaN(this.$route.params.doknr * 1)) === false ||
        (typeof (this.$route.params.propusk * 1) === 'number' && !isNaN(this.$route.params.propusk * 1)) === false
      ) {
        this.$router.push('/404')
        return
      }
      // выбор урла по которому забирать пропуск
      if (parseInt(this.$route.params.doknr) > 0) {
        // по номеру пропуска сап
        this.items = (await axios.get(`${this.$config.api}/bydoknr?doknr=${this.$route.params.doknr}&kpp=${this.$route.params.kpp}&random=${Math.random()}`)).data
      } else if (parseInt(this.$route.params.propusk) > 0) {
        // по номеру карточки сипасс
        this.items = (await axios.get(`${this.$config.api}/bycardid?propusk=${this.$route.params.propusk}&random=${Math.random()}`)).data
      }
      if (this.items === undefined || this.items === null) {
        this.$router.push('/404')
      } else {
        try {
          this.photobycardid = `${this.$config.api}/photobycardid?jwt=${localStorage.getItem('jwt')}&propusk=${this.items.DATA_CARD.ZPROPUSK}&random=${Math.random()}`
          // for (let i = 0; i < this.items.APPRDATA.length; i++) {
          //   let st = this.items.APPRDATA[i].APRST
          //   if (this.items.STATUS === '53') {
          //     if (st === '1') {
          //       this.items.APPRDATA[i].APRST = 'Согласован'
          //       if (this.status.value < 1) {
          //         this.status = {text: 'согласован', value: 1, color: 'red', additional: {text: 'поставил(-а) отметку', full: ''}}
          //       }
          //     } else if (st === 'S') {
          //       this.items.APPRDATA[i].APRST = 'Согласование'
          //       if (this.status.value < 2) {
          //         this.status = {text: 'согласование', value: 2, color: 'red', additional: {text: 'не поставил(-а) отметку', full: ''}}
          //       }
          //     } else if (st === 'IN') {
          //       this.items.APPRDATA[i].APRST = 'Вход'
          //       if (this.status.value < 3) {
          //         this.status = {text: 'отметка вход', value: 3, color: 'red', additional: {text: 'поставил(-а) отметку', full: ''}}
          //       }
          //     } else if (st === 'OUT') {
          //       this.items.APPRDATA[i].APRST = 'Выход'
          //       if (this.status.value < 4) {
          //         this.status = {text: 'отметка выход', value: 4, color: 'green', additional: {text: 'поставил(-а) отметку', full: ''}}
          //       }
          //     } else if (st === 'P') {
          //       this.items.APPRDATA[i].APRST = 'Нет'
          //       if (this.status.value < 5) {
          //         this.status = {text: 'нет отметки', value: 5, color: 'red', additional: {text: 'не поставил(-а) отметку', full: ''}}
          //       }
          //     }
          //   }
          //   else {
          //     if (st === '1') {
          //       this.items.APPRDATA[i].APRST = 'Согласован'
          //       if (this.status.value < 1) {
          //         this.status = {text: 'согласован', value: 1}
          //       }
          //     } else if (st === 'S') {
          //       this.items.APPRDATA[i].APRST = 'Согласование'
          //       if (this.status.value < 2) {
          //         this.status = {text: 'согласование', value: 2, additional: {text: 'поставил(-а) отметку', full: ''}}
          //       }
          //     } else if (st === 'IN') {
          //       this.items.APPRDATA[i].APRST = 'Вход'
          //       if (this.status.value < 3) {
          //         this.status = {text: 'отметка вход', value: 3, additional: {text: 'поставил(-а) отметку', full: ''}}
          //       }
          //     } else if (st === 'OUT') {
          //       this.items.APPRDATA[i].APRST = 'Выход'
          //       if (this.status.value < 4) {
          //         this.status = {text: 'отметка выход', value: 4, additional: {text: 'поставил(-а) отметку', full: ''}}
          //       }
          //     } else if (st === 'P') {
          //       this.items.APPRDATA[i].APRST = 'Нет'
          //       if (this.status.value < 5) {
          //         this.status = {text: 'нет отметки', value: 5, additional: {text: 'не поставил(-а) отметку', full: ''}}
          //       }
          //     }
          //   }
          // }
          this.status = { text: '', value: 1, additional: { text: '', full: '' } }
          for (let i = 0; i < this.items.APPRDATA.length; i++) {
            if (this.items.STATUS === '53' && this.items.APPRDATA[i].APRST === 'IN' && this.items.APPRDATA[i].APRROLE === 'MT') {
              this.status = {
                text: 'нет отметки',
                value: 2,
                color: 'red',
                additional: {text: 'не поставил(-а) отметку', full: ''}
              }
            }
            if (this.items.STATUS === '53' && this.items.APPRDATA[i].APRST === 'IN' && this.items.APPRDATA[i].APRROLE === 'IW') {
              this.status = {
                text: 'отметка вход',
                value: 3,
                color: 'red',
                additional: {text: 'поставил(-а) отметку', full: ''}
              }
            }
            if (this.items.STATUS === '53' && this.items.APPRDATA[i].APRST === 'OUT' && this.items.APPRDATA[i].APRROLE === 'IW') {
              this.status = {
                text: 'отметка выход',
                value: 4,
                color: 'green',
                additional: {text: 'поставил(-а) отметку', full: ''}
              }
              break
            }
          }
          if (this.status.value < 2 && this.items.STATUS === '53') {
            this.status = {
              text: 'нет отметки',
              value: 5,
              color: 'red',
              additional: {text: 'не поставил(-а) отметку', full: ''}
            }
          }
          this.card = [
            {title: 'Состояние пропуска', value: this.items.ES_STATUS_T.DOSTX, color: 1},
            {title: 'Номер пропуска в SAP ERP', value: parseInt(this.items.DATA_CARD.DOKNR)},
            {title: 'Документ удост. личность', value: this.items.DATA_CARD.ID_CARD_NUMB},
            {title: 'ФИО', value: this.items.DATA_CARD.NAME_DRVR},
            {
              title: 'Дата действия',
              value: `${this.M(this.items.DATA_CARD.VALID_DATE_FROM, 'YYYYMMDD').format('DD.MM.YYYY')} - ${this.M(this.items.DATA_CARD.VALID_DATE_TO, 'YYYYMMDD').format('DD.MM.YYYY')}`
            }
          ]
          let note = ''
          for (let i = 0; i < this.items.TEXTDATA.length; i++) {
            if (this.items.TEXTDATA[i].FIELDNAME === 'NOTE') {
              note += ' ' + this.items.TEXTDATA[i].TDLINE
            }
          }
          if (note !== '') {
            this.card.push({title: 'Заметка', value: note})
          }
          this.hiUser = [
            {title: 'ФИО', value: this.items.DATA_CARD.INIT_PNM},
            {title: 'Должность', value: this.items.DATA_CARD.INIT_SNM},
            {title: 'Подразделение', value: this.items.DATA_CARD.INIT_ONM}
          ]
          this.writeUser = [
            {title: 'ФИО', value: this.items.DATA_CARD.AUTHOR_PNM},
            {title: 'Должность', value: this.items.DATA_CARD.AUTHOR_SNM},
            {title: 'Подразделение', value: this.items.DATA_CARD.AUTHOR_ONM}
          ]
          this.objkey = this.items.DATA_CARD.DOKAR + this.items.DATA_CARD.DOKNR + this.items.DATA_CARD.DOKVR + this.items.DATA_CARD.DOKTL
          this.items.APPRDATA.forEach(it => {
            console.log(it.APRROLE)
            if (it.APRROLE === 'IW') {
              this.status.additional.full = `${it.APRNAME_FULL} ${this.status.additional.text}`
            }
          })
        } catch (e) {
          console.error(e)
          this.$router.push('/404')
        }
      }
    }
  },
  watch: {
    '$route.params.doknr' (val, oldVal) {
      this.getData()
    },
    '$route.params.propusk' (val, oldVal) {
      this.getData()
    }
  },
  destroyed () {
    // this.items = { loading: true }
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
    border-radius: 2px;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    color: whitesmoke;
  }
  .tt2 {
    border-radius: 2px;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
  }
</style>
