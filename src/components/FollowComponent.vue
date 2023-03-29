<template>
    <div id="follow" class="clear">
        <el-avatar id="avatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                   :size="45"
                   v-show="followVO.type === FollowType.User"/>

        <a id="followee" v-if="followVO.type === FollowType.User">{{ followVO.followee }}</a>
        <a id="followee" v-else>{{ followVO.followee }}</a>

        <div id="followButton">
            <el-button v-show="followVO.followed">已关注</el-button>
            <el-button v-show="!followVO.followed" plain>未关注</el-button>
        </div>
    </div>
</template>

<script lang=ts>
import {defineComponent} from "vue";
import {FollowType} from "@/common/consts/Enums";

export default defineComponent({
    name: "FollowComponent",
    props: ["followVO"],
    setup() {
        return {
            FollowType,
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

#follow {
    border: 1px solid red;
    box-sizing: border-box;
    width: 300px;
    height: 50px;
}

#avatar {
    float: left;
    margin: 0 20px 0 0;
}

#followee {
    margin: 0;
    float: left;
    font-size: 23px;
    line-height: 50px;
}

#followButton {
    float: left;
}
</style>