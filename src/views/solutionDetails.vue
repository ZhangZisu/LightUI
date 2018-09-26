<template>
  <v-container>
    <v-flex>
      <v-card flat :key="reversion">
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title v-if="loaded">
          <div>
            <div class="headline" v-text="$t('solution_details')"/>
            <div class="subheading" v-text="solution._id"/>
          </div>
        </v-card-title>
        <v-card-text v-if="loaded">
          <div class="subheading" v-text="$t('status')"/>
          <pre>{{ solution.status }}</pre>
          <v-divider/>
          <div class="subheading" v-text="$t('files')"/>
          <file v-for="(file, i) in solution.files" :key="i" :id="file"/>
          <template v-if="loadedResult">
            <h4 style="color: grey" v-text="$t('result')"/>
            <json-editor v-model="solution.result" :readonly="true"/>
          </template>
          <div class="subheading" v-text="$t('can_read')"/>
          <ace label v-for="ace in solution.allowedRead" :key="`ar_${ace}`" :id="ace"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_read_result')"/>
          <ace label v-for="ace in solution.allowedReadResult" :key="`ars_${ace}`" :id="ace"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_modify')"/>
          <ace label v-for="ace in solution.allowedModify" :key="`am_${ace}`" :id="ace"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_rejudge')"/>
          <ace label v-for="ace in solution.allowedRejudge" :key="`arj_${ace}`" :id="ace"/>
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
import jsonEditor from "../components/jsonEditor.vue";
import ace from "../components/ace";
import file from "../components/file";

export default {
  name: "solutionDetailsView",
  components: {
    jsonEditor,
    ace,
    file
  },
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
        created: "",
        allowedRead: [],
        allowedReadResult: [],
        allowedRejudge: [],
        allowedModify: []
      },
      showProgressBar: true,
      showSnackbar: false,
      snackbarText: "",
      loaded: false,
      loadedResult: false,
      reversion: 0
    };
  },
  async created() {
    const fetchURL = getURL(`/api/solution/${this.id}`);
    this.solution = await get(fetchURL);
    this.loaded = true;
    const resultURL = getURL(`/api/solution/${this.id}/result`);
    this.solution.result = await get(resultURL);
    this.loadedResult = true;
    this.showProgressBar = false;
  },
  methods: {
    async fetch() {
      this.showProgressBar = true;
      this.showSnackbar = true;
      this.snackbarText = this.$t("fetching");
      const fetchURL = getURL(`/api/solution/${this.id}`);
      this.solution = await get(fetchURL);
      const resultURL = getURL(`/api/solution/${this.id}/result`);
      this.solution.result = await get(resultURL);
      this.showSnackbar = true;
      this.snackbarText = this.$t("fetched");
      this.showProgressBar = false;
      this.reversion++;
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
