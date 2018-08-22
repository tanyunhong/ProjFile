<template>
    <div  v-for="(val, key, index) in data" :key="index">
        <el-row>
          <el-col :span="6" style="padding: 0px 0px 10px 0px;" 
                :offset="1">
         </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    props: ['data']
}
</script>
<style>
    
</style>>