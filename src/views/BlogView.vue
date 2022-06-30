<template>
  <div>
    <BlogCard
      :id="blogVO.id"
      :publisher="blogVO.publisher"
      :title="blogVO.title"
      :content="blogVO.content"
      :favorNum="blogVO.favorNum"
      :commentNum="blogVO.commentNum"
      :clickNum="blogVO.clickNum"
      :selfVisible="blogVO.selfVisible"
      :hidden="blogVO.hidden"
      :updateTime="blogVO.updateTime"
      :tagList="blogVO.tagList"
    ></BlogCard>
    <el-button @click="updateFavor" v-if="blogVO.favored">取消点赞</el-button>
    <el-button @click="updateFavor" v-if="!blogVO.favored">点赞</el-button>
    <ul>
      <li v-for="item in blogCommentList" :key="item">
        <BlogCommentCard
          :currentUser="currentUser"
          :id="item.id"
          :publisher="item.publisher"
          :blogId="item.blogId"
          :content="item.content"
          :favorNum="item.favorNum"
          :commentNum="item.commentNum"
          :hidden="item.hidden"
          :deleted="item.deleted"
          :sourceComment="item.sourceComment"
          :commentOf="item.commentOf"
          :createTime="item.createTime"
        ></BlogCommentCard>
      </li>
    </ul>
    <div>
      <el-input placeholder="写评论" v-model="blogCommentForm.content" />
      <el-button @click="publishComment">发表评论</el-button>
    </div>
    <el-button @click="getBlogComment">
      <span>加载更多评论（共{{ this.blogVO.commentNum }}条）</span>
    </el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { BlogVO, BlogFavorForm } from "@/interfaces/BlogInterfaces";
import {
  BlogCommentVO,
  BlogCommentAddForm,
} from "@/interfaces/BlogCommentInterfaces";
import router from "@/router";
import blogApis from "@/apis/BlogApis";
import { ElMessage } from "element-plus";
import BlogCard from "@/components/blog/BlogCard.vue";
import BlogCommentCard from "@/components/blog/BlogCommentCard.vue";
import BlogFavorApis from "@/apis/BlogFavorApis";
import BlogCommentApis from "@/apis/BlogCommentApis";
import BaseApis from "@/apis/BaseApis";

@Options({
  created() {
    this.getBlog();
    this.getCurrentUser();
  },
  components: {
    BlogCard,
    BlogCommentCard,
  },
})
export default class BlogView extends Vue {
  currentUser = "";
  blogFavorForm: BlogFavorForm = {
    praiser: "-1",
    blogId: -1,
  };
  blogCommentPageNum = 0;
  blogCommentList: Array<BlogCommentVO> = [];
  blogVO: BlogVO = {
    id: -1,
    publisher: "",
    title: "",
    content: "",
    favorNum: 0,
    commentNum: 0,
    clickNum: 0,
    selfVisible: false,
    hidden: false,
    updateTime: new Date(),
    tagList: [],
    favored: false,
  };
  blogCommentForm: BlogCommentAddForm = {
    publisher: "-1",
    blogId: -1,
    content: "",
    sourceComment: -1,
    commentOf: -1,
  };

  getCurrentUser() {
    BaseApis.getCurrentUser().then((res) => {
      if (res.data.code == 200) {
        this.currentUser = res.data.body as string;
        ElMessage.success(this.currentUser);
      }
    });
  }

  getBlog() {
    blogApis
      .getBlogById(router.currentRoute.value.query.id as unknown as number)
      .then((res) => {
        if (res.data.code != 200) {
          ElMessage.error(res.data.message);
        } else {
          this.blogVO = res.data.body as BlogVO;
          this.blogVO.updateTime = new Date(
            this.blogVO.updateTime as unknown as number
          );
          console.log(this.blogVO);
        }
      });
  }

  getBlogComment() {
    BlogCommentApis.get(this.blogVO.id, this.blogCommentPageNum).then((res) => {
      if (res.data.code == 200) {
        ElMessage.success("成功加载了" + res.data.body.length + "条评论");
        this.blogCommentPageNum++;
        for (let i = 0; i < res.data.body.length; i++) {
          if (res.data.body[i].deleted) {
            res.data.body[i].content =
              '<span style="color: red">' + "该评论已被删除" + "</span>";
          }
          this.blogCommentList.push({
            id: res.data.body[i].id,
            publisher: res.data.body[i].publisher,
            blogId: res.data.body[i].blogId,
            content: res.data.body[i].content,
            commentNum: res.data.body[i].commentNum,
            favorNum: res.data.body[i].favorNum,
            hidden: res.data.body[i].hidden,
            deleted: res.data.body[i].deleted,
            sourceComment: res.data.body[i].sourceComment,
            commentOf: res.data.body[i].commentOf,
            createTime: new Date(res.data.body[i].createTime),
          });
        }
      } else {
        ElMessage.error("加载评论失败：" + res.data.message);
      }
    });
  }

  updateFavor() {
    this.blogFavorForm.blogId = this.blogVO.id;
    if (this.blogVO.favored) {
      BlogFavorApis.favorCancel(this.blogFavorForm).then((res) => {
        if (res.data.code == 200) {
          ElMessage.success("取消点赞成功");
          this.blogVO.favorNum -= 1;
          this.blogVO.favored = false;
        } else {
          ElMessage.error("取消点赞失败：" + res.data.message);
        }
      });
    } else {
      BlogFavorApis.favor(this.blogFavorForm).then((res) => {
        if (res.data.code == 200) {
          ElMessage.success("点赞成功");
          this.blogVO.favorNum += 1;
          this.blogVO.favored = true;
        } else {
          ElMessage.error("点赞失败：" + res.data.message);
        }
      });
    }
  }

  publishComment() {
    this.blogCommentForm.blogId = this.blogVO.id;
    BlogCommentApis.publish(this.blogCommentForm).then((res) => {
      if (res.data.code == 200) {
        ElMessage.success("评论发表成功");
        this.blogVO.commentNum++;
        this.blogCommentList.push({
          id: res.data.body,
          publisher: this.currentUser,
          blogId: this.blogVO.id,
          content: this.blogCommentForm.content,
          commentNum: 0,
          favorNum: 0,
          hidden: false,
          deleted: false,
          sourceComment: -1,
          commentOf: -1,
          createTime: new Date(),
        });
      } else {
        ElMessage.error("评论发表失败：" + res.data.message);
      }
    });
  }
}
</script>

<style scoped></style>
