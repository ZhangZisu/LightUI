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
    if(this.id){
      this.user.username = this.id;
      const url = getURL(`/api/user/${this.id}/summary`, {});
      const user = await get(url);
      this.user = user;
    }else{
      this.user.username = "null";
    }
  }
};
</script>
