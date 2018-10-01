import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import "./plugins/github";
import App from "./App";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import i18n from "./i18n";
import axios from "axios";
import config from "../config.json";
import "./assets/lightui.styl";

axios.defaults.baseURL = config.server;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
