<template>
    <div id="blog">
        <el-input v-model="dto.title" placeholder="请输入标题..." style="margin-bottom: 10px"></el-input>

        <el-input v-model="dto.topic" placeholder="请输入话题..." style="margin-bottom: 10px"></el-input>

        <HyperTextInputBox
            id="HyperTextInputBox"
            v-model:content="dto.content"
            :height="'500px'"
            @submitEmit="submit"
            v-if="true">
        </HyperTextInputBox>

    </div>
</template>

<script lang=ts>
import {defineComponent, reactive, ref} from "vue";
import HyperTextInputBox from "@/components/HyperTextInputBoxComponent.vue";
import {BlogPublishDTO} from "@/common/dtos/BlogDTOs";
import BlogApis from "@/common/apis/BlogApis";
import {ElMessage} from "element-plus";
import router from "@/router";

export default defineComponent({
    name: "BlogPublishView",
    components: {
        HyperTextInputBox,
    },
    setup() {
        let dto: BlogPublishDTO = reactive({
            title: "",
            content: "",
            topic: "",
        });

        function submit() {
            BlogApis.blogPublish(dto).then(res => {
                if (dto.title === "" || dto.content === "" || dto.topic === "") {
                    ElMessage.error("空");
                    return;
                }
                if (res.data.code === 200) {
                    ElMessage.success("发布成功");
                    let id = res.data.body as number;
                    router.push("/blog/" + id);
                } else {
                    ElMessage.error("发布失败：" + res.data.message);
                }
            });
        }

        return {
            dto,
            submit,
        };
    },
});
</script>

<style scoped>
#blog {
    margin: 0 auto;
    width: 700px;
    /*border: 1px solid red;*/
}

#HyperTextInputBox {

}
</style>