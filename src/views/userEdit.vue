<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="loading" indeterminate query/>
        <v-card-title class="headline" v-text="$t('edit_user')"/>
        <v-card-text>
          <div class="subheading" v-text="$t('basic')"/>
          <v-text-field v-model="user.username" :label="$t('username')" readonly/>
          <v-text-field v-model="user.realname" :label="$t('realname')"/>
          <v-text-field v-model="user.email" :label="$t('email')"/>
          <v-text-field v-model="user.bio" :label="$t('bio')"/>
          <div class="subheading" v-text="$t('roles')"/>
          <z-array-editor v-model="user.roles" textProp="rolename" :hint="$t('input_rolename')" queryURL="/api/role/list" v-if="!loading">
            <template slot="items" slot-scope="data">
              <role :id="data.value"/>
            </template>
          </z-array-editor>
          <div class="subheading" v-text="$t('access_config')"/>
          <json-editor v-model="user.config" :valid.sync="valid" v-if="!loading"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="$t('cancel')" @click="$router.push(-1)"/>
          <v-btn color="info" v-text="$t('save')" @click="save" :disabled="loading || !valid"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, get, post } from "../httphelper";
import jsonEditor from "../components/jsonEditor";
import role from "../components/role";
import zArrayEditor from "../components/zArrayEditor";

export default {
  name: "userEditView",
  components: {
    jsonEditor,
    role,
    zArrayEditor
  },
  props: {
    userID: String
  },
  data() {
    return {
      user: {
        _id: "",
        username: "",
        realname: "",
        email: "",
        bio: "",
        roles: [],
        config: {}
      },
      loading: true,
      valid: true
    };
  },
  async mounted() {
    const url = getURL(`/api/user/${this.userID}`);
    this.user = await get(url);
    this.loading = false;
  },
  methods: {
    async save() {
      this.loading = true;
      const url = getURL(`/api/user/${this.userID}`);
      try {
        await post(url, this.user);
      } catch (e) {
        //
      }
      this.loading = false;
    }
  }
};
</script>
