<template>
  <input
    type="text"
    v-model="prp"
    @click='prp = ""'
    :input="inp"
    :autofocus="true"
    class="main"
    placeholder="Кликните сюда и считайте пропуск"
    v-on:focusout="inp('focusout')"
    @keydown.enter="inp"
  />
</template>

<script>
export default {
  name: 'search2',
  data () {
    return {
      prp: ''
    }
  },
  methods: {
    inp (v) {
      console.log(this.prp)
      if (v === 'focusout') {
        this.prp = ''
      } else if (this.prp.length >= 10) {
        console.log(this.prp)
        this.$router.push({
          name: 'card',
          params: {kpp: getRandomInt(-10000000, -2), doknr: getRandomInt(-10000000, -2), propusk: this.prp}
        })
        this.prp = ''
      }
    }
  },
  watch: {
    prp: function (v, ov) {
      this.inp(v)
    }
  }
}
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
</script>

<style scoped>
.main {
  height: 38px;
  max-width: 500px;
  width: 100%;
  font-size: 20px;
  color: rgba(0,0,0,0.8);
  border: rgba(0,0,0,0.6) solid 1px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.15);
  background-color: rgba(255,255,255,0.75);
}
</style>
