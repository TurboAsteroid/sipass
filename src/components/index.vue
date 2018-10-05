<template>
  <v-layout align-center justify-center row fill-height>
    <approved/>
  </v-layout>
</template>

<script>
// вместо индекса мы будем всегда показывать согласованные пропуски
// за исключением того случая, когда произведен поиск пропуска
import approved from './approved'
export default {
  name: 'index',
  components: {approved}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
