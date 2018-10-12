import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'
import navigation from './navigation'
import search from './search'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {navigation, search}
})
export default store
