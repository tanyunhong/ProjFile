// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ProjectConfig from '../config/ProjectConfig'
import config from '../static/config'
import HJload from './components/common/HJLoading/HJLoading.js'
import axios from 'axios'
import './assets/css/main.css'

axios.defaults.baseURL = config.APIRoot//ProjectConfig.APIRoot
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.prototype.$HJloading = HJload;

// 引用element组件
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
