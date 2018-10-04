<template>
  <v-layout align-start justify-start column fill-height>
    <v-btn color="info" flat @click="exit"><i class="material-icons">exit_to_app</i>&nbsp;Выход</v-btn>
  </v-layout>
</template>

<script>
import router from '@/router'
import S from '@/store'
export default {
  name: 'navigation',
  data () {
    return {
      nothing: false
    }
  },
  methods: {
    exit () {
      router.push({ name: 'auth' })
      S.commit('navigation/exitButtonIsActive', false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
