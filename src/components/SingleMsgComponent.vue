<template>
    <div id="singleMsg" class="clear">
        <el-avatar
            id="avatar"
            :style="{'float':  vo.fromCurrentUser?'right':'left'}"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />

        <div id="username" :style="{'text-align':  vo.fromCurrentUser?'right':'left'}">{{ vo.from }}</div>

        <div class="clear" :style="{'float':  vo.fromCurrentUser?'right':'left', 'width': '450px'}">
            <div id="content" :style="{float:  vo.fromCurrentUser?'right':'left'}">
                {{ vo.content }}
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


export default defineComponent({
    name: "SingleMsgComponent",
    props: ["vo"],
    emits: ["recallEmit"],
    setup(props, context) {
        function recall() {
            TalkApis.recall(props.vo.id).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("撤回成功")
                    context.emit("recallEmit", props.vo.to, props.vo.id);
                } else {
                    ElMessage.error("撤回失败：" + res.data.message);
                }
            });
        }

        return {
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
    border: 1px solid red;
    width: 500px;

}

#username {
    width: 460px;
    margin: 5px;
}

#content {
    float: left;
    margin: 0px;
    padding: 2px;
    box-sizing: border-box;
    border: 1px solid red;
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
