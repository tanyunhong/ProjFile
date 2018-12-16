<template>
    <!--背景图-->
    <div class = "login login-image" >
        <!--表单组件放在外面，标签栏在里面-->
        <el-form ref = "login" :model = "user"  :rules = "rules"  label-width="60px" class = "demo-ruleForm login-container">
            <!--tab标签-->
            <div>
                <el-form-item  label = "账号" prop = "userName" >
                    <el-input type = "text"  v-model="user.userName" placeholder = "请输入您的账号" ></el-input>
                </el-form-item> 
                <el-form-item label = "密码" prop = "passWord">
                    <el-input type = "password"  v-model="user.passWord" placeholder = "请输入密码" ></el-input>
                </el-form-item>
                <el-form-item  class="login-form-captcha"  prop="captcha" >
                    <el-input v-model="user.captcha" @keyup.enter.native="login" placeholder="验证码" class='login-captcha-text'></el-input>
                    <img alt="点击刷新图片！" title="看不清，换一张" :src="captchaSrc" @click="refreshCode" class="login-captcha-image">
                </el-form-item>
            </div>
            <div class = "login-remember">
                <el-checkbox v-model = "remember" class = "remember-me">记住密码</el-checkbox>
                <!--<a href ="'https://blog.csdn.net/Vanadis_outlook/article/details/72823024.html'" class = "forget-password">忘记密码？</a>-->
            </div>
            <div class = "formButton">
                <el-button type = "primary" style = "width:100%;"  @click='login'>登录</el-button>
            </div>
        </el-form>
    </div> 
</template>
 
<script>
import Util from '@/assets/js/Util.js'
import config from '../../../static/config'
export default {
    mounted(){
        //记住密码
       let vm = this
       let name = Util.getStorageData({key: vm.itemName})
       let pw = Util.getStorageData({key: vm.itemPW})
       if(name && pw){
         pw = Util.uncompileStr(pw, name)
         this.user.passWord = pw
         this.remember = true
       } else {
         this.remember = false
       }
       this.user.userName = name
       //let data = Util.getUser(this)
       //this.remember = data.remember
       //this.user.userName = data.user.userName
       //if(this.remember){
       //   this.user.passWord =  Util.uncompileStr(data.user.rememberPW, data.user.userName)
       //}
       this.refreshCode()
    },
    data() {
        return {
            itemName: 'NMONITOR',
            itemPW: 'PMONITOR',
            user: {userName: '', passWord: '', captcha: ''},
            captchaSrc: '',
            remember: false,
            rules: {
                userName :[
                    {required: true, message: '请输入账号',trigger: 'blur'}
                ],
                passWord: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                captcha: [
                    {required: true, message: '请输入验证码', trigger: 'change'}
                ]
            }
        };
    },
    methods: {
        /**
        * 刷新验证码
        */
        refreshCode: function () {
            let url = config.APIRoot == "/" ? "" : config.APIRoot
            this.captchaSrc =  url + '/captcha?t=' + new Date().toUTCString()
            //this.captchaSrc = 'http://localhost:8090/captcha?t=' + new Date().toUTCString()
            this.user.captcha = ''
        },
        login(){
            let vm = this
            vm.$refs['login'].validate((valid) => {
                    if (valid) {
                        let callBack = data => {
                            Util.setStorageData({key: vm.itemName, value: vm.user.userName})
                            if(vm.remember){
                                let rememberPW = Util.compileStr(vm.user.passWord, vm.user.userName);
                                Util.setStorageData({key: vm.itemPW, value: rememberPW})
                            } else {
                                Util.removeItem({key: vm.itemPW})
                            }
                            Util.setUser({user:data , remember: vm.remember, vm})
                            vm.$router.push('/platform')
                        }
                        let failBack = data => {
                            vm.refreshCode();
                        }
                        Util.requestService({vm, url: "/login" , method: 'post', data: vm.user, failBack, callBack})
                    }
                }
            )
        }
    }
}
</script> 
<style>
.login{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
}
.login-container {
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 300px;
    padding: 35px 35px 15px 35px;
    background: rgba(255,255,255,0.7);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}

.remember-me{
    width:250px;
    text-align:left;
}
.forget-password{
    width:500px;
    text-align:right;
    font-size:14px;
    font-family:PingFang SC;
}
.login-remember{
    margin-left: 60px;
    margin-bottom: 10px;
    padding-bottom: 10px;
}
.login .el-form-item__label{
    text-align: left;
}
.login-captcha-image{
    float: right;
}
.login .login-form-captcha .login-captcha-text{
    float: left;
    width: 50%;
}
</style>


// WEBPACK FOOTER //
// src/components/login/login.vue