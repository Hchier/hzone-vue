<template>
    <div id="topicVO">
        <el-avatar
            id="avatar"
            :size="90"
            src="https://img1.baidu.com/it/u=211971924,3506621796&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
            shape="square"
        />
        <div id="name">{{ topicVO.name }}</div>

        <div id="followed">
            <el-button v-if="topicVO.followed" type="primary">已关注</el-button>
            <el-button v-if="!topicVO.followed" plain>未关注</el-button>
        </div>

        <div id="readNum">
            <span id="totalReadNum" class="readNumItem">总阅读{{ topicVO.totalReadNum }}</span>
            <span id="weekReadNum" class="readNumItem">周阅读{{ topicVO.weekReadNum }}</span>
            <span id="dayReadNum" class="readNumItem">日阅读{{ topicVO.dayReadNum }}</span>
            <span id="discussionNum" class="readNumItem">总讨论{{ topicVO.discussionNum }}</span>
            <span id="followedNum" class="readNumItem">关注量{{ topicVO.followedNum }}</span>
        </div>
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

#readNum {
    position: absolute;
    left: 130px;
    top: 60px;

}

.readNumItem {
    margin-right: 10px;
}

/*#totalReadNum {*/
/*    position: absolute;*/
/*    left: 130px;*/
/*    top: 60px;*/
/*    color: #8590a6;*/
/*}*/

/*#weekReadNum {*/
/*    position: absolute;*/
/*    left: 230px;*/
/*    top: 60px;*/
/*    color: #8590a6;*/
/*}*/

/*#dayReadNum {*/
/*    position: absolute;*/
/*    left: 330px;*/
/*    top: 60px;*/
/*    color: #8590a6;*/
/*}*/

/*#discussionNum {*/
/*    position: absolute;*/
/*    left: 430px;*/
/*    top: 60px;*/
/*    color: #8590a6;*/
/*}*/

/*#followedNum {*/
/*    position: absolute;*/
/*    left: 530px;*/
/*    top: 60px;*/
/*    color: #8590a6;*/
/*}*/
</style>