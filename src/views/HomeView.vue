<template>
    <div id="father">
        <div id="hotTopicArea">
            <div class="rankingTag" tabindex="1" @click="getHotTopicList('total')">总榜</div>
            <div class="rankingTag" tabindex="1" @click="getHotTopicList('week')">周榜</div>
            <div class="rankingTag" tabindex="1" @click="getHotTopicList('day')">日榜</div>
            <div v-for="(item, index) in hotTopicList" v-bind:key="item">
                <SingleHotTopic :rank="index" :name="item.name" :readNum="item.readNum"></SingleHotTopic>
            </div>
        </div>

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
import TopicApis from "@/common/apis/TopicApis";
import {TopicTinyVO} from "@/common/vos/TopicTinyVO";
import {ElMessage} from "element-plus";
import SingleHotTopic from "@/components/SingleHotTopicComponent.vue";

export default defineComponent({
    name: "HomeView",
    components: {
        Blog,
        SingleHotTopic,
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

        let hotTopicList: Array<TopicTinyVO> = reactive([]);

        function getHotTopicList(type: string) {
            TopicApis.getReadNumChart(type).then(res => {
                if (res.data.code === 200) {
                    hotTopicList.splice(0);
                    let list = res.data.body as Array<TopicTinyVO>;
                    hotTopicList.push(...list);
                } else {
                    ElMessage.error("查找热搜失败：" + res.data.message);
                }
            });
        }

        function created() {
            getBlogList();
            getHotTopicList("total");
        }

        created();

        return {
            blogVOList,
            hotTopicList,
            getHotTopicList,
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

.rankingTag {
    display: inline-block;
    font-size: 15px;
    padding: 8px 21px;
    margin: 0 4px;
    border-radius: 10px;
    background-color: rgb(236, 245, 255);
    color: #409eff;
    border: 1px solid rgb(64, 158, 255);
}

.rankingTag:hover {
    background-color: rgb(64, 158, 255);
    color: white;
    cursor: pointer;
}

.rankingTag:focus {
    background-color: rgb(64, 158, 255);
    color: white;
    cursor: pointer;
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