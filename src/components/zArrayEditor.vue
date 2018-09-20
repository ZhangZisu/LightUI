<template>
    <div>
        <template v-for="(value, i) in values">
            <v-input append-icon="delete" @click:append="values.splice(i, 1)" :messages="[value]" :key="value">
                <slot name="items" :value="value">
                    {{ value }}
                </slot>
            </v-input>
        </template>
        <template v-if="showAddForm">
            <v-autocomplete :loading="loading" :items="items" :search-input.sync="search" v-model="newItem" cache-items flat hide-no-data hide-details :item-text="textProp" item-value="_id" :label="hint">
                <template slot="item" slot-scope="data">
                    <v-list-tile-content>
                        <v-list-tile-title v-html="data.item[textProp]"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="data.item._id"></v-list-tile-sub-title>
                    </v-list-tile-content>
                </template>
            </v-autocomplete>
            <v-btn flat color="primary" @click="values.push(newItem)" :disabled="!newItem || values.includes(newItem)" v-text="$t('ok')"/>
            <v-btn flat @click="showAddForm = false" v-text="$t('cancel')"/>
        </template>
        <template v-else>
            <v-btn flat color="primary" @click="showAddForm = true" v-text="$t('add')"/>
        </template>
    </div>
</template>

<script>
import { getPURL, get } from '../httphelper';

export default {
    name: "zArrayEditor",
    props: {
        values: {
            type: Array,
            required: true
        },
        textProp: {
            type: String,
            required: true
        },
        hint: "Input...",
        queryURL: {
            type: String,
            required: true
        }
    },
    model:{
        prop: "values",
        event: "updateValues",
    },
    data(){
        return {
            loading: false,
            items: [],
            search: "",
            newItem: null
        }
    },
    watch: {
        search(val){
            val && this.querySelections(val);
        },
        values(val){
            this.$emit("updateValues", val);
        }
    },
    methods: {
        async querySelections(val){
            this.loading = true;
            const searchURL = getPURL(this.queryURL, {search: val}, 10, 1);
            this.items = await get(searchURL);
            this.loading = false;
    },
    }
}
</script>
