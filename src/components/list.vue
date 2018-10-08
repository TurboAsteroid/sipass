<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap align-center>
      <v-flex xs12 d-flex>
        <far :kpps="kpps" @kpp_filter_changed="kpp_filter_changed" @refresh="refresh"/>
      </v-flex>
      <v-flex xs12 d-flex>
        <v-data-table :headers="headers" :items="showed" hide-actions>
          <template slot="items" slot-scope="props">
            <tr @click="open(props.item.DOKNR)">
              <td class="text-xs-left">{{ props.item.DOKNR }}</td>
              <td class="text-xs-left">{{ props.item.NAME_DRVR }}</td>
              <td class="text-xs-left">{{ M(props.item.E_DATE + props.item.E_TIME, 'YYYYMMDDHHmmSS').format('DD.MM.YYYY HH:mm:SS') }}</td>
              <td class="text-xs-left">{{ M(props.item.VALID_DATE_FROM, 'YYYYMMDD').format('DD.MM.YYYY') }}</td>
              <td class="text-xs-left">{{ M(props.item.VALID_DATE_TO, 'YYYYMMDD').format('DD.MM.YYYY') }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import far from './filter_and_refresh'
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'list',
  components: { far },
  data () {
    return {
      kpps: this.$globalUserData.kpps, // тут надо будет переделывать на нормальные названия
      M: moment,
      items: [],
      headers: [
        { text: 'Номер документа SAP ERP', value: '', sortable: false },
        { text: 'Имя посетителя', value: '', sortable: false },
        { text: 'Дата и время изменения состояния', value: '', sortable: false },
        { text: 'Дата начала действия', value: '', sortable: false },
        { text: 'Дата конец действия', value: '', sortable: false }
      ],
      showed: [],
      selectedKpp: 'Все'
    }
  },
  methods: {
    kpp_filter_changed (kpp) {
      this.selectedKpp = kpp
      if (kpp === 'Все') {
        this.showed = this.items
      } else {
        this.showed = this.items.filter(item => item.KPP === kpp)
      }
    },
    async refresh (kpp) {
      this.items = (await axios.get(`${this.$config.api}/all${this.$route.params.id}`)).data
      this.kpp_filter_changed(kpp)
    },
    async open (doknr) {
      let kpp = (await (this.items.filter(async item => item.DOKNR === doknr)))[0].KPP
      let response = (await axios.get(`${this.$config.api}/bydoknr?doknr=${doknr}&kpp=${kpp}`)).data
      console.log(response)
    }
  },
  mounted () {
    // this.refresh('Все')
    // обновление каждые 30 секунд
    setTimeout(this.refresh(this.selectedKpp), 30000)
  },
  watch: {
    '$route.params.id' (val, oldVal) {
      this.refresh(this.selectedKpp)
    }
  }
}
</script>

<style scoped>

</style>
