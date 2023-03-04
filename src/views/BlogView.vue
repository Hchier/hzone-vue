<template>
    <Blog v-bind:blogVO="blogVO"></Blog>
    <el-button type="primary" @click="getBlogCommentVOList(blogVO.id, -1, 0);">评论({{ blogVO.commentNum }})</el-button>
    <div v-for="(item) in blogCommentVOList" v-bind:key="item.id">
        <BlogComment v-bind:blogCommentVO="item" v-bind:hiddenPermission="true"></BlogComment>
    </div>
</template>

<script lang="ts">
import {reactive} from "vue";
import BlogComment from "@/components/BlogCommentComponent.vue";
import Blog from "@/components/BlogComponent.vue";
import {BlogCommentVO, BlogVO} from "@/utils/vos";
import BlogApis from "@/apis/BlogApis";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import blogCommentApis from "@/apis/BlogCommentApis";

export default {
    name: "HomeView",
    components: {
        Blog,
        BlogComment,
    },

    setup() {
        let blogVO: BlogVO = reactive({
            id: -1,
            publisher: "xxx",
            title: "",
            content: "",
            favorNum: 0,
            commentNum: 0,
            rewardNum: 0,
            favored: false,
            selfVisible: false,
            hidden: false,
            commentForbidden: false,
            updateTime: new Date(),
            topic: "",
            updatePermission: false,
        });
        let blogCommentVOList: Array<BlogCommentVO> = reactive([]);


        function getBlogVO() {
            let id: number = useRoute().params.id as unknown as number;
            console.log(id);
            BlogApis.getBlog(id).then(res => {
                if (res.data.code == 200) {
                    ElMessage.success("查找博客成功");
                    let vo = res.data.body as BlogVO;
                    blogVO.id = vo.id;
                    blogVO.publisher = vo.publisher;
                    blogVO.title = vo.title;
                    blogVO.content = vo.content;
                    blogVO.favorNum = vo.favorNum;
                    blogVO.commentNum = vo.commentNum;
                    blogVO.rewardNum = vo.rewardNum;
                    blogVO.favored = vo.favored;
                    blogVO.selfVisible = vo.selfVisible;
                    blogVO.hidden = vo.hidden;
                    blogVO.commentForbidden = vo.commentForbidden;
                    blogVO.updateTime = vo.updateTime;
                    blogVO.topic = vo.topic;
                    blogVO.updatePermission = vo.updatePermission;
                } else {
                    //todo
                }
            });
        }

        getBlogVO();



        function getBlogCommentVOList(blogId: number, commentOf: number, pageNum: number) {
            blogCommentApis.get(blogId, commentOf, pageNum).then(res => {
                if (res.data.code == 200) {
                    ElMessage.success("查找评论成功");
                    (res.data.body as Array<BlogCommentVO>).forEach(value => {
                        blogCommentVOList.push(value);
                    });
                } else {
                    //todo
                }
            });
        }


        return {
            blogCommentVOList,
            blogVO,
            getBlogCommentVOList,
        };
    },
};
</script>
