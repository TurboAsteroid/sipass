const listFilter = {
  namespaced: true,
  state: {
    filter: {
      kpp: {text: 'Все доступные', value: 'all'},
      whenDate: {text: 'Сегодня', value: 'today'}
    }
  },
  mutations: {
    changeKpp: (state, obj) => {
      state.filter.kpp = obj
    },
    changeWhen: (state, obj) => {
      state.filter.whenDate = obj
    },
    changeAll: (state, obj) => {
      state.filter = obj
    }
  },
  getters: {
    getFilter: state => { return state.filter },
    getKpp: state => { return state.filter.kpp },
    getWhenDate: state => { return state.filter.whenDate }
  },
  actions: {}
}
export default listFilter
