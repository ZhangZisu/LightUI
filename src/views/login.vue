<template>
    <v-container>
        <v-flex>
            <v-card>
                <v-card-title>
                    <div class="headline" v-text="$t('login')"/>
                </v-card-title>
                <v-card-text>
                    <v-stepper v-model="loginStep">
                        <v-stepper-header>
                            <v-stepper-step :complete="loginStep > 1" step="1" v-text="$t('enterUsername')"/>
                            <v-divider/>
                            <v-stepper-step :complete="loginStep > 2" step="2" v-text="$t('chooseRole')"/>
                            <v-divider/>
                            <v-stepper-step step="3" v-text="$t('enterPassword')"/>
                            </v-stepper-header>
                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <v-text-field v-model="username" :label="$t('username')"/>
                                <v-btn color="primary" @click="enterUsername" v-text="$t('continue')"/>
                            </v-stepper-content>
                            <v-stepper-content step="2">
                                <v-select v-model="role" :items="roles" :label="$t('select_a_role')"/>
                                <v-btn color="primary" @click="chooseRole" v-text="$t('continue')"/>
                                <v-btn flat v-text="$t('cancel')"/>
                            </v-stepper-content>
                            <v-stepper-content step="3">
                                <v-text-field v-model="password" :label="$t('password')" type="password"/>
                                <v-btn color="primary" @click="enterPassword" v-text="$t('continue')"/>
                                <v-btn flat v-text="$t('cancel')"/>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
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
      loginStep: 0,
      username: "",
      password: "",
      roles: [],
      role: "",
      roleData: []
    };
  },
  methods: {
    async enterUsername() {
      this.$store.commit("resetAccessToken");
      const username = this.username;
      const url = getURL("/rolesof", { username });
      const result = await get(url);
      this.roleData = result;
      this.roles = this.roleData.map(x => x.rolename);
      this.loginStep = 2;
    },
    async chooseRole() {
      this.loginStep = 3;
    },
    async enterPassword() {
      const username = this.username;
      const rolename = this.role;
      const clientID = this.$store.state.clientID;
      const password = this.password;
      const result = await post("/login", {
        username,
        rolename,
        clientID,
        password
      });
      this.$store.commit("setAccessToken", result);
      this.$router.push("/");
    }
  }
};
</script>
