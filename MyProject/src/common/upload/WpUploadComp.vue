<template>
  <uploader :options="options" @complete="uploadComplete" @file-added="fileAdd" class="uploader-example" ref="uploader">
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <div style="height: 45px; border-bottom: 1px solid #ccc;">
        <div class="upload-button">
          <span>在这里拖放文件上传或</span>
          <uploader-btn :attrs='btnAttrs' :single='btnSingle'>选择文件</uploader-btn>
          <button 
          v-show="templateDownload" 
          class="uploader-btn"
          size="small" 
          @click="down">
          下载模板
          </button>
        </div>
      </div>
      <uploader-files :endCountMsg="endCountMsg"></uploader-files>
    </uploader-drop>
  </uploader>
</template>

<script>
import Constant from "@/assets/js/Constant.js";

export default {
  props: {
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
      default: ""
    },
    /* customize options end */
    /* Uploader options begin */
    target: {
      type: String,
      default: Constant.APIRoot + "/uploadManage/upload"
    },
    simultaneousUploads: {
      type: Number,
      default: 3
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
        return [200, 201, 202];
      }
    },
    permanentErrors: {
      type: Array,
      default: function() {
        return [404, 415, 501];
      }
    },
    generateUniqueIdentifier: {
      type: Function
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
  data() {
    return {
      options: {
        target: this.target,
        simultaneousUploads: this.simultaneousUploads,
        testChunks: false,
        query: this.query,
        allowDuplicateUploads: this.allowDuplicateUploads,
        maxChunkRetries: this.maxChunkRetries,
        singleFile: this.btn_single,
        successStatuses: this.successStatuses,
        permanentErrors: this.permanentErrors,
        generateUniqueIdentifier: this.generateUniqueIdentifier
      },
      endCountMsg: ""
    };
  },
  methods: {
    fileAdd(file) {
      //添加一个文件
      // this.options.query = this.query
    },
    uploadComplete() {
      //上传完成
      if (this.showEndCount) {
        let files = this.$refs.uploader.files;
        let all = files.length;
        if (all <= 0) {
          return
        }
        let success = 0;
        let error = 0;
        for (const file of files) {
          if (file.error || file.msgStatus === 'msg-error') {
            error++;
          } else {
            success++;
          }
        }
        this.endCountMsg =
          "上传完成！选中文件" + all + "个，上传成功" + success + "个，上传失败" + error + "个";
      }
    },
    /**
      清空列表的返回数据
     */
    clearListHandler() {
      let isCancle = true;
      if (this.$refs.uploader.files.length !== 0) {
        this.$refs.uploader.uploader.files = [];
        this.$refs.uploader.files = [];
        this.endCountMsg = ''
        isCancle = false;
      } else {
        isCancle = true;
      }
      return isCancle;
    },
    down() {
      window.open(this.templateDownloadUrl);
    }
  }
};
</script>

<style>
.uploader-example {
  width: 100%;
  height: calc(100% - 6px);
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-drop span {
  margin-right: 20px;
}
.uploader-example .uploader-drop {
  height: 100%;
  padding: 0px;
}
.uploader-example .upload-button {
  position: relative;
  padding-left: 10px;
  overflow: hidden;
  top: 50%;
  transform: translateY(-50%);
}
.uploader-example .uploader-files {
  height: calc(100% - 46px);
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
