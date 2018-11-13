<template>
  <v-container>
    <v-layout align-center justify-center row fill-height wrap>
      <v-form v-model="valid" ref="form">
        <v-text-field
          label="Имя пользователя"
          v-model="login"
          :rules="loginRules"
          required
          id="login"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'visibility_off' : 'visibility'"
          :rules="passwordRules"
          :type="show1 ? 'text' : 'password'"
          name="password"
          counter
          @click:append="show1 = !show1"
          label="Пароль"
          required
          id="password"
        ></v-text-field>
        <v-layout justify-space-between>
          <v-btn @click="submit" color="info" :disabled="!valid" id="loginbtn">Вход</v-btn>
        </v-layout>
      </v-form>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios'
import router from '@/router'
import Vue from 'vue'
export default {
  name: 'auth',
  props: ['redirRouteName'],
  data () {
    return {
      show1: false,
      valid: false,
      e1: false,
      password: 'gs2-1',
      passwordRules: [
        (v) => !!v || 'Требуется ввести пароль'
      ],
      login: 'gs2@elem.ru',
      loginRules: [
        (v) => !!v || 'Требуется ввести имя пользователя'
      ]
    }
  },
  mounted () {
    if (localStorage.getItem('jwt') !== null && this.redirPath === undefined) {
      router.push({ path: this.redirPath })
    } else if (localStorage.getItem('jwt') !== null) {
      router.push({ path: this.redirPath })
    } else {
      this.$store.commit('navigation/exitButtonIsActive', false)
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        let login = this.login.split('@')[0]
        login = login + '@elem.ru'
        const options = {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          data: {
            user: {
              login: login,
              password: this.password
            }
          },
          url: `${this.$config.api}/auth/login`
        }
        try {
          const res = await axios(options)
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
          if (res.status === 200) {
            localStorage.setItem('jwt', res.data.token)
            localStorage.setItem('globalUserData', JSON.stringify(res.data.globalUserData))
            Vue.prototype.$globalUserData = res.data.globalUserData
            console.log(Vue.prototype.$globalUserData)
            if (localStorage.getItem('jwt') != null) {
              if (this.$route.params.nextUrl != null) {
                this.router.push(this.$route.params.nextUrl)
              } else {
                var redirRouteName = this.redirRouteName
                if (redirRouteName === undefined) {
                  redirRouteName = 'index'
                }
                router.push({ name: redirRouteName })
                this.$store.commit('navigation/exitButtonIsActive', true)
              }
            }
          } else {
            console.log('bad')
          }
        } catch (err) {
          console.log(err)
          router.push({ name: 'auth' })
          this.$store.commit('navigation/exitButtonIsActive', false)
        }
      }
    }
  }
}
</script>

<style>
</style>
