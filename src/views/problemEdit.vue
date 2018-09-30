<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear indeterminate query v-if="showProgressBar"/>
        <v-card-title class="headline" v-text="$t('edit_problem')"/>
        <v-card-text v-if="loaded">
          <v-text-field :label="$t('title')" v-model="problem.title"/>
          <v-textarea :label="$t('content')" v-model="problem.content"/>
          <v-combobox v-model="problem.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
          <v-divider/>
          <div class="headline" v-text="$t('files')"/>
          <z-array-editor v-model="problem.files" textProp="filename" :hint="$t('input_filename')" queryURL="/api/file/list">
            <template slot="items" slot-scope="data">
              <file :id="data.value"/>
            </template>
          </z-array-editor>
          <div class="headline" v-text="$t('data_config')"/>
          <json-editor v-model="problem.data" :valid.sync="dataValid"/>
          <v-divider/>
          <div class="headline" v-text="$t('meta')"/>
          <json-editor v-model="problem.meta" :valid.sync="metaValid"/>
          <!-- Access Control -->
          <div class="headline" v-text="$t('can_read')"/>
          <v-divider/>
          <z-access-control-editor v-model="problem.allowedRead"/>
          <div class="headline" v-text="$t('can_modify')"/>
          <v-divider/>
          <z-access-control-editor v-model="problem.allowedModify"/>
          <div class="headline" v-text="$t('can_submit')"/>
          <v-divider/>
          <z-access-control-editor v-model="problem.allowedSubmit"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn flat v-text="$t('return')" @click="$router.push(`/problem/show/${problem._id}`)" v-if="id"/>
          <v-btn flat color="primary" v-text="$t('save')" @click="save"/>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { getURL, post, get } from "../httphelper";
import jsonEditor from "../components/jsonEditor";
import zAccessControlEditor from "../components/zAccessControlEditor";
import zArrayEditor from "../components/zArrayEditor";
import file from "../components/file";

export default {
  name: "problemEditView",
  components: {
    jsonEditor,
    zAccessControlEditor,
    zArrayEditor,
    file
  },
  props: {
    id: String
  },
  data() {
    return {
      problem: {
        title: "",
        content: "",
        data: {
          version: "1.0"
        },
        meta: {
          version: "1.0"
        },
        tags: [],
        files: [],
        allowedRead: [],
        allowedModify: [],
        allowedSubmit: []
      },
      showProgressBar: false,
      loaded: false,
      showSnackbar: false,
      snackbarText: "",
      dataValid: true,
      metaValid: true
    };
  },
  async created() {
    if (this.id) {
      const fetchURL = getURL(`/api/problem/${this.id}`, {});
      this.problem = await get(fetchURL);
    }
    this.loaded = true;
  },
  methods: {
    async save() {
      if (!this.dataValid) {
        this.showSnackbar = true;
        this.snackbarText = this.$t("invalid", [this.$t("data")]);
        return;
      }
      if (!this.metaValid) {
        this.showSnackbar = true;
        this.snackbarText = this.$t("invalid", [this.$t("meta")]);
        return;
      }
      this.showProgressBar = true;
      let updateURL = null;
      if (this.id) {
        updateURL = getURL(`/api/problem/${this.id}`, {});
      } else {
        updateURL = getURL(`/api/problem/new`, {});
      }
      const result = await post(updateURL, this.problem);
      this.showProgressBar = false;
      if (!this.id) {
        this.$router.push(`/problem/edit/${result}`);
      } else {
        this.showSnackbar = true;
        this.snackbarText = this.$t("problem_updated");
        this.loaded = false;
        const fetchURL = getURL(`/api/problem/${this.id}`, {});
        this.problem = await get(fetchURL);
        this.loaded = true;
      }
    }
  }
};
</script>
