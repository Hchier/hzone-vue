<template>
    <el-form
        :label-position="'left'"
        label-width="100px"
        :model="dto"
        style="max-width: 460px; margin: auto"
    >
        <el-form-item label="用户名: ">
            <el-input v-model="dto.username"/>
        </el-form-item>
        <el-form-item label="密码: ">
            <el-input show-password v-model="dto.password"/>
        </el-form-item>
        <el-form-item label="重复密码: ">
            <el-input show-password v-model="dto.repeatedPassword"/>
        </el-form-item>
        <el-form-item label="邮箱: ">
            <el-input v-model="dto.email"/>
            <el-button :type="allowSendAuthCode?'primary':'danger'" :disabled="!allowSendAuthCode"
                       @click="sendAuthCode">
                <span v-if="allowSendAuthCode">发送验证码</span>
                <span v-else>请稍等({{ coldDuration / 1000 }})</span>
            </el-button>
        </el-form-item>
        <el-form-item label="验证码: ">
            <el-input v-model="dto.authCode"/>
        </el-form-item>
        <el-form-item>
            <el-button class="button" type="primary" @click="register">
                注册
            </el-button>
            <el-button class="button" @click="resetForm">清空</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang=ts>
import {defineComponent, reactive, ref} from "vue";
import {UserRegisterDTO} from "@/common/dtos/UserDTOs";
import NoticeApis from "@/common/apis/NoticeApis";
import {ElMessage} from "element-plus";
import UserApis from "@/common/apis/UserApis";
import router from "@/router";

export default defineComponent({
    name: "RegisterView",

    setup() {
        let dto: UserRegisterDTO = reactive({
            username: "",
            password: "",
            repeatedPassword: "",
            email: "",
            authCode: "",
        });
        let allowSendAuthCode = ref(true);

        const resetForm = () => {
            dto.username = "";
            dto.password = "";
            dto.repeatedPassword = "";
            dto.email = "";
            dto.authCode = "";

        };

        function sendAuthCode() {
            if (dto.email === "") {
                ElMessage.error("邮箱为空");
                return;
            }

            NoticeApis.sendAuthCode(dto.email).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("发送验证码成功");
                    allowSendAuthCode.value = false;
                    countDown();
                } else {
                    ElMessage.error("发送验证码失败：" + res.data.message);
                }
            });
        }

        let coldDuration = ref(60000);

        function countDown() {
            if (coldDuration.value <= 0) {
                coldDuration.value = 60000;
                allowSendAuthCode.value = true;
                return;
            }
            coldDuration.value -= 1000;
            setTimeout(countDown, 1000);
        }

        function register() {
            if (dto.username === "" || dto.password === "" || dto.repeatedPassword === "" || dto.email === "" || dto.authCode === "") {
                ElMessage.error("空");
                resetForm();
                return;
            }
            if (dto.password !== dto.repeatedPassword) {
                ElMessage.error("2次密码不一致");
                return;
            }
            UserApis.register(dto).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("注册成功");
                    router.push({path: "/login"});
                } else {
                    ElMessage.error("注册失败：" + res.data.message);
                    router.push({path: "/register"});
                }
            });
        }

        return {
            dto,
            resetForm,
            allowSendAuthCode,
            sendAuthCode,
            register,
            coldDuration,
        };
    },
});
</script>

<style scoped>
.button {
    width: 174px;
}
</style>