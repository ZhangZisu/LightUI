<template>
  <v-container>
    <v-flex>
      <v-card flat>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('roles')"/>
        <v-card-text>
          <v-list three-line>
            <v-list-tile v-for="(role, i) in roles" :key="i">
              <v-list-tile-content>
                <v-list-tile-title v-text="role.rolename"/>
                <v-list-tile-sub-title v-text="role._id"/>
                <v-list-tile-sub-title v-text="role.description"/>
              </v-list-tile-content>
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
const itemsPerPage = 25;

export default {
  name: "roleView",
  data() {
    return {
      page: 1,
      allPages: 1,
      roles: [],
      showProgressBar: true
    };
  },
  async mounted() {
    const query = {};
    const countURL = getURL("/api/role/count", query);
    const count = await get(countURL);
    this.allPages = Math.floor((count + itemsPerPage - 1) / itemsPerPage);
    const fetchURL = getPURL("/api/role/list", query, itemsPerPage, 1);
    this.roles = await get(fetchURL);
    this.showProgressBar = false;
  },
  watch: {
    async page(val) {
      this.showProgressBar = true;
      const query = {};
      const fetchURL = getPURL("/api/role/list", query, itemsPerPage, val);
      this.roles = await get(fetchURL);
      this.showProgressBar = false;
    }
  }
};
</script>
