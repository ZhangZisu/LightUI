<template>
  <v-container>
    <v-card>
      <v-progress-linear v-if="loading" indeterminate query/>
      <v-card-title class="headline" v-text="$t('edit_role')"/>
      <v-card-text v-if="!loading">
        <v-text-field v-model="role.rolename" :label="$t('rolename')"/>
        <v-text-field v-model="role.description" :label="$t('description')"/>
        <json-editor v-model="role.config" :valid.sync="valid"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn v-text="$t('cancel')" @click="$router.push(-1)"/>
          <v-btn color="primary" v-text="$t('save')" @click="save" :disabled="loading || !valid"/>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import jsonEditor from "../components/jsonEditor";
import { getURL, get, post } from "../httphelper";

export default {
  name: "roleDetails",
  components: {
    jsonEditor
  },
  props: {
    roleID: String
  },
  data() {
    return {
      role: {
        _id: "",
        rolename: "",
        description: "",
        config: {}
      },
      loading: true,
      valid: true
    };
  },
  async mounted() {
    const url = getURL(`/api/role/${this.roleID}`);
    this.role = await get(url);
    this.loading = false;
  },
  methods: {
    async save() {
      this.loading = true;
      const url = getURL(`/api/role/${this.roleID}`);
      try {
        await post(url, this.role);
      } catch (e) {
        //
      }
      this.loading = false;
    }
  }
};
</script>
