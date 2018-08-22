<template>
<div class="detailswindow">
  <el-dialog 
    :title="'子应用【' + serverName + '】信息'"
    :visible="detailDialogCfg.showWindow"
    :before-close="handleClose"
    @open="handleOpen" width="500px">
    <table border="0" cellspacing="0" class="detailBlock" style="width:100%" cellpadding="3">
      <tbody>
        <div>
            <updowncardcomp name="基本信息" :data="appinfo"></updowncardcomp>
            <progresscomp name="Memory" :compare="cftData.Memory.data" :proportion="cftData.Memory.proportion"></progresscomp>
            <progresscomp name="Heap Memory" :compare="cftData.HeapMemory.data" :proportion="cftData.HeapMemory.proportion"></progresscomp>
        </div>
      </tbody>
    </table>
  </el-dialog>
  </div>
</template>
<script>
import Util from '../../assets/js/Util.js'
import progresscomp from '../common/ProgressComp'
import updowncardcomp from '../common/UpDownCardComp'
export default {
  data() {
    return {
      loading: false,
      serverName: '',
      cftData: {projectPath: "", projectName: "", hostName: "", port: "", Memory: {data:'0 / 0', proportion: 0}, HeapMemory: {data: '0 / 0', proportion: 0}},
      appinfo: Util.getAppInfo({})
    }
  },
  components: {progresscomp, updowncardcomp},
  props: ['detailDialogCfg'],
  methods: {
    handleClose() { // 关闭
      Object.assign(this.cftData, 
        {projectPath: "", projectName: "", hostName: "", port: "", 
          Memory: {data:'0 / 0', proportion: 0}, 
          HeapMemory: {data: '0 / 0', proportion: 0}})
      this.appinfo = Util.getAppInfo(this.cftData)
      this.detailDialogCfg.showWindow = false
    },
    handleOpen() {
      let vm = this
      vm.serverName = vm.detailDialogCfg.data.serverName
      vm.$axios({
            method: 'get',
            url: "/findById/withstatus/" + vm.detailDialogCfg.data.id
        }).then(response => {
            if (response.status == 200){
                Object.assign(vm.cftData, Util.dealData(response.data));
                vm.appinfo = Util.getAppInfo(vm.cftData);
            }
        }, reject => {
            console.log(reject)
        }).catch(a => {console.log(a)})
    }
  }
}
</script>
<style>
.detailswindow .el-dialog .el-dialog__body{
  background-color: #F2F6FC;
}
</style>
