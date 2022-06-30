<template>
  <div>
    <ul @click="jumpToBlog(id)">
      <li>id: {{ id }}</li>
      <li>publisher: {{ publisher }}</li>
      <li>title: {{ title }}</li>
      <li>content: {{ content }}</li>
      <li>favorNum: {{ favorNum }}</li>
      <li>commentNum: {{ commentNum }}</li>
      <li>clickNum: {{ clickNum }}</li>
      <li>selfVisible: {{ selfVisible }}</li>
      <li>hidden: {{ hidden }}</li>
      <li>updateTime: {{ updateTime }}</li>
      <li>tagList: {{ tagList }}</li>
      <li>favored: {{ favored }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import router from "@/router";

@Options({
  props: {
    id: {
      type: Number,
    },
    publisher: {
      type: String,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    favorNum: {
      type: Number,
    },
    commentNum: {
      type: Number,
    },
    clickNum: {
      type: Number,
    },
    selfVisible: {
      type: Boolean,
    },
    hidden: {
      type: Boolean,
    },
    updateTime: {
      type: Date,
    },
    tagList: {
      type: Array,
    },
    favored: {
      type: Boolean,
    },
  },
})
export default class BlogCard extends Vue {
  jumpToBlog(id: number) {
    router.push({ path: "/blog", query: { id: id } });
  }
}
</script>

<style scoped></style>
