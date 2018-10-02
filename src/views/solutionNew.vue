<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('new_solution')"/>
        <v-card-text>
          <v-text-field :label="$t('problem_id')" v-model="problemID" readonly/>
          <z-file-editor v-model="files"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-menu offset-y>
            <v-btn slot="activator" v-text="$t('new')"/>
            <v-list>
              <v-list-tile to="/file/new">
                <v-list-tile-title v-text="$t('editor')"/>
              </v-list-tile>
              <v-list-tile to="/file/upload">
                <v-list-tile-title v-text="$t('upload')"/>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-btn depressed color="info" v-text="$t('submit')" @click="submit"/>
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
import zFileEditor from "../components/zFileEditor";

export default {
  name: "solutionNewView",
  components: {
    file,
    zFileEditor
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
