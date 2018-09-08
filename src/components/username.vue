<template>
    <span v-text="user.username"/>
</template>

<script>
import { getURL, get } from '../httphelper';

export default {
    name: "username",
    props:{
        id: String
    },
    data(){
        return {
            user:{
                username:""
            }
        }
    },
    async created(){
        this.user.user = this.id;
        const url = getURL(`/api/user/${this.id}/summary`, {});
        const user = await get(url);
        this.user = user;
    }
}
</script>

