import axios from 'axios'
export default {
  initAuth () {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt')
    axios.interceptors.response.use((response) => {
      return Promise.resolve(response)
    }, (error) => {
      console.log(error)
      localStorage.clear()
      this.$router.push({ name: 'index' })
      return Promise.reject(error)
    })
  }
}
