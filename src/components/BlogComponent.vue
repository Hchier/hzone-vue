<template>
    <div>{{ blogVO }}</div>
</template>

<script lang="ts">
import {onMounted} from "vue";
import {BlogVO} from "@/common/vos/BlogVO";

export default {
    props: ["blogVO"],
};
</script>

<style scoped>

</style>