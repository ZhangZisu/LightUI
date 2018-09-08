import Vue from "vue";
import Vuex from "vuex";
import { generate } from "randomstring";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    clientID: "",
    accessToken: ""
  },
  mutations: {
    init(state) {
      if (!state.clientID) {
        state.clientID = generate({ length: 50 });
      }
    },
    resetAccessToken(store) {
      store.accessToken = "";
    },
    setAccessToken(store, at) {
      store.accessToken = at;
    }
  },
  actions: {}
});
