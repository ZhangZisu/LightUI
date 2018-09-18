<template>
    <span v-text="role.rolename"/>
</template>

<script>
import { getURL, get } from "../httphelper";

export default {
  name: "role",
  props: {
    id: String
  },
  data() {
    return {
      role: {
        rolename: ""
      }
    };
  },
  async created() {
    if (this.id) {
      this.role.rolename = this.id;
      try{
        const url = getURL(`/api/role/${this.id}/summary`, {});
        const role = await get(url);
        this.role = role;
      }catch(e){
        this.role.rolename = "Error";
      }
    } else {
      this.role.rolename = "null";
    }
  }
};
</script>
