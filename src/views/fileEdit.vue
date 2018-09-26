<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear indeterminate query v-if="loading"/>
        <v-card-title class="headline" v-text="$t('edit_file')"/>
        <v-card-text v-if="!loading">
          <div class="subheading" v-text="$t('basic')"/>
          <v-text-field v-model="file.filename" :label="$t('filename')"/>
          <v-textarea v-model="file.description" :label="$t('description')"/>
          <!-- Access Control -->
          <div class="subheading" v-text="$t('can_read')"/>
          <v-divider/>
          <z-access-control-editor v-model="file.allowedRead"/>
          <div class="subheading" v-text="$t('can_modify')"/>
          <v-divider/>
          <z-access-control-editor v-model="file.allowedModify"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn flat v-text="$t('cancel')" @click="$router.go(-1)"/>
          <v-btn color="primary" v-text="$t('save')" @click="save"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, getPURL, get, post } from "../httphelper";
import zAccessControlEditor from "../components/zAccessControlEditor.vue";

export default {
  name: "fileEditView",
  components:{
    zAccessControlEditor
  },
  props:{
    fileID: String
  },
  data(){
    return {
      file: {
        _id: "",
        hash: "",
        size: 0,
        owner: "",
        description: "",
        filename: "",
        created: "",
        allowedRead: [],
        allowedModify: []
      },
      loading: true
    }
  },
  async mounted(){
    const url = getURL(`/api/file/${this.fileID}`, {});
    this.file = await get(url);
    this.loading = false;
  },
  methods:{
    async save(){
      this.loading = true;
      const url = getURL(`/api/file/${this.fileID}`, {});
      try{
        await post(url, this.file);
      }catch(e){
        //
      }
      this.loading = false;
    }
  }
}
</script>
