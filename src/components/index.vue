<template>
  <v-layout />
</template>

<script>
export default {
  name: 'index',
  created () {
    this.$router.push({ name: 'list', params: { id: 57, name: 'Список согласованных пропусков' } })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
