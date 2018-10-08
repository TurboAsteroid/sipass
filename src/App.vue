<template>
  <v-app>
    <v-navigation-drawer app v-if="exitButtonIsActive" fixed clipped class="grey lighten-4"><navigation/></v-navigation-drawer>
    <v-toolbar app clipped-left>
      <span class="title ml-3 mr-5">{{$appName}}<span v-if="$route.params.name !== undefined">: {{$route.params.name}}</span></span>
      <v-spacer></v-spacer>
      <v-btn color="info" flat @click="exit" v-if="exitButtonIsActive"><i class="material-icons">exit_to_app</i>&nbsp;Выход</v-btn>
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
import navigation from '@/components/navigation'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {navigation},
  mounted () {
    if (localStorage.getItem('jwt') == null) {
      this.$store.commit('navigation/exitButtonIsActive', false)
    } else {
      this.$store.commit('navigation/exitButtonIsActive', true)
    }
  },
  methods: {
    exit () {
      localStorage.clear()
      this.$router.push({ name: 'auth' })
      this.$store.commit('navigation/exitButtonIsActive', false)
    }
  },
  computed: {
    ...mapGetters({
      exitButtonIsActive: 'navigation/exitButtonIsActive'
    })
  }
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
.noshadow {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
</style>
