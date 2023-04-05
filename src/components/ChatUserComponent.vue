<template>
    <div id="chatUser" class="clear">
        <el-avatar id="avatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="45"/>

        <a id="username">{{ username}}</a>

    </div>
</template>

<script lang=ts>
import {defineComponent} from "vue";

export default defineComponent({
    name: "ChatUserComponent",
    props: ["username"],
    setup() {
        return {};
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

</style>