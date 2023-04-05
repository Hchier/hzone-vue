<template>

    <el-form
        :label-position="'left'"
        label-width="100px"
        :model="userLoginDto"
        style="max-width: 460px; margin: auto"
    >
        <el-form-item label="username: ">
            <el-input v-model="userLoginDto.username"/>
        </el-form-item>
        <el-form-item label="password: ">
            <el-input v-model="userLoginDto.password"/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="login">
                登录
            </el-button>
            <el-button @click="resetForm">清空</el-button>
        </el-form-item>
    </el-form>

</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {UserLoginDTO} from "@/common/dtos/UserDTOs";
import UserApis from "@/common/apis/UserApis";
import {ElMessage} from "element-plus";
import router from "@/router";

export default defineComponent({
    name: "LoginView",
    emits: ["loginSuccessEmit"],
    setup(props, context) {
        let userLoginDto: UserLoginDTO = reactive({
            username: "",
            password: "",
        });

        const resetForm = () => {
            userLoginDto.username = "";
            userLoginDto.password = "";

        };

        function login() {
            UserApis.login(userLoginDto).then(res => {
                if (res.data.code === 200) {
                    context.emit("loginSuccessEmit", userLoginDto.username);
                } else {
                    ElMessage.error("登录失败：" + res.data.body);
                }
            });
        }

        return {
            userLoginDto,
            resetForm,
            login,
        };
    },
});
</script>

<style scoped>

</style>