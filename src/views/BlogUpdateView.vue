<template>
    <div id="blog">
        <el-input v-model="dto.title"></el-input>
        <el-switch
            active-text="所有人可见"
            inactive-text="仅自我可见"
            v-model="visible"
            style="margin-right: 100px"
        />

        <el-switch
            active-text="允许评论"
            inactive-text="禁止评论"
            v-model="allowComment"/>

        <HyperTextInputBox
            id="HyperTextInputBox"
            v-model:content="dto.content"
            :height="'500px'"
            @submitEmit="submit"
            v-if="showInputBox">
        </HyperTextInputBox>

    </div>
</template>

<script lang=ts>
import {defineComponent, reactive, ref} from "vue";
import HyperTextInputBox from "@/components/HyperTextInputBoxComponent.vue";
import {BlogUpdateDTO} from "@/common/dtos/BlogDTOs";
import {useRoute} from "vue-router";
import BlogApis from "@/common/apis/BlogApis";
import {BlogVO} from "@/common/vos/BlogVO";
import {ElMessage} from "element-plus";
import router from "@/router";

export default defineComponent({
    name: "BlogUpdateView",
    components: {
        HyperTextInputBox,
    },
    setup() {
        let dto: BlogUpdateDTO = reactive({
            id: 0,
            title: "",
            content: "",
            selfVisible: false,
            commentForbidden: false,
        });
        let allowComment = ref(true);
        let allowVisit = ref(true);
        let showInputBox = ref(false);

        function submit() {
            dto.selfVisible = !allowVisit.value;
            dto.commentForbidden = !allowComment.value;
            BlogApis.blogUpdate(dto).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("更新成功");
                    router.push("/blog/" + dto.id);
                } else {
                    ElMessage.error("更新失败：" + res.data.message);
                }
            });
        }

        function created() {
            let blogIdStr = useRoute().query.id as string | undefined;
            if (blogIdStr === undefined || blogIdStr === "") {
                ElMessage.error("缺少参数blogId");
                return;
            }
            BlogApis.getBlog(Number(blogIdStr)).then(res => {
                if (res.data.code === 200) {
                    let vo = res.data.body as BlogVO;
                    dto.id = vo.id;
                    dto.title = vo.title;
                    dto.content = vo.content;
                    dto.selfVisible = vo.selfVisible;
                    dto.commentForbidden = vo.commentForbidden;

                    allowComment.value = !dto.commentForbidden;
                    allowVisit.value = !dto.selfVisible;
                    showInputBox.value = true;
                } else {
                    ElMessage.error("查找blogVO失败：" + res.data.message);
                }
            });
        }

        created();


        return {
            dto,
            submit,
            showInputBox,
            allowComment,
            visible: allowVisit,
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