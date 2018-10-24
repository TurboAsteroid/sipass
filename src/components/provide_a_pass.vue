<template>
    <v-layout wrap align-start justify-start row fill-height>
      <v-flex xs12 md6 d-flex>
        <v-text-field
          label="Кликните сюда и считайте карту"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 md3 d-flex>
        <v-btn @click="" color="info"><i class="material-icons">check_circle</i>&nbsp;Отметить вход</v-btn>
      </v-flex>
      <v-flex xs6 md3 d-flex>
        <v-btn @click="" color="info"><i class="material-icons">redo</i>&nbsp;На доработку</v-btn>
      </v-flex>
    </v-layout>
</template>

<script>
export default {
  name: 'provide_a_pass'
}
</script>

<style scoped>

</style>
