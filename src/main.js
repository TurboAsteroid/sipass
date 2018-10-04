// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import 'es6-promise/auto'
import auth from '@/auth'
auth.initAuth()
Vue.prototype.$appName = 'Разовый пропуск'
Vue.prototype.$appVersion = 'v3.r0'
Vue.use(Vuetify)
Vue.prototype.$config = {
  api: 'https://localhost:3000'
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
