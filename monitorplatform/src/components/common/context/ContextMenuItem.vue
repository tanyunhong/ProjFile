<template>
  <li
    class="context-menu-item"
    @click="onClick"
    @contextmenu.prevent
    :class="{disabled:disabled,'ctx-item':!header,'ctx-header':header,'context-menu-item-header':header}">
    <span class="context-menu-item-img">
      <icon :name="itemName" :showContent="false" :disabled="disabled" v-if="!useCustomIcon"></icon>
      <template v-else>
        <slot></slot>
      </template>
    </span>
    <span class="context-menu-item-name">
      {{itemName}}
    </span>
  </li>
</template>

<script>
  export default {
    props: {
      itemName: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      header: {
        type: Boolean,
        default: false
      },
      customIcon: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      /**
       * 是否显示自定义按钮
       * @author freedom wang
       * @date 2017-08-30
       * @since 1.0
       */
      useCustomIcon(){
        if (this.customIcon) {
          return this.customIcon
        } else {
          if (this.$slots.default) {
            return true
          } else {
            return false
          }
        }
      }
    },
    methods: {
      onClick(e){
        if (!this.disabled) {
          this.$emit('itemClick', e)
        }
      }
    }
  }
</script>

<style>
  .context-menu-item.ctx-item {
    cursor: pointer;
    font-size: 12px;
  }

  .context-menu-item.ctx-header {
    /* cursor: pointer; */
    padding-left: 0;
    font-size: 12px;
  }

  .context-menu-item-header {
    cursor: default;
  }

  .context-menu-item-img {
    padding-left: 5px;
    display: inline-block;
    width: 22px;
    vertical-align: middle;
  }

  .context-menu-item-img img {
    width: 16px;
    height: 16px;
    border: 0px;
  }

  .context-menu-item-img span {
    background-position: center;
  }

</style>
