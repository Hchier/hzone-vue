<template>
  <ul>
    <li>id: {{ id }}</li>
    <li>publisher: {{ publisher }}</li>
    <li>blogId: {{ blogId }}</li>
    <li>
      content:
      <span v-html="content"></span>
    </li>
    <li>commentNum: {{ commentNum }}</li>
    <li>favorNum: {{ favorNum }}</li>
    <li>hidden: {{ hidden }}</li>
    <li>deleted: {{ deleted }}</li>
    <li>sourceComment: {{ sourceComment }}</li>
    <li>commentOf: {{ commentOf }}</li>
    <li>createTime: {{ createTime }}</li>
    <el-button type="primary">
      <span>查看评论（共{{ commentNum }}条）</span>
    </el-button>
    <el-button
      v-show="publisher === currentUser"
      type="danger"
      @click="deleteComment(id, blogId)"
    >
      <span>删除</span>
    </el-button>
  </ul>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { ElMessage } from "element-plus";
import BlogCommentApis from "@/apis/BlogCommentApis";
import { BlogCommentDeleteForm } from "@/interfaces/BlogCommentInterfaces";
@Options({
  props: {
    currentUser: {
      type: String,
    },
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
  blogCommentDeleteForm: BlogCommentDeleteForm = {
    id: -1,
    blogId: -1,
  };
  deleteComment(id: number, blogId: number) {
    this.blogCommentDeleteForm.id = id;
    this.blogCommentDeleteForm.blogId = blogId;
    BlogCommentApis.delete(this.blogCommentDeleteForm).then((res) => {
      if (res.data.code == 200) {
        ElMessage.success("删除成功");
      } else {
        ElMessage.success("删除失败");
      }
    });
  }
}
</script>

<style scoped></style>
