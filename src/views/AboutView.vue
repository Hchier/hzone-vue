<template>
  <div>{{ title }}</div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";

@Options({
  created() {
    console.log(11);
  },
  props: {
    title: {
      type: String,
      default: "default title",
    },
    author: {
      type: String,
    },
    content: {
      type: String,
    },
    favorNum: {
      type: Number,
    },
  },
})
export default class BlogCard extends Vue {}
</script>

<style scoped></style>
