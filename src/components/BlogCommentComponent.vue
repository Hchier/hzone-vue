<template>
    <div id="BlogComment">
        <el-avatar id="avatar" :size="50" :src=" blogCommentVO.publisher" />
        <span id="publisher">{{ blogCommentVO.publisher }}</span>
        <span id="content">{{ blogCommentVO.content }}</span>
        <el-button id="button" type="danger" v-show="blogCommentVO.deletePermission"
                   @click="deleteComment(blogCommentVO.id,blogCommentVO.blogId)">删除
        </el-button>
        <el-button id="button" type="danger" v-show="hiddenPermission">隐藏</el-button>
        <el-button id="button" type="primary" v-show="hiddenPermission">查看回复({{ blogCommentVO.commentNum }})
        </el-button>
        <span id="createTime">{{ blogCommentVO.createTime }}</span>
    </div>
</template>

<script lang="ts">
import BlogCommentApis from "@/apis/BlogCommentApis";
import { ElMessage } from "element-plus";

export default {
    name: "BlogComment",
    props: ["blogCommentVO", "hiddenPermission"],
    setup() {
        function deleteComment(commentId: number, blogId: number) {
            BlogCommentApis.delete(commentId, blogId).then(res => {
                if (res.data.code == 200) {
                    ElMessage.success("删除成功");
                } else {
                    ElMessage.error("删除失败");
                }
            });
        }

        return {
            deleteComment,
        };
    },
};
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
    width: 100px;
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