<template>
    <v-container>
        <v-flex>
            <v-card>
                <v-card-text class="headline" v-text="$t('problems')"/>
                <v-card-text>
                    <v-list three-line>
                        <v-list-tile v-for="(problem, i) in problems" :key="i" :to="'/problem/show/' + problem._id">
                            <v-list-tile-content>
                                <v-list-tile-title v-text="problem.title"/>
                                <v-list-tile-sub-title v-text="problem._id"/>
                                <v-list-tile-sub-title>
                                    {{$t('createdat', [problem.created])}} by <user :id="problem.owner"/>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-list-tile-action-text>
                                    {{ problem.tags.join(',') }}
                                </v-list-tile-action-text>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-pagination v-model="page" :length="allPages"></v-pagination>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-container>
</template>

<script>
import user from "../components/user";
import { getURL, get, getPURL } from "../httphelper";
const itemPerPage = 25;

export default {
  name: "problemView",
  components: {
    user
  },
  props: {
    owner: String,
    search: String,
    type: String
  },
  data() {
    return {
      page: 1,
      allPages: 1,
      problems: []
    };
  },
  async created() {
    const query = { owner: this.owner, search: this.search, type: this.type };
    const countURL = getURL("/api/problem/count", query);
    const count = await get(countURL);
    const allPages = Math.floor((count + itemPerPage - 1) / itemPerPage);
    this.allPages = allPages;
    const fetchURL = getPURL("/api/problem/list", query, itemPerPage, 1);
    const problems = await get(fetchURL);
    this.problems = problems;
  },
  methods: {
    //
  },
  watch: {
    page: async function(page) {
      const query = { owner: this.owner, search: this.search, type: this.type };
      const fetchURL = getPURL("/api/problem/list", query, itemPerPage, page);
      const problems = await get(fetchURL);
      this.problems = problems;
    }
  }
};
</script>
