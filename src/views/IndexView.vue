<template>
  <div>
    <ul>
      <li v-for="item in blogCardList" v-bind:key="item">
        <BlogCard
          :id="item.id"
          :publisher="item.publisher"
          :title="item.title"
          :content="item.content"
          :favorNum="item.favorNum"
          :commentNum="item.commentNum"
          :clickNum="item.clickNum"
          :selfVisible="item.selfVisible"
          :hidden="item.hidden"
          :updateTime="item.updateTime"
          :tagList="item.tagList"
        ></BlogCard>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import BlogCard from "@/components/blog/BlogCard.vue"; // @ is an alias to /src
import BlogApis from "@/apis/BlogApis";
import { ElMessage } from "element-plus";
import { BlogVO } from "@/interfaces/BlogInterfaces";

@Options({
  created() {
    this.getBlogCardList();
  },
  components: {
    BlogCard,
  },
})
export default class Index extends Vue {
  blogCardList: BlogVO[] = [];
  title = "hhh";

  getBlogCardList() {
    BlogApis.getBlogCardList().then((res) => {
      if (res.data.code == 200) {
        for (let i = 0; i < res.data.body.length; i++) {
          this.blogCardList.push({
            id: res.data.body[i].id,
            publisher: res.data.body[i].publisher,
            title: res.data.body[i].title,
            content: res.data.body[i].content,
            favorNum: res.data.body[i].favorNum,
            commentNum: res.data.body[i].commentNum,
            clickNum: res.data.body[i].clickNum,
            selfVisible: res.data.body[i].selfVisible,
            hidden: res.data.body[i].hidden,
            updateTime: new Date(res.data.body[i].updateTime),
            tagList: res.data.body[i].tagList,
            favored: res.data.body[i].favored,
          });
        }
      } else {
        ElMessage.error(res.data.message);
      }
    });
  }
}
</script>

<style scoped></style>
