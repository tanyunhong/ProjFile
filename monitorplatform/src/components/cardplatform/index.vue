<template>
  <div class='cardplatform'>
    <div class='cardplatformpane' v-if="ok">
      <el-row>
          <el-col :span="6" v-for="(o, index) in data" :key="index" style="padding: 0px 0px 10px 0px;" :offset="1" >
            <div>
              <el-card shadow="hover" class="box-card transformMove" style='box-shadow:0px 0px 10px 5px #aaa;cursor:pointer;'>
                  <div slot="header" class="clearfix">
                      <a @click='cardClick(data[index])'>{{data[index].name}}</a>
                      <template>
                          <!--<span :class="data[index].status === 'UP' ? 'green-color' : 'red-color'" style='float: right;'>{{data[index].status}}</span>-->
                          <el-dropdown :hide-on-click="false"  @command='handleCommand' style="float:right">
                            <span class="el-dropdown-link">
                              <span @click="reflush(data[index])" :class="data[index].status === 'UP' ? 'green-color' : 'red-color'" style='float: right;'>{{data[index].status}}</span>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item v-for="(select, selectIndex) in dropdownData" :key="selectIndex" :command="dealCommad(dropdownData[selectIndex],  data[index])" >
                                <span style='float: right;'>{{dropdownData[selectIndex].label}}</span>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                      </template>
                  </div>
                  <div>
                    <div class="text item myItemClass">
                        {{'DiskSpace' }}
                    </div>
                    <el-row>
                      <el-col :span="12"><div class="grid-content bg-purple-light">Free</div></el-col>
                      <el-col :span="12"><div class="grid-content bg-purple-light">{{data[index].DiskSpace.Free}}</div></el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12"><div class="grid-content bg-purple-light">Threshold</div></el-col>
                      <el-col :span="12"><div class="grid-content bg-purple-light">{{data[index].DiskSpace.Threshold}}</div></el-col>
                    </el-row>
                    <div class="text item myItemClass">
                        {{'Memory：' + data[index].memory.data }}
                    </div>
                    <el-progress :stroke-width="10" :percentage="data[index].memory.proportion" color="green-color"></el-progress>
                    <div class="text item myItemClass">
                        {{'Heap Memory：' + data[index].HeapMemory.data }}
                    </div>
                    <el-progress :stroke-width="10" :percentage="data[index].HeapMemory.proportion" color="green-color"></el-progress>
                  </div>
              </el-card>
            </div>
          </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Util from '../../assets/js/Util.js'
  export default {
    data() {
      return {
         ok: false, //目的是为了渲染,不然数据填充不到
         data: {},
         dropdownData: [
                  {value: "UP", label: "UP", status: "UP"},
                  {value: "DOWN", label: "DOWN", status: "DOWN"},
                  {value: "INSTALL_NT", label: "安装服务", status: "INSTALL"},
                  {value: "UNINSTALL_NT", label: "卸载服务", status: "UNINSATLL"},
                  {value: "START_NT", label: "开启服务", status: "UP"},
                  {value: "STOP_NT", label: "关闭服务", status: "DOWN"}
         ]
      }
    }, 
    filters: {
      status(status){
        if(status == 'UP'){
          return "DOWN"
        }
        return "UP"
      }
    },
    created(){
      this.getData("");
    },
    methods: {
      //刷新数据
      reflush(value){
         debugger
         if(value.status == "REFRESH"){
           let vm = this;
           let serverName = value.name
           vm.$axios({
              method: 'post',
              url: "/reflush/" + serverName
            }).then(response => {
              if(response.status == 200){
                 let data = eval('(' + response.data + ')')
                 vm.ok = false
                 vm.data[serverName] = vm.dealData(data);
                 vm.ok = true
              }
            }, reject => {}).catch(a => {console.log(a)});
            return;
        }
      },
      /**处理下拉数据 */
      dealCommad(selectData, instance){
        return {selectData, instance}
      },
      /**处理数据 */
      dealData(data){
        let serverName = data.serverName;
        let healthData = data.data.health;
        let menData = data.data.metrics;
        
        let free = "0",threshold = "0";
        if (healthData && healthData != "null"){
          free = Util.transformDataType(healthData.diskSpace.free);
          threshold = Util.transformDataType(healthData.diskSpace.threshold);
        }

        let men = "0", useMem = "0", menProportion = 0;
        let heap = "0", useheap = "0", heapProportion = 0;
        if (menData && menData != "null"){
          men = Util.transformDataTypeByKB(menData.mem); //总内存
          let useMenNum = menData.mem - menData['mem.free']; //已用内存
          useMem = Util.transformDataTypeByKB(useMenNum);
          menProportion = Util.dealProportion(useMenNum, menData.mem); //内存使用百分比

          heap = Util.transformDataTypeByKB(menData['heap.committed']);
          useheap = Util.transformDataTypeByKB(menData['heap.used']);
          heapProportion = Util.dealProportion(menData['heap.used'], menData['heap.committed']); //内存使用百分比
        }

       return {
          name: serverName, 
          memory: {data: '('+useMem+' / '+men+')', proportion: menProportion},
          HeapMemory: {data: '('+useheap+' / '+heap+')', proportion: heapProportion}, 
          DiskSpace: {Free: free, Threshold: threshold}, 
          status: data.status, 
          version: 'wu'
        }
      },
      /**点击跳转 */
      cardClick(instance){
        this.$router.push({ name: 'detailplatform', params: {instance}})
      }, 
      /** 关闭与启动 */
      handleCommand(val){
        let vm = this
        let requestOpre = val.selectData.value//"UP" //开启
        let serverName = val.instance.name //服务名称

        vm.$axios({
          method: 'post',
          url: "/reload/"+serverName+"/"+requestOpre
        }).then(response => {
          if(response.status == 200){
            this.$message({
                message: val.selectData.label + '需要时间，请稍后刷新页面！',
                type: 'success'
              });
            vm.ok = false
            vm.data[val.instance.name].status = "REFRESH"
            vm.ok = true
            vm.$HJloading.close()
          }
        }, reject => {console.log(reject)}).catch(a => {console.log(a)});
      },
      /**失败数据的组织 */
      failData(serverName){
        return  {name: serverName, 
          memory: {data: '0', proportion: 0}, 
          HeapMemory: {data: '0', proportion: 0}, 
          DiskSpace: {Free: '0', Threshold: '0'}, 
          status: 'DOWN', version: ''}
      },
      getData(cb){
        let vm = this;
        //vm.ok = false
        vm.$axios({
          method: 'get',
          url: "/main"
        }).then(response => {
            if (response.status == 200){
              let data = eval('(' + response.data + ')')
              for (let i = 0 ; i < data.length; i++ ) {
                vm.data[data[i].serverName] = vm.dealData(data[i]);
                if (i == data.length - 1){
                  vm.ok = true 
                }
              }
            }
            if(cb){
              cb()
            }
        }, reject => {
            console.log(reject)
        }).catch(a => {console.log(a)})
      }
    }
  }
