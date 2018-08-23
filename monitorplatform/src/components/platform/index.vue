<template>
  <div class='platform'>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="服务器" name="server"><serverinfo ref="server"></serverinfo></el-tab-pane>
      <el-tab-pane label="应用" name="application"><cardplatform ref="application"></cardplatform></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import serverinfo from '../serverInfo/index.vue'
  import cardplatform from '../cardplatform/index.vue'
  export default {
     data() {
      return {
        activeName: 'server'
      };
    },
    components: {cardplatform,serverinfo},
    methods: {
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
</style>