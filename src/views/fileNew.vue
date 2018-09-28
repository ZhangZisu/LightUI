<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="loading" indeterminate/>
        <v-card-text class="headline" v-text="$t('create_file')"/>
        <v-card-text>
          <v-text-field v-model="file.filename" :label="$t('filename')"/>
          <v-text-field v-model="file.description" :label="$t('description')"/>
          <editor v-model="file.content" :lang="lang" height="500" @init="editorInit"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" v-text="$t('submit')" @click="submit"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import Editor from "vue2-ace-editor";
import { getURL, post } from "../httphelper";

export default {
  name: "fileNewView",
  components: {
    editor: Editor
  },
  props: ["filename", "description", "lang"],
  data() {
    return {
      file: {
        content: "",
        filename: "",
        description: ""
      },
      loading: false
    };
  },
  created() {
    this.file.filename =
      this.filename || "untitled " + new Date().toLocaleString();
    this.file.description = this.description || "No description";
  },
  methods: {
    async submit() {
      const url = getURL("/api/file/create", {});
      try {
        const id = await post(url, this.file);
        this.$router.push("/file/show/" + id);
      } catch (e) {
        //
      }
    },
    editorInit() {
      require("brace/ext/language_tools");
      require("brace/ext/beautify");
      require("brace/ext/searchbox");
      require("brace/mode/html");
      require("brace/mode/javascript");
      require("brace/mode/markdown");
      require("brace/theme/chrome");
      require("brace/snippets/javascript");
    }
  }
};
</script>
