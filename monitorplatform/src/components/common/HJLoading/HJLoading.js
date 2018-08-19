import Vue from 'vue'
import HJload from './HJLoading.vue'
export default {
  loadComp: null,
  open: (text = '操作中...') => {
    let Comp = Vue.extend(HJload);
    this.loadComp = new Comp({
      el: document.createElement('div'),
      data: {text}
    });
  }, 
  close: () => {
    if (this.loadComp){
      this.loadComp.$destroy();
    }
  }
}
