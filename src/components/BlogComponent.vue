<template>
    <div id="blog" class="clear">
        <el-avatar
            id="avatar"
            :size="50"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />

        <span id="publisher">{{ blogVO.publisher }}</span>

        <span id="title"> <font size="5">{{ blogVO.title }}</font></span>

        <div id="content">{{ blogVO.content }}</div>

        <el-button id="unfoldButton" type="primary" @click="unfold" v-show="foldStatus">展开</el-button>

        <p id="updateTime">发布于 {{ blogVO.updateTime }}</p>

        <div id="favorButton">
            <el-button type="primary" v-show="blogVO.favored">
                已点赞
                ({{ blogVO.favorNum }})
            </el-button>
            <el-button type="primary" v-show="!blogVO.favored" plain>
                点赞
                ({{ blogVO.favorNum }})
            </el-button>
        </div>


    </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {BlogVO} from "@/common/vos/BlogVO";

export default defineComponent({
    props: ["blogVO", "autoUnfold"],

    setup(props) {
        let content: string = ref(props.blogVO.content.substring(0, 100));
        let foldStatus = ref(true);

        function unfold() {
            let content: HTMLElement | null = document.getElementById("content");
            if (content !== null) {
                content.style.setProperty("height", "auto");
            }
        }


        onMounted((() => {
            if (props.autoUnfold) {
                foldStatus.value = false;
                unfold();
            }
        }));

        return {
            content,
            unfold,
            foldStatus,
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

#blog {
    position: relative;
    margin: auto;
    width: 700px;
    border: 1px solid red;
    /*min-height: 100px;*/
}

#avatar {
    position: absolute;
    top: 10px;
    left: 10px;
}

#publisher {
    position: absolute;
    top: 20px;
    left: 75px;
}

#title {
    top: 20px;
    margin: 20px auto;
    display: inline-block;
}

#content {
    padding: 20px;
    overflow-wrap: break-word;
    text-align: left;
    overflow: hidden;
    height: 28px;
}

#unfoldButton {
    float: right;
    margin: -5px 30px 0 0;
}

#updateTime {
    float: left;
    margin: 5px 0 0 20px;
    font-size: 10px;
    color: #8590a6;
}

#favorButton {
    float: left;
    margin: 40px 0px 10px -170px;
}

</style>