<template>
    <ChatMsgView
        id="msgArea"
        v-if="true"
        :msgType="ChatMsgType.BroadcastChatMsg"
        :chatMsgList="chatMsgList"
        :chatUser="''"
        @newMsg="addToBroadcastMsgList"
        @recall="recall">
    </ChatMsgView>
</template>

<script lang=ts>
import {defineComponent} from "vue";
import ChatMsgView from "@/components/ChatMsgViewComponent.vue";
import {ChatMsgVO} from "@/common/vos/ChatMsgVO";
import {ChatMsgType} from "@/common/consts/Enums";

export default defineComponent({
    name: "BroadcastChatFrameView",
    computed: {
        ChatMsgType() {
            return ChatMsgType;
        },
    },
    props: ["chatMsgList"],
    components: {
        ChatMsgView,
    },
    emits: ["addToBroadcastMsgList", "recall"],
    setup(props, context) {
        function addToBroadcastMsgList(vo: ChatMsgVO) {
            context.emit("addToBroadcastMsgList", vo);
        }

        function recall(receiver: string, id: number) {
            context.emit("recall", ChatMsgType.BroadcastChatMsg, receiver, id);
        }

        return {
            addToBroadcastMsgList,
            recall,
        };
    },
});
</script>

<style scoped>

</style>