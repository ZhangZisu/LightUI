<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="loading" indeterminate/>
        <v-card-text class="headline" v-text="$t('create_file')"/>
        <v-card-text>
          <v-text-field v-model="file.filename" :label="$t('filename')"/>
          <v-text-field v-model="file.description" :label="$t('description')"/>
          <monaco-editor class="editor" v-model="file.content"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="info" v-text="$t('submit')" @click="submit"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import MonacoEditor from "vue-monaco";
import { getURL, post } from "../httphelper";

export default {
  name: "fileNewView",
  components: {
    MonacoEditor
  },
  props: ["filename", "description"],
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
    }
  }
};
</script>

<style lang="stylus" scoped>
.editor
  height 500px
</style>
