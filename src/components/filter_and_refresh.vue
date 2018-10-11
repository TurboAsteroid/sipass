<template>
    <v-layout wrap align-center fluid grid-list-xl>
      <v-flex xs8 d-flex>
        <v-select :items="kpps" label="Контрольно-пропускной пункт" v-model="kpp"/>
      </v-flex>
      <v-flex xs4 d-flex>
        <v-btn @click="$emit('refresh', kpp)" color="info"><i class="material-icons">refresh</i> Обновить</v-btn>
      </v-flex>
    </v-layout>
</template>

<script>
export default {
  name: 'filter_and_refresh',
  props: ['kpps'],
  data () {
    return {
      kpp: 'Все'
    }
  },
  watch: {
    kpp (val, oldVal) {
      this.$emit('kpp_filter_changed', val)
    }
  }
}
</script>

<style scoped>

</style>
