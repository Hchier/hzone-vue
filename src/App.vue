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
                <router-link to="/blogPublish">发表博客</router-link>
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
                :privateChatMsg2dList="privateChatMsg2dList"
                @recall="recall"
                @updatePrivateChatMsg2dListEmit="updatePrivateChatMsg2dList"
                @addToPrivateChatMsg2dList="addToPrivateChatMsg2dList"
            />
        </el-main>

        <el-footer id="footer">Footer</el-footer>
        <el-footer id="footer">
            <el-button @click="getBroadcastMsgList">show</el-button>
        </el-footer>

        <el-dialog v-model="showBroadcastMsgList" title=""
                   style="width: 500px;height:710px;background-color: white">
            <BroadcastChatFrameView
                :chatMsgList="broadcastMsgList"
                @addToBroadcastMsgList="addToBroadcastMsgList"
                @recall="recall">
            </BroadcastChatFrameView>
        </el-dialog>

    </el-container>

</template>

<script lang="ts">

import {defineComponent, reactive, ref} from "vue";
import router from "@/router";
import {ElMessage} from "element-plus";
import {ChatUserVO} from "@/common/vos/ChatUserVO";
import {WsMsgDTO} from "@/common/wsMsgs/WsMsgDTO";
import {ChatMsgType, WsMsgType} from "@/common/consts/Enums";
import TalkApis from "@/common/apis/TalkApis";
import UserApis from "@/common/apis/UserApis";
import {PrivateMsgRecallDTO} from "@/common/dtos/TalkDTOs";
import {PrivateChatMsg} from "@/common/wsMsgs/PrivateChatMsg";
import {PrivateChatRecallMsg} from "@/common/wsMsgs/PrivateChatRecallMsg";
import {getCookie, setCookie} from "@/utils/cookies";
import {ChatMsgVO} from "@/common/vos/ChatMsgVO";
import {BroadcastChatMsg} from "@/common/wsMsgs/BroadcastChatMsg";
import BroadcastChatFrameView from "@/views/BroadcastChatFrameView.vue";
import {BroadcastChatRecallMsg} from "@/common/wsMsgs/BroadcastChatRecallMsg";

