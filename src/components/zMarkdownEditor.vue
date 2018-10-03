<template>
  <div>
    <div class="z-markdown-editor-main" v-if="showPreview">
      <div class="z-markdown-editor-left">
        <editor v-model="content" lang="markdown" height="500" @init="editorInit"/>
      </div>
      <div class="z-markdown-editor-right">
        <article class="markdown-body" v-html="rendered"/>
      </div>
    </div>
    <div v-else>
      <editor v-model="content" lang="markdown" height="500" @init="editorInit"/>
    </div>
    <v-switch v-model="showPreview" :label="$t('preview')"/>
  </div>
</template>

<script>
import Editor from "vue2-ace-editor";
import render from "../markdown";

export default {
  name: "zMarkdownEditor",
  components: {
    editor: Editor
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  model: {
    prop: "value",
    event: "updateValue"
  },
  data() {
    return {
      content: "",
      rendered: "",
      showPreview: true
    };
  },
  created() {
    this.content = this.value;
    this.rendered = render(this.content);
  },
  watch: {
    content(val) {
      this.$emit("updateValue", val);
      this.rendered = render(val);
    }
  },
  methods: {
    editorInit() {
      require("brace/ext/language_tools");
      require("brace/ext/beautify");
      require("brace/ext/searchbox");
      require("brace/mode/markdown");
      require("brace/theme/chrome");
    }
  }
};
</script>

<style lang="stylus" scoped>
.z-markdown-editor-main
  height 500px

.z-markdown-editor-left
  width 50%
  float left
  height 500px
  border-right 1px solid #c1c1c1

.z-markdown-editor-right
  width 50%
  float left
  height 500px
  overflow scroll
  border-left 1px solid #c1c1c1
</style>
