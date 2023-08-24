<script setup="setup">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import useUserStore from "@/store/modules/userStore";

const userInfo = reactive({
  username: "admin",
  password: "atguigu123",
});

let loginForm = ref(null);

const rules = {
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
};

const router = useRouter();
const userStore = useUserStore();
const handleSubmit = async (e) => {
  e.preventDefault();
  await loginForm.value.validate();
  await userStore.login(userInfo.username, userInfo.password);
  await userStore.userInfo();

  if (userStore.token) {
    ElMessage({
      type: "success",
      message: "欢迎回来，" + userStore.info.name,
    });
    router.push("/");
  } else {
    ElMessage({
      type: "error",
      message: "登录失败",
    });
  }
};
</script>

<template>
  <div class="login h-screen w-screen flex justify-center items-center bg-gray-100">
    <div class="login-wrapper w-full sm:w-80 p-4 bg-white shadow-md rounded-md">
      <div class="title font-bold text-xl border-b border-gray-200 my-2 pb-2 text-center">
        系统登录
      </div>
      <div class="p-2">
        <el-form
          :model="userInfo"
          :rules="rules"
          @submit="handleSubmit"
          ref="loginForm"
        >
          <el-form-item prop="username">
            <el-input
              placeholder="用户名"
              v-model:model-value="userInfo.username"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="密码"
              type="password"
              v-model:model-value="userInfo.password"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              class="w-full"
              type="primary"
              native-type="submit"
              >登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  background: url("../../assets/images/login-bg.jpg") no-repeat center center;
  background-size: cover;
}
</style>
