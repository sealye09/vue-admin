<script setup>
import { ref, inject } from "vue";
import { toString } from "lodash";
import { updateRoleById } from "@/api/acl/role.js";

// ref reactive
const editRoleForm = ref();

// provide inject
const editDialogValue = inject("editDialogValue");
const visible = inject("editDialogVisible");
const onClose = inject("onEditDialogClose");

// emits
const emits = defineEmits(["on-submit"]);

// variables
const rules = {
  roleName: [{ required: true, message: "角色名不能为空", trigger: "blur" }],
};

// handle events
const handleEditRole = async (formRef) => {
  console.log("get edit data:", editDialogValue);
  if (!formRef) return;
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      await updateRoleById(editDialogValue.id, editDialogValue.roleName);
      ElMessage({
        type: "success",
        message: "修改成功",
      });
      onClose();
      emits("on-submit");
    } else {
      ElMessage({
        type: "error",
        message: "修改失败",
      });
      console.log("error submit!", res);
    }
  });
};

const handleClose = () => {
  onClose();
};
</script>

<template>
  <el-dialog
    width="40%"
    v-model="visible"
    destroy-on-close
    title="Edit"
  >
    <el-form
      :rules="rules"
      :model="editDialogValue"
      label-position="right"
      label-width="100px"
      @submit.enter.prevent
      ref="editRoleForm"
    >
      <el-form-item
        prop="roleName"
        label="Role Name"
        required
      >
        <div class="w-4/5"><el-input v-model="editDialogValue.roleName" /></div>
      </el-form-item>

      <el-form-item class="">
        <span class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button
            type="primary"
            @click="handleEditRole(editRoleForm)"
          >
            Save
          </el-button>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
