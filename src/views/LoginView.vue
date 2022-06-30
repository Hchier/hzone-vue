<template>
  <el-input v-model="loginForm.username"></el-input>
  <el-input v-model="loginForm.password" type="password"></el-input>
  <el-button type="primary" @click="login">ok</el-button>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import UserApis from "@/apis/UserApis";
import { ElMessage } from "element-plus";
import router from "@/router";

interface LoginForm {
  username: string;
  password: string;
}

@Options({})
export default class LoginView extends Vue {
  loginForm: LoginForm = {
    username: "hchier",
    password: "pyh903903",
  };

  login() {
    UserApis.login(this.loginForm).then((res) => {
      if (res.data.code != 200) {
        ElMessage.error(res.data.message);
      }
      ElMessage.success(res.data.message);
      router.push({ path: "/index" });
    });
  }
}
</script>

<style scoped></style>
