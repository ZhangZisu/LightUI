<template>
    <span v-text="user.username"/>
</template>

<script>
import { getURL, get } from "../httphelper";

export default {
  name: "user",
  props: {
    id: String
  },
  data() {
    return {
      user: {
        username: ""
      }
    };
  },
  async created() {
    if (this.id) {
      this.user.username = this.id;
      try {
        const url = getURL(`/api/user/${this.id}/summary`, {});
        const user = await get(url);
        this.user = user;
      } catch (e) {
        this.user.username = this.$t("error");
        this.$emit("update:valid", false);
      }
    } else {
      this.user.username = this.$t("error");
      this.$emit("update:valid", false);
    }
  }
};
</script>
