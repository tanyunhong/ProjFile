<template>
  <div class='div1'>
    <el-row class='row2'>
        <el-col :span="span1">
            <label style='color:red'>输入代码：</label>
        </el-col>
        <el-col :span="span5">
            <label style='color:red'>序号</label>
        </el-col>
        <el-col :span="span4">
            <label style='color:red'>订单编号{{title4}}</label>
        </el-col>
         <el-col :span="span3">
            <label style='color:red'>收货人{{title3}}</label>
        </el-col>
        <el-col :span="span2">
            <label style='color:red'>成团时间{{title2}}</label>
        </el-col>
        <el-col :span="span2">
            <label style='color:red'>承诺发货时间{{title1}}</label>
        </el-col>
    </el-row>
    <el-row class='row1'>
        <el-col :span="span1" :height='100'>
            <el-input type="textarea" :rows="24" placeholder="请输入内容" v-model="htmlCode"></el-input>
        </el-col>
        <el-col :span="span5" :height='100'>
            <div class="el-textarea">
                <div v-html='htmlRow' class="el-textarea__inner" :style="rowStyle">
                </div>
            </div>
        </el-col>
        <el-col :span="span4" :height='100'>
            <div class="el-textarea">
                <div v-html='htmlNumber' class="el-textarea__inner" :style="rowStyle">
                </div>
            </div>
        </el-col>
        <el-col :span="span3" :height='100'>
            <div class="el-textarea">
                <div v-html='htmlName' class="el-textarea__inner" :style="rowStyle">
                </div>
            </div>
        </el-col>
        <el-col :span="span2" :height='100'>
            <div class="el-textarea">
                <div v-html='htmlTeamDate' class="el-textarea__inner" :style="rowStyle">
                </div>
            </div>
        </el-col>
        <el-col :span="span2" :height='100'>
            <div class="el-textarea">
                <div v-html='htmlFaHuoDate' class="el-textarea__inner" :style="rowStyle">
                </div>
            </div>
        </el-col>
    </el-row>
    <el-button type="primary" @click='submit'>查找</el-button>
    <div v-show='false' id="pddOrder" v-html="htmlCode">
        
    </div>
  </div>
</template>
<script>
  import PbcUtils from '@/common/PbcUtils'
  import api from '@/API'
    export default {
        data(){
            return {
                span1: 7,
                span2: 4,
                span3: 4,
                span4: 4,
                span5: 1,
                htmlCode: '',
                htmlName: '',
                htmlNumber: '',
                htmlTeamDate: '',
                htmlFaHuoDate: '',
                htmlRow: '',
                title4: '',
                title3: '',
                title2: '',
                title1: '',
                rowStyle: "overflow-y:auto;height:520px;"
            }
        },
        methods: {
            submit(){
                var content = document.getElementsByClassName("o-o-t-l-content");
                if(content && content.length == 1){
                    var list = content[0].getElementsByClassName("o-o-t-l-c-list");
                    if(list && list.length > 1){
                        this.htmlName = "";
                        this.htmlNumber = "";
                        this.htmlTeamDate = "";
                        this.htmlFaHuoDate = "";
                        this.htmlRow = "";
                        let row = 0;
                        let numSum = 0;
                        let nameSum = 0;
                        let teamDateSum = 0;
                        let faHuoDateSum = 0;
                        for(var b = 0 ; b < list.length; b++){
                            var table = list[b].getElementsByClassName("o-o-t-l-c-l-table-title");
                            if(table && table.length == 1){
                                var lis = table[0].getElementsByTagName("li");
                                row ++ ;
                                this.htmlRow =  this.htmlRow + row + "<br/>";
                                if(lis[0].innerText){
                                    this.htmlNumber = this.htmlNumber + lis[0].innerText.replace("订单编号：","").replace("订单编号:","") + "<br/>";
                                    numSum ++;
                                } else {
                                    this.htmlNumber = this.htmlNumber + "----" + "<br/>";
                                }
                                if(lis[3].innerText){
                                    this.htmlName = this.htmlName + lis[3].innerText.replace("收货人：","").replace("收货人:","") + "<br/>";
                                    nameSum ++;
                                } else {
                                    this.htmlName = this.htmlName + "----" + "<br/>";
                                }
                                if(lis[1].innerText){
                                    this.htmlTeamDate = this.htmlTeamDate + lis[1].innerText.replace("成团时间：","").replace("成团时间:","") + "<br/>";
                                    teamDateSum ++;
                                } else {
                                    this.htmlTeamDate = this.htmlTeamDate + "----" + "<br/>";
                                }
                                if(lis[2].innerText){
                                    this.htmlFaHuoDate = this.htmlFaHuoDate + lis[2].innerText.replace("承诺发货时间：","").replace("承诺发货时间:","") + "<br/>";
                                    faHuoDateSum ++;
                                } else {
                                     this.htmlFaHuoDate = this.htmlFaHuoDate + "----" + "<br/>";
                                }
                            }
                        }
                        this.title4 = "（总数：" + numSum +")"
                        this.title3 = "（总数：" + nameSum +")"
                        this.title2 = "（总数：" + teamDateSum +")"
                        this.title1 = "（总数：" + faHuoDateSum +")"
                        return;
                    }
                    this.$message.error("list参数出错！")
                }
                this.$message.error("content参数出错！")
                /*
                if(!this.htmlCode){
                    this.$message.error("内容不能为空！");
                    return;
                }
                let callBack = data => {
                    //this.htmlCode = data.code;
                    this.htmlNumber = data.number;
                    this.htmlName = data.name;
                }
                PbcUtils.requestService({url: api.pddOrder.getOrder, method: "POST", data: {code: this.htmlCode}, callBack});
                */
            }
        }
    }
</script>
<style>
  .div1 .row1.el-row .el-col.el-col-12 .el-textarea .el-textarea__inner{
    height: 100%!important;
    text-decoration:underline;
  }
</style>