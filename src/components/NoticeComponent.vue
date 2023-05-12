<template>
    <div id="notice" v-show="componentVisible">
        <span class="content" v-if="noticeVO.type === 1">
            您关注的用户
            <router-link class="link" :to="'/zone/?username='+noticeVO.sender">{{ noticeVO.sender }}</router-link>
            发表了新的博客
            <router-link class="link" :to="'/blog/'+href">{{ noticeVO.content }}</router-link>
        </span>

        <span class="content" v-else-if="noticeVO.type === 2">
                您关注的话题
            <router-link class="link" to="">{{ noticeVO.sender }}</router-link>
            有了新内容
             <router-link class="link" :to="'/blog/'+href">{{ noticeVO.content }}</router-link>
        </span>

        <span class="content" v-else-if="noticeVO.type === 3">
            您的
            <router-link class="link" :to="'/blog/'+href">博客</router-link>
            有了新的回复：{{ noticeVO.content }}
        </span>

        <span class="content" v-else-if="noticeVO.type === 4">
            您在
            <router-link class="link" :to="'/blog/'+href">博客</router-link>
            下的评论被回复了：{{ noticeVO.content }}
        </span>

        <span class="content" v-else-if="noticeVO.type === 5">
            您的
            <router-link class="link" to="/zone">空间</router-link>
            新增了留言：{{ noticeVO.content }}
        </span>

        <span class="content" v-else></span>

        <el-button id="deleteButton" type="danger" @click="deleteNotice">删除</el-button>
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
    text-align: left;
}

.content {
    width: 420px;
    margin: 0 20px 0 0;
    display: inline-block;
}

.link {
    color: #409eff;
    margin: 0;
}

#deleteButton {
    vertical-align: top;
}
</style>