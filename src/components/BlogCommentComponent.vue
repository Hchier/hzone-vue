<template>
    <div id="BlogComment" class="clear" v-show="visible">
        <el-avatar id="avatar" :size="50" :src="blogCommentVO.publisher"/>
        <span id="publisher">
            <span>{{ blogCommentVO.publisher }}</span>
            <span
                v-show="blogCommentVO.baseComment !== -1"> 回复 {{ blogCommentVO.receiver }}</span>
        </span>
        <span id="content">{{ blogCommentVO.content }}</span>
        <p id="createTime">发布于 {{ blogCommentVO.createTime }}</p>

        <el-popover placement="right" trigger="hover">
            <template #reference>
                <el-button id="opButton" type="primary">操作</el-button>
            </template>
            <el-button id="deleteButton" class="button" type="danger" v-show="blogCommentVO.deletePermission"
                       @click="deleteComment(blogCommentVO.receiver, blogCommentVO.id,blogCommentVO.blogId, blogCommentVO.baseComment,blogCommentVO.commentOf)">
                删除
            </el-button>
            <el-button id="hiddenButton" class="button" type="danger" v-show="hiddenPermission && !blogCommentVO.hidden"
                       @click="hiddenComment(blogCommentVO.blogId,blogCommentVO.id)">
                隐藏
            </el-button>
            <el-button id="replyButton" class="button" type="success" @click="replyAreaVisible = true">
                回复
            </el-button>
            <el-button id="reviewRepliesButton" class="button" type="primary" @click="setCommentRepliedDialogVisible"
                       v-show="moreRepliesButtonVisible">
                查看回复({{ blogCommentVO.commentNum }})
            </el-button>
        </el-popover>
        <ReplyComponent v-bind:blogCommentPublishDTO="blogCommentPublishDTO" v-if="replyAreaVisible"
                        @blogCommentRepliedPublishSuccessEmit="blogCommentRepliedPublishSuccess"></ReplyComponent>
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
        //被删除后设为false
        let visible = ref(true);
        let vo: BlogCommentVO = reactive(props.blogCommentVO);

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

        let blogCommentRepliedPublishSuccess = (commentId: number, publisher: string, createTime: string) => {
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
            Object.assign(props.blogCommentVO, {
                commentNum: props.blogCommentVO.commentNum + 1,
            });
            context.emit("commentPublishSuccessEmit", blogCommentVO);
        };

        return {
            deleteComment,
            setCommentRepliedDialogVisible,
            visible,
            hiddenComment,
            blogCommentPublishDTO,
            replyAreaVisible,
            blogCommentRepliedPublishSuccess,
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

#BlogComment {
    position: relative;
    border: red 1px solid;
    overflow: hidden;
    width: 700px;

}

#avatar {
    position: absolute;
    top: 10px;
    left: 10px;
    border: red 1px solid;
}

#publisher {
    position: absolute;
    top: 10px;
    left: 80px;
    border: red 1px solid;

}

#opButton {
    position: absolute;
    left: 620px;
    top: 10px;
}

.button{
    margin: 0;
    display: block;
}

#content {
    float: left;
    margin-top: 50px;
    margin-left: 80px;
    border: red 1px solid;
    width: 600px;
    overflow-wrap: break-word;
    text-align: left;
}

#createTime {
    float: left;
    margin-top: 10px;
    margin-left: 80px;
    font-size: 10px;
    color: #8590a6;
}

</style>