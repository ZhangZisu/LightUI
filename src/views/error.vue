<template>
    <v-container>
        <v-flex>
            <div class="error-title" v-text="$t('404')"/>
        </v-flex>
    </v-container>
</template>

<script>
export default {
  name: "error",
  data: function() {
    //
  }
};
</script>

<style lang="stylus" scoped>
.error-title
    font-size 144px
    text-align center
</style>
