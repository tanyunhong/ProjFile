<template>
    <div class="AppInfoWindow">
        <el-dialog :title="windowcfg.title" :visible.sync="windowcfg.showWindow" width="30%" 
                :close-on-click-modal="false" :close-on-press-escape="false" @open="openWindow" :show-close="false">
            <el-form :ref="formName" :label-position="labelPosition" :rules="rules" label-width="100px" size="mini" :model="formData">
                <el-form-item label="项目名称:" prop="projectName">
                    <el-input v-model="formData.projectName" @input="projectNameChange"></el-input>
                </el-form-item>
                <el-form-item label="服务名称:">
                    <el-input v-model="formData.serverName"></el-input>
                </el-form-item>
                <el-form-item label="项目路径:" prop="projectPath">
                    <el-input v-model="formData.projectPath"></el-input>
                </el-form-item>
                <el-form-item label="访问域名:" prop="hostName">
                    <el-input v-model="formData.hostName"></el-input>
                </el-form-item>
                <el-form-item label="服务端口:" prop="port">
                    <el-input v-model="formData.port"></el-input>
                </el-form-item>
                <el-form-item label="ip地址:">
                    <el-input v-model="formData.ip"></el-input>
                </el-form-item>
                <el-form-item label="访问前缀:">
                    <el-input v-model="formData.prefix"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="saveData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props:["windowcfg"],
        data(){
            return {
                formName: "appInfoform",
                labelPosition: 'right',
                formData: {id: null, parentId: null, hostName:"",ip:"",port:"",prefix:"",projectName: "",projectPath: "", serverName: ""},
                rules: {
                    'projectName': [{required: true, message: '请填写项目名称', trigger: 'blur'}],
                    'projectPath': [{required: true, message: '请填写项目路径', trigger: 'blur'}],
                    'hostName': [{required: true, message: '请填写域名', trigger: 'blur'}],
                    'port': [{required: true, message: '请填写端口', trigger: 'blur'}]
                }
            }
        },
        methods:{
            projectNameChange(value){
                this.formData.serverName = value;
            },
            /**
                打开窗口事件
             */
            openWindow(){
                let vm = this
                if(vm.windowcfg.tag == "update"){
                     vm.$axios({
                        method: 'get',
                        url: "/findById/nostatus/" + vm.windowcfg.instance.id
                        }).then(response => {
                            if(response.status == 200){
                                Object.assign(vm.formData, response.data)
                            }
                        }, reject => {})
                        .catch(a => {console.log(a)});
                } else if (vm.windowcfg.tag == "addChild"){
                    vm.formData.parentId = vm.windowcfg.instance.id
                }
            },
            saveData(){
                let vm = this
                vm.$refs[vm.formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确定要提交数据吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            if(!vm.formData.serverName){ //默认服务名称就是项目名称
                                vm.formData.serverName = vm.formData.projectName
                            }
                            vm.$axios({
                                method: 'post',
                                url: "/addAppInfo",
                                data: vm.formData
                                }).then(response => {
                                    if(response.status == 200){
                                        vm.cancel();
                                        vm.$emit('saveCallBack', Object.assign(response.data, {tag: vm.windowcfg.tag}));
                                    }
                                }, reject => {})
                                .catch(a => {console.log(a)});
                        }).catch(() => {});
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