<template>
  <div>
    <template v-for="(value, i) in values">
      <v-input append-icon="delete" @click:append="values.splice(i, 1)" :messages="[$t('index_and_id', [i, value])]" :key="value">
        <file :id="value"/>
      </v-input>
    </template>
    <template v-if="showAddForm">
      <v-autocomplete :loading="loading" :items="items" :search-input.sync="search" v-model="newItem" cache-items flat hide-no-data hide-details item-text="filename" item-value="_id" :label="$t('input_filename')">
        <template slot="item" slot-scope="data">
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.filename"></v-list-tile-title>
            <v-list-tile-sub-title v-html="data.item._id"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </v-autocomplete>
      <v-btn flat color="primary" @click="values.push(newItem), showAddForm = false" :disabled="!newItem || values.includes(newItem)" v-text="$t('ok')"/>
      <v-btn flat @click="showAddForm = false" v-text="$t('cancel')"/>
      {{ $t('selected', [newItem]) }}
    </template>
    <template v-else>
      <v-btn flat color="primary" @click="showAddForm = true" v-text="$t('add')"/>
      <input type="file" id="file_upload" name="file_upload" multiple>
      <v-btn flat @click="uploadFile" v-text="$t('upload')"/>
    </template>
  </div>
</template>

<script>
import { getURL, getPURL, get } from "../httphelper";
import file from "./file";
import axios from "axios";

export default {
  name: "zArrayEditor",
  props: ["values"],
  components: {
    file
  },
  model: {
    prop: "values",
    event: "updateValues"
  },
  data() {
    return {
      loading: false,
      items: [],
      search: "",
      newItem: null,
      showAddForm: false
    };
  },
  watch: {
    search(val) {
      val && this.querySelections(val);
    },
    values(val) {
      this.$emit("updateValues", val);
    }
  },
  methods: {
    async querySelections(val) {
      this.loading = true;
      const searchURL = getPURL("/api/file/list", { search: val }, 10, 1);
      const result = await get(searchURL);
      if (result instanceof Array) {
        this.items = result;
      } else {
        this.items = [];
      }
      this.loading = false;
    },
    async uploadFile() {
      const files = document.getElementById("file_upload").files;
      const url = getURL("/api/file/upload", {});
      for (let file of files) {
        let formData = new FormData();
        formData.append("file", file);
        const result = await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (result.data.status === "success") {
          this.values.push(result.data.payload);
        } else {
          //
        }
      }
      document.getElementById("file_upload").value = null;
    }
  }
};
</script>
