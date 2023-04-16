<template>
    <div id="chatFrame">
        <div id="userList">
            <el-scrollbar>
                <div v-for="(item, index) in chatUserVOList" :key="item">
                    <ChatUser id="user" tabindex="1" :chatUserVO="item"
                              @click="loadMsgList(index, item.sender)"></ChatUser>
                </div>
            </el-scrollbar>
        </div>

        <ChatMsgView
            id="msgArea"
            v-if="showMsgArea"
            :chatMsgType="ChatMsgType.PrivateChatMsg"
            :chatMsgList="chatMsgList"
            :chatUser="chatUser"
            @newMsg="addToPrivateChatMsg2dList"
            @recall="recall">
        </ChatMsgView>

    </div>
</template>

<script lang=ts>
import {defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import ChatUser from "@/components/ChatUserComponent.vue";
import {ChatMsgVO} from "@/common/vos/ChatMsgVO";
import TalkApis from "@/common/apis/TalkApis";
import {ElMessage, ElScrollbar} from "element-plus";
import {ChatUserVO} from "@/common/vos/ChatUserVO";
import {PrivateChatAddDTO, PrivateChatAddSuccessDTO} from "@/common/dtos/TalkDTOs";
import ChatMsgView from "@/components/ChatMsgViewComponent.vue";
import {ChatMsgType} from "@/common/consts/Enums";

export default defineComponent({
    name: "ChatFrameView",
    computed: {
        ChatMsgType() {
            return ChatMsgType;
        },
    },
    props: ["chatUserVOList", "privateChatMsg2dList"],
    components: {
        ChatUser,
        ChatMsgView,
    },
    emits: ["recall", "updatePrivateChatMsg2dListEmit", "addToPrivateChatMsg2dList"],
    setup(props, context) {
        // 当前正在与谁对话
        let chatUser = ref("");
        // 记录要展示与谁的聊天list
        let chatUserVOListIndex = ref(-1);
        // 聊天list
        let chatMsgList: Array<ChatMsgVO> = reactive([]);
        // 是否展示聊天区
        let showMsgArea = ref(false);
        let msgListScrollbarRef = ref<InstanceType<typeof ElScrollbar>>();

        function loadMsgList(index: number, username: string) {
            //为undefined，即还不存在currentUser与chatUser的聊天记录
            if (props.privateChatMsg2dList[index] === undefined) {
                TalkApis.getPrivateMsgsWith(username, 0).then(res => {
                    if (res.data.code === 200) {
                        let list = res.data.body as Array<ChatMsgVO>;
                        list.reverse();
                        context.emit("updatePrivateChatMsg2dListEmit", index, list);

                        chatMsgList.push(...list);

                        chatUserVOListIndex.value = index;
                        chatUser.value = props.chatUserVOList[index].sender;
                    } else {
                        ElMessage.error("查找聊天记录失败");
                    }
                });
            } else {
                chatMsgList.splice(0);
                chatMsgList.push(...props.privateChatMsg2dList[index]);

                chatUserVOListIndex.value = index;
                chatUser.value = props.chatUserVOList[index].sender;
            }
            showMsgArea.value = true;

            scrollToBottom();
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

        function addToPrivateChatMsg2dList(vo: ChatMsgVO) {
            context.emit("addToPrivateChatMsg2dList", chatUserVOListIndex.value, vo);
            chatMsgList.push(vo);
        }

        function recall(receiver: string, id: number) {
            chatMsgList.forEach((value, index) => {
                if (value.id === id) {
                    chatMsgList.splice(index, 1);
                }
            });
            context.emit("recall", ChatMsgType.PrivateChatMsg, receiver, id);
        }

        //监听
        watch(props.privateChatMsg2dList, (newVal, oldValue) => {
            console.log("changed");
            chatMsgList.splice(0);
            chatMsgList.push(...newVal[chatUserVOListIndex.value]);
            // chatMsgList.reverse();
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

        function created() {
            loadChatUserVOList();
        }

        created();

        return {
            loadMsgList,
            chatUserVOListIndex,
            msgListScrollbarRef,
            chatMsgList,
            chatUser,
            showMsgArea,
            addToPrivateChatMsg2dList,
            recall,
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
    height: 1060px;
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

#user {
    box-sizing: border-box;
    border: 1px solid #f0f2f7;
}

#user:hover {
    background-color: #e6e6e6;
}

#user:focus {
    background-color: #e6e6e6;
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

</style>