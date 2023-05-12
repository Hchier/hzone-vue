<template>
    <div v-for="item in vos" v-bind:key="item.id">
        <NoticeComponent style="margin: 0 auto 10px;border: 1px solid #f0f2f7" :noticeVO="item"></NoticeComponent>
    </div>
    <el-button @click="loadMoreVos" type="primary">加载更多</el-button>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {NoticeVO} from "@/common/vos/NoticeVO";
import NoticeApis from "@/common/apis/NoticeApis";
import {ElMessage} from "element-plus";
import NoticeComponent from "@/components/NoticeComponent.vue";

export default defineComponent({
    name: "NoticeView",
    components: {
        NoticeComponent,
    },

    setup() {
        let vos: Array<NoticeVO> = reactive([]);
        let pageNum = 0;

        function getVos() {
            if (pageNum === 0 && vos.length > 0) {
                return;
            }
            NoticeApis.get(pageNum).then(res => {
                if (res.data.code === 200) {
                    let arr = res.data.body as Array<NoticeVO>;
                    if (arr.length === 0) {
                        ElMessage.error("暂无更多...");
                        return;
                    }
                    vos.push(...arr);
                } else {
                    ElMessage.error("加载失败: " + res.data.message);
                }
            });
        }

        function loadMoreVos() {
            pageNum++;
            getVos();
        }

        function created() {
            getVos();
        }

        created();

        return {
            vos,
            loadMoreVos,
        };
    },

});
</script>

<style scoped>

</style>