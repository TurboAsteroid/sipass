import axios from 'axios'
import router from '@/router'
export default {
  initAuth () {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt')
    axios.interceptors.response.use((response) => {
      return Promise.resolve(response)
    }, (error) => {
      console.log(error)
      localStorage.clear()
      router.push({ name: 'index' })
      return Promise.reject(error)
    })
  }
}
