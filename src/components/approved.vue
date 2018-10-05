<template>
<div>{{all}}</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'approved',
  data () {
    return {
      all: 'Загрузка...'
    }
  },
  async mounted () {
    this.all = await axios.get(`${this.$config.api}/all57`)
  }
}
</script>

<style scoped>

</style>
