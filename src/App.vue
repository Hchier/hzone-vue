<template>

    <el-container style="background-color: #f6f6f6; min-height: 1000px">
        <el-header id="header">
            <router-link to="/login" v-show="!loggedIn">登录</router-link>
        </el-header>

        <el-header id="header" v-show="loggedIn">
            <router-link to="/">首页</router-link>
            |
            <router-link to="/zone">个人空间</router-link>
            |
            <el-badge :value="200" :max="99" class="item">
                <router-link to="/notice">通知</router-link>
            </el-badge>
            |
            <router-link to="/">登出</router-link>
        </el-header>

        <el-main>
            <router-view @loginSuccessEmit="loginSuccess" :msgMap="msgMap"/>
        </el-main>

        <el-footer id="footer">Footer</el-footer>
    </el-container>

</template>

<script lang="ts">

import {defineComponent, reactive, ref} from "vue";
import router from "@/router";
import {PrivateMsgVO} from "@/common/vos/PrivateMsgVO";
import {ElMessage} from "element-plus";

export default defineComponent({
    setup(props, context) {
        let loggedIn = ref(false);
        let ws: WebSocket;

        function loginSuccess(username: string) {
            let token: string = getCookie("token");
            if (token === "") {
                return;
            }
            ws = new WebSocket("ws://localhost:9527/ws/" + getCookie("token"));

            ws.onopen = function () {
                loggedIn.value = true;
                ElMessage.success("登录成功");
                router.push({path: "/"});
            };

            ws.onmessage = function (this: WebSocket, ev: MessageEvent<string>) {
                let vo: PrivateMsgVO = JSON.parse(ev.data);
                //todo
            };

            ws.onerror = function () {
                loggedIn.value = false;
            };

            ws.onclose = function () {
                loggedIn.value = false;
            };
        }

        function getCookie(name: string): string {
            if (document.cookie.length > 0) {
                let arr = document.cookie.split('; ');//注意：分号+空格
                for (let i = 0; i < arr.length; i++) {
                    let index = arr[i].indexOf("=");
                    if (arr[i].substring(0, index) === name) {
                        return arr[i].substring(index + 1);
                    }
                }
            }
            return "";
        }

        function checkLoginStatus() {
            loggedIn.value = (getCookie("token") !== "");
        }

        let msgMap = reactive(new Map<string, Array<PrivateMsgVO>>());
        msgMap.set(
            "jack",
            [{
                id: 1,
                from: "jack",
                to: "hchier",
                content: "111",
                createTime: "202020",
                float: "left",
            }, {
                id: 2,
                from: "jack",
                to: "hchier",
                content: "222",
                createTime: "202020",
                float: "right",
            }]);

        msgMap.set(
            "hhh",
            [{
                id: 3,
                from: "jack",
                to: "hchier",
                content: "333",
                createTime: "202020",
                float: "left",
            }, {
                id: 4,
                from: "jack",
                to: "hchier",
                content: "444",
                createTime: "202020",
                float: "left",
            }]);

        function created() {
            checkLoginStatus();
        }

        created();

        return {
            loginSuccess,
            loggedIn,
            msgMap,
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
