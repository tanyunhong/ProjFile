<template>
    <div>
        <highchart ref="netstathighchart" :id="netstat.id" :option="netstat.option"></highchart>
    </div>
</template>
<script>
import highchart from '../common/highchart'
import HighCharts from 'highcharts'
import Util from '@/assets/js/Util.js'
export default {
    components: {highchart},
    data(){
        let vm = this
        return {
            series: null,
            netstat: {
                id: 'netstat', 
                option: {
                    chart: {
                    type: 'area',
                    height: '250px',
                    events: {
                        load: function () {
                            var seft = this
                            vm.series = seft.series
                            Util.setInterval({name: 'netstat', time: 2000, vm, callBack: _ => {
                                let callBack = data => {
                                    seft.series[0].addPoint(data.receive, true, true);
                                    seft.series[1].addPoint(data.send, true, true);
                                    vm.activeLastPointToolip(seft);
                                }
                                Util.requestService({vm, url: "/server/nestatinfo", method: 'get', callBack})
                            }})
                            }
                        }
                    },
                    title: { //去掉标题
                        text: ''
                    },
                    xAxis: {
                        labels: {enabled: false}, //x轴不要
                        visible: false,
                        //categories: [0,1,2,3,4,5,6,7,8,9]
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: 0,
                        y: 0,
                        floating: true
                    },
                    credits: { //右下角提示不要
                        enabled: false
                    },
                    yAxis: {
                        /*tickPositioner: function (){
                            if(this.dataMax <= 3){
                                return [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
                            }
                            let data = []
                            let max = Math.round(this.dataMax)
                            let increment = Math.round(max*10 / 6) / 10
                            for(let i = 0 ; i < 6; i++){
                                data.push( Math.round(i * increment))
                            }
                            return data
                        },*/
                        //tickPositions: [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
                        title: {
                            text: '吞吐量'
                        }
                    },
                    plotOptions: {
                        area: {
                            fillOpacity: 0.3, // 指定所有面积图的透明度
                            marker: {
                                enabled: false,
                                radius: 2
                            }
                        }
                    },
                    tooltip: {
                        shared: true,
                        formatter: function () {
                            return "接收："+ vm.dealData(this.points[0] ? this.points[0].y : 0) + 
                                        "<br/>发送：" + vm.dealData(this.points[1] ? this.points[1].y : 0) +""
                        }
                    },
                    series: [
                        {name: '接收', data:[0,0,0,0,0,0,0,0,0,0]},
                        {name: '发送',color: '#909399', data:[0,0,0,0,0,0,0,0,0,0]}
                        ]
                    }
                }
            }
        },
    methods: {
        activeLastPointToolip(chart) {
            //var points = chart.series[0].points;
            //chart.tooltip.refresh(points[points.length -1]);
        },
        dealData(data){
            if(data < 0.5){
               return data*1024 + " Kbps"
            } else {
               return data + " Mbps"
            }
        }
    }
}
</script>
<style>
    
</style>


// WEBPACK FOOTER //
// src/components/serverInfo/NetstatArea.vue