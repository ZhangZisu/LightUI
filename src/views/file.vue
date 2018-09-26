<template>
  <v-container>
    <v-flex>
      <v-card flat>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('files')"/>
        <v-card-text>
          <v-list three-line>
            <v-list-tile v-for="(file, i) in files" :key="i" avatar>
              <v-list-tile-avatar>
                <v-icon>folder</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-text="file.filename"/>
                <v-list-tile-sub-title v-text="file._id"/>
                <v-list-tile-sub-title>
                  {{$t('createdat', [file.created])}} by <user :id="file.owner"/>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon @click.stop="openFileDialog(file._id)">
                  <v-icon>info</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-card-actions>
            <v-pagination v-model="page" :length="allPages"></v-pagination>
            <v-spacer/>
            <v-btn flat to="/file/upload" v-text="$t('upload')"/>
          </v-card-actions>
        </v-card-text>
      </v-card>
      <v-dialog v-model="dialog" max-width="640">
        <v-card>
          <v-card-title>
            <div>
              <div class="headline" v-text="$t('file_details')"/>
              <div class="subheading" v-text="selectedFile.filename"/>
            </div>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="selectedFile._id" readonly :label="$t('id')"/>
            <v-textarea v-model="selectedFile.description" readonly :label="$t('description')"/>
            <v-text-field v-model="selectedFile.hash" readonly :label="$t('hash')"/>
            <v-text-field v-model="selectedFile.size" readonly :label="$t('size')"/>
            <v-text-field v-model="selectedFile.created" readonly :label="$t('created')"/>
            <div class="subheading" v-text="$t('can_read')"/>
            <ace label v-for="ace in selectedFile.allowedRead" :key="`ar_${ace}`" :id="ace"/>
            <v-divider/>
            <div class="subheading" v-text="$t('can_modify')"/>
            <ace label v-for="ace in selectedFile.allowedModify" :key="`am_${ace}`" :id="ace"/>
          </v-card-text>
          <v-card-actions>
            <user :id="selectedFile.owner" v-if="selectedFile._id" :key="selectedFile._id"/>
            <v-spacer/>
            <v-btn flat v-text="$t('download')" @click="downloadFile(selectedFile._id, '.'+selectedFile.type)"/>
            <v-btn flat v-text="$t('cancel')" @click="dialog = false"/>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, getPURL, get } from "../httphelper";
import user from "../components/user";
import ace from "../components/ace";
import axios from "axios";
const itemsPerPage = 25;

export default {
  name: "fileView",
  components: {
    user,
    ace
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
      files: [],
      selectedFile: {
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
      dialog: false,
      showProgressBar: true
    };
  },
  async mounted() {
    const query = { owner: this.owner, search: this.search, type: this.type };
    const countURL = getURL("/api/file/count", query);
    const count = await get(countURL);
    const allPages = Math.floor((count + itemsPerPage - 1) / itemsPerPage);
    this.allPages = allPages;
    const fetchURL = getPURL("/api/file/list", query, itemsPerPage, 1);
    const files = await get(fetchURL);
    this.files = files;
    this.showProgressBar = false;
  },
  methods: {
    async openFileDialog(fileID) {
      this.showProgressBar = true;
      const fetchURL = getURL(`/api/file/${fileID}`, {});
      const file = await get(fetchURL);
      this.selectedFile = file;
      this.showProgressBar = false;
      this.dialog = true;
    },
    downloadFile(fileID, type) {
      const downloadURL = getURL(`/api/file/${fileID}/raw`, {});
      axios.get(downloadURL, { responseType: "blob" }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileID + type);
        this.$el.appendChild(link);
        link.click();
      });
    }
  },
  watch: {
    page: async function(page) {
      const query = { owner: this.owner, search: this.search, type: this.type };
      const fetchURL = getPURL("/api/file/list", query, itemsPerPage, page);
      const files = await get(fetchURL);
      this.files = files;
    }
  }
};
</script>
