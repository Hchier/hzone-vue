<template>
    <div id="chatBox">
        <div id="msgArea">
            <el-scrollbar ref="msgListScrollbarRef">
                <div v-for="item in chatMsgList" :key="item.id">
                    <SingleMsg :vo="item" :msgType="msgType" @recallEmit="recall"></SingleMsg>
                </div>
                <el-button type="primary" @click="openDialog(); loadHistoryMsgs()">
                    查找更多聊天记录
                </el-button>
            </el-scrollbar>
        </div>

        <div id="inputArea">
            <HyperTextInputBox
                v-model:content="msgContent"
                :height="'150px'"
                @submitEmit="sendMsg">
            </HyperTextInputBox>
        </div>

        <el-dialog
            :title="chatMsgType === ChatMsgType.PrivateChatMsg?'与'+chatUser+'的历史记录':'广播消息历史记录'"
            v-model="showHistoryMsgs"
            style="width: 560px"
            @close="closeDialog">

            <el-button type="primary" @click="loadHistoryMsgs()">查找更多</el-button>
            <div v-for="item in historyMsgs" :key="item.id">
                <SingleMsg :vo="item" :msgType="msgType" @recallEmit="recall" style="margin: auto"></SingleMsg>
            </div>
        </el-dialog>
    </div>
</template>

<script lang=ts>
import {defineComponent, onBeforeUnmount, reactive, ref, watch} from "vue";
import SingleMsg from "@/components/SingleMsgComponent.vue";
import HyperTextInputBox from "@/components/HyperTextInputBoxComponent.vue";
import {ChatMsgVO} from "@/common/vos/ChatMsgVO";
import TalkApis from "@/common/apis/TalkApis";
import {ElMessage, ElScrollbar} from "element-plus";
import {BroadcastMsgAddSuccessDTO, PrivateChatAddDTO, PrivateChatAddSuccessDTO} from "@/common/dtos/TalkDTOs";
import {ChatMsgType} from "@/common/consts/Enums";

