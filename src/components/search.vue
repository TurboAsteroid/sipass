<template>
  <v-text-field
    v-model="propusk"
    style="max-width: 500px;"
    solo-inverted
    flat
    label="Поиск пропуска"
    prepend-icon="search">
  </v-text-field>
</template>

<script>
// 0021528669
export default {
  name: 'search',
  props: ['propusk'],
  methods: {
    clear () {}
  },
  watch: {
    propusk: function (val, oldVal) {
      console.log(val)
      console.log(this.propusk)
      if (val.toString().length === 10) {
        this.$emit('clear_propusk')
        this.$router.push({
          name: 'card',
          params: {kpp: getRandomInt(-10000000, -2), doknr: getRandomInt(-10000000, -2), propusk: val}
        })
      }
    }
  }
}
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
</script>

<style scoped>

</style>
