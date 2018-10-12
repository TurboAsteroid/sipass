// 0021528669
const search = {
  namespaced: true,
  state: {
    propusk: ''
  },
  mutations: {
    propusk: (state, val) => {
      state.propusk = val
    }
  },
  getters: {
    propusk: state => { return state.propusk }
  },
  actions: {}
}
export default search
