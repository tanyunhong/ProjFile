<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>{{num}}-----{{num2}}
    <el-button type="primary" @click="cancelHandler">注销</el-button>
  </div>
</template>

<script>
import PbcUtils from '@/common/PbcUtils'
import laod from '@/common/load'
import api from '@/API'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      num: 0,
      num2: 0
    }
  },
  methods: {
    cancelHandler(){
      let n = 1.003
      for(let i = 2;i<=360;i++){
          n = n * 1.003;
      }
      this.num = 600000*0.003*n/(n-1)
      //〔贷款本金×月利率×（1+月利率）^还款月数〕÷〔（1+月利率）^还款月数－1〕
      this.num2 = 600000/360 + (600000)* 0.003
      //(贷款本金÷还款月数)+(贷款本金-累计已还本金)×月利率
      /** 
      let callBack = data => {
        this.$router.push('/login');
      }
      PbcUtils.requestService({url: api.loginModule.loginOut, method: "get", data: this.formData, callBack});
      */
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
