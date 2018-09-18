<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-card-title>
          <div class="headline" v-text="$t('login')"/>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="username" :label="$t('username')"/>
          <v-text-field v-model="password" :label="$t('password')" type="password"/>
          <v-btn color="primary" @click="submit" v-text="$t('submit')"/>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, get, post } from "../httphelper";

export default {
  name: "login-view",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async submit() {
      const username = this.username;
      const clientID = this.$store.state.clientID;
      const password = this.password;
      const result = await post("/login", {
        username,
        clientID,
        password
      });
      this.$store.commit("setAccessToken", result);
      this.$router.push("/");
    }
  }
};
</script>