export default defineComponent({
    name: "ChatMsgViewComponent",
    components: {
        SingleMsg,
        HyperTextInputBox,
    },
    props: ["msgType", "chatMsgList", "chatUser"],
    emits: ["newMsg", "recall"],
    setup: function (props, context) {
        // 是否展示 查看更多聊天记录的框
        let showHistoryMsgs = ref(false);
        // 历史聊天记录
        let historyMsgs: Array<ChatMsgVO> = reactive([]);
        let historyMsgsPageNum = ref(0);
        let msgListScrollbarRef = ref<InstanceType<typeof ElScrollbar>>();

        function openDialog() {
            showHistoryMsgs.value = true;
        }

        function loadHistoryMsgs() {
            // if (props.chatMsgType === ChatMsgType.PrivateChatMsg) {
            //     TalkApis.getPrivateMsgsWith(props.chatUser, historyMsgsPageNum.value).then(res => {
            //         if (res.data.code === 200) {
            //             let list = res.data.body as Array<ChatMsgVO>;
            //             if (list.length === 0) {
            //                 ElMessage.error("暂无更多");
            //                 return;
            //             }
            //             historyMsgs.reverse();
            //             historyMsgs.push(...list);
            //             historyMsgs.reverse();
            //             console.log(historyMsgs);
            //             historyMsgsPageNum.value++;
            //         } else {
            //             ElMessage.error("查找历史消息失败：" + res.data.message);
            //         }
            //     });
            // } else if (props.chatMsgType === ChatMsgType.BroadcastChatMsg) {
            //
            // } else {
            //     ElMessage.error("未知的ChatMsgType");
            //     let p: Promise<any> = TalkApis.getPrivateMsgsWith(props.chatUser, historyMsgsPageNum.value);
            //
            // }
            let promise: Promise<any>;
            if (props.msgType === ChatMsgType.PrivateChatMsg) {
                promise = TalkApis.getPrivateMsgsWith(props.chatUser, historyMsgsPageNum.value);
            } else if (props.msgType === ChatMsgType.BroadcastChatMsg) {
                promise = TalkApis.getBroadcastMsgs(historyMsgsPageNum.value);
            } else {
                ElMessage.error("未知的ChatMsgType");
                return;
            }
            promise.then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<ChatMsgVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多");
                        return;
                    }
                    historyMsgs.reverse();
                    historyMsgs.push(...list);
                    historyMsgs.reverse();
                    console.log(historyMsgs);
                    historyMsgsPageNum.value++;
                } else {
                    ElMessage.error("查找历史消息失败：" + res.data.message);
                }
            });
        }

        function closeDialog() {
            historyMsgs.splice(0);
            showHistoryMsgs.value = false;
            historyMsgsPageNum.value = 0;
        }

        //撤回操作可能发生在聊天框中，也可能发生在查看历史消息的dialog中
        function recall(receiver: string, id: number) {
            //todo
            context.emit("recall", receiver, id);

            historyMsgs.forEach((value, index) => {
                if (value.id === id) {
                    historyMsgs.splice(index, 1);
                }
            });
        }

        // 聊天框中的内容
        let msgContent = ref("");

        function sleep(d: number) {
            return new Promise((resolve) => setTimeout(resolve, d));
        }

        async function sendMsg() {
            if (props.msgType === ChatMsgType.PrivateChatMsg) {
                let dto: PrivateChatAddDTO = {
                    to: props.chatUser,
                    content: msgContent.value,
                };
                while (props.chatUser === "") {
                    await sleep(100);
                }
                TalkApis.sendPrivateMsg(dto).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success("发送成功");
                        let chatMsgVO: ChatMsgVO = res.data.body as ChatMsgVO;
                        context.emit("newMsg", chatMsgVO);
                        msgContent.value = "";
                        // scrollToBottom();
                    } else {
                        ElMessage.error("发送失败：" + res.data.message);
                        // console.log(res.data);
                    }
                });
            } else if (props.msgType === ChatMsgType.BroadcastChatMsg) {
                TalkApis.sendBroadcastMsg(msgContent.value).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success("发送成功");
                        let dto: BroadcastMsgAddSuccessDTO = res.data.body as BroadcastMsgAddSuccessDTO;
                        let chatMsgVO: ChatMsgVO = {
                            id: dto.id,
                            from: dto.from,
                            to: "",
                            content: dto.content,
                            createTime: dto.createTime,
                            fromCurrentUser: true,
                        };
                        context.emit("newMsg", chatMsgVO);
                        msgContent.value = "";
                    } else {
                        ElMessage.error("发送失败：" + res.data.message);
                    }
                });
            } else {
                ElMessage.error("未知的ChatMsgType");
            }
        }

        //监听
        watch(props.chatMsgList, (newVal, oldValue) => {
            scrollToBottom();
        });

        //滚到最底部。到顶部的高度应该计算出来，但是我不会
        function scrollToBottom() {
            return setTimeout(function () {
                msgListScrollbarRef.value?.setScrollTop(1000000);
            }, 50); // 定时时间

        }

        onBeforeUnmount(() => {
            clearTimeout(scrollToBottom());
        });

        return {
            showHistoryMsgs,
            openDialog,
            loadHistoryMsgs,
            closeDialog,
            recall,
            sendMsg,
            msgContent,
            historyMsgs,
            ChatMsgType,
            msgListScrollbarRef,
        };
    },
});
</script>

<style scoped>

#chatBox {
    position: relative;
}

#msgArea {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    border: 1px solid #e6f0fd;
    width: 500px;
    height: 400px;
}

#inputArea {
    position: absolute;
    top: 400px;
    right: 0;
    box-sizing: border-box;
    border: 1px solid #f0f2f7;
    width: 500px;
    /*height: 450px;*/
}

</style>