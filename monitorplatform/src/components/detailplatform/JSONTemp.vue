<template>
  <div class="jsontemp" style="height: 100%; margin: 0px; padding: 0px;" ref="JSONTemp">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-tree :data="data" :highlight-current='hc' @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="22" style="height: 100%; margin: 0px; padding: 0px;"> 
        <div class='jsontempsidedata'>
          <pre id="result" v-html='jsonData' ></pre>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import sidebardata from './JSONTemp.js'
import util from '../../assets/js/Util.js'
import axios from 'axios'
export default {
  props: ["instance"],
  data () {
    return {
      hc: true,
      data: sidebardata.data,
      jsonData: ''
    }
  },
  methods: {
    /**
      点击时发送请求
     */
    handleNodeClick (data) {
      let propmt = '<font color="red">获取失败，请查看服务是否被关闭！</font>' //提示
      let vm = this
      vm.jsonData = '' //重置数据

      if (this.instance.status == "UP"){
        vm.$HJloading.open("请求中...");
        axios({
          method: 'post',
          url: '/rpcjson/' + this.instance.id + "/" + data.path,
          data: this.instance
        }).then(
          response => {
            vm.$HJloading.close();
            if(response.status == 200){
              vm.jsonData = util.syntaxHighlight(response.data)
            } else {
              vm.jsonData = propmt
            }
          }, reject =>{
            vm.$HJloading.close()
            vm.jsonData = propmt
          }
        ).catch(a => vm.jsonData = propmt)
      } else {
        vm.jsonData = propmt
      }
    }
  }
}
</script>
<style scope>
/**外部容器的滚动条设置隐藏 */
.jsontemp {

}

/**行高占满 */
.jsontemp .el-row{
    height: 100%;
    margin: 0px;
    padding: 0px;
}
/**设置点击时的高亮颜色 */
.jsontemp .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: gainsboro;
}
/**设置第二列的高度以及隐藏滚动条 */
.jsontemp .el-col-22{
  height: 80%;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
}
/**外框的高宽滚动条 */
.jsontempsidedata {
  width: 100%;
  height: calc(100% - 2px);
}
/**内容高度 */
pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; width: calc(100% - 30px); height: calc(100% - 50px);overflow-y: auto;}
.string { color: green; }        /*字符串的样式*/
.number { color: darkorange; }    /*数字的样式*/
.boolean { color: blue; }        /*布尔型数据的样式*/
.null { color: magenta; }        /*null值的样式*/
.key { color: red; }            /*key值的样式*/
</style>
