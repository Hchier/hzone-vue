<template>
    <div id="BlogComment" v-show="visible">
        <el-avatar id="avatar" :size="50" :src=" blogCommentVO.publisher"/>
        <div id="publisher">
            <span>{{ blogCommentVO.publisher }}</span><span
            v-show="blogCommentVO.receiver !== ''"> 回复 {{ blogCommentVO.receiver }}</span>
        </div>
        <span id="content">{{ blogCommentVO.content }}</span>
        <span id="createTime">{{ blogCommentVO.createTime }}</span>

        <el-popover placement="right" :width="400" trigger="hover">
            <template #reference>
                <el-button style="margin-right: 16px">操作</el-button>
            </template>
            <el-button id="button" type="danger" v-show="blogCommentVO.deletePermission"
                       @click="deleteComment(blogCommentVO.receiver, blogCommentVO.id,blogCommentVO.blogId, blogCommentVO.baseComment,blogCommentVO.commentOf)">
                删除
            </el-button>
            <el-button id="button" type="danger" v-show="hiddenPermission && !blogCommentVO.hidden"
                       @click="hiddenComment(blogCommentVO.blogId,blogCommentVO.id)">
                隐藏
            </el-button>
            <el-button id="button" type="success" @click="replyAreaVisible = true">
                回复
            </el-button>
            <el-button id="button" type="primary" @click="setCommentRepliedDialogVisible"
                       v-show="moreRepliesButtonVisible">
                查看回复({{ blogCommentVO.commentNum }})
            </el-button>
        </el-popover>

        <ReplyComponent v-bind:blogCommentPublishDTO="blogCommentPublishDTO" v-if="replyAreaVisible"
                        @commentPublishSuccessEmit="commentPublishSuccess"></ReplyComponent>
    </div>

</template>

<script lang="ts">
import BlogCommentApis from "@/common/apis/BlogCommentApis";
import {ElMessage} from "element-plus";
import {defineComponent, reactive, ref, SetupContext} from "vue";
import {BlogCommentDeleteDTO, BlogCommentPublishDTO} from "@/common/dtos/BlogCommentDTOs";
import ReplyComponent from "@/components/ReplyComponent.vue";
import blogCommentApis from "@/common/apis/BlogCommentApis";
import {BlogCommentVO} from "@/common/vos/BlogCommentVO";

export default defineComponent({
    name: "BlogComment",
    components: {
        ReplyComponent,
    },
    props: ["blogCommentVO", "hiddenPermission", "moreRepliesButtonVisible"],
    emits: ["setCommentRepliedDialogVisibleEmit", "commentPublishSuccessEmit"],
    setup(props, context) {
        //被删除后设为true
        let visible = ref(true);

        function deleteComment(
            receiver: string,
            id: number,
            blogId: number,
            baseComment: number,
            commentOf: number) {

            let blogCommentDeleteDTO: BlogCommentDeleteDTO = {
                receiver: receiver,
                id: id,
                blogId: blogId,
                baseComment: baseComment,
                commentOf: commentOf,
            };

            BlogCommentApis.delete(blogCommentDeleteDTO).then(res => {
                if (res.data.code == 200) {
                    ElMessage.success("删除成功");
                    visible.value = false;
                } else {
                    ElMessage.error("删除失败: " + res.data.message);
                }
            });
        }

        //当查看评论的回复时，像父组件发送事件，把对应的dialog设为可见。
        function setCommentRepliedDialogVisible() {
            context.emit("setCommentRepliedDialogVisibleEmit");
        }


        function hiddenComment(blogId: number, commentId: number) {
            BlogCommentApis.hidden(blogId, commentId).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("隐藏成功");
                    Object.assign(props.blogCommentVO, {
                        content: "该评论已被隐藏",
                    });
                } else {
                    ElMessage.error("隐藏失败: " + res.data.body);
                }
            });
        }

        let replyAreaVisible = ref(false);

        let blogCommentPublishDTO: BlogCommentPublishDTO = reactive({
            receiver: props.blogCommentVO.publisher,
            blogId: props.blogCommentVO.blogId,
            content: "",
            baseComment: (props.blogCommentVO.baseComment === -1) ? props.blogCommentVO.id : props.blogCommentVO.baseComment,
            commentOf: props.blogCommentVO.id,
        });

        let commentPublishSuccess = (commentId: number, publisher: string, createTime: Date) => {
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
            context.emit("commentPublishSuccessEmit", blogCommentVO);
        };

        return {
            deleteComment,
            setCommentRepliedDialogVisible,
            visible,
            hiddenComment,
            blogCommentPublishDTO,
            replyAreaVisible,
            commentPublishSuccess,
        };
    },
});
</script>

<style scoped>


#BlogComment {
    border: red 1px solid;
    overflow: hidden;
    width: 750px;
    min-height: 90px;
}


#avatar {
    display: inline-block;
    margin-top: 20px;
    margin-left: 10px;
    float: left;
    border: red 1px solid;
    width: 50px;
    height: 50px;
}

#publisher {
    display: inline-block;
    margin-top: 20px;
    margin-left: 10px;
    float: left;
    border: red 1px solid;
    width: 200px;
    height: 20px;
}

#content {
    margin: 10px auto auto 10px;
    display: inline-block;
    float: left;
    border: red 1px solid;
    width: 600px;
    overflow-wrap: break-word;
    text-align: left;
}

#button {
    margin: auto 10px 10px;
    display: inline-block;
    float: right;
    overflow-wrap: break-word;
    text-align: left;
}

#createTime {
    display: inline-block;
    float: left;
    margin-left: 70px;
}

</style>