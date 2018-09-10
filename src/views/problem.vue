<template>
    <v-container>
        <v-flex>
            <v-card>
                <v-card-text class="headline" v-text="$t('problems')"/>
                <v-card-text>
                </v-card-text>
                <v-card-actions>
                    <v-pagination/>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-container>
</template>

<script>
export default {
  name: "problemView",
  data() {
    return {
      //
    };
  },
  async created() {
    //
  },
  methods: {
    //
  }
};
</script>
