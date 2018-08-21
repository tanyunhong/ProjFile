<template>
  <div class='cardplatform' @contextmenu='openMainMenu'>
    <div class='cardplatformpane' v-if="ok">
      <el-row>
          <el-col :span="6" v-for="(o, index) in data" :key="index" style="padding: 0px 0px 10px 0px;" 
                :offset="1">
            <div @contextmenu='openMainMenu($event, data[index])'>
              <el-card shadow="hover" class="box-card /*transformMove*/" style='box-shadow:0px 0px 10px 5px #aaa;cursor:pointer;'>
                  <div slot="header" class="clearfix">
                      <a @click='cardClick(data[index])'>{{data[index].serverName}}</a>
                      <template>
                          <el-dropdown :hide-on-click="false"  @command='handleCommand' style="float:right">
                            <span class="el-dropdown-link">
                              <span :class="data[index].status === 'UP' ? 'green-color' : 'red-color'" style='float: right;'>{{data[index].status}}</span>
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
                    <updowncardcomp name="基本信息" :data="getAppInfo(data[index])"></updowncardcomp>
                    <progresscomp name="Memory" :compare="data[index].memory.data" :proportion="data[index].memory.proportion"></progresscomp>
                    <progresscomp name="Heap Memory" :compare="data[index].HeapMemory.data" :proportion="data[index].HeapMemory.proportion"></progresscomp>
                  </div>
                  <el-collapse v-model="activeName" accordion>
                    <el-collapse-item :title="'子应用(' + data[index].children.length + ')'" name="1">
                      
                    </el-collapse-item>
                  </el-collapse>
              </el-card>
            </div>
          </el-col>
      </el-row>
    </div>
    <appinfowindow :windowcfg="windowcfg" @saveCallBack="reflushAllData"></appinfowindow>
    <context-menu ref="mainMenuRef">
        <context-menu-item itemName="刷新" @itemClick="reflushAllData">
            <icon name="刷新" :showContent='false'></icon>
        </context-menu-item>
        <context-menu-item itemName="新增应用" @itemClick="addAppInfo">
            <icon name="新增" :showContent='false'></icon>
        </context-menu-item>
        <context-menu-item itemName="新增子应用" @itemClick="addChildAppInfo" :disabled="isCanDo">
            <icon name="新增" :showContent='false' :disabled="isChildCanDo"></icon>
        </context-menu-item>
        <context-menu-item itemName="修改":disabled="isCanDo" @itemClick="updateAppInfo">
            <icon name="修改" :showContent='false' :disabled="isCanDo"></icon>
        </context-menu-item>
        <context-menu-item itemName="删除" :disabled="isCanDo" @itemClick="deleteAppInfo">
            <icon name="删除" :showContent='false' :disabled="isCanDo"></icon>
        </context-menu-item>
    </context-menu>
  </div>
