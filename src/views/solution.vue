<template>
  <v-container>
    <v-flex>
      <v-card flat>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-text class="headline" v-text="$t('solutions')"/>
        <v-card-text>
          <v-list three-line>
            <v-list-tile v-for="(solution, i) in solutions" :key="i" :to="'/solution/show/' + solution._id">
            <v-list-tile-content>
              <v-list-tile-title v-text="solution._id"/>
              <v-list-tile-sub-title>
                {{$t('status')}}: {{solution.status}}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title>
                {{$t('createdat', [solution.created])}} by <user :id="solution.owner"/>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>
                <problem :id="solution.problemID"/>
              </v-list-tile-action-text>
            </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-pagination v-model="page" :length="allPages"/>
          <v-spacer/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import user from "../components/user";
import problem from "../components/problem";
import { getURL, get, getPURL } from "../httphelper";
const itemPerPage = 25;

export default {
  name: "solutionView",
  components: {
    user,
    problem
  },
  props: {
    owner: String,
    problemID: String,
    status: String
  },
  data() {
    return {
      page: 1,
      allPages: 1,
      solutions: [],
      showProgressBar: true
    };
  },
  async created() {
    const query = {
      owner: this.owner,
      problemID: this.problemID,
      status: this.status
    };
    const countURL = getURL("/api/solution/count", query);
    const count = await get(countURL);
    this.allPages = Math.floor((count + itemPerPage - 1) / itemPerPage);
    const fetchURL = getPURL("/api/solution/list", query, itemPerPage, 1);
    this.solutions = await get(fetchURL);
    this.showProgressBar = false;
  },
  watch: {
    page: async function(page) {
      const query = {
        owner: this.owner,
        problemID: this.problemID,
        status: this.status
      };
      const fetchURL = getPURL("/api/solution/list", query, itemPerPage, page);
      this.solutions = await get(fetchURL);
    }
  }
};
</script>
