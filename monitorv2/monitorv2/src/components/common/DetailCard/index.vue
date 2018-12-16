<template>
  <div class='detailcard'>
   <el-card shadow="always" style='cursor:pointer;'>
      <el-container>
        <el-header class='detailcardhead'>
          <slot name="header">
            <div style='line-height:40px;text-align:center;'>
              <span style='color: white; float:left;'>{{headata}}</span>
              <!--<a style='float:right;font-size:1px;' @click=''>JSON</a> -->
            </div>
          </slot>
        </el-header>
        <el-main class='detailcardmain'>
         <slot>主面板</slot>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>
<script>
    export default {
        props: ['headata', 'endpoint', 'jsondata'],
        methods: {
          seePointJson(){
            
          }
        }
    }
</script>
<style scope>
  /**a标签移动鼠标变颜色 */
  a:hover { 
    color:#409EFF;
  }

  .detailcard {

  }

  .detailcardhead {
    height: 40px!important;
    border-radius: 10px;
  }

  .detailcardmain {
    
  }
</style>


// WEBPACK FOOTER //
// src/components/common/DetailCard/index.vue