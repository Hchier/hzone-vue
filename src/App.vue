<template>

    <el-container style="background-color: #f6f6f6; min-height: 1000px">
        <el-header id="header">
            <router-link to="/">首页</router-link>
            |
            <router-link to="/zone" v-show="loggedIn">个人空间</router-link>
            |
            <router-link to="/login" v-show="!loggedIn">登录</router-link>
            |
            <el-badge :value="200" :max="99" class="item">
                <router-link to="/notice">通知</router-link>
            </el-badge>
            |
            <router-link to="/" v-show="loggedIn">登出</router-link>
        </el-header>
        <el-main>
            <router-view @loginSuccessEmit="loginSuccess"/>
        </el-main>
        <el-footer id="footer">Footer</el-footer>
    </el-container>

</template>

<script lang="ts">

import {defineComponent, ref} from "vue";
import router from "@/router";

export default defineComponent({
    setup() {
        let loggedIn = ref(false);

        function loginSuccess(username: string) {
            loggedIn.value = true;

        }

        function checkLoginStatus() {
            if (document.cookie.length > 0) {
                let arr = document.cookie.split('; ');//注意：分号+空格
                for (let i = 0; i < arr.length; i++) {
                    let index = arr[i].indexOf("=");
                    if (arr[i].substring(0, index) === "token") {
                        loggedIn.value = true;
                        return;
                    }
                }
            }
            loggedIn.value = false;
        }

        checkLoginStatus();

        return {
            loginSuccess,
            loggedIn,
        };
    },
});

</script>

<style lang="scss">
#app {
    text-align: center;

}

#header {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

#footer {
    position: fixed;
    bottom: 0;
    display: block;
}
</style>
