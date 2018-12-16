<template>
    <div>
        <highchart ref="cpuhighchart" :id="cpu.id" :option="cpu.option"></highchart>
    </div>
</template>
<script>
import highchart from '../common/highchart'
import Util from '@/assets/js/Util.js'
export default {
    components: {highchart},
    data(){
        let vm = this
        return {
            cpu: {
                id: 'cpu', 
                option: {
                    chart: {
                    type: 'area',
                    height: '250px',
                    events: {
                        load: function () {
                            var seft = this
                            let series = seft.series[0]
                            Util.setInterval({vm, name: 'cpu', time: 2000, callBack: _ => {
                                let callBack = data => {
                                    series.addPoint(data, true, true);
                                    vm.activeLastPointToolip(seft);
                                }
                                Util.requestService({vm, url: "/server/cpuuseprop", method: 'get', callBack})
                            }})
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
                        area: {
                            fillOpacity: 0.5, // 指定所有面积图的透明度
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
    methods: {
        activeLastPointToolip(chart) {
            var points = chart.series[0].points;
            chart.tooltip.refresh(points[points.length -1]);
        }
    }
}
</script>
<style>
    
</style>


// WEBPACK FOOTER //
// src/components/serverInfo/CpuArea.vue