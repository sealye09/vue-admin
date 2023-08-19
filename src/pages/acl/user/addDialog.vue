<script setup>
import { ref, reactive, inject, nextTick } from "vue";
import { toString } from "lodash";
import { addUser } from "@/api/acl/user.js";

// reactive
const dialogValue = reactive({
  username: "",
  password: "",
  name: "",
});

// ref
const addUserForm = ref();

// inject
const visible = inject("addDialogVisible");
const onClose = inject("onAddDialogClose");

// emits
const emits = defineEmits(["on-submit"]);

// variables
const rules = {
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        setTimeout(() => {
          if (value.length < 5) {
            callback(new Error("用户名长度不能小于5位"));
          } else {
            callback();
          }
        }, 1000);
      },
    },
  ],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
};

const defaultValues = {
  username: "",
  password: "",
  name: "",
};

// event handlers
const handleAdd = async (formRef) => {
  if (!formRef) return;
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      await addUser({
        username: dialogValue.username,
        name: dialogValue.name,
        password: dialogValue.password,
      });
      ElMessage({
        type: "success",
        message: "添加成功",
      });
      // 关闭对话框
      onClose();
      emits("on-submit");
    } else {
      ElMessage({
        type: "error",
        message: "添加失败",
      });
      console.log("error submit!", fields);
    }
  });

  nextTick(() => {
    // 清空
    Object.assign(dialogValue, defaultValues);
  });
};

const handleCancel = () => {
  onClose();
  nextTick(() => {
    // 清空
    Object.assign(dialogValue, defaultValues);
  });
};
</script>

<template>
  <el-dialog
    width="40%"
    v-model="visible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    title="添加用户"
  >
    <el-form
      :rules="rules"
      :model="dialogValue"
      @submit.enter.prevent
      @keydown.native.enter="handleAdd(addUserForm)"
      label-position="right"
      label-width="100px"
      ref="addUserForm"
    >
      <el-form-item
        prop="username"
        label="用户名"
        required
      >
        <div class="w-4/5">
          <el-input
            v-model="dialogValue.username"
            placeholder="Please input username"
          />
        </div>
      </el-form-item>
      <el-form-item
        prop="name"
        label="姓名"
        required
      >
        <div class="w-4/5">
          <el-input
            v-model="dialogValue.name"
            placeholder="Please input name"
          />
        </div>
      </el-form-item>
      <el-form-item
        prop="password"
        label="密码"
        required
      >
        <div class="w-4/5">
          <el-input
            v-model="dialogValue.password"
            type="password"
            placeholder="Please input password"
            show-password
          />
        </div>
      </el-form-item>
      <el-form-item class="">
        <span class="dialog-footer">
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button
            type="primary"
            @click="handleAdd(addUserForm)"
          >
            Add
          </el-button>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
