<template>
    <div id="singleMsg" class="clear">
        <el-avatar
            id="avatar"
            :style="{'float':  vo.fromCurrentUser?'right':'left', 'margin':vo.fromCurrentUser?'0 0 0 5px':'0 5px 0 0'}"
            :src="avatarPrefix + vo.from +'.png'" @error="true">
            <img :src="avatarPrefix+Math.floor(Math.random()*10)+'.png'" :alt="vo.from">
        </el-avatar>

        <div id="username" :style="{'text-align':  vo.fromCurrentUser?'right':'left'}">{{ vo.from }}</div>

        <div class="clear" :style="{'float':  vo.fromCurrentUser?'right':'left', 'width': '450px'}">
            <div
                id="content"
                v-html="vo.content"
                :style="{float: vo.fromCurrentUser?'right':'left','background-color': vo.fromCurrentUser?'rgba(96,215,151,0.8)':'#e6e6e6'}">
            </div>
            <el-button v-if="vo.fromCurrentUser && ((Date.now() - Date.parse(vo.createTime)) / 1000) < 120" id="recall"
                       type="primary" size="small" :style="{'float': 'right'}"
                       @click="recall">撤回
            </el-button>
        </div>

        <span id="createTime" v-if="!vo.fromCurrentUser"
              :style="{'float':  'left', 'margin': '5px 0px 0px 40px'}">{{ vo.createTime }}</span>
        <span id="createTime" v-if="vo.fromCurrentUser"
              :style="{'float':  'right', 'margin': '5px 40px 0px 0px'}">{{ vo.createTime }}</span>

    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import TalkApis from "@/common/apis/TalkApis";
import {ElMessage} from "element-plus";
import {PrivateMsgRecallDTO} from "@/common/dtos/TalkDTOs";
import {ChatMsgType} from "@/common/consts/Enums";
import {AVATAR_PREFIX} from "@/common/consts/const";


export default defineComponent({
    name: "SingleMsgComponent",
    props: ["msgType", "vo"],
    emits: ["recallEmit"],
    setup(props, context) {
        let avatarPrefix = AVATAR_PREFIX;
        function recall() {
            if (((Date.now() - Date.parse(props.vo.createTime)) / 1000) >= 120) {
                ElMessage.error("只能撤回2分钟内的消息...");
            }
            if (props.msgType === ChatMsgType.PrivateChatMsg) {
                let dto: PrivateMsgRecallDTO = {
                    id: props.vo.id,
                    sender: "",
                    receiver: props.vo.to,
                };
                TalkApis.recallPrivateMsg(dto).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success("撤回成功");
                        context.emit("recallEmit", props.vo.to, props.vo.id);
                    } else {
                        ElMessage.error("撤回失败：" + res.data.body);
                    }
                });
            } else if (props.msgType === ChatMsgType.BroadcastChatMsg) {
                TalkApis.recallBroadcastMsg(props.vo.id).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success("撤回成功");
                        context.emit("recallEmit", "", props.vo.id);
                    } else {
                        ElMessage.error("撤回失败：" + res.data.body);
                    }
                });
            } else {
                ElMessage.error("未知的消息类型：" + props.msgType);
            }
        }

        return {
            avatarPrefix,
            recall,
        };
    },
});
</script>

<style scoped lang="css">

.clear::before, .clear::after {
    content: '';
    display: table;
    clear: both;
}

#singleMsg {
    box-sizing: border-box;
    width: 495px;
    padding-bottom: 10px;
}

#username {
    width: 460px;
    margin: 5px;
}

#content {
    float: left;
    margin: 0px;
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid #e6f0fd;
    border-radius: 7px 7px;
    max-width: 350px;
    overflow-wrap: break-word;
    text-align: left;


}

#createTime {
    color: #8590a6;
    font-size: 10px;
}

#recall {
    padding: 1px 3px;
}
</style>
