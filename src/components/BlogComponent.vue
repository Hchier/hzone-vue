<template>
    <div id="blog" class="clear">
        <el-avatar
            id="avatar"
            :size="50"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />

        <span id="publisher">{{ blogVO.publisher }}</span>

        <span id="title"> <font size="5">{{ blogVO.title }}</font></span>

        <div id="content">{{ blogVO.content }}</div>

        <el-button id="unfoldButton" type="primary" @click="unfold" v-show="foldStatus">展开</el-button>

        <a id="topic" href="">{{ blogVO.topic }}</a>

        <p id="updateTime">发布于 {{ blogVO.updateTime }}</p>

        <div id="favorButton">
            <el-button type="primary" v-show="blogVO.favored">
                已点赞
                ({{ blogVO.favorNum }})
            </el-button>
            <el-button type="primary" v-show="!blogVO.favored" plain>
                点赞
                ({{ blogVO.favorNum }})
            </el-button>
        </div>
        <el-button id="openOrCloseCommentAreaButton" type="primary" @click="openOrCloseCommentArea">
            评论({{ blogVO.commentNum }})
        </el-button>
    </div>


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

</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import {BlogVO} from "@/common/vos/BlogVO";
import BlogComment from "@/components/BlogCommentComponent.vue";
import Reply from "@/components/ReplyComponent.vue";
import {BlogCommentVO} from "@/common/vos/BlogCommentVO";
import BlogApis from "@/common/apis/BlogApis";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import blogCommentApis from "@/common/apis/BlogCommentApis";
import {Ref, UnwrapRef} from "@vue/reactivity";
import {BlogCommentGetDTO, BlogCommentPublishDTO} from "@/common/dtos/BlogCommentDTOs";

export default defineComponent({
    props: ["blogVO", "autoUnfold"],
    components: {
        BlogComment,
        Reply,
    },
    setup(props) {
        let content: string = ref(props.blogVO.content.substring(0, 100));
        let foldStatus = ref(true);

        function unfold() {
            let content: HTMLElement | null = document.getElementById("content");
            if (content !== null) {
                content.style.setProperty("height", "auto");
            }
        }

        onMounted((() => {
            if (props.autoUnfold) {
                foldStatus.value = false;
                unfold();
            }
        }));

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
            content,
            unfold,
            foldStatus,
            blogCommentVOList,
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

<style scoped>

.clear::before, .clear::after {
    content: '';
    display: table;
    clear: both;
}

#blog {
    position: relative;
    margin: auto;
    width: 700px;
    border: 1px solid red;
    /*min-height: 100px;*/
}

#avatar {
    position: absolute;
    top: 10px;
    left: 10px;
}

#publisher {
    position: absolute;
    top: 20px;
    left: 75px;
}

#title {
    top: 20px;
    margin: 20px auto;
    display: inline-block;
}

#content {
    padding: 20px;
    overflow-wrap: break-word;
    text-align: left;
    overflow: hidden;
    height: 28px;
}

#unfoldButton {
    float: right;
    margin: -5px 30px 0 0;
}

#topic {
    float: left;
    margin: -22px 0 0 20px;
    color: #409eff;
}

#updateTime {
    float: left;
    margin: 5px 0 0 20px;
    font-size: 10px;
    color: #8590a6;
}

#favorButton {
    float: left;
    margin: 30px 0px 10px -170px;
}

#openOrCloseCommentAreaButton{
    float: left;
    margin: 30px 0px 10px -60px;
}

</style>