<template>
    <div class='labelComp'>
        <el-row v-for = '(o, index) in data' :key='index'>
            <el-col :span="12"><div class="grid-content bg-purple-light">{{data[index].name}}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">{{data[index].value}}</div></el-col>
        </el-row>
    </div>
</template>
<script>
  export default {
    props: ['data']
  }
</script>
<style>
  .labelComp {
    
  }
</style>


// WEBPACK FOOTER //
// src/components/common/labelComp/index.vue