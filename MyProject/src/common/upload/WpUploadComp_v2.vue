<!--
  注解: 这个插件目前只是导出模板的上传模板按钮在使用，主要是改造原来的上传组件
  -->
<template>
  <uploader :options="options" @file-added="fileAdd" class="uploader-examplev2" ref="uploader">
    <uploader-unsupport></uploader-unsupport>
    <el-row :gutter="10" style='padding: 5px'>
      <el-col :span='12'>
        <slot name='components'></slot>
      </el-col>
      <el-col :span='12'>
        <div style='box-shadow: 0 0 0px rgba(0, 0, 0, .4);'>
          <uploader-btn :attrs='attrs' :btnStyle='btnStyle'>选择文件</uploader-btn>
        </div>
      </el-col>
    </el-row>
    <uploader-files :fileStyle='fileStyle'></uploader-files>
  </uploader>
</template>

<script>
import config from '../../../config/ProjectConfig.js'

export default {
  data() {
    return {
      options: {
        target: config.APIRoot + '/uploadManage/upload',
        testChunks: false,
        successStatuses: [200, 201, 202],
        permanentErrors: [404, 415, 500, 501],
        query: this.uploadCfg.queryData
      },
      btnStyle: 'height: 36px; background: #409EFF; color: white; border-color: white;border-radius : 5px;',
      attrs: {
        accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      single: this.uploadCfg.single
    }
  },
  props: [
    'uploadCfg', 'fileStyle'
  ],
  methods: {
    fileAdd(file) { //添加一个文件
      // this.options.query = this.uploadCfg.queryData
    },
    closeDialog(done) { //关闭dialog窗口时
      this.handleClose()
    },
    handleClose() { //关闭
      let isCancle = this.clearListHandler()
      this.$emit('handleDialog', {
        showDialog: false,
        isCancle: isCancle
      });
    },
    /**
      清空列表的返回数据
     */
    clearListHandler(){
      let isCancle = true
      if (this.$refs.uploader.files.length !== 0) {
        this.$refs.uploader.uploader.files = []
        this.$refs.uploader.files = []
        isCancle = false
      } else {
        isCancle = true
      }
      return isCancle
    }
  }
}
</script>

<style>
.uploader-examplev2 {
  width: 100%;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}

.uploader-examplev2 .uploader-btn {
  margin-right: 4px;
}

.uploader-examplev2 .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}

.uploader-drop p {
  height: 45px;
}
</style>
