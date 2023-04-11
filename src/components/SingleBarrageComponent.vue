<template>
    <div id="SingleBarrage" class="clear">
        <img id="avatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="">
        <span id="content" :style="{color: randomColor()}">{{ content }}</span>
    </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
    name: "SingleBarrageComponent",
    props: ["username", "content"],
    setup() {
        function randomColor(): string {
            let color = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"];
            let num = Math.floor(Math.random() * 7);
            return color[num];
        }

        return {
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
