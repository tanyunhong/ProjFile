<template>
  <div class='cardplatform' @contextmenu='openMainMenu'>
    <div class='cardplatformpane' v-if="ok">
      <el-row v-for='(pVal, pIndex) in appInfoData' :key="pIndex">
          <el-col :span="6" v-for="(val, index) in pVal" :key="index" style="padding: 0px 0px 10px 0px;" 
                :offset="1">
            <div @contextmenu='openMainMenu($event, val)'>
              <el-card shadow="hover" class="box-card /*transformMove*/" style='box-shadow:0px 0px 10px 5px #aaa;cursor:pointer;'>
                  <div slot="header" class="clearfix">
                      <a @click='cardClick(val)'>{{val.serverName}}</a>
                      <template>
                          <el-dropdown :hide-on-click="false"  @command='handleCommand' style="float:right">
                            <span class="el-dropdown-link">
                              <span :class="val.status === 'UP' ? 'green-color' : 'red-color'" style='float: right;'>{{val.status}}</span>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item v-for="(select, selectIndex) in dropdownData" :key="selectIndex" :command="dealCommad(dropdownData[selectIndex],  val)" >
                                <span style='float: right;'>{{dropdownData[selectIndex].label}}</span>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                      </template>
                  </div>
                  <updowncardcomp name="基本信息" :data="getAppInfo(val)"></updowncardcomp>
                  <div class="childAppInfo">
                    <el-collapse v-model="activeName[pIndex * 3 + index]" accordion>
                      <el-collapse-item title="内存信息" :name="'memory_' + val.id">
                        <progresscomp name="Memory" :compare="val.Memory.data" :proportion="val.Memory.proportion"></progresscomp>
                        <progresscomp name="Heap Memory" :compare="val.HeapMemory.data" :proportion="val.HeapMemory.proportion"></progresscomp>
                      </el-collapse-item>
                      <el-collapse-item :title="'子应用(' + val.children.length + ')'" :name="'child_' + val.id">
                          <el-row v-for="(childVal, childIndex) in val.childrenObj" :key="childIndex">
                            <div @contextmenu='openMainMenu($event, childVal, val)'>
                              <el-col :span="8" > <a @click="cardClick(childVal)">{{childVal.serverName}}</a>
                              </el-col>
                              <el-col :span="8" > <a @click="detailHandler(childVal)">{{childVal.port}}</a>
                              </el-col>
                              <el-col :span="8" > 
                                <el-dropdown :hide-on-click="false"  @command='handleCommand'>
                                  <span class="el-dropdown-link">
                                    <span :class="childVal.status === 'UP' ? 'green-color' : 'red-color'">{{childVal.status}}</span>
                                  </span>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="(select, selectIndex) in dropdownData" :key="selectIndex" :command="dealCommad(dropdownData[selectIndex],  childVal)" >
                                      <span style='float: right;'>{{dropdownData[selectIndex].label}}</span>
                                    </el-dropdown-item>
                                  </el-dropdown-menu>
                                </el-dropdown>
                              </el-col>
                            </div>
                          </el-row>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
              </el-card>
            </div>
          </el-col>
      </el-row>
    </div>
    <appinfowindow :windowcfg="windowcfg" @saveCallBack="saveCallBack"></appinfowindow>
    <childdetailwindow :detailDialogCfg='detailDialogCfg'></childdetailwindow>
    <context-menu ref="mainMenuRef">
        <context-menu-item itemName="刷新" @itemClick="reflushAllData">
            <icon name="刷新" :showContent='false'></icon>
        </context-menu-item>
        <context-menu-item itemName="新增应用" @itemClick="addAppInfo">
            <icon name="新增" :showContent='false'></icon>
        </context-menu-item>
        <context-menu-item itemName="新增子应用" @itemClick="addChildAppInfo" :disabled="isChildCanDo">
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
import childdetailwindow from './childDetailWindow'
import labelcomp from '../common/labelComp'
  export default {
    data() {
      return {
         ok: true, //目的是为了渲染,不然数据填充不到
         data: {},
         appInfoData: [],
         windowcfg: {showWindow: false, tag: "add", instance: null, title: "新增应用"},
         selectParentData: null,
         detailDialogCfg: {showWindow: false, data: null},
         isCanDo: true,
         isChildCanDo: true,
         activeName: [],
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
    components: {"appinfowindow":AppInfoWindow, progresscomp,updowncardcomp,childdetailwindow,labelcomp},
    created(){
      let vm = this
      let cb = _ => {
        let i = 0;
        for(let xIndex in vm.appInfoData){
          for(let yIndex in vm.appInfoData[xIndex]){
            vm.activeName[i] = "memory_" + vm.appInfoData[xIndex][yIndex].id
            i++
          }
        }
        vm.ok = false
        vm.ok = true
      }
      this.getAllData(cb);
    },
    methods: {
      /**
      * 打开右键菜单
      * @author 谭云洪
      * @date 2017年09月07日09时47分
      * @since 1.0
      */
      openMainMenu(event, data, pval) {
        if(data){
          this.isCanDo = false
          if(!data.parentId){
            this.isChildCanDo = false
            //this.index = data.index
            this.selectParentData = data
          } else { //
            this.isChildCanDo = true
            //this.index = pval.index
            this.selectParentData = pval
          }
        }else{ 
          this.isCanDo = true
          this.isChildCanDo = true
          this.selectParentData = null
        }
        this.windowcfg.instance = data
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
         this.windowcfg.tag = "addChild"
         this.windowcfg.title = "新增子应用"
         this.windowcfg.showWindow = true
      },
      /**
        修改应用
       */
      updateAppInfo(){
          this.windowcfg.tag = "update"
          let str = this.windowcfg.instance.parentId ? '子' :  ''
          this.windowcfg.title = "修改" + str +"应用"
          this.windowcfg.showWindow = true
      },
      /**
        删除应用      
       */
      deleteAppInfo(){
        let vm = this;
        if(vm.windowcfg.instance){
          let str = vm.windowcfg.instance.parentId ? '子' :  ''
          this.$confirm('确定要删除【' + vm.windowcfg.instance.serverName + '】'+str+'应用吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            vm.$axios({
              method: 'get',
              url: "/deleteAppInfo/" + this.windowcfg.instance.id
            }).then(response => {
              if(response.status == 200){
                  vm.getAllData(_ => {
                    vm.ok = false
                    vm.ok = true
                  })
              }
            }, reject => {}).catch(a => {console.log(a)});
          }).catch(() => {});
        }
      },
      /**
        查看子应用
       */
      detailHandler(data){
        this.detailDialogCfg = {showWindow: true, data}
      },
      /**
        刷新整个页面应用
       */
      reflushAllData(){
        let vm = this
        vm.getAllData(_ => {
          vm.ok = false
          vm.ok = true
        })
        //vm.reflushOldData();
      },
      //刷新数据(不管是修改新增父亲还是儿子都刷新父亲)
      saveCallBack(value){
        let vm = this;
        vm.$axios({
          method: 'get',
          url: "/findById/withstatus/"+ (value.parentId ? value.parentId : value.id)
        }).then(response => {
          if(response.status == 200){
              let d =Util.dealData(response.data)              
              if(vm.windowcfg.tag == "add"){
                let xLen = vm.appInfoData.length
                if(xLen == 0)
                  vm.appInfoData[0] = []
                xLen = xLen > 0 ? xLen - 1 : 0
                let yLen = vm.appInfoData[xLen].length
                if(yLen == 3){
                  vm.appInfoData[xLen + 1] = []
                  vm.appInfoData[xLen + 1][0] = d;
                } else {
                  vm.appInfoData[xLen][yLen] = d;
                }
              } else {
                Object.assign(vm.selectParentData, d)
              }
              vm.ok = false
              vm.ok = true
          }
        }, reject => {}).catch(a => {console.log(a)});
      },
      /**获取基本信息
       */
      getAppInfo(data){
        return Util.getAppInfo(data)
      },
      /**处理下拉数据 */
      dealCommad(selectData, instance){
        return {selectData, instance}
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
            let message = '操作完成，请稍后刷新页面！'
            let type = 'success'
            if(response.data != 0){
              essage = '操作失败，请检查应用信息！'
              type = 'warning'
            } 
            vm.$message({message, type});
          }
        }, reject => {console.log(reject)}).catch(a => {console.log(a)});
      },
      /**
        获取所有的数据
       */
      getAllData(cb){
        let vm = this;
        vm.appInfoData = []
        vm.$axios({
          method: 'get',
          url: "/main"
        }).then(response => {
            if (response.status == 200){
              let xIndex = 0;
              let yIndex = 0;
              for (let i = 0 ; i < response.data.length; i++) {
                let d = Util.dealData(response.data[i])

                if(yIndex == 0){
                  vm.appInfoData[xIndex] = []
                }
                vm.appInfoData[xIndex][yIndex] = d
                //Object.assign(vm.appInfoData[xIndex][yIndex], d);
                yIndex++;
                if(yIndex == 3){
                  yIndex = 0;
                  xIndex++;
                }
              }
            }
            if(cb && typeof cb === "function"){
              cb()
            }
        }, reject => {
            console.log(reject)
        }).catch(a => {console.log(a)})
      },
      /**
        在原有的数据基础上刷新数据
       */
       reflushOldData(cb){
          let vm = this;
          vm.$axios({
            method: 'get',
            url: "/main"
          }).then(response => {
              if (response.status == 200){
                for(let xIndex = 0; xIndex < vm.appInfoData.length; xIndex ++){
                  for(let yIndex = 0; vm.appInfoData[xIndex] && yIndex < vm.appInfoData[xIndex].length; yIndex ++){
                    let isData = false
                    response:
                    for (let i = 0 ; i < response.data.length; i++) {
                      if(vm.appInfoData[xIndex][yIndex].id == response.data[i].id){
                        Object.assign(vm.appInfoData[xIndex][yIndex], Util.dealData(response.data[i]))
                        response.data.splice(i,1);
                        isData = true
                        break response
                      }
                    }
                    if(!isData){ // 如果没有数据，清空
                      vm.appInfoData[xIndex][yIndex].HeapMemory = {data: "0 / 0", proportion: 0}
                      vm.appInfoData[xIndex][yIndex].Memory = {data: "0 / 0", proportion: 0}
                      vm.appInfoData[xIndex][yIndex].status = "DOWN"
                    }
                  }
                }

                //存在多余的数据
                let x = vm.appInfoData.length;
                x = x > 0 ? x-- : 0
                if(!vm.appInfoData[x]){
                  vm.appInfoData[x] = []
                }
                let y = vm.appInfoData[x].length
                y = y > 0 ? y-- : 0
                for (let i = 0 ; i < response.data.length; i++) {
                  let d = Util.dealData(response.data[i])
                  if(y == 0){
                    vm.appInfoData[x] = []
                  }
                  y = vm.appInfoData[x].length
                  vm.appInfoData[x][y] = d
                  y++;
                  if(y == 3){
                    y = 0;
                    x++;
                  }
                }
              }
              vm.ok = false
              vm.ok = true
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
  .childAppInfo .el-collapse-item__content{
     padding-bottom: 5px; 
     background-color: #e5e9f2;
  }
  .childAppInfo .el-row{
    padding-top: 5px;
  }
  .childAppInfo .el-collapse-item__header{
    height: 30px;
    line-height: 30px;
  }
  .childAppInfo .el-collapse-item__arrow{
    line-height: 30px;
  }
  /**设置面板阴影 */
  .cardplatform .el-card__body {
    background-color: #F2F6FC;
    max-height: 310px;
    overflow: hidden;
    padding: 10px 20px 10px 20px
  }
  .cardplatformpane {
    width: 100%;
    position: absolute;
    overflow: auto;
    padding: 30px 0px 30px 0px;
  }
  .cardplatformpane .el-collapse-item__content{
    max-height: 100px;
    overflow-y: auto;
  }
  /**设置手风琴 进度条的背景颜色 */
  .childAppInfo .el-collapse-item__content .progresscomp .text.item.myItemClass{
    background-color: initial;
  }
</style>