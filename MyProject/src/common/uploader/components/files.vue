<template>
  <div class="uploader-files" :style='fileStyle'>
    <div class="uploader-end-count">
      {{endCountMsg}}
    </div>
    <slot :files="files">
      <ul>
        <li v-for="file in files" :key="file.id">
          <uploader-file :file="file"></uploader-file>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script>
import UploaderFile from "./file.vue";

const COMPONENT_NAME = "uploader-files";

export default {
  name: COMPONENT_NAME,
  props: {
    fileStyle: {
      type: String,
      default: ""
    },
    endCountMsg: {
      type: String,
      default: ""
    }
  },
  computed: {
    files() {
      return this.$parent.files;
    },
    showEndCount() {
      return this.endCountMsg !== "";
    }
  },
  components: {
    UploaderFile
  }
};
</script>

<style>
.uploader-files {
  position: relative;
}
.uploader-files > ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.uploader-end-count {
  padding: 0 15px;
  color: #20a0ff;
  line-height: 36px;
}
</style>
