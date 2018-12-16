<template>
  <div class='platform'>
    <el-dropdown class='login-dropdown' @command="handleCommand">
      <span class="el-dropdown-link">
        <i class="welcome-image el-icon--right"></i><span>admin</span>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-tabs v-model="activeName" @tab-click="handleClick" class='hj-tabs'>
      <el-tab-pane label="服务器" name="server" class="server-pane"><serverinfo ref="server"></serverinfo></el-tab-pane>
      <el-tab-pane label="应用" name="application" ><cardplatform ref="application"></cardplatform></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import serverinfo from '../serverInfo/index.vue'
  import cardplatform from '../cardplatform/index.vue'
  import Util from '@/assets/js/Util.js'
  export default {
     data() {
      return {
        activeName: 'server'
      };
    },
    components: {cardplatform,serverinfo},
    beforeRouteEnter(to, from, next){
      next()
    },
    beforeRouteLeave(to, from, next) { //控制缓存
        if(to.name == 'detailplatform'){
          from.meta.keepAlive = true
        } else {
          from.meta.keepAlive = false
        }
        next()
    },
    methods: {
      handleCommand(){
        Util.cancelAllInterval(this)
        Util.requestService({vm: this, url: '/logout', method: 'post', data: {logout: "true"}})
      },
      handleClick(tab, event) {
        if(!tab.$children[0].isChoose){ //改变选择的状态
          this.$refs['server'].choose();
          this.$refs['application'].choose();
        }
      }
    }
  }
</script>
<style>
.platform .login-dropdown.el-dropdown{
    position: absolute;
    right: 30px;
    line-height: 40px;
    z-index: 1;
}
.platform {
    width: 100%;
    height: 100%;
    /*margin-left: 10px;*/
    overflow-y: auto;
}
.platform .el-tabs__content {
    height: calc(100% - 55px);
    overflow: visible; 
}
.platform .el-tabs.el-tabs--top{
  height: 100%;
}
.el-tab-pane{
  height: 100%;
  overflow: auto;
}
.el-tabs__nav-scroll{
  margin-left: 10px;
}
.server-pane{
  padding-top: 15px;
}
</style>


// WEBPACK FOOTER //
// src/components/platform/index.vue