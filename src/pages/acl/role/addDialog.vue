<script setup>
import { ref, reactive, nextTick, inject } from "vue";
import { toString } from "lodash";
import { addRole } from "@/api/acl/role.js";

// ref reactive
const addDialogValue = reactive({
  roleName: "",
});

const addRoleFormRef = ref();

// provide inject
const visible = inject("addDialogVisible");
const onClose = inject("onAddDialogClose");

// emits
const emits = defineEmits(["on-submit"]);

// variables
const rules = {
  roleName: [{ required: true, message: "角色名不能为空", trigger: "blur" }],
};

const defaultValues = {
  roleName: "",
};

// events handlers
const handleAddRole = async (formRef) => {
  if (!formRef) return;
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      await addRole(addDialogValue.roleName);
      ElMessage({
        type: "success",
        message: "添加成功",
      });
      handleClose();
      emits("on-submit");
    } else {
      ElMessage({
        type: "error",
        message: "添加失败",
      });
      console.log("error submit!", res);
    }
  });
  await nextTick(() => {
    // 清空
    formRef.clearValidate();
    Object.assign(addDialogValue, defaultValues);
  });
};

const handleClose = () => {
  onClose();
  nextTick(() => {
    // 清空
    addRoleFormRef.value.clearValidate();
    Object.assign(addDialogValue, defaultValues);
  });
};
</script>

<template>
  <el-dialog
    width="40%"
    v-model="visible"
    :before-close="handleClose"
    title="Add a role"
  >
    <el-form
      :rules="rules"
      :model="addDialogValue"
      label-position="right"
      label-width="100px"
      @keydown.enter.native="handleAddRole(addRoleFormRef)"
      @submit.enter.prevent
      ref="addRoleFormRef"
    >
      <el-form-item
        prop="roleName"
        label="Role Name"
        required
      >
        <div class="w-4/5"><el-input v-model="addDialogValue.roleName" /></div>
      </el-form-item>

      <el-form-item class="">
        <span class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button
            type="primary"
            @click="handleAddRole(addRoleFormRef)"
          >
            Add
          </el-button>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
