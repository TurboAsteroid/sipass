import axios from 'axios'
export default {
  initAuth () {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt')
  }
}
