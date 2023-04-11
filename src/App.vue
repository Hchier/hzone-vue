<template>

    <el-container style="background-color: #f6f6f6; min-height: 1000px">
        <el-header id="header">
            <router-link to="/login" v-show="!loggedIn">登录</router-link>
        </el-header>

        <el-header id="header" v-show="loggedIn">
            <el-badge class="link" :hidden="true">
                <router-link to="/">首页</router-link>
            </el-badge>
            |
            <el-badge class="link" :hidden="true">
                <router-link to="/zone">个人空间</router-link>
            </el-badge>
            |
            <el-badge class="link" :value="200" :max="99">
                <router-link to="/notice">通知</router-link>
            </el-badge>
            |
            <el-badge class="link" :value="200" :max="99">
                <router-link to="/privateChat">私信</router-link>
            </el-badge>
            |
            <el-badge class="link" :hidden="true">
                <router-link to="/login" @click="logout">登出</router-link>
            </el-badge>
        </el-header>

        <el-main>
            <router-view
                @loginSuccessEmit="loginSuccess"
                :chatUserVOList="chatUserVOList"
                :msg2dList="msg2dList"
                @recallEmit="recall"
                @updateMsg2dListEmit="updateMsg2dList"
                @addToMsg2dListEmit="addToMsg2dList"
            />
        </el-main>

        <el-footer id="footer">Footer</el-footer>
    </el-container>

</template>

<script lang="ts">

import {defineComponent, reactive, ref} from "vue";
import router from "@/router";
import {PrivateChatMsgVO} from "@/common/vos/PrivateChatMsgVO";
import {ElMessage} from "element-plus";
import {ChatUserVO} from "@/common/vos/ChatUserVO";
import {WsMsgDTO} from "@/common/wsMsgs/WsMsgDTO";
import {WsMsgType} from "@/common/consts/Enums";
import TalkApis from "@/common/apis/TalkApis";
import UserApis from "@/common/apis/UserApis";
import {PrivateMsgRecallDTO} from "@/common/dtos/TalkDTOs";
import {PrivateChatMsg} from "@/common/wsMsgs/PrivateChatMsg";
import {PrivateChatRecallMsg} from "@/common/wsMsgs/PrivateChatRecallMsg";
import {getCookie, setCookie} from "@/utils/cookies";

export default defineComponent({
    setup: function (props, context) {
        let loggedIn = ref(false);
        let ws: WebSocket;

        function loginSuccess(username: string) {
            let token: string = getCookie("token");
            if (token === "") {
                return;
            }
            ElMessage.success("登录成功");
            router.push({path: "/"});
            createWs();
        }

        function createWs() {
            ws = new WebSocket("ws://localhost:9527/ws/" + getCookie("token"));
            ws.onopen = function () {
                loggedIn.value = true;
            };
            ws.onmessage = function (this: WebSocket, ev: MessageEvent<string>) {
                switch (Number(ev.data[8])) {
                    case WsMsgType.NoticeNumIncr:
                        //todo
                        break;
                    case WsMsgType.PrivateChatMsg:
                        let dto1 = JSON.parse(ev.data) as WsMsgDTO<PrivateChatMsg>;
                        let added = false;
                        let privateChatMsgVO: PrivateChatMsgVO = {
                            id: dto1.body.id,
                            from: dto1.body.sender,
                            to: dto1.body.receiver,
                            content: dto1.body.content,
                            createTime: dto1.body.createTime,
                            fromCurrentUser: false,
                        };
                        chatUserVOList.forEach((value, index) => {
                            if (value.sender === dto1.body.sender) {
                                msg2dList[index].push(privateChatMsgVO);
                                added = true;
                            }
                        });
                        if (!added) {
                            chatUserVOList.push({
                                sender: dto1.body.sender,
                                unReadNum: 1,
                            });
                            msg2dList[0].push(privateChatMsgVO);
                        }
                        break;
                    case WsMsgType.PrivateChatRecallMsg:
                        let dto2 = JSON.parse(ev.data) as WsMsgDTO<PrivateChatRecallMsg>;
                        chatUserVOList.forEach((value, index) => {
                            if (value.sender === dto2.body.sender) {
                                msg2dList[index].forEach((value, i) => {
                                    if (value.id === dto2.body.id) {
                                        msg2dList[index].splice(i, 1);
                                    }
                                });
                            }
                        });
                        break;
                    default:
                        console.log("未知的WsMsgType：" + Number(ev.data[8]));
                        break;
                }

            };
            ws.onerror = function () {
                loggedIn.value = false;
            };
            ws.onclose = function () {
                loggedIn.value = false;
            };
        }


        function checkLoginStatus() {
            let token = getCookie("token");
            if (token !== "") {
                UserApis.loginByToken().then(res => {
                    if (res.data.code === 200) {
                        loggedIn.value = true;
                        createWs();
                    } else {
                        loggedIn.value = false;
                        router.push({path: "/login"});
                    }
                });
            }
        }

        let chatUserVOList: ChatUserVO[] = reactive([]);
        let msg2dList: PrivateChatMsgVO[][] = reactive([]);

        function recall(receiver: string, id: number) {
            let index = -1;
            for (let i = 0; i < chatUserVOList.length; i++) {
                if (receiver === chatUserVOList[i].sender) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                return;
            }
            msg2dList[index].forEach((value, i) => {
                if (value.id === id) {
                    msg2dList[index].splice(i, 1);
                }
            });
        }

        function updateMsg2dList(index: number, list: Array<PrivateChatMsgVO>) {
            msg2dList[index] = list;
        }

        function addToMsg2dList(index: number, vo: PrivateChatMsgVO) {
            msg2dList[index].push(vo);
        }

        function loadChatUserVOList() {
            // TalkApis.getChatUserVOList().then(res => {
            //     if (res.data.code === 200) {
            //         let list = res.data.body as Array<ChatUserVO>;
            //         chatUserVOList.push(...list);
            //     } else {
            //         ElMessage.error("加载ChatUserVOList失败");
            //     }
            // });
        }

        function logout() {
            setCookie("token", "", -1);
            loggedIn.value = false;
            ws.close();
            chatUserVOList.splice(0);
            msg2dList.splice(0);
        }

        function created() {
            checkLoginStatus();
            loadChatUserVOList();
        }

        created();

        return {
            loginSuccess,
            loggedIn,
            // msgMap,
            chatUserVOList,
            msg2dList,
            recall,
            updateMsg2dList,
            addToMsg2dList,
            logout,
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

.link{
    margin: 0 20px;
}

#footer {
    position: fixed;
    bottom: 0;
    display: block;
}
</style>
