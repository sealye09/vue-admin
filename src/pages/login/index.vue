<script lang="ts" setup>
import { reactive } from "vue";

// do not use same name with ref
const form = reactive({
  username: "",
  password: "",
});

const onSubmit = () => {
  return;
};
</script>

<template>
  <div class="login">
    <el-form
      :model="form"
      label-width="120px"
    >
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          type="password"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          >Create</el-button
        >
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login {
  height: 600px;
  width: 600px;
  display: flex;
  align-items: center;
  margin: auto;
}
</style>
