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
  async mounted () {
    this.all = await axios.get(`${this.$config.api}/all57`)
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
