<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap align-center>
      <v-flex xs12 d-flex>
        <far :kpps="kpps" @refresh="refresh"/>
      </v-flex>
      <v-flex xs12 d-flex>
        <v-data-table :headers="headers" :items="showed" hide-actions :loading="loading">
          <template slot="items" slot-scope="props">
            <tr @click="open(props.item.DOKNR)">
              <td class="text-xs-left">{{ parseInt(props.item.DOKNR) }}</td>
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
import { mapGetters } from 'vuex'
export default {
  name: 'list',
  components: { far },
  data () {
    return {
      varSI: null,
      loading: false,
      M: moment,
      items: [],
      headers: [
        { text: 'Номер документа SAP ERP', value: '', sortable: false },
        { text: 'Имя посетителя', value: '', sortable: false },
        { text: 'Дата и время изменения состояния', value: '', sortable: false },
        { text: 'Дата начала действия', value: '', sortable: false },
        { text: 'Дата конец действия', value: '', sortable: false }
      ],
      showed: []
    }
  },
  methods: {
    async open (doknr) {
      let kpp = await (this.items.filter(item => item.DOKNR === doknr))
      kpp = kpp[0].KPP
      this.$router.push({ name: 'card', params: { kpp: kpp, doknr: doknr, propusk: '-1' } })
    },
    async refresh () {
      this.loading = true
      this.items = (await axios.get(`${this.$config.api}/all${this.$route.params.id}`)).data
      this.loading = false
    },
    filterList (items) {
      let tmp = []
      if (this.kpp.value === 'all') {
        tmp = items
      } else {
        tmp = items.filter(it => it.KPP === this.kpp.value)
      }
      if (this.whenDate.value === 'today') {
        this.showed = tmp.filter(it => it.VALID_DATE_FROM === this.M().format('YYYYMMDD'))
      } else if (this.whenDate.value === 'tomorrow') {
        this.showed = tmp.filter(it => it.VALID_DATE_FROM === this.M().add(1, 'day').format('YYYYMMDD'))
      } else { // all
        this.showed = tmp
      }
    }
  },
  created () {
    const self = this
    function f () {
      self.refresh()
    }
    f()
    this.varSI = setInterval(f, 60000)
  },
  destroyed () {
    console.log('list destroyed')
    clearInterval(this.varSI)
  },
  computed: {
    ...mapGetters({filter: 'listFilter/getFilter', kpp: 'listFilter/getKpp', whenDate: 'listFilter/getWhenDate'}),
    kpps: function () {
      return this.$globalUserData.kpps
    }
  },
  watch: {
    items: function (val, oldVal) {
      this.filterList(val)
    },
    kpp: function (val, oldVal) {
      this.filterList(this.items)
    },
    whenDate: function (val, oldVal) {
      this.filterList(this.items)
    },
    '$route.params.id' (val, oldVal) {
      this.refresh()
    }
  }
}
</script>

<style scoped>

</style>
