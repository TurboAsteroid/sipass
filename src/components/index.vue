<template>
  <v-layout align-center justify-center row fill-height><auth v-bind:redirPath="'/search'" /></v-layout>
</template>

<script>
import auth from '@/auth/auth'
export default {
  name: 'index',
  components: {auth}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
