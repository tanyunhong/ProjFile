<template>
    <div class='serverInfo' v-if="ok">
        <el-row>
            <el-col :span="12">
                <detailpanel headata="硬盘">
                    <labelcomp :data="usageData"></labelcomp>
                </detailpanel>
            </el-col>
            <el-col :span="12">
                <detailpanel headata="内存">
                    <progresscomp name="Memory" :compare="memData.compare" :proportion="memData.proportion"></progresscomp>
                    <updowncardcomp name="进程" :data="memData.process"></updowncardcomp>
                    <!--
                    <progresscomp name="Memory" :compare="memoryData.md.compare" :proportion="memoryData.md.proportion"></progresscomp>
                    <progresscomp name="Heap Memory" :compare="memoryData.hd.compare" :proportion="memoryData.hd.proportion"></progresscomp>
                    <progresscomp name="Non-Heap Memory" :compare="memoryData.nhd.compare" :proportion="memoryData.nhd.proportion"></progresscomp>
                    <labelcomp :data='memoryData.labelData'></labelcomp>
                    -->
                </detailpanel>
            </el-col>
           
        </el-row>
        <el-row>
             <el-col :span="12">
                <detailpanel headata="CPU">
                   <highchart ref="cpuhighchart" :id="cpu.id" :option="cpu.option"></highchart>
                </detailpanel>
            </el-col>
            <el-col :span="12">
                <detailpanel headata="网络">
                    <progresscomp name="Memory" :compare="memoryData.md.compare" :proportion="memoryData.md.proportion"></progresscomp>
                    <progresscomp name="Heap Memory" :compare="memoryData.hd.compare" :proportion="memoryData.hd.proportion"></progresscomp>
                    <progresscomp name="Non-Heap Memory" :compare="memoryData.nhd.compare" :proportion="memoryData.nhd.proportion"></progresscomp>
                    <labelcomp :data='memoryData.labelData'></labelcomp>
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
    import Util from '../../assets/js/Util.js'
    import highchart from '../common/highchart'
    export default {
        props: ['data', 'name'],
        created(){
           let vm = this
           vm.createPointsArray();
           vm.timerTask();
           setInterval(function(){
                vm.timerTask();           
           },5000);
        },
        data(){
            let vm = this
            return {
                    ok: true, //目的是为了渲染,不然数据填充不到
                    spaceData: [{name: 'Total', value: '123G'}, {name: 'Free', value: '123G'},{name: 'Threshold', value: '322M'}],
                    usageData: [{name: "", value:""}],
                    memData: {
                        compare: '0/0', proportion: 0, process: [
                            {name: '', value: ''},
                            {name: '', value: ''},
                            {name: '', value: ''},
                            {name: '', value: ''},
                            {name: '', value: ''}
                        ]
                    },
                    memoryData: {
                        md: {proportion: 0, compare: '0/0'}, 
                        hd: {proportion: 0, compare: '0/0'}, 
                        nhd: {proportion: 0, compare: '0/0'},
                        labelData: [
                            {name: 'Initial Heap', value: "12M"},
                            {name: 'Maximum Heap', value: "12M"},
                            {name: 'Initial Non-Heap', value: "12M"},
                            {name: 'Maximum Non-Heap', value: "12M"}
                        ]
                    },
                    cpu: {id: 'cpu', option: {chart: {
                            type: 'area',
                            height: '250px',
                            events: {
                                load: function () {
                                    var seft = this
                                    var series = seft.series[0]
                                    //vm.activeLastPointToolip(seft);
                                    setInterval(function () {
                                        vm.$axios({
                                            method: 'get',
                                            url: "/server/cpuuseprop"
                                        }).then(response => {
                                            if(response.status == 200){
                                                series.addPoint(response.data, true, true);
                                            }
                                            vm.activeLastPointToolip(seft);
                                        }, reject => {console.log(reject)}).catch(a => {console.log(a)});
                                        }, 2000);
                                }
                            }
                        },
                        title: { //去掉标题
                            text: ''
                        },
                        xAxis: {
                            labels: {enabled: false}, //x轴不要
                            visible: false
                        },
                        legend: { //X轴坐标不要
                            enabled: false
                        },
                        credits: { //右下角提示不要
                            enabled: false
                        },
                        yAxis: {
                            tickPositions: [0, 25, 50, 75, 100],
                            title: {
                                text: '利用率'
                            }
                        },
                        plotOptions: {
                            fillOpacity: 0.3, // 指定所有面积图的透明度
                            area: {
                                marker: {
                                    enabled: false,
                                    radius: 2
                                }
                            }
                        },
                        tooltip: {
                            formatter: function () {
                                return this.y + '%';
                            }
                        },
                        series: [{data:[0,0,0,0,0,0,0,0,0,0]}]}
                    }
                }
        },
        components: {detailpanel, updowncardcomp, progresscomp,labelcomp, highchart},
        methods: {
            activeLastPointToolip(chart) {
                var points = chart.series[0].points;
                chart.tooltip.refresh(points[points.length -1]);
            },
            //显示的端点配置
            createPointsArray(){
                let vm = this
                let pointsArray = []

                //磁盘
                /*
                let healthCallBack = data => {
                    vm.spaceData[0].value = Util.transformDataType(data.diskSpace.total);
                    vm.spaceData[1].value = Util.transformDataType(data.diskSpace.free);
                    vm.spaceData[2].value = Util.transformDataType(data.diskSpace.threshold);
                }
                pointsArray[0] = {url: 'health', callBack: healthCallBack}
                */
                //内存
                /*let metricsCallBack = data => {
                   
                    //memory
                    let mem = Util.transformDataTypeByKB(data.mem);
                    let useMemData = data.mem - data['mem.free']
                    let useMem = Util.transformDataTypeByKB(useMemData)
                    vm.memoryData.md.compare = useMem + "/" + mem
                    vm.memoryData.md.proportion = Util.dealProportion(useMemData, data.mem);

                    //head memory
                    let hdmem = Util.transformDataTypeByKB(data['heap.committed']);
                    let hduseMemData = data['heap.used']
                    let hduseMem = Util.transformDataTypeByKB(hduseMemData)
                    vm.memoryData.hd.compare = hduseMem + "/" + hdmem
                    vm.memoryData.hd.proportion = Util.dealProportion(hduseMemData, data['heap.committed']);
                    vm.memoryData.labelData[0].value = Util.transformDataTypeByKB(data['heap.init'])
                    vm.memoryData.labelData[1].value = Util.transformDataTypeByKB(data['heap'])

                    //non head memory
                    let nhdmem = Util.transformDataTypeByKB(data['nonheap.committed']);
                    let nhduseMemData = data['nonheap.used']
                    let nhduseMem = Util.transformDataTypeByKB(nhduseMemData)
                    vm.memoryData.nhd.compare = nhduseMem + "/" + nhdmem
                    vm.memoryData.nhd.proportion = Util.dealProportion(nhduseMemData, data['nonheap.committed']);
                    vm.memoryData.labelData[3].value = Util.transformDataTypeByKB(data['nonheap.init'])
                    vm.memoryData.labelData[4].value = Util.transformDataTypeByKB(data['nonheap'])
                }
                vm.pointsArray[1] = {url: 'metrics', callBack: metricsCallBack}*/



                //所有磁盘
                let usageCallBack = data => {
                    vm.ok = false
                    for(let i = 0; i < data.length; i++){
                        let val = Util.transformDataTypeByKB(data[i].free, 1) + " 可用，共 " +
                                     Util.transformDataTypeByKB(data[i].total, 1)
                        if(i==0){
                            vm.usageData[i].name = data[i].name
                            vm.usageData[i].value = val
                        } else {
                            vm.usageData[i] = {name: data[i].name, value: val}
                        }
                    }
                    vm.ok = true
                }
                pointsArray[0] = {url: 'server/usageinfo', callBack: usageCallBack}
                vm.getPointsData(pointsArray);
            },
            timerTask(){
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
                    for(let i = 0 ; i < 5 && i < process.length ; i ++){
                        vm.memData.process[i].name = process[i].name
                        vm.memData.process[i].value = process[i].memUse
                    }
                }
                pointsArray[0] = {url: 'server/meminfo', callBack: memCallBack}
                vm.getPointsData(pointsArray);
            },
            //循环调用查询端点数据
            getPointsData(pointsArray){
                let vm = this; 
                for(let item of pointsArray){
                    vm.$axios({
                        method: 'get',
                        url: "/" + item.url
                    }).then(response => {
                        if(response.status == 200){
                            if(item.callBack){
                                item.callBack(response.data);
                            }
                        }
                    }, reject => {console.log(reject)}).catch(a => {console.log(a)});
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
    .serverInfo .el-col {
        padding-left: 12px;
        overflow: auto;
    }
</style>