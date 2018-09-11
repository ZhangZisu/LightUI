<template>
    <span v-text="problem.title"/>
</template>

<script>
import { getURL, get } from '../httphelper';

export default {
    name: "problem",
    props: {
        id:String
    },
    data(){
        return {
            problem: {
                title: ""
            }
        }
    },
    async created(){
        this.problem.title = this.id;
        const url = getURL(`/api/problem/${this.id}/summary`, {});
        const problem = await get(url);
        this.problem = problem;
    }
}
</script>
