<template>
  <v-container>
    <v-flex>
      <v-card flat>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('new_solution')"/>
        <v-card-text>
          <v-text-field :label="$t('problem_id')" v-model="problemID" readonly/>
          <z-array-editor v-model="files" textProp="filename" :hint="$t('input_filename')" queryURL="/api/file/list">
            <template slot="items" slot-scope="data">
              <file :id="data.value"/>
            </template>
          </z-array-editor>
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
import file from "../components/file";
import zArrayEditor from "../components/zArrayEditor";

export default {
  name: "solutionNewView",
  components: {
    file,
    zArrayEditor
  },
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
    }
  }
};
</script>