</template>
<script>
import Util from '../../assets/js/Util.js'
import AppInfoWindow from './AppInfoWindow.vue'
import progresscomp from '../common/ProgressComp'
import updowncardcomp from '../common/UpDownCardComp'
  export default {
    data() {
      return {
         ok: false, //目的是为了渲染,不然数据填充不到
         data: {},
         windowcfg: {showWindow: false, tag: "add", id: 0, parentId: null, title: "新增应用"},
         isCanDo: true,
         isChildCanDo: true,
         activeNames: ['1'],
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
    components: {"appinfowindow":AppInfoWindow, progresscomp,updowncardcomp},
    created(){
      this.getData("");
    },
    methods: {
      /**
      * 打开右键菜单
      * @author 谭云洪
      * @date 2017年09月07日09时47分
      * @since 1.0
      */
      openMainMenu(event, data) {
        if(data){
          this.isCanDo = false
          if(!data.parentId){
            this.isChildCanDo = false
          } else {
            this.isChildCanDo = true
          }
        }else{ 
          this.isCanDo = true
          this.isChildCanDo = true
        }
        
        this.windowcfg.id = data ? data.id : null
        //打开菜单之后，选中列表上的对应的那条记录
        this.$refs['mainMenuRef'].open(event)
        //用.prevent的方式阻止默认行为无效，只能这么设置
        event.preventDefault();
        event.stopPropagation();
      },
      /**
        添加应用
       */
      addAppInfo(){
         this.windowcfg.tag = "add"
         this.windowcfg.title = "新增应用"
         this.windowcfg.showWindow = true
      },
      /**
        新增子应用
       */
      addChildAppInfo(){
         this.windowcfg.parentId = this.windowcfg.id
         this.windowcfg.tag = "addChild"
         this.windowcfg.title = "新增子应用"
         this.windowcfg.showWindow = true
      },
      /**
        修改应用
       */
      updateAppInfo(){
          this.windowcfg.tag = "update"
          this.windowcfg.title = "修改应用"
          this.windowcfg.showWindow = true
      },
      /**
        删除应用      
       */
      deleteAppInfo(){
        let vm = this;
        if(vm.windowcfg.id){
          this.$confirm('确定要删除该应用信息吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            vm.$axios({
              method: 'get',
              url: "/deleteAppInfo/" + this.windowcfg.id
            }).then(response => {
              if(response.status == 200){
                  vm.ok = false
                  vm.getData(_ => vm.ok = true)
              }
            }, reject => {}).catch(a => {console.log(a)});
          }).catch(() => {});
        }
      },
      /**
        刷新整个页面应用
       */
      reflushAllData(){
        let vm = this
        if(vm.windowcfg.id){
          vm.reflushAppInfo(vm.data[vm.windowcfg.id])
        } else {   
          vm.ok = false
          vm.getData(_ => vm.ok = true)
        }
      },
      //刷新数据
      reflushAppInfo(value){
        let vm = this;
        vm.$axios({
          method: 'post',
          url: "/reflush",
          data: value
        }).then(response => {
          if(response.status == 200){
              vm.ok = false
              Object.assign(value, vm.dealData(response.data));
              vm.ok = true
          }
        }, reject => {}).catch(a => {console.log(a)});
      },
      /**获取基本信息
       */
      getAppInfo(data){
        return [
          {name: '项目路径', value: data.projectPath},
          {name: '项目名称', value: data.projectName},
          {name: '域名', value: data.hostName},
          {name: '端口', value: data.port}
          ];
      },
      /**处理下拉数据 */
      dealCommad(selectData, instance){
        return {selectData, instance}
      },
      /**处理内存数据数据 */
      dealData(data){
        let men = "0", useMem = "0", menProportion = 0;
        let heap = "0", useheap = "0", heapProportion = 0;
        if (data.jsonData && data.jsonData != "{}"){
          let jsonData = eval('(' + data.jsonData + ')')
          men = Util.transformDataTypeByKB(jsonData.mem); //总内存
          let useMenNum = jsonData.mem - jsonData['mem.free']; //已用内存
          useMem = Util.transformDataTypeByKB(useMenNum);
          menProportion = Util.dealProportion(useMenNum, jsonData.mem); //内存使用百分比

          heap = Util.transformDataTypeByKB(jsonData['heap.committed']);
          useheap = Util.transformDataTypeByKB(jsonData['heap.used']);
          heapProportion = Util.dealProportion(jsonData['heap.used'], jsonData['heap.committed']); //内存使用百分比
        }

       return Object.assign(data, {
          memory: {data: useMem + ' / ' + men, proportion: menProportion},
          HeapMemory: {data: useheap + ' / ' + heap, proportion: heapProportion}
        })
      },
      /**点击跳转 */
      cardClick(instance){
        this.$router.push({ name: 'detailplatform', params: {instance}})
      }, 
      /** 关闭与启动 */
      handleCommand(val){
        let vm = this
        let requestOpre = val.selectData.value//"UP" //开启
        let id = val.instance.id //服务名称

        vm.$axios({
          method: 'post',
          url: "/reload/"+id+"/"+requestOpre
        }).then(response => {
          if(response.status == 200){
            this.$message({
                message: '请稍后刷新页面！',
                type: 'success'
              });
            vm.ok = false
            vm.data[id].status = "REFRESH"
            vm.ok = true
            vm.$HJloading.close()
          }
        }, reject => {console.log(reject)}).catch(a => {console.log(a)});
      },
      getData(cb){
        let vm = this;
        //vm.ok = false
        vm.$axios({
          method: 'get',
          url: "/main"
        }).then(response => {
            if (response.status == 200){
              for (let i = 0 ; i < response.data.length; i++ ) {
                vm.data[response.data[i].id] = vm.dealData(response.data[i]);
                if (i == response.data.length - 1){
                  vm.ok = true 
                }
              }
            }
            if(cb && typeof cb === "function"){
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
  .cardplatform .cardplatformpane .progresscomp .el-progress-bar__outer{
    background-color: #ebeef5
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