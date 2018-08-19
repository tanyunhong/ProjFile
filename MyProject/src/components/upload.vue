<template>
  <el-upload
    class="upload-demo"
    :action="action"
    :on-success = "handleSuccess"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :before-upload = 'beforeUpload'
    multiple
    :data = "param"
    :limit="30"
    :on-exceed="handleExceed"
    :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
    <el-select v-model="param.type" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div slot="tip" class="el-upload__tip">请注意只上传jpg/png文件，且不超过500kb</div>
  </el-upload>
</template>

<script>
  import config from '../../config/ProjectConfig.js'
  import guidUtil from '@/common/GuidUtil'
  import PbcUtils from '@/common/PbcUtils'
  import api from '@/API'
  export default {
    data() {
      return {
        uuid: "",
        param: {key: "", type: "mainPhoto"},
        action: config.APIRoot + "/pddOrder/pddUpload",
        options: [{value: 'mainPhoto', label: '主页图'},
          {value: "turnPhoto", label: "轮播图"}, {value: 'detailPhoto', label: '详情图'},
          {value: "skuPhoto", label: "SKU图"}
        ],
        fileList: []
      };
    },
    methods: {
      handleSuccess(response, file, fileList){
        this.$message.success("成功");
         /*
        let callBack = data => {
        }
        PbcUtils.requestService({url: api.pddOrder.upload, method: "GET", data: this.param, callBack});
        */
        window.open("/TYH/pddOrder/pddDealPhoto?type=" + this.param.type + "&key=" + this.param.key);
      },
      beforeUpload(file){
        //this.$message.success("失败");
        if(!this.uuid){
          this.uuid = guidUtil.generateGUID() 
        }
        this.param.key = this.uuid + this.param.type
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    }
  }
</script>