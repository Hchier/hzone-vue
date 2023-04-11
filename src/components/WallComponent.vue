<template>
    <Barrage
        id="barrage"
        ref="barrage"
        v-model:danmus="wallVOList"
        useSlot
        loop
        :channels="5"
        :speeds="150"
        :top="12"
        :right="10"
    >
        <template v-slot:dm="{danmu }">
            <!--            <span style="color: red">{{ danmu.content }}</span>-->
            <SingleBarrage :username="danmu.sender" :content="danmu.content"></SingleBarrage>
        </template>
    </Barrage>

    <div v-for="item in wallVOList" :key="item.id">
        <WallMsg :wallVO="item"></WallMsg>
    </div>

    <el-input style="margin-top: 20px" v-model="input" placeholder="请输入..."></el-input>
    <el-button type="primary" @click="add">提交</el-button>
    <button @click="console.log(barrage)">ok</button>
</template>

<script lang=ts>
import {defineComponent, onMounted, reactive, ref} from "vue";
import Barrage from 'vue3-danmaku';
import {WallVO} from "@/common/vos/WallVO";
import WallApis from "@/common/apis/WallApis";
import {ElMessage} from "element-plus";
import SingleBarrage from "@/components/SingleBarrageComponent.vue";
import WallMsg from "@/components/WallMsgComponent.vue";
import {WallAddDTO} from "@/common/dtos/WallDTOs";

export default defineComponent({
    components: {
        Barrage,
        SingleBarrage,
        WallMsg,
    },
    name: "WallComponent",
    props: ["username"],
    setup: function (props) {
        let wallVOList: Array<WallVO> = reactive([]);
        let pageNum = 0;
        let barrage = ref<any>(null);

        function sleep(d: number) {
            return new Promise((resolve) => setTimeout(resolve, d));
        }

        async function getWallVOList() {
            if (pageNum === 0 && wallVOList.length > 0) {
                return;
            }
            while (props.username === undefined || props.username === "") {
                await sleep(100);
            }
            ElMessage.success(props.username);
            WallApis.getList(props.username, pageNum).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<WallVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多");
                        return;
                    }
                    ElMessage.success("查找留言成功");
                    wallVOList.push(...list);
                } else {
                    ElMessage.error("查找留言呢失败：" + res.data.message);
                }
            });
        }

        let input = ref("");

        function add() {
            let dto: WallAddDTO = {
                content: input.value,
                commentee: props.username,
            };
            WallApis.add(dto).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("新增留言成功");
                    let vo = res.data.body as WallVO;
                    wallVOList.push(vo);
                    input.value = "";
                } else {
                    ElMessage.error("新增留言失败");
                }
            });
        }

        onMounted(() => {
            barrage.value.$refs.container;
        });

        function created() {
            getWallVOList();
        }

        created();

        return {
            wallVOList,
            input,
            add,
            barrage,

        };
    },
});
</script>

<style scoped>
#barrage {
    width: 700px;
    height: 250px;
    background-color: white;
}
</style>