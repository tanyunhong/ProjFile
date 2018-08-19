<template>
  <transition name="dialog-fade">
   <div id="HJloading">   
      <div class="HJ-loading__wrapper" :style="windex">
        <div class="el-loading-spinner">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none"/>
          </svg>
          <slot name='content'>
            <div class="HJ-loading_text">{{text}}</div>
          </slot>
        </div>
      </div>
      <div class='HJ-loading_modal' :style="mindex"></div>
   </div>
  </transition>
</template>
<script>
  import PopupManager from 'element-ui/src/utils/popup/popup-manager';
  export default {
    data(){
      return {
        windex: '',
        mindex: ''
      }
    },
    mounted() {
      let m = PopupManager.nextZIndex();
      let w = PopupManager.nextZIndex();
      this.windex = "z-index: " + w + ";"
      this.mindex = "z-index: " + m + ";"
      document.body.appendChild(this.$el);
    },
    destroyed() {
      if (this.$el) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  };
</script>
<style scope>
.HJ-loading__wrapper{
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow: auto;
  margin: 0;
}
.HJ-loading_modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
}
.HJ-loading_body{
  padding: 10px 10px;
  color: #48576a;
}
.HJ-loading_text{
  color: #20a0ff;
  margin: 3px 0;
  font-size: 16px;
}
.el-loading-spinner i {
    color: #409eff;
}
</style>
