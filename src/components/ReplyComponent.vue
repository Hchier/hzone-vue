<template>
    <div>
        <el-input v-model="content"></el-input>
        <el-button id="publishButton" type="primary" @click="publishComment">提交</el-button>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";
import BlogCommentApis from "@/common/apis/BlogCommentApis";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: "ReplyComponent",
    props: ["blogCommentPublishDTO"],
    emits: ["blogCommentRepliedPublishSuccessEmit", "blogCommentPublishSuccessEmit"],
    setup(props, context) {

        let content = ref("");

        function publishComment() {
            Object.assign(props.blogCommentPublishDTO, {
                content: content.value,
            });
            BlogCommentApis.publish(props.blogCommentPublishDTO).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("发布成功");
                    Object.assign(props.blogCommentPublishDTO, {
                        content: content.value,
                    });
                    if (props.blogCommentPublishDTO.baseComment !== -1) {
                        context.emit("blogCommentRepliedPublishSuccessEmit", res.data.body.id as number, res.data.body.publisher as string, res.data.body.createTime as string);
                    } else {
                        context.emit("blogCommentPublishSuccessEmit", res.data.body.id as number, res.data.body.publisher as string, res.data.body.createTime as string);
                    }
                    content.value = "";
                } else {
                    ElMessage.error("发布失败：" + res.data.message);
                }
            });
        }

        return {
            content,
            publishComment,
        };
    },
});
</script>

<style scoped>
#publishButton {
    float: right;
}
</style>