<template>
  <v-app>
    <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher fixed app>
      <v-list>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('home')"/>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/file">
          <v-list-tile-action>
            <v-icon>folder</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('file')"/>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/problem">
          <v-list-tile-action>
            <v-icon>folder</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('problem')"/>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/logout" v-if="loggedin">
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('logout')"/>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/login" v-else>
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('login')"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view :key="$route.fullPath"/>
    </v-content>
    <v-footer app fixed>
      <span>&nbsp;{{$t('log')}}:&nbsp;{{log}}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: true,
      log: ""
    };
  },
  computed: {
    title: function() {
      return this.$store.state.title;
    },
    loggedin: function(){
      return !!this.$store.state.accessToken;
    }
  },
  watch: {
    "$store.state.error": function(val) {
      this.log = val;
    }
  }
};
</script>
