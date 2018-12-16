export default {
  namespaced: true,
  state: {
    data: [] // {name:value}
  },
  mutations: {
   setData(state, {name, count}){
     state.data[name] = count
   },
   cancelData(state, name){
     state.data[name] = null
   }
  }
}



// WEBPACK FOOTER //
// ./src/store/Interval.js