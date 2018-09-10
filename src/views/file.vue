<template>
    <v-container>
        <v-flex>
            <v-card>
                <v-card-title>
                    <div class="headline" v-text="$t('files')"/>
                </v-card-title>
                <v-card-text>
                    <v-list three-line>
                        <v-list-tile v-for="(file, i) in files" :key="i" avatar>
                            <v-list-tile-avatar>
                                <v-icon>folder</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="file._id"/>
                                <v-list-tile-sub-title v-text="$t('filetype', [file.type])"/>
                                <v-list-tile-sub-title>
                                    {{$t('createdat', [file.created])}} by <username :id="file.owner"/>
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
                    </v-card-actions>
                </v-card-text>
            </v-card>
            <v-dialog v-model="dialog" max-width="640">
                <v-card>
                    <v-card-title>
                        <div>
                            <div class="headline" v-text="$t('file_details')"/>
                            <div class="subheading" v-text="selectedFile._id"/>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="selectedFile.type" readonly :label="$t('type')"/>
                        <v-textarea v-model="selectedFile.description" readonly :label="$t('description')"/>
                        <v-text-field v-model="selectedFile.hash" readonly :label="$t('hash')"/>
                        <v-text-field v-model="selectedFile.created" readonly :label="$t('created')"/>
                    </v-card-text>
                    <v-card-actions>
                        <username :id="selectedFile.owner" v-if="selectedFile._id" :key="selectedFile._id"/>
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
import { getURL, getPURL,get } from "../httphelper";
import username from "../components/username";
import axios from "axios";

export default {
  name: "fileView",
  components:{
      username
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
      selectedFile:{
          _id: "",
          hash:"",
          owner:"",
          description:"",
          type:"",
          created:""
      },
      dialog: false
    };
  },
  async created() {
    const countURL = getURL("/api/file/count", {
      owner: this.owner,
      search: this.search,
      type: this.type
    });
    const result = await get(countURL);
    const itemPerPage = 25;
    const allPages = Math.floor((result + itemPerPage - 1) / itemPerPage);
    this.allPages = allPages;
    const fetchURL = getPURL(
      "/api/file/list",
      { owner: this.owner, search: this.search, type: this.type },
      itemPerPage,
      1
    );
    const files = await get(fetchURL);
    this.files = files;
  },
  methods: {
    async openFileDialog(fileID) {
      const fetchURL = getURL(`/api/file/${fileID}/meta`, {});
      const file = await get(fetchURL);
      this.selectedFile = file;
      this.dialog = true;
    },
    downloadFile(fileID, type){
        const downloadURL = getURL(`/api/file/${fileID}`, {});
        axios.get(downloadURL, {responseType:"blob"}).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileID+type);
            this.$el.appendChild(link);
            link.click();
        });
    }
  }
};
</script>
