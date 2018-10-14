<template>
  <v-container>
    <v-flex wrap>
      <v-card class="fill">
        <v-toolbar>
          <v-toolbar-items>
            <v-btn flat v-text="$t('edit')" :disabled="!loaded || view === 0" @click="view = 0"/>
            <v-btn flat v-text="$t('data')" :disabled="!loaded || view === 1" @click="view = 1"/>
            <v-btn flat v-text="$t('access')" :disabled="!loaded || view === 2" @click="view = 2"/>
          </v-toolbar-items>
          <v-spacer/>
          <v-toolbar-items>
            <v-menu offset-y>
              <v-btn flat slot="activator" v-text="$t('auto_generate')" />
              <v-list>
                <v-list-tile @click="generateTraditional">
                  <v-list-tile-title v-text="$t('traditional')" />
                </v-list-tile>
                <v-list-tile @click="generateDirect">
                  <v-list-tile-title v-text="$t('direct')" />
                </v-list-tile>
                <v-list-tile @click="generateVirtual">
                  <v-list-tile-title v-text="$t('virtual')" />
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-btn flat v-text="$t('show')" @click="$router.push(`/problem/show/${problem._id}`)" :disabled="!id"/>
            <v-btn flat v-text="$t('save')" @click="save"/>
          </v-toolbar-items>
        </v-toolbar>
        <v-progress-linear indeterminate query v-if="showProgressBar"/>
        <template v-if="loaded">
          <template v-if="view === 0">
            <v-card-text>
              <v-text-field :label="$t('title')" v-model="problem.title"/>
              <z-markdown-editor v-model="problem.content"/>
              <v-combobox v-model="problem.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
            </v-card-text>
          </template>
          <template v-if="view === 1">
            <v-container fluid fill-height align-content-start>
              <v-flex sm3 align-start>
                <v-card-text style="overflow: scroll">
                  <z-file-editor v-model="problem.fileIDs"/>

                </v-card-text>
              </v-flex>
              <v-flex sm9>
                <v-card-text>
                  <json-editor v-model="problem.data" :valid.sync="dataValid"/>
                </v-card-text>
              </v-flex>
            </v-container>
          </template>
          <template v-if="view === 3">
          </template>
        </template>
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
import zFileEditor from "../components/zFileEditor";
import zMarkdownEditor from "../components/zMarkdownEditor";
import file from "../components/file";

const programExts = ["c", "cpp", "java", "js"];
const testcaseExts = ["in", "out", "ans"];

export default {
  name: "problemEditView",
  components: {
    jsonEditor,
    zFileEditor,
    zMarkdownEditor,
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
        channel: "",
        tags: [],
        fileIDs: [],
        created: null,
        ownerID: "",
        groupID: "",
        permission: 0
      },
      showProgressBar: false,
      loaded: false,
      showSnackbar: false,
      snackbarText: "",
      dataValid: true,
      view: 0
    };
  },
  async created() {
    if (this.id) {
      const fetchURL = getURL(`/api/problem/${this.id}`, {});
      this.problem = await get(fetchURL);
      this.$store.commit(
        "updateTitle",
        this.$t("title_problem_edit", [this.problem.title])
      );
    } else {
      this.$store.commit("updateTitle", this.$t("new_problem"));
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
    },
    async generateDirect() {
      this.problem.data = {
        version: "1.0",
        judgerFile: 0,
        testcases: []
      };
      this.problem.channel = "direct";
    },
    async generateTraditional() {
      try {
        this.showSnackbar = true;
        this.snackbarText = this.$t("fetching_file_info");
        let esmated = {};
        let judgerFile = 0;
        for (let i in this.problem.fileIDs) {
          const file = this.problem.fileIDs[i];
          const url = getURL(`/api/file/${file}/summary`, {});
          const result = await get(url);
          const filename = result.filename;
          const fullname = filename.substring(0, filename.lastIndexOf("."));
          const extname = filename.substring(
            filename.lastIndexOf(".") + 1,
            filename.length
          );
          if (testcaseExts.includes(extname)) {
            if (!esmated[fullname]) esmated[fullname] = {};
            esmated[fullname][extname] = i;
          }
          if (programExts.includes(extname)) {
            judgerFile = i;
          }
        }
        const subtaskmap = {};
        let count = 0;
        for (let name in esmated) {
          const pos = name.indexOf("_");
          const subtaskname = ~pos ? name.substring(0, pos) : "_default_";
          if (!subtaskmap[subtaskname]) {
            subtaskmap[subtaskname] = [];
            count++;
          }
          subtaskmap[subtaskname].push({
            input: esmated[name]["in"],
            output: esmated[name]["out"] || esmated[name]["ans"]
          });
        }
        const subtasks = [];
        for (let name in subtaskmap) {
          subtasks.push({
            name,
            score: 100 / count,
            testcases: subtaskmap[name],
            autoSkip: true,
            timeLimit: 1000,
            memoryLimit: 512 * 1024 * 1024
          });
        }
        this.problem.data = {
          version: "1.0",
          judgerFile,
          subtasks
        };
        this.problem.channel = "traditional";
      } catch (e) {
        this.showSnackbar = true;
        this.snackbarText = e.message;
      }
    },
    async generateVirtual() {
      if (confirm(this.$t("this_operation_will_rewrite_data"))) {
        const origin = prompt(this.$t("remote_oj"));
        const problemID = prompt(this.$t("remote_problem_id"));
        this.problem.data = {
          version: "1.0",
          origin,
          problemID
        };
        this.problem.channel = "virtual";
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.fill
  height 100%
  overflow hidden
</style>
