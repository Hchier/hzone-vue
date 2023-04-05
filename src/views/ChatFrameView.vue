<template>
    <div id="chatFrame">
        <div id="userList">
            <el-scrollbar>
                <div v-for="item in msgMap" :key="item[0]">
                    <ChatUser :username="item[0]" @click="showMsgList(item[1])"></ChatUser>
                </div>
            </el-scrollbar>
        </div>
        <div id="msgList">
            <div v-for="item in msgList" :key="item.id">
                <SingleMsg :vo="item"></SingleMsg>
            </div>
        </div>
        <div id="inputArea"></div>
    </div>
</template>

<script lang=ts>
import {defineComponent, reactive} from "vue";
import ChatUser from "@/components/ChatUserComponent.vue";
import SingleMsg from "@/components/SingleMsgComponent.vue";
import {PrivateMsgVO} from "@/common/vos/PrivateMsgVO";

export default defineComponent({
    name: "ChatFrameComponent",
    props: ["msgMap"],
    components: {
        ChatUser,
        SingleMsg,
    },
    setup() {
        let msgList: Array<PrivateMsgVO> = reactive([]);

        function showMsgList(list: Array<PrivateMsgVO>) {
            let len = msgList.length;
            for (let i = 0; i < len; i++) {
                msgList.pop();
            }

            msgList.push(...list);
        }

        return {
            msgList,
            showMsgList,
        };
    },
});
</script>

<style scoped>
#chatFrame {
    position: relative;
    margin: 0 auto;
    box-sizing: border-box;
    border: 1px solid red;
    width: 700px;
    height: 750px;
}

#userList {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    border: 1px solid red;
    width: 200px;
    height: 750px;
}

#msgList {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    border: 1px solid red;
    width: 500px;
    height: 570px;
}

#inputArea {
    position: absolute;
    bottom: 0;
    right: 0;
    box-sizing: border-box;
    border: 1px solid red;
    width: 500px;
    height: 180px;
}
</style>