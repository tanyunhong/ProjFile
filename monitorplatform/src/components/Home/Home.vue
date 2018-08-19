<template>
  <div class="wrapper" ref="wrapper">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-tree :data="data" :highlight-current='hc' @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="22">
        <div class='sidedata'>
          <pre id="result" v-html='jsonData' ></pre>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import sidebardata from './sidebardata.js'
import util from '../../assets/js/Util.js'
import axios from 'axios'
export default {
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

      let callBack = () => { // 负责请求后端的方法
        vm.$HJloading.open("请求中...");
        axios({
          method: 'get',
          url: '/' + data.path
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
      }

      if (data.path.indexOf('shutdown') > -1){ //对于关闭操作进行必要的询问
        vm.$confirm('确定要执行关闭操作吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          callBack();
        }, () => {return}).catch((error) => {console.log(error)});
      } else {
        callBack();
      }
    }
  }
}
</script>
<style scope>
/**外部容器的滚动条设置隐藏 */
.wrapper {
  overflow: hidden;
}
/**设置点击时的高亮颜色 */
.wrapper .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: gainsboro;
}
/**设置第二列的高度以及隐藏滚动条 */
.wrapper .el-col-22{
  height: 720px;
  overflow: hidden;
}
/**外框的高宽滚动条 */
.sidedata {
  width: 100%;
  height: calc(100% - 2px);
  /**overflow-y: auto;*/
}
pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; width: calc(100% - 20px); height: calc(100% - 20px);overflow-y: auto;}
.string { color: green; }        /*字符串的样式*/
.number { color: darkorange; }    /*数字的样式*/
.boolean { color: blue; }        /*布尔型数据的样式*/
.null { color: magenta; }        /*null值的样式*/
.key { color: red; }            /*key值的样式*/
</style>
