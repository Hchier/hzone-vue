<template>
  <ul>
    <li>id: {{ id }}</li>
    <li>publisher: {{ publisher }}</li>
    <li>blogId: {{ blogId }}</li>
    <li>content: {{ content }}</li>
    <li>commentNum: {{ commentNum }}</li>
    <li>favorNum: {{ favorNum }}</li>
    <li>hidden: {{ hidden }}</li>
    <li>deleted: {{ deleted }}</li>
    <li>sourceComment: {{ sourceComment }}</li>
    <li>commentOf: {{ commentOf }}</li>
    <li>createTime: {{ createTime }}</li>
    <el-button>
      <span>查看评论（共{{ commentNum }}条）</span>
    </el-button>
  </ul>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";

@Options({
  props: {
    id: {
      type: Number,
    },
    publisher: {
      type: String,
    },
    blogId: {
      type: Number,
    },
    content: {
      type: String,
    },
    commentNum: {
      type: Number,
    },
    favorNum: {
      type: Number,
    },
    hidden: {
      type: Boolean,
    },
    deleted: {
      type: Boolean,
    },
    sourceComment: {
      type: Number,
    },
    commentOf: {
      type: Number,
    },
    createTime: {
      type: Date,
    },
  },
})
export default class BlogCommentCard extends Vue {
  test() {
    console.log("BlogCommentCard");
  }
}
</script>

<style scoped></style>
