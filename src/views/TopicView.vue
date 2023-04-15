<template>
    <div id="topic">
        <HotTopic id="hotTopic"></HotTopic>

        <div id="topicArea">
            <Topic :topicVO="topicVO"></Topic>

            <div>
                <div v-for="item in blogList" :key="item.id">
                    <Blog :blogVO="item" :autoUnfold="false"></Blog>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang=ts>
import {defineComponent, reactive} from "vue";
import {TopicVO} from "@/common/vos/TopicVO";
import TopicApis from "@/common/apis/TopicApis";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {deepCopy} from "@/utils/copy";
import HotTopic from "@/components/HotTopicComponent.vue";
import BlogApis from "@/common/apis/BlogApis";
import {BlogVO} from "@/common/vos/BlogVO";
import Blog from "@/components/BlogComponent.vue";
import Topic from "@/components/TopicComponent.vue";

export default defineComponent({
    name: "TopicView",
    components: {
        HotTopic,
        Topic,
        Blog,
    },
    setup() {
        let topicVO: TopicVO = reactive({
            name: "",
            picUrl: "",
            visible: false,
            totalReadNum: 0,
            weekReadNum: 0,
            dayReadNum: 0,
            discussionNum: 0,
            followedNum: 0,
            followed: false,
        });

        function getTopicVO() {
            let name = useRoute().query.name as string | undefined;
            if (name === undefined || name === "") {
                ElMessage.error("参数无效");
                return;
            }
            TopicApis.getVO(name).then(res => {
                if (res.data.code === 200) {
                    let vo = res.data.body as TopicVO;
                    deepCopy(vo, topicVO);
                    topicVO.name = "#" + topicVO.name;
                    getListByTopic(vo.name);
                } else {
                    ElMessage.error("查找话题失败：" + res.data.message);
                }
            });
        }

        let pageNum = 0;
        let blogList: Array<BlogVO> = reactive([]);

        function getListByTopic(name: string) {
            BlogApis.getListByTopic(name, pageNum++).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<BlogVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多");
                        return;
                    }
                    blogList.push(...list);
                } else {
                    ElMessage.error("查找blogList失败：" + res.data.message);
                }
            });
        }


        function created() {
            getTopicVO();
        }

        created();

        return {
            topicVO,
            blogList,
        };
    },
});
</script>

<style scoped>
#topic {
    /*width: 700px;*/
    /*border: 1px solid red;*/
    /*box-sizing: border-box;*/
    /*margin: auto;*/
}

#hotTopic {
    display: inline-block;
    vertical-align: top;
    width: 250px;
    margin-right: 10px;
    border: 1px solid #f0f2f7;
    box-sizing: border-box;
    background-color: white;
}

#topicArea {
    display: inline-block;
    vertical-align: top;
}


</style>