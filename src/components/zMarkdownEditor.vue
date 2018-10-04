<template>
  <div>
    <div class="z-markdown-editor-main" v-if="view === 1">
      <div class="z-markdown-editor-left">
        <editor v-model="content" lang="markdown" height="500" @init="editorInit"/>
      </div>
      <div class="z-markdown-editor-right">
        <article id="rendered" class="markdown-body" v-html="rendered"/>
      </div>
    </div>
    <div v-else-if="view === 0">
      <editor v-model="content" lang="markdown" height="500" @init="editorInit"/>
    </div>
    <div v-else>
      <div class="z-markdown-editor-preview">
        <article id="rendered" class="markdown-body" v-html="rendered"/>
      </div>
    </div>
    <v-menu :close-on-content-click="false" offset-x>
      <v-btn slot="activator" color="info" v-text="$t('operations')"/>
      <v-card>
        <v-card-text>
          <v-slider v-model="view" :tick-labels="ticksLabels" :max="2" step="1" ticks="always"/>
          <v-btn color="info" v-text="$t('export_to_pdf')" @click="pdf" :disabled="view === 0"/>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import Editor from "vue2-ace-editor";
import render from "../markdown";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
      view: 1,
      ticksLabels: [this.$t("editor"), this.$t("both"), this.$t("preview")]
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
    },
    pdf() {
      html2canvas(document.getElementById("rendered"), {
        background: "#fff",
        allowTaint: true
      }).then(canvas => {
        let imgData = canvas.toDataURL("image/jpeg");
        let img = new Image();
        img.src = imgData;
        img.onload = function() {
          let doc = null;
          if (this.width > this.height) {
            doc = new jsPDF("l", "mm", [
              this.width * 0.225,
              this.height * 0.225
            ]);
          } else {
            doc = new jsPDF("p", "mm", [
              this.width * 0.225,
              this.height * 0.225
            ]);
          }
          doc.addImage(
            imgData,
            "jpeg",
            0,
            0,
            this.width * 0.225,
            this.height * 0.225
          );
          doc.save("export.pdf");
        };
      });
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

.z-markdown-editor-preview
  height 500px
  overflow scroll
</style>
