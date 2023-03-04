<template>
    <div>{{ blogVO }}</div>
</template>

<script lang="ts">
import { onMounted } from "vue";
import { BlogVO } from "@/utils/vos";

export default {
    props: ["blogVO"],
};
</script>

<style scoped>

</style>