<template>
    <el-button size='small' :class="{'hj-group-button': isOpacity}"  @click='clickHandler' :disabled='disabled'>
      <icon :name="iconName" :showContent='true' :content='buttonText' :disabled='disabled'></icon>
    </el-button>
</template>
<script>
  export default {
    props: {
      //按钮文字
      content: {
        type: String,
        default: this.iconName
      },
      //按钮图标名称
      iconName: {
        type: String,
        required: true
      },
      //按钮是否显示
      disabled: {
        type: Boolean,
        default: false
      },
      /**是否设置透明 */
      isOpacity: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      buttonText(){
        if (this.content) {
          return this.content
        } else {
          return this.iconName
        }
      }
    },
    methods: {
      clickHandler(){
        this.$emit('iconClick')
      }
    }
  }
</script>



// WEBPACK FOOTER //
// src/components/common/IconButton.vue