<template>
    <div id="father">
        <Blog v-bind:blogVO="blogVO" v-bind:autoUnfold="true"></Blog>

        <el-button type="primary" @click="openOrCloseCommentArea">评论({{ blogVO.commentNum }})</el-button>

        <div v-for="(item) in blogCommentVOList" v-bind:key="item.id" v-show="showCommentArea">
            <BlogComment
                style="margin: auto"
                v-bind:blogCommentVO="item"
                v-bind:hiddenPermission="item.currentUser === blogVO.publisher"
                v-bind:moreRepliesButtonVisible="true"
                @setCommentRepliedDialogVisibleEmit="setCommentRepliedDialogVisible(item.id)"
                @blogCommentRepliedPublishSuccessEmit="blogCommentRepliedPublishSuccess"></BlogComment>
        </div>
        <el-button type="primary" @click="loadMoreComments(-1,blogCommentVOList)" v-show="showCommentArea">更多评论
        </el-button>

        <el-dialog v-model="commentRepliedDialog" title="评论回复" @close="CommentRepliedDialogClose"
                   style="width: 750px">
            <div v-for="(item) in blogCommentRepliedVOList" v-bind:key="item.id" v-show="showCommentArea"
                 style="margin: auto">
                <BlogComment v-bind:blogCommentVO="item"
                             v-bind:hiddenPermission="item.currentUser === blogVO.publisher"
                             v-bind:moreRepliesButtonVisible="false"
                             @commentPublishSuccessEmit="blogCommentRepliedPublishSuccess">
                </BlogComment>
            </div>
            <el-button type="primary"
                       @click="loadMoreComments(blogCommentRepliedVOList[0].id,blogCommentRepliedVOList)">更多评论
            </el-button>
        </el-dialog>

        <Reply id="replyComponent" :blogCommentPublishDTO="blogCommentPublishDTO" v-if="showCommentArea"
               @blogCommentPublishSuccessEmit="blogCommentPublishSuccess"></Reply>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";
import BlogComment from "@/components/BlogCommentComponent.vue";
import Reply from "@/components/ReplyComponent.vue";
import Blog from "@/components/BlogComponent.vue";
import {BlogCommentVO} from "@/common/vos/BlogCommentVO";
import {BlogVO} from "@/common/vos/BlogVO";
import BlogApis from "@/common/apis/BlogApis";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import blogCommentApis from "@/common/apis/BlogCommentApis";
import {Ref, UnwrapRef} from "@vue/reactivity";
import {BlogCommentGetDTO, BlogCommentPublishDTO} from "@/common/dtos/BlogCommentDTOs";

export default defineComponent({
    name: "HomeView",
    components: {
        Blog,
        BlogComment,
        Reply,
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
            updateTime: "",
            topic: "",
            updatePermission: false,
        });
        //博客的评论
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
                if (res.data.code === 200) {
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

                    blogCommentPublishDTO.blogId = vo.id;
                    blogCommentPublishDTO.receiver = vo.publisher;

                } else {
                    ElMessage.error(res.data.message);
                }
            });
        }

        getBlogVO();

        const openOrCloseCommentArea = () => {
            if (showCommentArea.value) {
                showCommentArea.value = false;
            } else {
                if (blogCommentVOList.length === 0) {
                    getCommentVOList(blogVO.id, -1, 0, blogCommentVOList);
                }
                showCommentArea.value = true;
            }
        };

        function getCommentVOList(blogId: number, baseComment: number, pageNum: number, list: Array<BlogCommentVO>) {
            let blogCommentGetDTO: BlogCommentGetDTO = {
                blogId: blogId,
                baseComment: baseComment,
                pageNum: pageNum,
            };
            blogCommentApis.get(blogCommentGetDTO).then(res => {
                if (res.data.code == 200) {
                    let arr = (res.data.body as Array<BlogCommentVO>);
                    if (arr.length === 0) {
                        ElMessage.error("暂无更多评论...");
                        return;
                    }
                    arr.forEach(value => {
                        if (value.hidden) {
                            value.content = "该评论已被隐藏。";
                        }
                        console.log(value);
                        list.push(value);
                    });
                } else {
                    ElMessage.error(res.data.body);
                }
            });
        }


        let commentPageNum: Ref<UnwrapRef<number>> = ref(0);
        let loadMoreComments = (baseComment: number, list: Array<BlogCommentVO>) => {
            //查找博客的评论
            if (baseComment === -1) {
                commentPageNum.value++;
                getCommentVOList(blogVO.id, baseComment, commentPageNum.value, list);
            }
            //查找评论的评论
            else {
                commentRepliedPageNum.value++;
                getCommentVOList(blogVO.id, baseComment, commentRepliedPageNum.value, list);
            }

        };

        //评论的评论
        let commentRepliedPageNum: Ref<UnwrapRef<number>> = ref(0);
        let commentRepliedDialog = ref(false);
        let blogCommentRepliedVOList: Array<BlogCommentVO> = reactive([]);

        function setCommentRepliedDialogVisible(commentId: number) {
            commentRepliedDialog.value = true;
            getCommentVOList(blogVO.id, commentId, 0, blogCommentRepliedVOList);
        }

        function commentRepliedDialogClose() {
            commentRepliedDialog.value = false;
            for (let i = 0; i < blogCommentRepliedVOList.length; i++) {
                blogCommentRepliedVOList.pop();
            }
            commentRepliedPageNum.value = 0;
        }

        let blogCommentRepliedPublishSuccess = (blogCommentVO: BlogCommentVO) => {
            blogCommentRepliedVOList.push(blogCommentVO);
            blogVO.commentNum++;
        };

        let blogCommentPublishSuccess = (commentId: number, publisher: string, createTime: string) => {
            let blogCommentVO: BlogCommentVO = {
                id: commentId,
                publisher: publisher,
                receiver: blogCommentPublishDTO.receiver,
                blogId: blogCommentPublishDTO.blogId,
                content: blogCommentPublishDTO.content,
                commentNum: 0,
                favorNum: 0,
                hidden: false,
                baseComment: blogCommentPublishDTO.baseComment,
                commentOf: blogCommentPublishDTO.commentOf,
                currentUser: publisher,
                createTime: createTime,
                deletePermission: true,
            };
            blogCommentVOList.push(blogCommentVO);
            blogVO.commentNum++;
        };

        let blogCommentPublishDTO: BlogCommentPublishDTO = reactive({
            receiver: blogVO.publisher,
            blogId: blogVO.id,
            content: "",
            baseComment: -1,
            commentOf: -1,
        });

        return {
            blogCommentVOList,
            blogVO,
            getBlogCommentVOList: getCommentVOList,
            showCommentArea,
            openOrCloseCommentArea,
            loadMoreComments,
            commentRepliedDialog,
            setCommentRepliedDialogVisible,
            blogCommentRepliedVOList,
            CommentRepliedDialogClose: commentRepliedDialogClose,
            commentPageNum,
            commentRepliedPageNum,
            blogCommentRepliedPublishSuccess,
            blogCommentPublishDTO,
            blogCommentPublishSuccess,
        };
    },
});
</script>

<style>
#father {
    margin: 0 auto;
    width: 700px;
}
</style>