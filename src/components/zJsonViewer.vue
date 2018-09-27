<template>
  <v-expansion-panel>
    <v-expansion-panel-content v-for="(obj, i) in parsed" :key="i">
      <div slot="header" v-text="obj.key"/>
      <v-card>
        <v-card-text>
          <template v-if="typeof obj.value === 'object'">
            <z-json-viewer :value="obj.value"/>
          </template>
          <template v-else>
            <pre v-text="obj.value"/>
          </template>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: "zJsonViewer",
  props: {
    value: Object
  },
  data() {
    return {
      parsed: []
    };
  },
  created() {
    for (let key in this.value) {
      this.parsed.push({ key: key, value: this.value[key] });
    }
  }
};
</script>
