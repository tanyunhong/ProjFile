<template>
    <div class='serverInfo' v-if="ok" >
        <el-row :gutter="20">
            <el-col :span="12">
                <detailpanel headata="硬盘">
                    <!--<labelcomp :data="diskSpaceData"></labelcomp>-->
                    <div class="serverInfo-diskspace">
                        <diskspace v-for="(val, index) in diskSpaceData" :key="index" :data='val'></diskspace>
                    </div>
                </detailpanel>
            </el-col>
            <el-col :span="12">
                <detailpanel headata="内存">
                    <progresscomp name="Memory" :compare="memData.compare" :proportion="memData.proportion"></progresscomp>
                    <updowncardcomp name="进程" :data="memData.process"></updowncardcomp>
                </detailpanel>
            </el-col>
           
        </el-row>
        <el-row :gutter="20">
             <el-col :span="12">
                <detailpanel headata="CPU">
                   <cpuarea></cpuarea>
                </detailpanel>
            </el-col>
            <el-col :span="12">
                <detailpanel headata="网络">
                     <netstatarea></netstatarea>
                </detailpanel>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import detailpanel from '../common/DetailCard/index.vue'
    import updowncardcomp from '../common/UpDownCardComp'
    import progresscomp from '../common/ProgressComp'
    import labelcomp from '../common/labelComp'
    import Util from '@/assets/js/Util.js'
    import cpuarea from './CpuArea.vue'
    import netstatarea from './NetstatArea.vue'
    import diskspace from './DiskSpace.vue'
    export default {
        props: ['data', 'name'],
        created(){
           let vm = this
           vm.getDiskSpaceData();
           vm.memTimerTask();
           vm.setInterval()
        },
        data(){
            let vm = this
            return {
                    ok: true, //目的是为了渲染,不然数据填充不到
                    series: null,
                    isChoose: true,
                    spaceData: [{name: 'Total', value: '123G'}, {name: 'Free', value: '123G'},{name: 'Threshold', value: '322M'}],
                    diskSpaceData: [],
                    memData: {
                        compare: '0/0', proportion: 0, process: []
                    }
            } 
        },
        components: {detailpanel, updowncardcomp, progresscomp, labelcomp, cpuarea,netstatarea,diskspace},
        methods: {
            setInterval(){
                let vm = this
                Util.setInterval({vm, name: 'serverInfo', callBack: _ => vm.memTimerTask()})
            },
            cancelInterval(){
                let vm = this
                Util.cancelInterval({vm, name: 'serverInfo'})
            },
            choose(){
                if(this.isChoose){
                    this.isChoose = false
                    this.cancelInterval()
                } else {
                    this.isChoose = true
                    this.setInterval()
                }
            },
            /**保持cpu最后一个点有提示 */
            activeLastPointToolip(chart) {
                var points = chart.series[0].points;
                chart.tooltip.refresh(points[points.length -1]);
            },
            //显示的端点配置
            getDiskSpaceData(){
                let vm = this
                let pointsArray = []
                //所有磁盘
                let usageCallBack = data => {
                    var diskSpaceData = [];
                    for(let i = 0; i < data.length; i++){
                        let percentage = Util.dealProportion((data[i].total - data[i].free), data[i].total)
                        let val = Util.transformDataTypeByM(data[i].free, 1) + " 可用，共 " +
                                     Util.transformDataTypeByM(data[i].total, 1)
                        diskSpaceData[i] = {name: data[i].name, value: val, percentage}
                    }
                    vm.diskSpaceData = diskSpaceData
                }
                pointsArray[0] = {url: 'server/usageinfo', callBack: usageCallBack}
                vm.getDataByPoints(pointsArray);
            },
            memTimerTask(){
                let vm = this
                let pointsArray = [];
                //内存
                let memCallBack = data => {
                    let total = data.total;
                    let use = data.use;
                    let process = data.process;
                    let proportion = Util.dealProportion(use, total)
                    let compare = Util.transformDataTypeByM(use) + "/" + Util.transformDataTypeByM(total)
                    vm.memData.compare = compare
                    vm.memData.proportion = proportion
                    //vm.ok = false
                    let d = [];
                    for(let i = 0 ; i < 10 && i < process.length ; i ++){
                        d[i] = {name: process[i].imageName, value: Util.transformDataTypeByM(process[i].memory)}
                    }
                    vm.memData.process = d
                    //vm.ok = true
                }
                pointsArray[0] = {url: 'server/meminfo', callBack: memCallBack}
                vm.getDataByPoints(pointsArray);
            },
            //循环调用查询端点数据
            getDataByPoints(pointsArray){
                let vm = this; 
                for(let item of pointsArray){
                    Util.requestService({vm, url: item.url, method: 'get', callBack: item.callBack})
                }
            }
        }
    }
</script>
<style>
    .serverInfo{
        left: 0;
        right: 0;
        width: 70%;
        margin: 0 auto;
    }
    .serverInfo > .el-col {
        padding-left: 12px;
        overflow: auto;
    }
    .serverInfo .content{
        max-height: 110px;
        overflow-y: auto;
    }
    .serverInfo-diskspace{
        max-height: 180px;
        overflow-y: auto;
    }
</style>


// WEBPACK FOOTER //
// src/components/serverInfo/index.vue