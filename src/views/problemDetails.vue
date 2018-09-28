<template>
  <v-container>
    <v-flex>
      <v-card v-if="loaded">
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title>
          <div>
            <div class="headline" v-text="problem.title"/>
            <div class="subheading">
              {{$t('createdat', [problem.created])}} {{$t('by')}} <user :id="problem.owner"/>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <article class="markdown-body" v-html="render(problem.content)"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn flat v-text="$t('more_info')" @click="dialog = true"/>
          <v-btn v-if="problem.data.type" flat color="primary" v-text="$t('submit')" :to="'/solution/new?id=' + problem._id + '&type=' + problem.data.type"/>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog" max-width="80%">
      <v-card v-if="loaded">
        <v-card-title>
          <div>
            <div class="headline" v-text="$t('problem_information')"/>
            <div class="subheading" v-text="problem._id"/>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="subheading" v-text="$t('data_config')"/>
          <json-editor v-model="problem.data" :readonly="true"/>
          <div class="subheading" v-text="$t('tags')"/>
          <v-chip label v-for="tag in problem.tags" :key="tag" v-text="tag"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_read')"/>
          <ace label v-for="ace in problem.allowedRead" :id="ace" :key="`ar_${ace}`"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_modify')"/>
          <ace label v-for="ace in problem.allowedModify" :id="ace" :key="`am_${ace}`"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_submit')"/>
          <ace label v-for="ace in problem.allowedSubmit" :id="ace" :key="`as_${ace}`"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn :to="'/problem/edit/' + problem._id" v-text="$t('edit')"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import user from "../components/user";
import ace from "../components/ace";
import jsonEditor from "../components/jsonEditor";
import { getURL, get } from "../httphelper";
import render from "../markdown";

export default {
  name: "problemDetailsView",
  components: {
    user,
    ace,
    jsonEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      problem: {
        content: "",
        tags: [],
        data: {},
        title: "",
        owner: "",
        created: "",
        allowedRead: [],
        allowedModify: [],
        allowedSubmit: []
      },
      loaded: false,
      dialog: false,
      showProgressBar: true
    };
  },
  async created() {
    const url = getURL(`/api/problem/${this.id}`);
    const problem = await get(url);
    this.problem = problem;
    this.loaded = true;
    this.showProgressBar = false;
  },
  methods: {
    async submit() {
      this.dialog = false;
    },
    render: render
  }
};
</script>
