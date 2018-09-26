<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-card-title>
          <div>
            <div class="headline" v-text="$t('file_details')"/>
            <div class="subheading" v-text="file.filename"/>
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="file._id" readonly :label="$t('id')"/>
          <v-textarea v-model="file.description" readonly :label="$t('description')"/>
          <v-text-field v-model="file.hash" readonly :label="$t('hash')"/>
          <v-text-field v-model="file.size" readonly :label="$t('size')"/>
          <v-text-field v-model="file.created" readonly :label="$t('created')"/>
          <div class="subheading" v-text="$t('can_read')"/>
          <ace label v-for="ace in file.allowedRead" :key="`ar_${ace}`" :id="ace"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_modify')"/>
          <ace label v-for="ace in file.allowedModify" :key="`am_${ace}`" :id="ace"/>
        </v-card-text>
        <v-card-actions>
          {{ $t('created_by') }}
          <user :id="file.owner" v-if="file._id" :key="file._id"/>
          <v-spacer/>
          <v-btn depressed v-text="$t('download')" @click="downloadFile"/>
          <v-btn depressed v-text="$t('cancel')" @click="$router.go(-1)"/>
          <v-btn depressed color="primary" v-text="$t('edit')" :to="'/file/edit/' + fileID"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import axios from "axios";
import { getURL, getPURL, get } from "../httphelper";
import ace from "../components/ace.vue";
import user from "../components/user.vue";

export default {
  name: "fileDetailsView",
  components:{
    ace,
    user
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
  },
  methods:{
    downloadFile() {
      const downloadURL = getURL(`/api/file/${this.fileID}/raw`, {});
      axios.get(downloadURL, { responseType: "blob" }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", this.file.filename);
        this.$el.appendChild(link);
        link.click();
      });
    }
  }
}
</script>
