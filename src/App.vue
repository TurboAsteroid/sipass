<template>
  <v-app>
    <span v-if="lite">
      <span style="margin: 20px;">
      <search v-if="exitButtonIsActive"/></span>
      <router-view></router-view>
    </span>
    <span v-else>
      <v-navigation-drawer app v-if="exitButtonIsActive" fixed clipped class="grey lighten-4" v-model="drawer"><navigation/></v-navigation-drawer>
      <v-toolbar app clipped-left style="min-width: 1080px">
        <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
        <span class="title ml-3 mr-5">{{$appName}}<span
          v-if="$route.params.name !== undefined">: {{$route.params.name}}</span></span>
        <v-spacer></v-spacer>
        <search v-if="exitButtonIsActive"/>
        <v-btn flat @click="exit" v-if="exitButtonIsActive" color="info"><i class="material-icons">exit_to_app</i>&nbsp;Выход</v-btn>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <v-card height="100%" color="blue-grey lighten-5" style="min-width: 1080px">
            <router-view></router-view>
          </v-card>
        </v-container>
      </v-content>
      <v-footer app>{{$appVersion}}
        <!--<help v-if="exitButtonIsActive"/>-->
      </v-footer>
    </span>
  </v-app>
</template>

<script>
import navigation from '@/components/navigation'
import search from '@/components/search'
import {mapGetters} from 'vuex'

export default {
  name: 'App',
  components: {navigation, search},
  data: () => ({
    drawer: null,
    windowWidth: window.innerWidth,
    lite: false
  }),
  mounted () {
    if (localStorage.getItem('jwt') == null) {
      this.$store.commit('navigation/exitButtonIsActive', false)
    } else {
      this.$store.commit('navigation/exitButtonIsActive', true)
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          this.windowWidth = window.innerWidth
        })
      })
    }
  },
  methods: {
    exit () {
      localStorage.clear()
      this.$router.push({name: 'auth'})
      this.$store.commit('navigation/exitButtonIsActive', false)
    }
  },
  computed: {
    ...mapGetters({
      exitButtonIsActive: 'navigation/exitButtonIsActive'
    })
  },
  watch: {
    windowWidth: function (val, oldVal) {
      if (val < 800) {
        this.lite = true
        console.log(val)
      } else {
        this.lite = false
      }
      console.log(val)
    }
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
