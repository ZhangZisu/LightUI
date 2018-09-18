<template>
  <v-container>
    <v-flex>
      <v-card flat>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('new_solution')"/>
        <v-card-text>
          <v-text-field :label="$t('problem_id')" v-model="problemID" readonly/>
          <v-text-field v-for="(file, i) in files" :key="i" :label="$t('file_id')" v-model="files[i]" append-icon="delete" :append-icon-cb="() => removeFile(i)"/>
          <v-btn flat color="primary" @click="files.push('')" v-text="$t('add_file')"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn depressed color="primary" v-text="$t('submit')" @click="submit"/>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { getURL, post } from "../httphelper";

export default {
  name: "solutionNew",
  props: {
    problemID: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      files: [],
      showProgressBar: false,
      loaded: false,
      showSnackbar: false,
      snackbarText: ""
    };
  },
  methods: {
    async submit() {
      this.showProgressBar = true;
      const submitURL = getURL("/api/solution/new", {});
      const form = { files: this.files, problemID: this.problemID };
      const solutionID = await post(submitURL, form);
      this.showSnackbar = true;
      this.snackbarText = this.$t("solution_created");
      this.$router.push(`/solution/show/${solutionID}`);
    },
    removeFile(index){
      this.files.splice(index, 1);
    }
  }
};
</script>
