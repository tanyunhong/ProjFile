import Vuex from 'vuex'
import Vue from 'vue'
import Interval from './Interval.js'
import User from './User.js'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    interval: Interval,
    user: User
  },
  plugins: [
    createPersistedState({storage: window.sessionStorage}),createLogger()
  ]
})



// WEBPACK FOOTER //
// ./src/store/index.js