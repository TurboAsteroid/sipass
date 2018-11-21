<template>
  <div class="text-xs-right">
    <v-btn fab color="info" class="fab_position" @click="toContents">
      <h2>?</h2>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'help',
  methods: {
    toContents () {
      this.$router.push({name: 'helpPage', params: { page: 'content' }})
    }
  }
}
</script>

<style scoped>
.fab_position {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
