<template>
    <div class="diskspace">
        <div class="text item myItemClass" style='border-radius: 3px;'>
            {{data.name}}
            <span style="float: right;">{{data.value}}&nbsp;&nbsp;&nbsp;</span>
        </div>
        <el-progress :text-inside="true" :show-text="false" :stroke-width="18" :percentage="data.percentage" :color="data.percentage >= 90 ? '#f56c6c' : '#409EFF'"></el-progress>
    </div>
</template>
<script>
export default {
  props: ['data']
}
</script>
<style>
    /**去掉圆边 */
    .diskspace .el-progress-bar__outer{
        border-radius: 3px
    }
    .diskspace .el-progress-bar__inner{
        border-radius: 3px;
    }
</style>


// WEBPACK FOOTER //
// src/components/serverInfo/DiskSpace.vue