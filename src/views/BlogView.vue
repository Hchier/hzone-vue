<template>
    <Blog v-bind:blogVO="blogVO"></Blog>
    <el-button type="primary" @click="openOrCloseCommentArea">评论({{ blogVO.commentNum }})</el-button>
    <div v-for="(item) in blogCommentVOList" v-bind:key="item.id" v-show="showCommentArea" style="margin: auto">
        <BlogComment v-bind:blogCommentVO="item"
                     v-bind:hiddenPermission="item.currentUser === blogVO.publisher"
                     v-bind:moreRepliesButtonVisible="true"
                     @setCommentRepliedDialogVisible="setCommentRepliedDialogVisible(item.id)"></BlogComment>
        <el-button type="primary" @click="loadMoreComments(-1,blogCommentVOList)">更多评论</el-button>
    </div>


    <el-dialog v-model="commentRepliedDialog" title="评论回复" @close="CommentRepliedDialogClose">
        <div v-for="(item) in blogCommentRepliedVOList" v-bind:key="item.id" v-show="showCommentArea"
             style="margin: auto">
            <BlogComment v-bind:blogCommentVO="item"
                         v-bind:hiddenPermission="item.currentUser === blogVO.publisher"
                         v-bind:moreRepliesButtonVisible="false">
            </BlogComment>
            <el-button type="primary"
                       @click="loadMoreComments(item.id,blogCommentRepliedVOList)">更多评论
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import {reactive, ref} from "vue";
import BlogComment from "@/components/BlogCommentComponent.vue";
import Blog from "@/components/BlogComponent.vue";
import {BlogCommentVO, BlogVO} from "@/utils/vos";
import BlogApis from "@/common/apis/BlogApis";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import blogCommentApis from "@/common/apis/BlogCommentApis";
import {Ref, UnwrapRef} from "@vue/reactivity";
import {BlogCommentGetDTO} from "@/common/dtos/BlogCommentDTOs";

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
        let showCommentArea = ref(false);

        function getBlogVO() {
            let idStr: string = useRoute().params.id as string;
            let id: number;
            if (((idStr != null) &&
                (idStr !== '') &&
                !isNaN(Number(idStr.toString())))) {
                id = Number(idStr);
            } else {
                ElMessage.error("查找博客失败");
                return;
            }

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
                    ElMessage.error("查找博客失败：" + res.data.body);
                }
            });
        }

        getBlogVO();

        const openOrCloseCommentArea = () => {
            if (showCommentArea.value) {
                showCommentArea.value = false;
            } else {
                if (blogCommentVOList.length === 0) {
                    getBlogCommentVOList(blogVO.id, -1, 0, 0, blogCommentVOList);
                }
                showCommentArea.value = true;
            }
        };

        function getBlogCommentVOList(blogId: number, baseComment: number, pageNum: number, hidden: number, list: Array<BlogCommentVO>) {
            let blogCommentGetDTO: BlogCommentGetDTO = {
                blogId: blogId,
                baseComment: baseComment,
                hidden: hidden,
                pageNum: pageNum,
            };
            blogCommentApis.get(blogCommentGetDTO).then(res => {
                if (res.data.code == 200) {
                    let arr = (res.data.body as Array<BlogCommentVO>);
                    if (arr.length === 0) {
                        ElMessage.error("暂无更多评论...");
                    }
                    arr.forEach(value => {
                        list.push(value);
                    });
                } else {
                    ElMessage.error(res.data.body)
                }
            });
        }


        let commentPageNum: Ref<UnwrapRef<number>> = ref(0);
        let loadMoreComments = (baseComment: number, list: Array<BlogCommentVO>) => {
            if (baseComment === -1) {
                commentPageNum.value++;
                getBlogCommentVOList(blogVO.id, baseComment, commentPageNum.value, 0, list);
            } else {
                commentRepliedPageNum.value++;
                getBlogCommentVOList(blogVO.id, baseComment, commentRepliedPageNum.value, 0, list);
            }

        };


        let commentRepliedPageNum: Ref<UnwrapRef<number>> = ref(0);
        let commentRepliedDialog = ref(false);
        let blogCommentRepliedVOList: Array<BlogCommentVO> = reactive([]);

        function setCommentRepliedDialogVisible(commentId: number) {
            commentRepliedDialog.value = true;
            getBlogCommentVOList(blogVO.id, commentId, 0, 0, blogCommentRepliedVOList);
        }

        function commentRepliedDialogClose() {
            commentRepliedDialog.value = false;
            for (let i = 0; i < blogCommentRepliedVOList.length; i++) {
                blogCommentRepliedVOList.pop();
            }
            commentRepliedPageNum.value = 0;
        }


        return {
            blogCommentVOList,
            blogVO,
            getBlogCommentVOList,
            showCommentArea,
            openOrCloseCommentArea,
            loadMoreComments,
            commentRepliedDialog,
            setCommentRepliedDialogVisible,
            blogCommentRepliedVOList,
            CommentRepliedDialogClose: commentRepliedDialogClose,
            commentPageNum,
            commentRepliedPageNum,
        };
    },
};
</script>
