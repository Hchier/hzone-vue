<template>
    <div id="box">
        <div style="border: 1px solid #ccc">
            <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
            />
            <Editor
                :style="{'height': height}"
                v-model="valueHtml"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
            />
        </div>
        <el-button @click="submit" type="primary">提交</el-button>
    </div>
</template>
<script lang=ts>
import {defineComponent, watch} from "vue";
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import {onBeforeUnmount, ref, shallowRef, onMounted} from "vue";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {IEditorConfig, IToolbarConfig} from "@wangeditor/editor";
import {SlateElement} from "@wangeditor/editor";
import {ElMessage} from "element-plus";
import {ElementWithId} from "@wangeditor/core/dist/core/src/editor/interface";
import {useRoute} from "vue-router";
import BlogApis from "@/common/apis/BlogApis";
import {BlogVO} from "@/common/vos/BlogVO";
import UserApis from "@/common/apis/UserApis";

export default defineComponent({
    name: "HyperTextInputBoxComponent",
    components: {Editor, Toolbar},
    props: ["content", "height"],
    emits: ["update:content", "submitEmit"],
    setup: function (props, context) {
        // 编辑器实例，必须用 shallowRef
        const editorRef = shallowRef();

        // 内容 HTML
        const valueHtml = ref(props.content);

        // 插入过的图片的地址
        const picListInserted: string[] = [];
        // 一开始就存在的图片的地址
        const picListExistedFromTheBeginning: string[] = [];
        // 插入过的视频的地址
        const videoListInserted: string[] = [];
        // 一开始就存在的视频的地址
        const videoListExistedFromTheBeginning: string[] = [];

        const toolbarConfig: Partial<IToolbarConfig> = {};


        const editorConfig: Partial<IEditorConfig> = {
            placeholder: '请输入内容...',
        };

        editorConfig.MENU_CONF = {};
        // 图片配置
        editorConfig.MENU_CONF['uploadImage'] = {
            // 上传图片的api
            server: "http://localhost:9527/user/uploadResource",
            // form-data fieldName
            fieldName: "resource",
            // 跨域是否传递 cookie
            withCredentials: true,

            // 单个文件上传成功之后
            onSuccess(file: File, res: any) {
                //res即后端相应的数据
                ElMessage.success(`${file.name}` + "上传成功");
            },

            // 单个文件上传失败
            onFailed(file: File, res: any) {
                console.log(res);
                ElMessage.error(`${file.name}` + "上传失败");
            },

            // 上传错误，或者触发 timeout 超时
            onError(file: File, err: any, res: any) {  // TS 语法
                ElMessage.error(`${file.name}` + "上传出错。err: " + err);
            },
        };

        //转换图片链接
        function customParseImageSrc(src: string): string {
            //后端返回的是相对路径
            return "http://localhost:7010" + src;
        }

        editorConfig.MENU_CONF['insertImage'] = {
            //插入图片之后的回调
            onInsertedImage(imageNode: any | null) {
                if (imageNode == null) return;
                const {src, alt, url, href} = imageNode;
                let src_str = src as string;
                src_str = src_str.substring(src_str.lastIndexOf("/") + 1);
                picListInserted.push(src_str);
            },

            parseImageSrc: customParseImageSrc,
        };


        editorConfig.MENU_CONF['uploadVideo'] = {
            server: "http://localhost:9527/user/uploadResource",
            fieldName: "resource",
            maxFileSize: 100 * 1024 * 1024, // 100M
            withCredentials: true,

            // 单个文件上传成功之后
            onSuccess(file: File, res: any) {
                ElMessage.success(`${file.name}` + "上传成功");
            },

            // 单个文件上传失败
            onFailed(file: File, res: any) {
                console.log(res);
                ElMessage.error(`${file.name}` + "上传失败");
            },

            // 上传错误，或者触发 timeout 超时
            onError(file: File, err: any, res: any) {  // TS 语法
                ElMessage.error(`${file.name}` + "上传出错。err: " + err);
            },
        };

        //转换视频链接
        function customParseVideoSrc(src: string): string {
            //后端返回的是相对路径
            return "http://localhost:7010" + src;
        }

        editorConfig.MENU_CONF['insertVideo'] = {
            onInsertedVideo(videoNode: any | null) {  // TS 语法
                if (videoNode == null) return;
                //              封面
                const {src, poster} = videoNode;
                videoListInserted.push(src);
            },
            parseVideoSrc: customParseVideoSrc,
        };

        watch(valueHtml, (newVal, oldValue) => {
            // 监视valueHtml，发生变化后同步给父组件
            context.emit("update:content", newVal);
        });

        // 组件销毁时，也及时销毁编辑器
        onBeforeUnmount(() => {
            const editor = editorRef.value;
            if (editor == null) return;
            editor.destroy();
        });

        const handleCreated = (editor: any) => {
            // 记录 editor 实例，重要！
            editorRef.value = editor;
            // console.log(editor.getConfig());
            //记录一开始就存在的图片的地址
            picListExistedFromTheBeginning.push(...getList("image"));
            videoListExistedFromTheBeginning.push(...getList("video"));
        };

        //得到编辑框中的图片href列表
        function getList(type: "image" | "video"): string[] {
            const editor = editorRef.value;
            let list: any[] = editor.getElemsByType(type);
            let res: string[] = [];
            list.forEach(value => {
                let src_str = value.src as string;
                src_str = src_str.substring(src_str.lastIndexOf("/") + 1);
                res.push(src_str);
            });
            return res;
        }

        function getUselessPicOrVideo(type: "image" | "video", listInserted: Array<string>, listExistedFromTheBeginning: string[]): string[] {
            let setExist: Set<string> = new Set<string>();
            for (const item of getList(type)) {
                setExist.add(item);
            }
            console.log("setExist: ", setExist);
            console.log("listInserted: ", listInserted);
            console.log("listExistedFromTheBeginning: ", listExistedFromTheBeginning);
            let listToDelete: string[] = [];
            listInserted.forEach(value => {
                if (!setExist.has(value)) {
                    listToDelete.push(value);

                }
            });
            listExistedFromTheBeginning.forEach(value => {
                if (!setExist.has(value)) {
                    listToDelete.push(value);
                }
            });
            console.log("listToDelete: ", listToDelete);
            return listToDelete;
        }


        //删除多余的图片或视频
        function deleteUseless() {
            UserApis.deleteResourceList(
                [
                    ...getUselessPicOrVideo("image", picListInserted, picListExistedFromTheBeginning),
                    ...getUselessPicOrVideo("video", videoListInserted, videoListExistedFromTheBeginning),
                ],
            ).then(res => {
                if (res.data.code === 200) {
                } else {
                }
            });
        }

        function submit() {
            deleteUseless();
            valueHtml.value = "";
            context.emit("submitEmit");
        }

        return {
            editorRef,
            valueHtml,
            mode: 'default',
            toolbarConfig,
            editorConfig,
            handleCreated,
            submit,
        };
    },
});
</script>

<style scoped>

</style>