<!-- 系统默认使用上传窗口 使用文档请参考 -->
<template>
  <el-dialog 
  custom-class="upload-dialog" 
  :title="title" 
  :visible="showDialog" 
  size="small" 
  :before-close="closeDialog">
    <wp-upload-comp 
    :showEndCount="showEndCount"
    :templateDownload="templateDownload"
    :templateDownloadUrl="templateDownloadUrl"
    :target="target"
    :simultaneousUploads="simultaneousUploads"
    :query="query"
    :allowDuplicateUploads="allowDuplicateUploads"
    :maxChunkRetries="maxChunkRetries"
    :successStatuses="successStatuses"
    :permanentErrors="permanentErrors"
    :generateUniqueIdentifier="generateUniqueIdentifier"
    :btnSingle="btnSingle"
    :btnAttrs="btnAttrs"
    ref='UploadOnClickWindowRef'>
    </wp-upload-comp>
  </el-dialog>
</template>

<script>
import WpUploadComp from './WpUploadComp.vue'
import Constant from "@/assets/js/Constant.js";
import GuidUtil from "@/assets/js/GuidUtil.js";
export default {
  name: 'uploadwindow',
  components: {
    'wp-upload-comp': WpUploadComp
  },
  props: {
    title: {
      type: String,
      default: '上传'
    },
    showDialog: {
      type: Boolean,
      required: true
    },
    /* customize options begin */
    showEndCount: {
      type: Boolean,
      default: false
    },
    templateDownload: {
      type: Boolean,
      default: false
    },
    templateDownloadUrl: {
      type: String,
      default: ''
    },
    /* customize options end */
    /* Uploader options begin */
    target: {
      type: String,
      default: Constant.APIRoot + "/uploadManage/upload"
    },
    simultaneousUploads: { //并发上传数
      type: Number,
      default: 1
    },
    query: {
      type: [Object, Function],
      required: false
    },
    allowDuplicateUploads: {
      type: Boolean,
      default: true
    },
    maxChunkRetries: {
      type: Number,
      default: 3
    },
    successStatuses: {
      type: Array,
      default: function() {
        return [200, 201, 202]
      }
    },
    permanentErrors: {
      type: Array,
      default: function() {
        return [404, 415, 501]
      }
    },
    generateUniqueIdentifier: {
      type: Function,
      default: function() {
        return GuidUtil.generateGUID()
      }
    },
    /* Uploader options end */
    /* Upload-btn options start */
    btnSingle: {
      type: Boolean,
      default: false
    },
    btnAttrs: {
      type: Object,
      default() {
        return {};
      }
    }
    /* Upload-btn options end */
  },
  methods: {
    closeDialog(done) {
      //关闭dialog窗口时
      this.handleClose();
    },
    handleClose() {
      //关闭
      let isCancle = this.$refs.UploadOnClickWindowRef.clearListHandler();
      this.$emit("handleDialog", {
        showDialog: false,
        isCancle: isCancle
      });
    }
  }
}
</script>

<style>
.upload-dialog {
  height: 70%;
}
.upload-dialog .el-dialog__body{
  height: calc(100% - 73px);
  max-height: 1000px !important;
}
</style>
