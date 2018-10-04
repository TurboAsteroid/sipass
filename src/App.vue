<template>
  <v-app>
    <v-navigation-drawer app v-if="exitButtonIsActive" fixed clipped class="grey lighten-4"><navigation/></v-navigation-drawer>
    <v-toolbar app clipped-left>
      <span class="title ml-3 mr-5">{{$appName}}</span>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-card height="100%" color="blue-grey lighten-5">
          <router-view></router-view>
        </v-card>
      </v-container>
    </v-content>
    <v-footer app>{{$appVersion}}</v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
