<template>
  <v-container>
    <v-flex>
      <v-card v-if="loaded">
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
          <v-btn flat v-text="$t('more_info')"/>
          <v-btn flat color="primary" v-text="$t('submit')" @click="dialog = true"/>
        </v-card-actions>
      </v-card>
    </v-flex>
        <v-dialog v-model="dialog" max-width="640">
        <v-card>
          <v-card-title>
            <div>
                <div class="headline" v-text="$t('submit_problem')"/>
                <div class="subheading" v-text="problem._id"/>
            </div>
          </v-card-title>
          <v-card-text>
            <!--  -->
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn flat v-text="$t('submit')" @click="submit"/>
            <v-btn flat v-text="$t('cancel')" @click="dialog = false"/>
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
      dialog: false
    };
  },
  async created() {
    const url = getURL(`/api/problem/${this.id}`);
    const problem = await get(url);
    this.problem = problem;
    this.loaded = true;
  },
  methods: {
    async submit() {
      this.dialog = false;
    }
  }
};
</script>
