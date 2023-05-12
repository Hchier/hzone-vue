<template>
    <div id="chatUser" class="clear">
        <el-avatar
            id="avatar"
            :size="45"
            :src="avatarPrefix + chatUserVO.sender +'.png'" @error="true">
            <img :src="avatarPrefix+Math.floor(Math.random()*10)+'.png'" :alt="chatUserVO.sender">
        </el-avatar>

        <a id="username">{{ chatUserVO.sender }}</a>
        <el-badge id="unReadNum" :value="chatUserVO.unReadNum" :max="99">
        </el-badge>

    </div>
</template>

<script lang=ts>
import {defineComponent} from "vue";
import {AVATAR_PREFIX} from "@/common/consts/const";

export default defineComponent({
    name: "ChatUserComponent",
    props: ["chatUserVO"],
    setup() {
        let avatarPrefix = AVATAR_PREFIX;
        return {
            avatarPrefix,
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

#chatUser {
    box-sizing: border-box;
    border: 1px solid red;
    width: 200px;
    height: 50px;
}

#avatar {
    float: left;
    margin: 0 5px 0 5px;
}

#username {
    margin: 0;
    float: left;
    font-size: 18px;
    line-height: 50px;
}

#unReadNum {
    float: left;
}

</style>