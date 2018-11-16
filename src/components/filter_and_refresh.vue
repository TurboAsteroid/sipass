<template>
    <v-layout wrap align-center fluid grid-list-xl>
      <v-flex xs6 d-flex>
        <v-select :items="kpps" label="Контрольно-пропускной пункт" v-model="kpp"/>
      </v-flex>
      <v-flex xs4 d-flex>
        <v-select :items="when" label="Начало действия пропуска" v-model="whenDate"/>
      </v-flex>
      <v-flex xs2 d-flex>
        <v-btn @click="$emit('refresh')" color="info" flat><i class="material-icons">refresh</i> Обновить</v-btn>
      </v-flex>
    </v-layout>
</template>

<script>
export default {
  name: 'filter_and_refresh',
  props: ['kpps'],
  data () {
    return {
      when: [
        {text: 'Сегодня', value: 'today'},
        {text: 'Завтра', value: 'tomorrow'},
        {text: 'Все', value: 'all'}
      ]
    }
  },
  computed: {
    kpp: {
      get: function () {
        return this.$store.getters['listFilter/getKpp']
      },
      set: function (val) {
        let toCommit = this.kpps.filter(it => it.value === val)
        this.$store.commit('listFilter/changeKpp', toCommit[0])
      }
    },
    whenDate: {
      get: function () {
        return this.$store.getters['listFilter/getWhenDate']
      },
      set: function (val) {
        let toCommit = this.when.filter(it => it.value === val)
        this.$store.commit('listFilter/changeWhen', toCommit[0])
      }
    }
  }
}
</script>

<style scoped>

</style>
