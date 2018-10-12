<template>
  <v-text-field
    v-model="propusk"
    @click.native="propusk = ''"
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
  data () {
    return {
      propusk: 666
    }
  },
  created () {},
  methods: {
  },
  computed: {
  },
  watch: {
    propusk: function (val, oldVal) {
      if (val.toString().length === 10) {
        console.log('search watcher')
        this.propusk = ''
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
