<template>
  <v-container>
    <h1>К сожалению, ничего не найдено</h1>
    <v-spacer></v-spacer>
    <v-btn @click="$router.go(-2)" color="info" flat><i class="material-icons">arrow_back</i>Назад</v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'page404'
}
</script>

<style scoped>

</style>
