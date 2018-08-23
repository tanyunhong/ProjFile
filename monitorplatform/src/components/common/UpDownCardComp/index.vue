<!--
    上下显示的组件，头是显示信息，下面是具体数据
-->
<template>
    <div class='updowncardcomp'>
        <div class="text item myItemClass" style='border-radius: 3px;'>
            {{name}}
        </div>
        <el-row v-for = '(o, index) in data' :key='index'>
            <el-col :span="12"><div class="grid-content bg-purple-light">{{data[index].name}}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light updowncardcomp-vlue">{{data[index].value}}</div></el-col>
        </el-row>
    </div>
</template>
<script>
  export default {
    props: ['data', 'name']
  }
</script>
<style>
  .updowncardcomp {

  }
  .updowncardcomp-vlue{
     overflow: hidden;
  }
</style>