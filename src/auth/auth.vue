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
          label="Пароль"
          v-model="password"
          min="8"
          :append-icon="e1 ? 'visibility' : 'visibility_off'"
          :append="() => (e1 = !e1)"
          :type="e1 ? 'text' : 'password'"
          :rules="passwordRules"
          counter
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
import S from '@/store'
export default {
  name: 'auth',
  props: ['redirRouteName'],
  data () {
    return {
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
            localStorage.setItem('auth', res.data.auth)
            if (localStorage.getItem('jwt') != null) {
              if (this.$route.params.nextUrl != null) {
                this.router.push(this.$route.params.nextUrl)
              } else {
                var redirRouteName = this.redirRouteName
                if (redirRouteName === undefined) {
                  redirRouteName = 'index'
                }
                router.push({ name: redirRouteName })
                S.commit('navigation/exitButtonIsActive', true)
              }
            }
          } else {
            console.log('bad')
          }
        } catch (err) {
          console.log(err)
          router.push({ name: 'auth' })
          S.commit('navigation/exitButtonIsActive', false)
        }
      }
    }
  }
}
</script>

<style>
</style>
