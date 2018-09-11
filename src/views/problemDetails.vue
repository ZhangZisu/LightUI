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
            </v-card>
        </v-flex>
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
      loaded: false
    };
  },
  async created() {
    const url = getURL(`/api/problem/${this.id}`);
    const problem = await get(url);
    this.problem = problem;
    this.loaded = true;
  }
};
</script>
