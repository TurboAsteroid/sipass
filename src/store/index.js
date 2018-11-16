import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'
import navigation from './navigation'
import listFilter from './list_filter'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {navigation, listFilter}
})
export default store
