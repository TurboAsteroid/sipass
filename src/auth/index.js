import axios from 'axios'
export default {
  initAuth (route, router) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt')
    axios.interceptors.response.use((response) => {
      return Promise.resolve(response)
    }, (error) => {
      console.log(error)
      router.push({ path: router })
      return Promise.reject(error)
    })
  }
}
