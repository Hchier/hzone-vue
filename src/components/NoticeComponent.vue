<template>
    <div id="notice" v-show="componentVisible">
        <span v-if="noticeVO.type === 1">
            您关注的用户
            <a v-bind:href="'/zone/?username='+noticeVO.sender">{{ noticeVO.sender }}</a>
            发表了新的博客
            <a v-bind:href="'/blog/'+href">{{ noticeVO.content }}</a>
        </span>

        <span v-else-if="noticeVO.type === 2">
                您关注的话题
            <a href="">{{ noticeVO.sender }}</a>
            有了新内容
             <a v-bind:href="'/blog/'+href">{{ noticeVO.content }}</a>
        </span>

        <span v-else-if="noticeVO.type === 3">
            您的
            <a v-bind:href="'/blog/'+href">博客</a>
            有了新的回复：{{ noticeVO.content }}
        </span>

        <span v-else-if="noticeVO.type === 4">
            您在
            <a v-bind:href="'/blog/'+href">博客</a>
            下的评论被回复了：{{ noticeVO.content }}
        </span>

        <span v-else-if="noticeVO.type === 5">
            您的空间新增了留言：{{ noticeVO.content }}
        </span>

        <span v-else>

        </span>

        <el-button type="danger" @click="deleteNotice">删除</el-button>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import NoticeApis from "@/common/apis/NoticeApis";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: "NoticeComponent",
    props: ["noticeVO"],

    setup(props) {
        let componentVisible = ref(true);
        // eslint-disable-next-line vue/no-setup-props-destructure
        let href = props.noticeVO.link;

        function deleteNotice() {
            NoticeApis.delete(props.noticeVO.id).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("删除成功");
                    componentVisible.value = false;
                } else {
                    ElMessage.error("删除失败: " + res.data.message);
                }
            });
        }

        return {
            deleteNotice,
            componentVisible,
            href,
        };
    },
});
</script>

<style scoped>
#notice {
    border: 1px solid #f0f2f7;
    width: 500px;
    background-color: white;
    margin: auto;
    padding: 10px;
}
</style>