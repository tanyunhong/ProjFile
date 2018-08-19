<template>
  <div>
    <el-form :model="formData" status-icon :rules="rules" ref="formRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="pass">
            <el-input v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
        </el-form-item>
    </el-form>
    <form action="https://api.cloudconvert.com/convert" method="POST" enctype="multipart/form-data">
      <input type="file" name="file">
      <input type="hidden" name="apikey" value="kJTGGG4MJulUVwA7s-O2cvxRH6kvf1GhJgY3L7cldDVA5UwFVt7W9LzXgaZKXHcMQ91qMo4ptxkwj7vpZZNukQ">
      <input type="hidden" name="inputformat" value="dwg">
      <input type="hidden" name="outputformat" value="pdf">
      <input type="hidden" name="input" value="upload">
      <input type="hidden" name="wait" value="true">
      <input type="hidden" name="download" value="true">
      <input type="submit" value="Convert!">
    </form>
  </div>  
</template>
<script>
  import PbcUtils from '@/common/PbcUtils'
  import api from '@/API'
  export default {
    data() {
      return {
        formData: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名！', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码！', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        let callBack = data => {
          this.$router.push('/index');
        }
        PbcUtils.requestService({url: api.loginModule.loginUrl, method: "post", data: this.formData, callBack});
      }
    }
  }
</script>