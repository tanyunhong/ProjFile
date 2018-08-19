// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import ProjectConfig from '../config/ProjectConfig.js'
import store from './store'
import init from './canvasnest'
import $ from 'jquery'
init();
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
/* eslint-disable no-new */
axios.defaults.baseURL = '/api'//ProjectConfig.APIRoot
export let vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