</script>
<style>
  a:hover { 
    color:#409EFF;
  }
  .cardplatform {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  /*
  .cardplatform .el-row {
    margin-bottom: 3px;
    &:last-child {
      margin-bottom: 0;
    }
  }
   .cardplatform .el-col {
    border-radius: 4px;
  }
   .cardplatform .bg-purple-light {
    background: #e5e9f2;
  }
   .cardplatform .grid-content {
    line-height: 22px;
    border-radius: 4px;
    min-height: 25px;
  }*/

  /**设置面板阴影 */
  .cardplatform .el-card__body {
    background-color: #F2F6FC;
  }

  /**设置头白色 
  .myItemClass {
    display: block!important; 
    background-color: #fff;
    padding-bottom: 5px;
    padding-top: 5px;
  }*/
  .cardplatformpane {
    /*margin: 20px 10px 20px 10px;*/
    /*padding: 30px 15px 30px 15px;
    */
    width: 100%;
    /*height: 100%;*/
    position: absolute;
    overflow: auto;
    padding: 30px 0px 30px 0px;
    /*padding: 30px 15px 30px 15px;*/
  }
  /*
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  */

  /**鼠标移入的时候显示动态 
  .box-card:hover {
    transform: scale(1.1);
    -webkit-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -o-transform: scale(1.1);
    -ms-transform: scale(1.1);
  }*/
</style>