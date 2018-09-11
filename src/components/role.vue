<template>
    <span v-text="role.rolename"/>
</template>

<script>
import { getURL, get } from '../httphelper';

export default {
    name: "role",
    props: {
        id: String
    },
    data(){
        return {
            role: {
                rolename: ""
            }
        };
    },
    async created(){
        this.role.rolename = this.id;
        const url = getURL(`/api/role/${this.id}/summary`, {});
        const role = await get(url);
        this.role = role;
    }
}
</script>
