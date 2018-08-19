<template>
    <div class='detailplatform'>
        <el-container>
            <el-header>
                <font style='color:#409EFF; font-size: 35px !important;'>
                    <a class="el-icon-share" @click="returnToHome" style="float:left;line-height: 60px;cursor:pointer;"></a>
                    <span :class="routerParam.status === 'UP' ? 'green-color' : 'red-color'">{{routerParam.status}}</span>
                </font>
                &nbsp;&nbsp;
                <font style='color:white;font-size: 35px !important;'>{{routerParam.name}}</font>
            </el-header>
            <el-main>
             <el-tabs type="border-card"  v-model="activeName" class='detailplatformtabs'>
                    <el-tab-pane label="JSON查询">
                        <jsontemp :instance='routerParam'></jsontemp>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import detailcard from '../common/DetailCard/index.vue'
import updowncardcomp from '../common/UpDownCardComp/index.vue'
import progresscomp from '../common/ProgressComp/index.vue'
import jsontemp from './JSONTemp.vue'
 export default {
     data(){
         return {
             data: {health: {}},
             routerParam: this.$route.params.instance,
             activeName: '0'
         }
     },
     components: {detailcard, updowncardcomp, progresscomp, jsontemp}, //注册组件
     methods: {
        returnToHome(){
          this.$router.push({ path: '/'})
        }
     },
     mounted() {
       /**
       this.$axios({
         method: 'get',
         url: '/rpc/' + this.routerParam.name
       }).then(
         response => {
           console.log(response.data)
         }, reject =>{
           console.log(reject)
         }
       ).catch(a => {console.log(a)}) */
     },
     beforeCreate(){//刷新的时候跳转回到首页
         if (!this.$route.params.instance){
            this.$router.push({ path: '/'}) 
         }
     }
 }
</script>
<style scope>
  .detailplatform {
    height: 100%;
    margin: 0px;
    padding: 0px;
  }
  /**容器占满 */
  .detailplatform,section{
    height: 100%;
    margin: 0px;
    padding: 0px;
  }

  /**main的高度左右宽度 */
  main {
    height: calc(100% - 130px);
    margin: 0px;
    padding: 0px;
  }

  /**tab的高度左右宽度 */
  .detailplatformtabs {
    height: calc(100% - 10px);
    margin-right: 100px;
    margin-left: 100px;
  }
  .detailplatformtabpane {

  }
  /**头布局样式 */
  .detailplatform .el-header {
    background-color: #606266;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  /**主要布局样式 */
  .detailplatform .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
  
  /**设置content的高度 */
 .detailplatformtabs .el-tabs__content{
    height: calc(100% - 60px);
    margin: 10px 10px 10px 10px;
 }
 /**设置面板高度占满外部div */
.detailplatformtabs .el-tabs__content .el-tab-pane{
    height: 100%;
 }

</style>