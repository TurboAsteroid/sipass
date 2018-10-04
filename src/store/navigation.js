const navigation = {
  namespaced: true,
  state: {
    exitButtonIsActive: false
  },
  mutations: {
    exitButtonIsActive: (state, val) => {
      state.exitButtonIsActive = val
      if (!val) {
        localStorage.removeItem('user')
        localStorage.removeItem('jwt')
      }
    }
  },
  getters: {
    exitButtonIsActive: state => { return state.exitButtonIsActive }
  },
  actions: {}
}
export default navigation
