<template>
    <div>
			<el-row class='row1'>
					<el-col :span="12">
							<label style='color:red'>输入代码：</label>
					</el-col>
					<el-col :span="12">					
							<label style='color:red'>{{this.imageTitle}}</label>
					</el-col>
			</el-row>
			<el-row class='row2'>
					<el-col :span="12" :height='100'>
						<el-input type="textarea" :rows="24" placeholder="请输入内容" v-model="imageCode"></el-input>
					</el-col>
					<el-col :span="12" :height='100'>					
						<div>
							<img border="0" :src="imageUrl" alt="照片" style='height: 512px;width: 100%;'>
						</div>
					</el-col>
			</el-row>
			<el-button type="primary" @click='upImage'>上一张</el-button>
			<el-button type="primary" @click='findImage'>查找</el-button>
			<el-button type="primary" @click='downImage'>下一张</el-button>
			<el-button type="primary" @click='download'>下载</el-button>
			<el-button type="primary" @click='nextTickV2'>复制Title</el-button>
			<el-input v-model="downLoadName" id='input' style="width:200px;"></el-input>
			<div v-show='false' id="imageCode" v-html="imageCode"></div>
		</div>
</template>
<script>
  export default{
		data(){
			return {
				index: 1,
				imageTitle: '当前照片：',
				imageCode: '',
				imageArray: [], //src, name
				imageUrl: "",
				downLoadName: '照片名称'
			}
		},
		mounted(){
			
		},
    methods: {
			nextTickV2(){
				let f = function(){
					$('#input').trigger('select');
					document.execCommand('copy');
				}
				setTimeout(f,100)
			},
			upImage(){
				if(this.imageArray.length === 0){
					this.$message.error("当前没有照片！");
					return;
				}
				if(this.index === 0){
					this.$message.error("当前已是第一张照片！");
					return;
				}
				this.index = this.index - 1;
				this.imageUrl = this.imageArray[this.index].src
				//this.downLoadName = this.imageArray[this.index].name
				this.downLoadName = this.index + 1 + ".jpg";
				this.imageTitle = '共有照片'+this.imageArray.length+'张，当前是第【'+(this.index + 1)+'】张';
				this.nextTickV2();
			},
			downImage(){
				if(this.imageArray.length === 0){
					this.$message.error("当前没有照片！");
					return;
				}
				if(this.index === this.imageArray.length -1 ){
					this.$message.error("当前已是最后一张照片！");
					return;
				}
				this.index = this.index + 1 ; 
				this.imageUrl = this.imageArray[this.index].src
				//this.downLoadName = this.imageArray[this.index].name
				this.downLoadName = this.index + 1 + ".jpg"; 
				this.imageTitle = '共有照片'+this.imageArray.length+'张，当前是第【'+(this.index+1)+'】张';
				this.nextTickV2();
			},
			findImage(){
				if(this.imageCode){
					 var content = document.getElementById('imageCode');
					 var images = content.getElementsByTagName('img');
					 this.imageArray = [];
					 for(let i = 0; i<images.length; i++){
						 let index = images[i].src.lastIndexOf('.');
						 let name = i + '.jpg'
						 if(index > 0){
							 name = i + images[i].src.substring(index)
						 }
						 let image = {src: images[i].src, name: name};
						 this.imageArray[i] = image;
					 }

					 this.imageUrl = this.imageArray[0].src;
					 //this.downLoadName = this.imageArray[0].name;
					 this.downLoadName = "1.jpg";
					 this.index = 0;
					 this.imageTitle = '共有照片'+this.imageArray.length+'张，当前是第【1】张';
					 this.nextTickV2();
				} else {
					this.$message.error("请输入代码！");
				}
			},
			download() {
				if(!this.imageUrl){
					this.$message.error("当前没有照片！");
					return;
				}
				var $a = document.createElement('a');
				$a.setAttribute("href", this.imageUrl);
				$a.setAttribute("download", this.downLoadName);
				var evObj = document.createEvent('MouseEvents');
				evObj.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
				$a.dispatchEvent(evObj);
			}
    }
  }   
</script>