<template>
    <div id="hotTopic">
        <div class="rankingTag" tabindex="1" @click="getHotTopicList('total')">总榜</div>
        <div class="rankingTag" tabindex="1" @click="getHotTopicList('week')">周榜</div>
        <div class="rankingTag" tabindex="1" @click="getHotTopicList('day')">日榜</div>
        <div v-for="(item, index) in hotTopicList" v-bind:key="item">
            <SingleHotTopic :rank="index" :name="item.name" :readNum="item.readNum"></SingleHotTopic>
        </div>
    </div>
</template>

<script lang=ts>
import {defineComponent, reactive} from "vue";
import SingleHotTopic from "@/components/SingleHotTopicComponent.vue";
import {TopicTinyVO} from "@/common/vos/TopicTinyVO";
import TopicApis from "@/common/apis/TopicApis";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: "HotTopicComponent",
    components: {
        SingleHotTopic,
    },
    setup() {
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
            getHotTopicList("total");
        }

        created();

        return {
            hotTopicList,
            getHotTopicList,
        };
    },
});
</script>

<style scoped>
#hotTopic {
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

</style>