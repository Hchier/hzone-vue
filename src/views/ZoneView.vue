<template>
    <div></div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useRoute} from "vue-router";

export default defineComponent({
    name: "ZoneView",

    setup() {
        function t() {
            let username = useRoute().params.username;
            console.log(username);
        }

        t();

    },
});
</script>

<style scoped>

</style>