<template>
  <v-layout align-start justify-start column style="padding-top: 18px">
    <v-btn color="info" flat @click="approval" block><i class="material-icons">done</i>&nbsp;&nbsp;&nbsp;На согласовании</v-btn>
    <v-btn color="info" flat @click="approved" block><i class="material-icons">done_all</i>&nbsp;&nbsp;&nbsp;Согласованы</v-btn>
    <v-btn color="info" flat @click="inside" block><i class="material-icons">location_on</i>&nbsp;&nbsp;&nbsp;На территории</v-btn>
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
      this.$router.push({ name: 'list', params: { id: 53, name: 'Список пропусков на территории' } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
