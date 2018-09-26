import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import "./plugins/github";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import i18n from "./i18n";
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:3000";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
