<template>
  <v-container>
    <v-flex>
      <v-card flat>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('users')"/>
        <v-card-text>
          <v-list three-line>
            <v-list-tile v-for="(user, i) in users" :key="i" :to="`/user/show/${user._id}`">
              <v-list-tile-content>
                <v-list-tile-title v-text="user.username"/>
                <v-list-tile-sub-title v-text="user._id"/>
                <v-list-tile-sub-title v-text="$t('user_info', [user.realname, user.email])"/>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>
                  <v-chip v-for="(role, j) in user.roles" :key="`${i}-${j}`">
                    <role :id="role"/>
                  </v-chip>
                </v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-pagination v-model="page" :length="allPages"/>
          <v-spacer/>
          <v-btn color="primary" depressed v-text="$t('new')"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, get, getPURL } from "../httphelper";
import role from "../components/role.vue";
const itemsPerPage = 25;

export default {
  name: "userView",
  components: {
    role
  },
  data() {
    return {
      page: 1,
      allPages: 1,
      users: [],
      showProgressBar: true
    };
  },
  async mounted() {
    const query = {};
    const countURL = getURL("/api/user/count", query);
    const count = await get(countURL);
    this.allPages = Math.floor((count + itemsPerPage - 1) / itemsPerPage);
    const fetchURL = getPURL("/api/user/list", query, itemsPerPage, 1);
    this.users = await get(fetchURL);
    this.showProgressBar = false;
  },
  watch: {
    async page(val) {
      this.showProgressBar = true;
      const query = {};
      const fetchURL = getPURL("/api/user/list", query, itemsPerPage, val);
      this.users = await get(fetchURL);
      this.showProgressBar = false;
    }
  }
};
</script>
