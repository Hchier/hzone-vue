<template>
    <div id="singleMsg" class="clear">
        <el-avatar
            id="avatar"
            :style="{'float':  vo.float}"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />

        <div id="username" :style="{'text-align':  vo.float}">{{ vo.from }}</div>

        <div class="clear" :style="{'float':  vo.float, 'width': '450px'}">
            <div id="content" :style="{float:  vo.float}">
                {{ vo.content }}
            </div>
            <el-button v-if="vo.float === 'right'" id="recall" type="primary" size="small" :style="{'float': vo.float}">撤回</el-button>
        </div>

        <span id="createTime" v-if="vo.float === 'left'"
              :style="{'float':  vo.float, 'margin': '5px 0px 0px 40px'}">{{ vo.createTime }}</span>
        <span id="createTime" v-if="vo.float === 'right'"
              :style="{'float':  vo.float, 'margin': '5px 40px 0px 0px'}">{{ vo.createTime }}</span>

    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {PrivateMsgVO} from "@/common/vos/PrivateMsgVO";

export default defineComponent({
    name: "HelloWorld",
    props: ["vo"],
    setup(props) {
        return {};
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
