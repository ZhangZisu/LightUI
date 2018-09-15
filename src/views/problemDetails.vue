<template>
  <v-container>
    <v-flex>
      <v-card v-if="loaded">
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title>
          <div>
            <div class="headline" v-text="problem.title"/>
            <div class="subheading">
              {{$t('createdat', [problem.created])}} by <user :id="problem.owner"/>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          {{ problem.content }}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn flat v-text="$t('more_info')" @click="dialog = true"/>
          <v-btn flat color="primary" v-text="$t('submit')" :to="'/solution/new?id=' + problem._id"/>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog" max-width="640">
      <v-card v-if="loaded">
        <v-card-title>
          <div>
            <div class="headline" v-text="$t('problem_information')"/>
            <div class="subheading" v-text="problem._id"/>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="subheading" v-text="$t('data_config')"/>
          <JsonEditor :objData="problem.data" :key="dialog"/>
          <div class="subheading" v-text="$t('tags')"/>
          <v-chip label v-for="(tag, i) in problem.tags" :key="i" v-text="tag"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn flat :to="'/problem/edit/' + problem._id" v-text="$t('edit')"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import user from "../components/user";
import { getURL, get } from "../httphelper";

export default {
  name: "problemDetailsView",
  components: {
    user
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
        created: ""
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
    }
  }
};
</script>
