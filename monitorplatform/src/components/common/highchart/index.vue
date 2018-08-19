<template>
    <div ref="chart" class="x-bar">
        <div :id="id" :option="option" ></div>
    </div>
</template>
<script>
import HighCharts from 'highcharts'
export default {
    // 验证类型
    props: {
        id: { type: String },
        option: {type: Object}
    },
    mounted(){
        HighCharts.chart(this.id, this.option)
    },
    updated(){ //保证第二次之后打开会渲染
        HighCharts.chart(this.id, this.option)
    }
}
</script>