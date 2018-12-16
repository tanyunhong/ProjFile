<template>
    <div class="AppInfoWindow">
        <el-dialog :title="windowcfg.title" :visible.sync="windowcfg.showWindow" width="600px" 
                :close-on-click-modal="false" :close-on-press-escape="false" @open="openWindow" :show-close="false">
            <el-form :ref="formName" :label-position="labelPosition" :inline="false" :rules="rules" label-width="100px" size="mini" :model="formData">
            <el-row>
                <el-col :span='12'>
                    <el-form-item label="项目名称:" prop="projectName">
                        <el-input v-model="formData.projectName" @input="projectNameChange"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="服务名称:">
                        <el-input v-model="formData.serverName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="项目路径:" prop="projectPath">
                        <el-input v-model="formData.projectPath"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="协议:">
                        <el-select v-model="formData.agreement">
                            <el-option label="http" value="http"></el-option>
                            <el-option label="https" value="https"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="ip地址:" prop='ip'>
                        <el-input v-model="formData.ip"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="端口:" prop="port">
                        <el-input v-model="formData.port"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="域名:">
                        <el-input v-model="formData.hostName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="前缀:">
                        <el-input v-model="formData.prefix"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="saveData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Util from '@/assets/js/Util.js'
    export default {
        props:["windowcfg"],
        data(){
            let vm = this
            return {
                formName: "appInfoform",
                labelPosition: 'right',
                formData: {id: null, parentId: null, agreement: "http", hostName:"", ip:"", port:"", prefix:"", projectName: "",projectPath: "", serverName: ""},
                rules: {
                    'projectName': [{required: true, message: '请填写项目名称', trigger: 'blur'}],
                    'projectPath': [{required: true, message: '请填写项目路径', trigger: 'blur'}],
                    /*'hostName': [{required: true, message: '请填写域名', trigger: 'blur'}],*/
                    'port': [
                        {required: true, message: '请填写端口', trigger: 'blur'},
                        {validator: vm.validateNumber, trigger: 'blur'}
                    ],
                    'ip': [
                        {required: true, message: '请填写ip地址', trigger: 'blur'},
                        {validator: vm.validateIp, trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            validateIp(rule, value, callback){
                let exp = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
                if(exp.test(Util.trim(value))){
                    callback();
                } else {
                    callback(new Error('输入格式错误'));
                }
            },
            validateNumber(rule, value, callback){
                let exp = /^[0-9]*$/
                if(exp.test(Util.trim(value))){
                    if(value > 65535){
                        callback(new Error('端口超界'));
                    } else {
                        callback()
                    }
                } else {
                    callback(new Error('请输入数字'));
                }
            },
            projectNameChange(value){
                this.formData.serverName = value;
            },
            /**
                打开窗口事件
             */
            openWindow(){
                let vm = this
                if(vm.windowcfg.tag == "update"){
                     let callBack = data => {
                         Object.assign(vm.formData, data)
                     }
                     Util.requestService({vm, url: "/findById/nostatus/" + vm.windowcfg.instance.id, method: 'get', callBack})
                } else if (vm.windowcfg.tag == "addChild"){
                    vm.formData.parentId = vm.windowcfg.instance.id
                }
            },
            saveData(){
                let vm = this
                vm.$refs[vm.formName].validate((valid) => {
                    if (valid) {
                        if(vm.windowcfg.beforeSave){
                            vm.windowcfg.beforeSave()
                        }
                        let confirmCallBack = _ => {
                            if(!vm.formData.serverName){ //默认服务名称就是项目名称
                                vm.formData.serverName = vm.formData.projectName
                            }
                            Util.trimData({data: vm.formData, exclude: ['id', 'parentId']})
                            let callBack = data => {
                                vm.cancel();
                                vm.$emit('saveCallBack', Object.assign(data, {tag: vm.windowcfg.tag}));
                            }
                            let failBack = _ => {
                                console.log("请求失败")
                            }
                            Util.requestService({vm, url: "/addAppInfo", method: 'post', data: vm.formData, callBack})
                        }
                        Util.confirm({vm, tip: '确定要提交数据吗?', callBack: confirmCallBack});
                    }
                })
            },
            cancel(){
                this.resetFields();
                this.windowcfg.showWindow = false
            },
            resetFields(){
                this.$refs[this.formName].resetFields();
                this.formData.id = null;
                this.formData.parentId = null;
                this.formData.serverName = "";
                this.formData.ip = "";
                this.formData.prefix = "";
                this.formData.agreement = "http";
                this.formData.hostName = ""
            }
        }
    }
</script>
<style>
    .AppInfoWindow {}
    .AppInfoWindow .el-dialog__body {
        padding: 30px 10px 0px
    }
</style>


// WEBPACK FOOTER //
// src/components/cardplatform/AppInfoWindow.vue