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
        <template v-if="loggedin">
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
              <v-icon>notes</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('problem')"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/solution">
            <v-list-tile-action>
              <v-icon>assignment_turned_in</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('solution')"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/role">
            <v-list-tile-action>
              <v-icon>supervised_user_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('role')"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/user">
            <v-list-tile-action>
                <v-icon>account_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('user')"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/logout">
            <v-list-tile-action>
                <v-icon>power_settings_new</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('logout')"/>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <template v-else>
          <v-list-tile to="/login">
            <v-list-tile-action>
              <v-icon>account_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('login')"/>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark color="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
			<v-menu offset-y>
				<v-btn slot="activator" icon flat>
					<v-icon>language</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile v-for="(lang, i) in languages" :key="`lang${i}`" ripple @click="setLang(lang.name)">
						<v-list-tile-title v-text="lang.display_name"/>
					</v-list-tile>
				</v-list>
			</v-menu>
    </v-toolbar>
    <v-content>
      <router-view :key="$route.fullPath"/>
    </v-content>
    <v-footer app fixed dark color="primary">
      <span class="pa-2">&copy;ZhangZisu 2018</span>
      <v-spacer/>
      <span class="pa-2">version 0.0.3</span>
    </v-footer>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: true,
      snackbar: false,
      snackbarText: "",
      languages: [
        {
          name: "en",
          display_name: "English"
        },
        {
          name: "zh-Hans",
          display_name: "简体中文"
        },
        {
          name: "zh-Hant",
          display_name: "正體中文"
        }
      ]
    };
  },
  computed: {
    title: function() {
      return this.$store.state.title;
    },
    loggedin: function() {
      return !!this.$store.state.accessToken;
    }
  },
  watch: {
    "$store.state.error": function(val) {
      this.snackbar = true;
      this.snackbarText = val;
    }
  },
  created() {
    let language = localStorage.getItem("language");
    if (language) {
      this.$i18n.locale = language;
    } else {
      for (let language of navigator.languages) {
        if (this.languages.filter(x => x.name === language).length) {
          this.$i18n.locale = language;
          break;
        }
      }
    }
  },
  methods: {
    setLang(language) {
      this.$i18n.locale = language;
      localStorage.setItem("language", language);
    }
  }
};
</script>
