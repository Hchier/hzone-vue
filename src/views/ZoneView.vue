<template>
    <div id="zone" class="clear">
        <div id="userInfo">
            <el-avatar id="avatar" :size="90"
                       src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
            <p id="username"><strong>{{ userVO.username }}</strong></p>
            <p id="signature">{{ userVO.signature }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {useRoute} from "vue-router";
import {UserVO} from "@/common/vos/UserVO";
import UserApis from "@/common/apis/UserApis";
import {ElMessage} from "element-plus";
import {deepCopy} from "@/utils/copy";

export default defineComponent({
    name: "ZoneView",

    setup() {
        let userVO: UserVO = reactive({
            username: "",
            signature: "",
            favorNum: 0,
            faveredNum: 0,
            followNum: 0,
            followedNum: 0,
            followed: false,
        });

        function getUserVO() {
            let username = useRoute().query.username as string;
            if (username === undefined) {
                username = "";
            }
            UserApis.getUserVO(username).then(res => {
                if (res.data.code === 200) {
                    let vo = res.data.body as UserVO;
                    deepCopy(vo, userVO);
                } else {
                    ElMessage.error("查找失败：" + res.data.body);
                }
            });
        }

        const created = () => {
            getUserVO();
        };

        created();

        return {
            userVO,
        };
    },
});
</script>

<style scoped>

.clear::before, .clear::after {
    content: '';
    display: table;
    clear: both;
}

#zone {
    position: relative;
    margin: 0 auto;
    border: 1px solid red;
    width: 700px;

}

#userInfo {
    border: 1px solid red;
    width: 700px;
    height: 500px;
}


#avatar {
    position: absolute;
    left: 10px;
    top: 10px;
}

#username {
    position: absolute;
    left: 130px;
    top: 0px;
    font-size: 25px;
}

#signature{
    position: absolute;
    left: 130px;
    top: 45px;
    font-size: 20px;
}

</style>