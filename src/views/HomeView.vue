<template>
    <div id="father">
        <div v-for="item in blogVOList" v-bind:key="item.id">
            <Blog :blogVO="item" :autoUnfold="false"></Blog>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {BlogVO} from "@/common/vos/BlogVO";
import BlogApis from "@/common/apis/BlogApis";
import {deepCopy} from "@/utils/copy";
import Blog from "@/components/BlogComponent.vue";

export default defineComponent({
    name: "HomeView",
    components: {
        Blog,
    },
    setup() {
        let blogVOList: Array<BlogVO> = reactive([]);

        const getBlogList = () => {
            BlogApis.getHomeList().then(res => {
                if (res.data.code === 200) {
                    let vos = res.data.body as Array<BlogVO>;
                    deepCopy(vos, blogVOList);
                }
            });
        };

        function created() {
            getBlogList();
        }

        created();

        return {
            blogVOList,
        };
    },
});
</script>

<style scoped>
    #father{
        width: 700px;
        margin: auto;
    }
</style>