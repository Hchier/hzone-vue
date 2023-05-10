<template>
    <div id="topicVO">
        <el-avatar
            id="avatar"
            :size="90"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            shape="square"
        />
        <div id="name">{{ topicVO.name }}</div>

        <div id="followed">
            <el-button v-if="topicVO.followed" type="primary">已关注</el-button>
            <el-button v-if="!topicVO.followed" plain>未关注</el-button>
        </div>

        <div id="totalReadNum">总阅读{{ topicVO.totalReadNum }}</div>
        <div id="weekReadNum">周阅读{{ topicVO.weekReadNum }}</div>
        <div id="dayReadNum">日阅读{{ topicVO.dayReadNum }}</div>
        <div id="discussionNum">总讨论{{ topicVO.discussionNum }}</div>
        <div id="followedNum">关注量{{ topicVO.followedNum }}</div>
    </div>
</template>

<script lang=ts>
import {defineComponent} from "vue";

export default defineComponent({
    name: "TopicVOComponent",
    props: ["topicVO"],
    setup() {
        return {};
    },
});
</script>

<style scoped>
#topicVO {
    position: relative;
    height: 120px;
    width: 700px;
    border: 1px solid #f0f2f7;
    box-sizing: border-box;
    background-color: white;
    margin: 0 0 10px 0;
}

#avatar {
    position: absolute;
    left: 10px;
    top: 10px;
}

#name {
    position: absolute;
    left: 130px;
    top: 10px;
    font-size: 30px;
    color: #fc5431;
}

#followed {
    position: absolute;
    left: 520px;
    top: 15px;
}

#totalReadNum {
    position: absolute;
    left: 130px;
    top: 60px;
    color: #8590a6;
}

#weekReadNum {
    position: absolute;
    left: 230px;
    top: 60px;
    color: #8590a6;
}

#dayReadNum {
    position: absolute;
    left: 330px;
    top: 60px;
    color: #8590a6;
}

#discussionNum {
    position: absolute;
    left: 430px;
    top: 60px;
    color: #8590a6;
}

#followedNum {
    position: absolute;
    left: 530px;
    top: 60px;
    color: #8590a6;
}
</style>