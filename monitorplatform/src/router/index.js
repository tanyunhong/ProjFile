import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home/Home.vue'
import platform from '../components/platform/index.vue'
import cardplatform from '../components/cardplatform/index.vue'
import detailplatform from '../components/detailplatform/index.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'platform',
      component: platform,
      meta: {
          keepAlive: true // 需要被缓存
        }
    },
    {
      path: '/cardplatform',
      name: 'cardplatform',
      component: cardplatform
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    }, {
      path: '/detailplatform',
      name: 'detailplatform',
      component: detailplatform
    }
  ]
})