export default defineComponent({
    components: {
        BroadcastChatFrameView,
    },
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
                        let privateChatMsgDTO = JSON.parse(ev.data) as WsMsgDTO<PrivateChatMsg>;
                        let added = false;
                        let privateChatMsgVO: ChatMsgVO = {
                            id: privateChatMsgDTO.body.id,
                            from: privateChatMsgDTO.body.sender,
                            to: privateChatMsgDTO.body.receiver,
                            content: privateChatMsgDTO.body.content,
                            createTime: privateChatMsgDTO.body.createTime,
                            fromCurrentUser: false,
                        };
                        chatUserVOList.forEach((value, index) => {
                            if (value.sender === privateChatMsgDTO.body.sender) {
                                privateChatMsg2dList[index].push(privateChatMsgVO);
                                added = true;
                            }
                        });
                        if (!added) {
                            chatUserVOList.push({
                                sender: privateChatMsgDTO.body.sender,
                                unReadNum: 1,
                            });
                            privateChatMsg2dList[0].push(privateChatMsgVO);
                        }
                        break;
                    case WsMsgType.PrivateChatRecallMsg:
                        let privateChatRecallMsgDTO = JSON.parse(ev.data) as WsMsgDTO<PrivateChatRecallMsg>;
                        chatUserVOList.forEach((value, index) => {
                            if (value.sender === privateChatRecallMsgDTO.body.sender) {
                                for (let i = 0; i < privateChatMsg2dList[index].length; i++) {
                                    if (privateChatMsg2dList[index][i].id === privateChatRecallMsgDTO.body.id) {
                                        privateChatMsg2dList[index].splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        });
                        break;
                    case WsMsgType.BroadcastChatMsg:
                        let broadcastChatMsgDTO = JSON.parse(ev.data) as WsMsgDTO<BroadcastChatMsg>;
                        let broadcastChatMsgVO: ChatMsgVO = {
                            id: broadcastChatMsgDTO.body.id,
                            from: broadcastChatMsgDTO.body.sender,
                            to: broadcastChatMsgDTO.body.receiver,
                            content: broadcastChatMsgDTO.body.content,
                            createTime: broadcastChatMsgDTO.body.createTime,
                            fromCurrentUser: false,
                        };
                        console.log("BroadcastChatMsg");
                        broadcastMsgList.push(broadcastChatMsgVO);
                        break;
                    case WsMsgType.BroadcastChatRecallMsg:
                        let broadcastChatRecallMsgDTO = JSON.parse(ev.data) as WsMsgDTO<BroadcastChatRecallMsg>;
                        console.log(broadcastChatRecallMsgDTO);
                        console.log(broadcastMsgList);
                        for (let i = 0; i < broadcastMsgList.length; i++) {
                            if (broadcastMsgList[i].id === broadcastChatRecallMsgDTO.body.id) {
                                console.log("移除" + broadcastMsgList[i]);
                                broadcastMsgList.splice(i, 1);
                                break;
                            }
                        }
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
        let privateChatMsg2dList: ChatMsgVO[][] = reactive([]);

        //可能撤回私信或广播消息
        function recall(chatMsgType: number, receiver: string, id: number) {
            console.log(chatMsgType, id);
            //撤回私信
            if (chatMsgType === ChatMsgType.PrivateChatMsg) {
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
                privateChatMsg2dList[index].forEach((value, i) => {
                    if (value.id === id) {
                        privateChatMsg2dList[index].splice(i, 1);
                    }
                });
            }
            //撤回广播消息
            else {
                broadcastMsgList.forEach((value, index) => {
                    if (value.id === id) {
                        broadcastMsgList.splice(index, 1);
                        return;
                    }
                });
            }
        }

        function updatePrivateChatMsg2dList(index: number, list: Array<ChatMsgVO>) {
            privateChatMsg2dList[index] = list;
        }

        function addToPrivateChatMsg2dList(index: number, vo: ChatMsgVO) {
            privateChatMsg2dList[index].push(vo);
        }

        //广播消息
        let broadcastMsgList: Array<ChatMsgVO> = reactive([]);
        let showBroadcastMsgList = ref(false);
        let broadcastMsgListPageNum = 0;

        function getBroadcastMsgList() {
            showBroadcastMsgList.value = true;
            if (broadcastMsgListPageNum === 0 && broadcastMsgList.length > 0) {
                return;
            }
            TalkApis.getBroadcastMsgs(broadcastMsgListPageNum).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<ChatMsgVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多");
                        return;
                    }
                    list.reverse();
                    broadcastMsgList.push(...list);
                } else {
                    ElMessage.error("查找失败：" + res.data.message);
                }
            });
        }

        function addToBroadcastMsgList(vo: ChatMsgVO) {
            broadcastMsgList.push(vo);
        }

        function logout() {
            setCookie("token", "", -1);
            loggedIn.value = false;
            ws.close();
            chatUserVOList.splice(0);
            privateChatMsg2dList.splice(0);
            broadcastMsgList.splice(0);
        }

        function created() {
            checkLoginStatus();
        }

        created();

        return {
            loginSuccess,
            loggedIn,
            // msgMap,
            chatUserVOList,
            privateChatMsg2dList,
            recall,
            updatePrivateChatMsg2dList,
            addToPrivateChatMsg2dList,
            logout,
            addToBroadcastMsgList,
            broadcastMsgList,
            showBroadcastMsgList,
            getBroadcastMsgList,
            ChatMsgType,
        };
    },
});

</script>

<style lang="scss">
#app {
    text-align: center;
}

.clear::before, .clear::after {
    content: '';
    display: table;
    clear: both;
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

.link {
    margin: 0 20px;
}

#footer {
    position: fixed;
    bottom: 0;
    display: block;
}

p {
    margin: 0;
}
</style>
