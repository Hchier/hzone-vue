<template>
    <div id="father">
        <Blog v-bind:blogVO="blogVO" v-bind:autoUnfold="true"></Blog>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import Blog from "@/components/BlogComponent.vue";
import {BlogVO} from "@/common/vos/BlogVO";
import BlogApis from "@/common/apis/BlogApis";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {deepCopy} from "@/utils/copy";

export default defineComponent({
    name: "HomeView",
    components: {
        Blog,
    },

    setup() {
        let blogVO: BlogVO = reactive({
            id: -1,
            publisher: "xxx",
            title: "",
            content: "",
            favorNum: 0,
            commentNum: 0,
            rewardNum: 0,
            favored: false,
            selfVisible: false,
            hidden: false,
            commentForbidden: false,
            updateTime: "",
            topic: "",
            updatePermission: false,
        });

        function getBlogVO() {
            let idStr: string = useRoute().params.id as string;
            let id: number;
            if (((idStr != null) &&
                (idStr !== '') &&
                !isNaN(Number(idStr.toString())))) {
                id = Number(idStr);
            } else {
                ElMessage.error("查找博客失败");
                return;
            }

            BlogApis.getBlog(id).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("查找博客成功");
                    let vo = res.data.body as BlogVO;
                    deepCopy(vo, blogVO);
                    console.log(blogVO.id);
                } else {
                    ElMessage.error(res.data.message);
                }
            });
        }

        getBlogVO();

        return {
            blogVO,
        };
    },
});
</script>

<style scoped>
#father {
    margin: 0 auto;
    width: 700px;
}
</style>