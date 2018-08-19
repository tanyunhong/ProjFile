import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/components/login'
import pddOrder from '@/components/pddOrder'
import upload from '@/components/upload'
import loadImage from '@/components/loadImage'
import pddGetSKU from '@/components/pddGetSKU'
import index from '@/components/index.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: HelloWorld
    },{
      path: '/login',
      name: 'login',
      component: login
    },{
      path: '/index',
      name: "HelloWorld",
      component: index
    },{
      path: '/pddOrder',
      name: 'pddOrder',
      component: pddOrder
    },{
      path: '/pddUpload',
      name: 'upload',
      component: upload
    },{
      path: '/loadImage',
      name: 'loadImage',
      component: loadImage
    }, {
      path: '/pddTBSKU',
      name: 'pddGetSKU',
      component: pddGetSKU
    }
  ]
})
