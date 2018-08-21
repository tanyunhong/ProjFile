<template>
  <span :class="className">{{buttonText}}</span>
</template>

<script>
  import ImageIcon from './ImageIcon'
  export default{
    props: {
      name: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'small'
      },
      source: {
        type: String,
        default: 'image'
      },
      content: {
        type: String
      },
      showContent: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      className(){
        if (this.source === 'image') {
          return this.getImageClassName({
            iconName: this.name,
            disabled: this.disabled,
            size: this.size
          })
        } else {
          return ''
        }
      },
      buttonText(){
        if (this.showContent) {
          if (this.content) {
            return this.content
          } else {
            return this.name
          }
        } else {
          return ''
        }
      }
    },
    methods: {
      /**
       * 查询图标类名
       * @author freedom wang
       * @date 2017-08-29
       * @since 1.0
       */
      getImageClassName (data) {
        let icons = ImageIcon.icons
        for (let i = 0; i < icons.length; i++) {
          if (icons[i].iconName === data.iconName && icons[i].disabled === data.disabled && icons[i].size === data.size) {
            return icons[i].className
          }
        }
        return ''
      }
    }
  }
</script>

<style>
</style>
