import Vue from 'vue'
import Router from 'vue-router'
import platform from '../components/platform/index.vue'
import cardplatform from '../components/cardplatform/index.vue'
import detailplatform from '../components/detailplatform/index.vue'
import login from '../components/login/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/platform',
      name: 'platform',
      component: platform,
      meta: {
          keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/detailplatform',
      name: 'detailplatform',
      component: detailplatform
    }
  ]
})



// WEBPACK FOOTER //
// ./src/router/index.js