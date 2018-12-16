<template>
  <div class='cardplatform'>
     <el-button-group class='hj-button-group'>
        <icon-button :isOpacity='true' @iconClick='reflushAllData' iconName='刷新'></icon-button>
        <icon-button :isOpacity='true' @iconClick='addAppInfo' iconName='新增' content='新增应用'></icon-button>
    </el-button-group>
    <div class='cardplatformpane' @contextmenu='openMainMenu' v-if="ok">
      <el-row v-for='(pVal, pIndex) in appInfoData' :key="pIndex">
          <el-col :span="span" v-for="(val, index) in pVal" :ref="'parentAppInfo_' + val.id" :key="index" :offset="0" 
                class='parentAppInfoCol'>
              <el-card shadow="hover" class="box-card" @contextmenu.native='openMainMenu($event, val)' style='box-shadow:0px 0px 10px 5px #aaa;cursor:pointer;'>
                  <div slot="header" class="clearfix">
                      <a @click='cardClick(val)'>{{val.serverName}}</a>
                      <template>
                        <span class="el-dropdown-link">
                          <span :class="val.status === 'UP' ? 'green-color' : 'red-color'" style='float: right;'>{{val.status}}</span>
                        </span>
                      </template>
                  </div>
                  <updowncardcomp name="基本信息" :data="getAppInfo(val)"></updowncardcomp>
                  <div class="childAppInfo">
                    <el-collapse v-model="activeName[pIndex * rowNum + index]" accordion>
                      <el-collapse-item title="内存信息" :name="'memory_' + val.id">
                        <progresscomp name="Mem" :compare="val.Memory.data" :proportion="val.Memory.proportion"></progresscomp>
                        <progresscomp name="Heap" :compare="val.HeapMemory.data" :proportion="val.HeapMemory.proportion"></progresscomp>
                      </el-collapse-item>
                      <el-collapse-item :title="'子应用(' + val.children.length + ')'" :name="'child_' + val.id" class="childAppInfoCollapse">
                          <el-row v-for="(childVal, childIndex) in val.childrenObj" :ref="'childAppInfo_' + childVal.id" 
                            @contextmenu.native='openMainMenu($event, childVal, val)' :key="childIndex">
                              <el-col :span="8"><a @click="cardClick(childVal)">{{childVal.serverName}}</a></el-col>
                              <el-col :span="8"><a @click="detailHandler(childVal)">{{childVal.port}}</a></el-col>
                              <el-col :span="8"> 
                                <span class="el-dropdown-link">
                                  <span :class="childVal.status === 'UP' ? 'green-color' : 'red-color'">{{childVal.status}}</span>
                                </span>
                              </el-col>
                          </el-row>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
              </el-card>
          </el-col>
      </el-row>
    </div>
    <appinfowindow :windowcfg="windowcfg" @saveCallBack="saveCallBack"></appinfowindow>
    <childdetailwindow :detailDialogCfg='detailDialogCfg'></childdetailwindow>
    <context-menu ref="mainMenuRef" @ctx-cancel="ctxCancel" @ctx-open="ctxOpen">
        <!--<context-menu-item itemName="刷新" @itemClick="reflushAllData" v-if="!btnCfg.isCanDo">
            <icon name="刷新" :showContent='false'></icon>
        </context-menu-item>
        <context-menu-item itemName="新增应用" @itemClick="addAppInfo" v-if="!btnCfg.isCanDo">
            <icon name="新增" :showContent='false'></icon>
        </context-menu-item> -->
        <context-menu-item itemName="新增子应用" @itemClick="addChildAppInfo" v-if="!btnCfg.isChildCanDo">
            <icon name="新增子应用" :showContent='false' ></icon>
        </context-menu-item>
        <context-menu-item itemName="修改" @itemClick="updateAppInfo" >
            <icon name="修改" :showContent='false' ></icon>
        </context-menu-item>
        <context-menu-item itemName="删除" @itemClick="deleteAppInfo">
            <icon name="删除" :showContent='false'></icon>
        </context-menu-item>
        <context-menu-item v-for="(val , index) in dropdownData" :key="index"
           :itemName="val.label" @itemClick="operaApp(val)" v-if="val.btntag ? !btnCfg[val.btntag] : true">
            <icon :name="val.image" :showContent='false'></icon>
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
      let vm = this
      return {
         ok: true, //目的是为了渲染,不然数据填充不到
         curInterval: null,
         isChoose: false,
         rowNum: 4, //这个值要设置24的约数，否则栅格分配不均
         appInfoData: [],
         windowcfg: {showWindow: false, tag: "add", instance: null, title: "新增应用", beforeSave: vm.cancelInterval},
         selectParentData: null,
         detailDialogCfg: {showWindow: false, data: null},
         btnCfg: {isCanDo: true,isChildCanDo: true},
         activeName: [],
         dropdownData: [
                  {value: "UP", label: "启动应用", status: "UP", image:"启动", tip: "启动【s%】应用"},
                  {value: "DOWN", label: "关闭应用", status: "DOWN",image:"关闭", tip: "关闭【s%】应用"},
                  {value: "INSTALL_NT", label: "安装服务", status: "INSTALL", btntag: 'isChildCanDo', image:"安装", tip: "安装【s%】应用服务"},
                  {value: "UNINSTALL_NT", label: "卸载服务", status: "UNINSATLL", btntag: 'isChildCanDo', image:"卸载", tip: "卸载【s%】应用服务"},
                  {value: "START_NT", label: "开启服务", status: "UP", btntag: 'isChildCanDo', image:"开启服务", tip: "开启【s%】应用服务"},
                  {value: "STOP_NT", label: "关闭服务", status: "DOWN", btntag: 'isChildCanDo', image:"关闭服务",tip: "关闭【s%】应用服务"}
         ]
      }
    }, 
    computed: {
      span(){
        return 24 / this.rowNum 
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
      vm.getAllData(cb);
    },
    methods: {
      setInterval(){
        let vm = this
        Util.setInterval({vm, name: 'appinfo', time: 3000, callBack: _ => {
            vm.reflushOldData()
          }
        })
      },
      cancelInterval(){
        let vm = this
        Util.cancelInterval({vm, name: 'appinfo'})
      },
      /**修改选择状态 */
      choose(){
          if(this.isChoose){
              this.isChoose = false
              this.cancelInterval()
          } else {
              this.isChoose = true
              this.setInterval();
          }
      },
      /**关闭右键菜单 */
      ctxCancel(data){
        if(data.id && data.parentId){
          this.$refs['childAppInfo_' + data.id][0].$el.style.backgroundColor = ''
          this.$refs['parentAppInfo_' + data.parentId][0].$el.style.transform = ''
          this.$refs['parentAppInfo_' + data.parentId][0].$children[0].$el.style.boxShadow = 'rgb(170, 170, 170) 0px 0px 10px 5px'
        } else if(data.id){
          this.$refs['parentAppInfo_' + data.id][0].$el.style.transform = ''
          this.$refs['parentAppInfo_' + data.id][0].$children[0].$el.style.boxShadow = 'rgb(170, 170, 170) 0px 0px 10px 5px'
        }
      },
      /**打开右键菜单 */
      ctxOpen(data){
        if(data.id && data.parentId){
          this.$refs['childAppInfo_' + data.id][0].$el.style.backgroundColor = '#C0C4CC'
          this.$refs['parentAppInfo_' + data.parentId][0].$el.style.transform = 'scale(1.05)'
          this.$refs['parentAppInfo_' + data.parentId][0].$children[0].$el.style.boxShadow = '#AACDF1 0px 0px 10px 5px'
        } else if(data.id){
          this.$refs['parentAppInfo_' + data.id][0].$el.style.transform = 'scale(1.05)'
          this.$refs['parentAppInfo_' + data.id][0].$children[0].$el.style.boxShadow = '#AACDF1 0px 0px 10px 5px'
        }
      },
      /**
      * 打开右键菜单
      * @author 谭云洪
      * @date 2017年09月07日09时47分
      * @since 1.0
      */
      openMainMenu(event, data, pval) {
        if(data){
          if(!data.parentId){ //父亲
            this.btnCfg.isChildCanDo = false
            this.btnCfg.isCanDo = true
            this.selectParentData = data
          } else { //儿子
            this.btnCfg.isChildCanDo = true
            this.btnCfg.isCanDo = false
            this.selectParentData = pval
          }
          this.windowcfg.instance = data
          //打开菜单之后，选中列表上的对应的那条记录
          this.$refs['mainMenuRef'].open(event, data)
        }
        /*
        else{ 
          this.btnCfg.isCanDo = true
          this.btnCfg.isChildCanDo = true
          this.selectParentData = null
        }*/

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
          let confirmCallBack = _ => {
            vm.cancelInterval()
            let callBack = data => {
                vm.reflushAllData()
            }
            Util.requestService({vm, url: "/deleteAppInfo/" + this.windowcfg.instance.id, method: 'get', callBack})
          }
          Util.confirm({vm, tip:'确定要删除【' + vm.windowcfg.instance.serverName + '】'+str+'应用吗?', callBack: confirmCallBack});
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
        vm.cancelInterval
        vm.$HJloading.open()
        vm.getAllData(_ => {
          vm.ok = false
          vm.ok = true
          vm.$HJloading.close()
          vm.setInterval()
        })
        //vm.reflushOldData();
      },
      //刷新数据(不管是修改新增父亲还是儿子都刷新父亲)
      saveCallBack(value){
        let vm = this;
        vm.cancelInterval()
        let callBack = data => {
          let d =Util.dealData(data)              
          if(vm.windowcfg.tag == "add"){
            let xLen = vm.appInfoData.length
            if(xLen == 0)
              vm.appInfoData[0] = []
            xLen = xLen > 0 ? xLen - 1 : 0
            let yLen = vm.appInfoData[xLen].length
            if(yLen == vm.rowNum){
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
          vm.setInterval()
        }
        Util.requestService({vm, url: "/findById/withstatus/"+ (value.parentId ? value.parentId : value.id), method: 'get', callBack})
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
        let tip = val.selectData.tip.replace("s%", val.instance.serverName)
        let confirmCallBack = _ => {
          let callBack = data => {
              let message = data.message
              let type = 'success'
              if(data.code != 0){
                type = 'warning'
              } 
              vm.$message({message, type});
          }
          Util.requestService({vm, url: "/reload/"+id+"/"+requestOpre , method: 'post', callBack})
        }
        Util.confirm({vm, tip:'确定要'+tip+'吗?', callBack: confirmCallBack});
      },
      /**
        操作应用
       */
      operaApp(val){
        this.handleCommand({selectData: val, instance: this.windowcfg.instance});
      },
      /**
        获取所有的数据
       */
      getAllData(cb){
        let vm = this;
        vm.appInfoData = []
        let callBack = data => {
          let xIndex = 0;
          let yIndex = 0;
          for (let i = 0 ; i < data.length; i++) {
            let d = Util.dealData(data[i])
            if(yIndex == 0){ //处理布局
              vm.appInfoData[xIndex] = []
            }
            vm.appInfoData[xIndex][yIndex] = d
            yIndex++;
            if(yIndex == vm.rowNum){
              yIndex = 0;
              xIndex++;
            }
          }
          if(cb && typeof cb === "function"){
              cb()
          }
        }
        Util.requestService({vm, url: "/main", method: 'get', callBack})
      },
      /**
       在原有的数据基础上刷新数据
      */
      reflushOldData(cb){
        let vm = this;
        let callBack = data => {
          for(let xIndex = 0; xIndex < vm.appInfoData.length; xIndex ++){
            for(let yIndex = 0; vm.appInfoData[xIndex] && yIndex < vm.appInfoData[xIndex].length; yIndex ++){
              let isData = false
              resp:
              for (let i = 0 ; i < data.length; i++) {
                if(vm.appInfoData[xIndex][yIndex].id == data[i].id){
                  Object.assign(vm.appInfoData[xIndex][yIndex], Util.dealData(data[i]))
                  data.splice(i,1);
                  isData = true
                  break resp
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
          /*
          let x = vm.appInfoData.length;
          x = x > 0 ? x-- : 0
          if(!vm.appInfoData[x]){
            vm.appInfoData[x] = []
          }
          let y = vm.appInfoData[x].length
          y = y > 0 ? y-- : 0
          for (let i = 0 ; i < data.length; i++) {
            let d = Util.dealData(data[i])
            if(y == 0){
              vm.appInfoData[x] = []
            }
            y = vm.appInfoData[x].length
            vm.appInfoData[x][y] = d
            y++;
            if(y == vm.rowNum){
              y = 0;
              x++;
            }
          }*/
          vm.ok = false
          vm.ok = true
          if(cb && typeof cb === "function"){
            cb()
          }
        }
        let newData = [];
        for(let xIndex = 0; xIndex < vm.appInfoData.length; xIndex ++){
          for(let yIndex = 0; vm.appInfoData[xIndex] && yIndex < vm.appInfoData[xIndex].length; yIndex ++){
            newData[newData.length] = vm.appInfoData[xIndex][yIndex]
          }
        }
        Util.requestService({vm, url: "/reflusholddata", method: 'post', data: newData, callBack})
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
    overflow: hidden;
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
    height: calc(100% - 30px);
    position: absolute;
    overflow: auto;
    padding: 10px 0px 10px 0px;
  }
  .cardplatformpane .el-collapse-item__content{
    max-height: 100px;
    overflow-y: auto;
  }
  /**设置手风琴 进度条的背景颜色 */
  .childAppInfo .el-collapse-item__content .progresscomp .text.item.myItemClass{
    background-color: initial;
  }
  .childAppInfo .el-row{
    border-bottom: 1px solid azure;
  }
  .childAppInfoCollapse .el-collapse-item__content{
    padding-bottom: 1px;
  }
  .cardplatformpane > .el-row{
    padding-top: 10px;
  }
  .cardplatformpane > .el-row .el-col{
    transition-duration: 0.5s;
  }
  .parentAppInfoCol{
    padding-left: 15px; 
    padding-right: 15px; 
    padding-bottom: 20px;
  }
</style>


// WEBPACK FOOTER //
// src/components/cardplatform/index.vue