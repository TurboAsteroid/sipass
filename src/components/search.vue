<template>
  <v-layout align-center justify-center row fill-height>{{all}}</v-layout>
</template>

<script>
import axios from 'axios'
export default {
  name: 'search',
  data () {
    return {
      all: {}
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      // Optionally the request above could also be done as
      // axios.get(`https://sap-prx.ugmk.com:443/ummc/permit/list`, {
      //   params: {
      //     status: 57,
      //     ckeckpoint: 11002,
      //     'sap-user': 'skud_uem',
      //     'sap-password': 'sRec137K'
      //   }
      // })
      //   .then(function (response) {
      //     this.all = response
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
      //   .then(function () {
      //     // always executed
      //   })
      this.all = await axios.get(`https://sap-prx.ugmk.com:443/ummc/permit/list`, {
        params: {
          status: 57,
          ckeckpoint: 11002,
          'sap-user': 'skud_uem',
          'sap-password': 'sRec137K'
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
