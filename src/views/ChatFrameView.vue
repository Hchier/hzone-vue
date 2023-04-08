<template>
    <div id="chatFrame">
        <div id="userList">
            <el-scrollbar>
                <div v-for="(item, index) in chatUserVOList" :key="item">
                    <ChatUser id="user" tabindex="1" :chatUserVO="item" @click="loadMsgList(index, item.sender)"></ChatUser>
                </div>
            </el-scrollbar>
        </div>

        <div id="msgList">
            <el-scrollbar ref="msgListScrollbar">
                <div v-for="item in msg2dList[msgListIndex]" :key="item.id">
                    <SingleMsg :vo="item" @recallEmit="recall"></SingleMsg>
                </div>
                <el-button type="primary" @click="openDialog(); loadHistoryMsgs()" v-if="showInputArea">
                    查找更多聊天记录
                </el-button>
            </el-scrollbar>
        </div>

        <div id="inputArea" v-if="showInputArea">
            <el-input
                v-model="msgContent"
                :autosize="{ minRows: 6, maxRows: 6 }"
                type="textarea"
                placeholder="请输入..."
            />
            <el-button type="primary" @click="sendMsg">发送</el-button>
        </div>

        <el-dialog
            :title="'与'+currentChatUser+'的历史记录'"
            v-model="showHistoryMsgs"
            style="width: 560px"
            @close="closeDialog">

            <el-button type="primary" @click="loadHistoryMsgs()">查找更多</el-button>
            <div v-for="item in historyMsgs" :key="item.id">
                <SingleMsg :vo="item" @recallEmit="recall" style="margin: auto"></SingleMsg>
            </div>

        </el-dialog>
    </div>
</template>

<script lang=ts>
import {defineComponent, reactive, ref} from "vue";
import ChatUser from "@/components/ChatUserComponent.vue";
import SingleMsg from "@/components/SingleMsgComponent.vue";
import {PrivateChatMsgVO} from "@/common/vos/PrivateChatMsgVO";
import TalkApis from "@/common/apis/TalkApis";
import {ElMessage} from "element-plus";
import {ChatUserVO} from "@/common/vos/ChatUserVO";
import {PrivateChatAddDTO, PrivateChatAddSuccessDTO} from "@/common/dtos/TalkDTOs";

export default defineComponent({
    name: "ChatFrameView",
    props: ["chatUserVOList", "msg2dList"],
    components: {
        ChatUser,
        SingleMsg,
    },
    emits: ["recallEmit", "updateMsg2dListEmit", "addToMsg2dListEmit"],
    setup(props, context) {
        //记录要展示与谁的聊天记录
        let msgListIndex = ref(-1);
        let currentChatUser = ref("");

        let showInputArea = ref(false);


        function loadMsgList(index: number, username: string) {
            if (props.msg2dList[index] === undefined) {
                TalkApis.getPrivateMsgsWith(username, 0).then(res => {
                    if (res.data.code === 200) {
                        let list = res.data.body as Array<PrivateChatMsgVO>;
                        list.reverse();
                        showInputArea.value = true;
                        context.emit("updateMsg2dListEmit", index, list);
                        // this.$refs['msgListScrollbar'].wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight;
                        // msgListScrollbar.value!.setScrollTop();
                    } else {
                        ElMessage.error("查找聊天记录失败");
                    }
                });
                this.$refs['msgListScrollbar'].wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight;
            }
            msgListIndex.value = index;
            currentChatUser.value = props.chatUserVOList[msgListIndex.value].sender;
            msgContent.value = "";
        }


        //撤回操作可能发生在聊天框中，也可能发生在查看历史消息的dialog中
        function recall(receiver: string, id: number) {
            context.emit("recallEmit", receiver, id);

            historyMsgs.forEach((value, index) => {
                if (value.id === id) {
                    historyMsgs.splice(index, 1);
                }
            });
        }

        function loadChatUserVOList() {
            TalkApis.getChatUserVOList().then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<ChatUserVO>;
                    Object.assign(props.chatUserVOList, [...list]);
                } else {
                    ElMessage.error("加载ChatUserVOList失败");
                }
            });
        }

        //是否展示 查看更多聊天记录的框
        let showHistoryMsgs = ref(false);
        let historyMsgs: Array<PrivateChatMsgVO> = reactive([]);
        let historyMsgsPageNum = ref(0);

        function openDialog() {
            showHistoryMsgs.value = true;
        }

        function loadHistoryMsgs() {
            TalkApis.getPrivateMsgsWith(props.chatUserVOList[msgListIndex.value].sender, historyMsgsPageNum.value).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<PrivateChatMsgVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多");
                        return;
                    }
                    historyMsgs.reverse();
                    historyMsgs.push(...list);
                    historyMsgs.reverse();
                    historyMsgsPageNum.value++;
                } else {
                    ElMessage.error("查找历史消息失败：" + res.data.message);
                }
            });
        }

        function closeDialog() {
            let len = historyMsgs.length;
            for (let i = 0; i < len; i++) {
                historyMsgs.pop();
            }
            showHistoryMsgs.value = false;
            historyMsgsPageNum.value = 0;
        }

        let msgContent = ref("");

        function sendMsg() {
            let dto: PrivateChatAddDTO = {
                to: "",
                content: "",
            };
            dto.to = props.chatUserVOList[msgListIndex.value].sender;
            dto.content = msgContent.value;
            TalkApis.sendMsg(dto).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("发送成功");
                    let successDto: PrivateChatAddSuccessDTO = res.data.body as PrivateChatAddSuccessDTO;
                    let privateMsgVO: PrivateChatMsgVO = {
                        id: successDto.id,
                        from: successDto.from,
                        to: successDto.to,
                        content: successDto.content,
                        createTime: successDto.createTime,
                        fromCurrentUser: true,
                    };
                    context.emit("addToMsg2dListEmit", msgListIndex.value, privateMsgVO);
                    msgContent.value = "";
                } else {
                    ElMessage.error("发送失败：" + res.data.message);
                }
            });
        }

        function created() {
            loadChatUserVOList();
        }

        created();

        return {
            showInputArea,
            loadMsgList,
            recall,
            msgListIndex,
            showHistoryMsgs,
            historyMsgs,
            historyMsgsPageNum,
            loadHistoryMsgs,
            openDialog,
            closeDialog,
            msgContent,
            sendMsg,
        };
    },
});
</script>

<style scoped>
#chatFrame {
    position: relative;
    margin: 0 auto;
    box-sizing: border-box;
    border: 1px solid #f0f2f7;
    width: 700px;
    height: 750px;
    background-color: white;
}

#userList {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    border: 1px solid #f0f2f7;
    width: 200px;
    height: 750px;
}

#user{
    box-sizing: border-box;
    border: 1px solid #f0f2f7;
}

#user:hover{
    background-color: #e6e6e6;
}

#user:focus {
    background-color: #e6e6e6;
}

#msgList {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    border: 1px solid #e6f0fd;
    width: 500px;
    height: 570px;
}

#inputArea {
    position: absolute;
    bottom: 0;
    right: 0;
    box-sizing: border-box;
    border: 1px solid #f0f2f7;
    width: 500px;
    height: 180px;
}
</style>