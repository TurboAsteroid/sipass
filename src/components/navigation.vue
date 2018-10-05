<template>
  <v-layout align-start justify-start column fill-height>
    <div style="margin-left: 8px; width: 96%">
      <v-text-field label="Поиск пропуска" append-icon="search"></v-text-field>
    </div>
    <v-btn color="info" flat @click="approval"><i class="material-icons">done</i>На согласовании</v-btn>
    <v-btn color="info" flat @click="approved"><i class="material-icons">done_all</i>&nbsp;Согласован</v-btn>
    <v-btn color="info" flat @click="inside"><i class="material-icons">location_on</i>&nbsp;На териитории</v-btn>
  </v-layout>
</template>

<script>
export default {
  name: 'navigation',
  data () {
    return {
      nothing: false
    }
  },
  methods: {
    approval () {
      this.$router.push({name: 'approval'})
    },
    approved () {
      this.$router.push({name: 'approved'})
    },
    inside () {
      this.$router.push({name: 'inside'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
