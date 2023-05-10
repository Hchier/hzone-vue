<template>
    <div id="SingleBarrage" class="clear">
        <!--        <el-avatar id="avatar" :size="5"-->
        <!--                   :src="avatarPrefix + username +'.png'" @error="true">-->
        <!--            <img :src="avatarPrefix+Math.floor(Math.random()*10)+'.png'" :alt="username">-->
        <!--        </el-avatar>-->

        <img id="avatar" :src="avatarPrefix + username +'.png'" alt="" style="border-radius:50%; overflow:hidden;">

        <span id="content" :style="{color: randomColor()}">{{ content }}</span>
    </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {AVATAR_PREFIX} from "@/common/consts/const";

export default defineComponent({
    name: "SingleBarrageComponent",
    props: ["username", "content"],
    setup() {
        let avatarPrefix = AVATAR_PREFIX;

        function randomColor(): string {
            let color = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"];
            let num = Math.floor(Math.random() * 7);
            return color[num];
        }

        return {
            avatarPrefix,
            randomColor,
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

#SingleBarrage {
    border: 1px solid #f0f2f7;
    box-sizing: border-box;
    background-color: #f6f6f6;
    border-radius: 10px;
    display: inline-block;
    padding: 3px;
}

#avatar {
    float: left;
    height: 23px;
    margin-top: 1px;
}

#content {
    margin: 0 5px 0 5px;
    line-height: 25px;
    font-size: 15px;
    text-align: center;
}
</style>
