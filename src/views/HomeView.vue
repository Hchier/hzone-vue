<template>
    <div id="father">
        <HotTopic id="hotTopicArea"></HotTopic>

        <div id="blogArea">
            <div v-for="item in blogVOList" v-bind:key="item.id">
                <Blog :blogVO="item" :autoUnfold="false"></Blog>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {BlogVO} from "@/common/vos/BlogVO";
import BlogApis from "@/common/apis/BlogApis";
import {deepCopy} from "@/utils/copy";
import Blog from "@/components/BlogComponent.vue";
import HotTopic from "@/components/HotTopicComponent.vue";

export default defineComponent({
    name: "HomeView",
    components: {
        Blog,
        HotTopic,
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
#father {
    /*width: 1010px;*/
    /*margin: auto;*/
}

#hotTopicArea {
    width: 250px;
    margin-right: 10px;
    border: 1px solid #f0f2f7;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    background-color: white;
}


#blogArea {
    width: 700px;
    height: 200px;
    /*border: 1px solid black;*/
    /*box-sizing: border-box;*/
    display: inline-block;
    vertical-align: top;
}

</style>