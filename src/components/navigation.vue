<template>
  <v-layout align-start justify-start column fill-height>
    <v-btn color="info" flat @click="approval"><i class="material-icons">done</i> На согласовании</v-btn>
    <v-btn color="info" flat @click="approved"><i class="material-icons">done_all</i>&nbsp;Согласованы</v-btn>
    <v-btn color="info" flat @click="inside"><i class="material-icons">location_on</i>&nbsp;На териитории</v-btn>
  </v-layout>
</template>

<script>
export default {
  name: 'navigation',
  methods: {
    approval () {
      this.$router.push({ name: 'list', params: { id: 51, name: 'Список пропусков на согласовании' } })
    },
    approved () {
      this.$router.push({ name: 'list', params: { id: 57, name: 'Список согласованных пропусков' } })
    },
    inside () {
      this.$router.push({ name: 'list', params: { id: 53, name: 'Список пропусков на териитории' } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
