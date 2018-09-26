<template>
  <v-container>
    <v-card>
      <v-progress-linear v-if="loading" indeterminate query/>
      <v-card-title>
        <div>
          <div class="headline" v-text="role.rolename"/>
          <div class="subheading" v-text="role.description"/>
        </div>
      </v-card-title>
      <v-card-text v-if="!loading">
        <json-editor v-model="role.config" :readonly="true"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn depressed color="primary" v-text="$t('edit')" :to="'/role/edit/' + roleID"/>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import jsonEditor from "../components/jsonEditor.vue";
import { getURL, get } from '../httphelper';

export default {
  name: "roleDetails",
  components:{
    jsonEditor
  },
  props:{
    roleID:String
  },
  data(){
    return{
      role: {
        _id: "",
        rolename: "",
        description: "",
        config: {}
      },
      loading: true
    }
  },
  async mounted(){
    const url = getURL(`/api/role/${this.roleID}`);
    this.role = await get(url);
    this.loading = false;
  }
}
</script>
