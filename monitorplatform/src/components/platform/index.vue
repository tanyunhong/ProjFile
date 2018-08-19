<template>
  <div class='platform'>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="服务器" name="server"><serverinfo></serverinfo></el-tab-pane>
      <el-tab-pane label="应用" name="application"><cardplatform></cardplatform></el-tab-pane>
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
        //console.log(tab, event);
      }
    }
  }
</script>
<style>
.platform {
    width: 100%;
    height: 100%;
    margin-left: 10px;
    overflow-y: auto;
}
.platform .el-tabs__content {
    overflow: visible; 
}
</style>