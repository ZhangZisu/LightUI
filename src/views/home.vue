<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <img src="@/assets/logo.png" alt="UI inspired by Vuetify.js" class="mb-5">
        <div class="display-2" v-text="$t('home_welcome_title')"/>
        <div class="headline" v-text="$t('home_welcome_subtitle')"/>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: "homeView"
}
</script>
