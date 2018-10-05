<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap align-center>
      <v-flex xs12 d-flex>
        <v-select :items="kpps" label="Контрольно-пропускной пункт" v-model="kpp"/>
      </v-flex>
      <v-flex xs12 d-flex>
        <v-data-table :headers="headers" :items="showed" hide-actions>
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.DOKNR }}</td>
            <td class="text-xs-left">{{ props.item.NAME_DRVR }}</td>
            <td class="text-xs-left">{{ M(props.item.E_DATE + props.item.E_TIME, 'YYYYMMDDHHmmSS').format('DD.MM.YYYY HH:mm:SS') }}</td>
            <td class="text-xs-left">{{ M(props.item.VALID_DATE_FROM, 'YYYYMMDD').format('DD.MM.YYYY') }}</td>
            <td class="text-xs-left">{{ M(props.item.VALID_DATE_TO, 'YYYYMMDD').format('DD.MM.YYYY') }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'approved',
  data () {
    return {
      kpps: ['11002', '11008', 'Все'], // тут надо будет переделывать на нормальные названия,
      // поэтому придется переделвывать либо сервер еще либо фильтр в компутед
      kpp: 'Все',
      M: moment,
      items: [],
      headers: [
        { text: 'Номер документа SAP ERP', value: '', sortable: false },
        { text: 'Имя посетителя', value: '', sortable: false },
        { text: 'Дата и время изменения состояния', value: '', sortable: false },
        { text: 'Дата начала действия', value: '', sortable: false },
        { text: 'Дата конец действия', value: '', sortable: false }
      ]
    }
  },
  async mounted () {
    this.items = (await axios.get(`${this.$config.api}/all57`)).data
  },
  computed: {
    showed () {
      if (this.kpp === 'Все') {
        return this.items
      }
      const result = this.items.filter(item => item.KPP === this.kpp)
      return result
    }
  }
}
</script>

<style scoped>

</style>
