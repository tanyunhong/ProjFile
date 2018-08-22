<!--
    带进度条的组件，头是显示信息，下面是具体进度
-->
<template>
  <div class='progresscomp'>
    <div class="text item myItemClass" style="border-radius: 3px;">
        {{name}}({{compare}})
    </div>
    <el-progress :stroke-width="10" :percentage="proportion" :color="getColor"></el-progress>
  </div>
</template>
<script>
  export default {
    props: ['name', "compare",'proportion'],
    computed: {
      getColor(){
        return this.proportion > 90 ? "red" : ""
      }
    },
    methods: {
      
    }
  }
</script>
<style scope>
  /**重新设置进度条的颜色 */
  .progresscomp .el-progress-bar__outer{
    /*background-color: #F2F6FC;gba(70, 45, 45, 0.1);*/
  }
</style>