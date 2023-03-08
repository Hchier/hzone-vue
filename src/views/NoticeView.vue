<template>
    <div v-for="item in vos" v-bind:key="item.id">
        <NoticeComponent :noticeVO="item"></NoticeComponent>
    </div>
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
            NoticeApis.get(pageNum++).then(res => {
                if (res.data.code === 200) {
                    let arr = res.data.body as Array<NoticeVO>;
                    arr.forEach(value => {
                        vos.push(value);
                    });
                } else {
                    ElMessage.error("加载失败: " + res.data.message);
                }
            });
        }

        getVos();

        return {
            vos,
        };
    },

});
</script>

<style scoped>

</style>