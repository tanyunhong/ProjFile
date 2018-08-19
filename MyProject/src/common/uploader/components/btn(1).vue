<template>
  <button class="uploader-btn" :style="btnStyle" ref="btn" v-show="support">
    <slot></slot>
  </button>
</template>

<script>
import { uploaderMixin, supportMixin } from "../common/mixins";
import { assignBrowse } from "../common/utils";
const COMPONENT_NAME = "uploader-btn";

export default {
  name: COMPONENT_NAME,
  mixins: [uploaderMixin, supportMixin],
  props: {
    directory: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    },
    attrs: {
      type: Object,
      default() {
        return {};
      }
    },
    btnStyle: {
      type: String,
      default: ""
    }
  },
  mounted() {
    this.$nextTick(() => {
      assignBrowse(this.$refs.btn, this.directory, this.single, this.attrs, this.uploader);
    });
  },
  updated() {
    this.$nextTick(() => {
      assignBrowse(this.$refs.btn, this.directory, this.single, this.attrs, this.uploader);
    });
  }
};
</script>

<style>
.uploader-btn {
  position: relative;
  padding: 4px 8px;
  font-size: 100%;
  line-height: 1.4;
  color: #666;
  border: 1px solid #666;
  cursor: pointer;
  border-radius: 2px;
  background: none;
  outline: none;
}
.uploader-btn:hover {
  background-color: rgba(0, 0, 0, 0.08);
}
</style>
