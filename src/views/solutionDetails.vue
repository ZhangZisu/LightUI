<template>
  <v-container>
    <v-flex>
      <v-card flat>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title v-if="loaded">
          <div>
            <div class="headline" v-text="$t('solution_details')"/>
            <div class="subheading" v-text="solution._id"/>
          </div>
        </v-card-title>
        <v-card-text v-if="loaded">
          <h4 style="color: grey" v-text="$t('status')"/>
          <pre>{{ solution.status }}</pre>
          <h4 style="color: grey" v-text="$t('result')"/>
          <JsonEditor :objData="solution.result" :key="showSnackbar"/>
        </v-card-text>
        <v-card-actions v-if="loaded">
          <v-spacer/>
          <v-btn depressed v-text="$t('rejudge')" @click="rejudge"/>
          <v-btn depressed color="primary" v-text="$t('refesh')" @click="fetch"/>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { getURL, get, post } from "../httphelper";

export default {
  name: "solutionDetails",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      solution: {
        owner: "",
        problemID: "",
        files: [],
        status: "",
        result: {},
        meta: {},
        created: ""
      },
      showProgressBar: true,
      showSnackbar: false,
      snackbarText: "",
      loaded: false
    };
  },
  async created() {
    const fetchURL = getURL(`/api/solution/${this.id}`);
    this.solution = await get(fetchURL);
    this.loaded = true;
    this.showProgressBar = false;
  },
  methods: {
    async fetch() {
      this.showProgressBar = true;
      this.showSnackbar = true;
      this.snackbarText = this.$t("fetching");
      const fetchURL = getURL(`/api/solution/${this.id}`);
      this.solution = await get(fetchURL);
      this.showSnackbar = true;
      this.snackbarText = this.$t("fetched");
      this.showProgressBar = false;
    },
    async rejudge() {
      this.showProgressBar = true;
      const rejudgeURL = getURL(`/api/solution/${this.id}/rejudge`);
      await post(rejudgeURL);
      this.showProgressBar = false;
    }
  }
};
</script>
