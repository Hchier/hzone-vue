<template>
    <div id="BlogComment" class="clear" v-show="visible">
        <el-avatar id="avatar" :size="50"
                   :src="avatarPrefix + vo.sender +'.png'" @error="true">
            <img :src="avatarPrefix+Math.floor(Math.random()*10)+'.png'" :alt="vo.sender">
        </el-avatar>
        <span id="sender">
            <span>{{ vo.sender }}</span>
        </span>
        <span id="content" v-html="vo.content"></span>
        <p id="createTime">发布于 {{ vo.createTime }}</p>

        <el-popover placement="right" trigger="hover">
            <template #reference>
                <el-button id="opButton" type="primary">操作</el-button>
            </template>

            <el-button style="display: none"></el-button>

            <el-button id="deleteButton" class="button" type="danger" v-show="vo.deletePermission" @click="deleteMsg">
                删除
            </el-button>

            <el-button id="deleteButton" class="button" type="danger" v-show="vo.hiddenPermission" @click="hidden">
                隐藏
            </el-button>

        </el-popover>

    </div>

</template>

<script lang="ts">
import {ElMessage} from "element-plus";
import {defineComponent, reactive, ref} from "vue";
import {WallVO} from "@/common/vos/WallVO";
import WallApis from "@/common/apis/WallApis";
import {AVATAR_PREFIX} from "@/common/consts/const";

export default defineComponent({
    name: "WallMsgComponent",
    props: ["wallVO"],
    setup(props) {
        //被删除后设为false
        let visible = ref(true);
        let vo: WallVO = reactive(props.wallVO);
        let avatarPrefix = AVATAR_PREFIX;

        function deleteMsg() {
            WallApis.delete(vo.id).then(res => {
                if (res.data.code === 200) {
                    visible.value = false;
                    ElMessage.success("删除成功");
                } else {
                    ElMessage.error("删除失败：" + res.data.message);
                }
            });
        }

        function hidden() {
            WallApis.hidden(vo.id).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("隐藏成功");
                    Object.assign(props.wallVO, {
                        content: "<span style='color: #8590a6'>该评论已被隐藏</span>",
                    });
                } else {
                    ElMessage.error("隐藏失败：" + res.data.message);
                }
            });
        }

        return {
            avatarPrefix,
            visible,
            vo,
            deleteMsg,
            hidden,
        };
    },
});
</script>

<style scoped>

.clear::before, .clear::after {
    content: '';
    display: table;
    clear: both;
}

#BlogComment {
    position: relative;
    border: 1px solid #f0f2f7;
    background-color: white;
    overflow: hidden;
    width: 700px;

}

#avatar {
    position: absolute;
    top: 10px;
    left: 10px;
}

#sender {
    position: absolute;
    top: 10px;
    left: 80px;
}

#opButton {
    position: absolute;
    left: 620px;
    top: 10px;
}

.button {
    margin: 0 0 10px;
    display: block;
}

#content {
    float: left;
    margin-top: 50px;
    margin-left: 80px;
    width: 600px;
    overflow-wrap: break-word;
    text-align: left;
}

#createTime {
    float: left;
    margin-top: 10px;
    margin-left: 80px;
    font-size: 8px;
    color: #8590a6;
}

</style>