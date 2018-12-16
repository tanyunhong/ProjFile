let initData = _ => {
  return {
    id: 0, 
    userName: '', 
    //rememberPW: ''
  }
}
export default {
  namespaced: true,
  state: {
    remember: false,
    user: initData()
  },
  mutations: {
    clearUser(state){
      //state.user = initData()
      state.user.id = 0
    },
    setUser(state, data){
      for(let item in state.user){
          state.user[item] = data.user[item]
      }
      state.remember = data.remember //已没用，暂时没删除
    }
  }
}



// WEBPACK FOOTER //
// ./src/store/User.js