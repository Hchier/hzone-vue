<template>
    <div id="blog" class="clear">
        <el-avatar
            id="avatar"
            :size="50"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />

        <span id="publisher">{{ blogVO.publisher }}</span>

        <a id="title" v-bind:href="'/blog/' + blogVO.id"> <font size="5">{{ blogVO.title }}</font></a>

        <a id="topic" href="">{{ blogVO.topic }}</a>

        <div id="content">{{ blogVO.content }}</div>

        <el-button id="unfoldButton" type="primary" @click="unfold" v-show="foldStatus">展开</el-button>

        <p id="updateTime">发布于 {{ blogVO.updateTime }}</p>

        <div id="favorButton">
            <el-button type="primary" v-show="blogVO.favored" @click="blogUnFavor">
                已点赞
                ({{ blogVO.favorNum }})
            </el-button>
            <el-button type="primary" v-show="!blogVO.favored" plain @click="blogFavor">
                点赞
                ({{ blogVO.favorNum }})
            </el-button>
        </div>
        <el-button id="openOrCloseCommentAreaButton" type="primary" @click="openOrCloseCommentArea">
            评论({{ blogVO.commentNum }})
        </el-button>


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

        <el-dialog v-model="showCommentRepliedDialog" title="评论回复" @close="commentRepliedDialogClose"
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
        //内容是否折叠了
        let foldStatus = ref(true);

        //展开内容
        function unfold() {
            let content: HTMLElement | null = document.getElementById("content");
            if (content !== null) {
                foldStatus.value = false;
                content.style.setProperty("height", "auto");
            }
        }

        //博客的评论
        let blogCommentVOList: Array<BlogCommentVO> = reactive([]);
        //是否展示评论区
        let showCommentArea = ref(false);

        const openOrCloseCommentArea = () => {
            if (showCommentArea.value) {
                showCommentArea.value = false;
            } else {
                if (blogCommentVOList.length === 0) {
                    getCommentVOList(props.blogVO.id, -1, 0, blogCommentVOList);
                }

                blogCommentPublishDTO.receiver = props.blogVO.publisher;
                blogCommentPublishDTO.blogId = props.blogVO.id;
                blogCommentPublishDTO.content = "";
                blogCommentPublishDTO.baseComment = -1;
                blogCommentPublishDTO.commentOf = -1;

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
                getCommentVOList(props.blogVO.id, baseComment, commentPageNum.value, list);
            }
            //查找评论的评论
            else {
                commentRepliedPageNum.value++;
                getCommentVOList(props.blogVO.id, baseComment, commentRepliedPageNum.value, list);
            }

        };

        //评论的评论
        let commentRepliedPageNum: Ref<UnwrapRef<number>> = ref(0);
        let showCommentRepliedDialog = ref(false);
        let blogCommentRepliedVOList: Array<BlogCommentVO> = reactive([]);

        function setCommentRepliedDialogVisible(commentId: number) {
            showCommentRepliedDialog.value = true;
            getCommentVOList(props.blogVO.id, commentId, 0, blogCommentRepliedVOList);
        }

        function commentRepliedDialogClose() {
            showCommentRepliedDialog.value = false;
            let len = blogCommentRepliedVOList.length;
            for (let i = 0; i < len; i++) {
                blogCommentRepliedVOList.pop();
            }
            commentRepliedPageNum.value = 0;
        }

        let blogCommentRepliedPublishSuccess = (blogCommentVO: BlogCommentVO) => {
            blogCommentRepliedVOList.push(blogCommentVO);
            Object.assign(props.blogVO, {
                commentNum: props.blogVO.commentNum + 1,
            });
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
            Object.assign(props.blogVO, {
                commentNum: props.blogVO.commentNum + 1,
            });
        };

        let blogCommentPublishDTO: BlogCommentPublishDTO = reactive({
            receiver: "",
            blogId: -1,
            content: "",
            baseComment: -1,
            commentOf: -1,
        });

        function blogFavor() {
            BlogApis.blogFavor(props.blogVO.id, props.blogVO.publisher).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("点赞成功");
                    Object.assign(props.blogVO, {
                        favored: true,
                        favorNum: props.blogVO.favorNum + 1,
                    });
                } else {
                    ElMessage.error("点赞失败：" + res.data.message);
                }
            });
        }

        function blogUnFavor() {
            BlogApis.blogUnFavor(props.blogVO.id, props.blogVO.publisher).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("取消点赞成功");
                    Object.assign(props.blogVO, {
                        favored: false,
                        favorNum: props.blogVO.favorNum - 1,
                    });
                } else {
                    ElMessage.error("点赞失败：" + res.data.message);
                }
            });
        }

        onMounted((() => {
            if (props.autoUnfold) {
                unfold();
            }
        }));

        return {
            content,
            unfold,
            foldStatus,
            blogCommentVOList,
            getBlogCommentVOList: getCommentVOList,
            showCommentArea,
            openOrCloseCommentArea,
            loadMoreComments,
            showCommentRepliedDialog,
            setCommentRepliedDialogVisible,
            blogCommentRepliedVOList,
            commentRepliedDialogClose,
            commentPageNum,
            commentRepliedPageNum,
            blogCommentRepliedPublishSuccess,
            blogCommentPublishDTO,
            blogCommentPublishSuccess,
            blogFavor,
            blogUnFavor,
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
    background-color: white;
    position: relative;
    margin: 0 auto 20px;
    width: 700px;
    border: 1px solid #f0f2f7;

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

#topic {
    position: absolute;
    top: 65px;
    left: 20px;
    color: #409eff;
}

#content {
    padding: 20px 20px 0px 20px;
    overflow-wrap: break-word;
    text-align: left;
    overflow: hidden;
    height: 60px;
}

#unfoldButton {
    float: right;
    margin: 5px 30px 0 0;
}

#updateTime {
    float: left;
    margin: 15px 0 0 20px;
    font-size: 10px;
    color: #8590a6;
}

#favorButton {
    float: left;
    margin: 40px 0px 10px -170px;
}

#openOrCloseCommentAreaButton {
    float: left;
    margin: 40px 0px 10px -60px;
}

</style>