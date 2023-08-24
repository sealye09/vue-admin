<script setup>
import { ref, inject, onMounted } from "vue";
import { toString } from "lodash";

import { updateUserById, assignRole } from "@/api/acl/user.js";

// ref
const userFormRef = ref();

// inject
const visible = inject("editDrawerVisible");
const onClose = inject("onEditDrawerClose");
const editDrawerValue = inject("editDrawerValue");

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

// handlers
const handleClose = () => {
  onClose();
  editDrawerValue.mode = "info";
};

const handleEditUserConfirm = async (formRef) => {
  console.log("edit user confirm:", editDrawerValue);
  if (!formRef) return;
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      const res = await updateUserById({
        id: editDrawerValue.id,
        name: editDrawerValue.name,
        username: editDrawerValue.username,
      });
      if (res.code === 200) {
        ElMessage({
          type: "success",
          message: "更新成功",
        });
        onClose();
        emits("on-submit");
      } else {
        ElMessage({
          type: "error",
          message: `更新失败: ${res.data}`,
        });
      }
    } else {
      ElMessage({
        type: "error",
        message: "修改失败",
      });
      console.log("error submit!", res);
    }
  });
};

const handleAllCheckChange = (value) => {
  console.log(value);
  console.log(editDrawerValue.roleNames);
  const checkedCount = value.length;
  const allCount = editDrawerValue.allRoles.length;
  editDrawerValue.checkAllRoles = checkedCount === allCount;
  editDrawerValue.isIndeterminate = checkedCount > 0 && checkedCount < allCount;
};

const handleRoleCheckChange = (val) => {
  console.log(val);
  editDrawerValue.roleNames = val ? editDrawerValue.allRoles.map((role) => role.roleName) : [];
  console.log(editDrawerValue.roleNames);
  editDrawerValue.isIndeterminate = false;
};

// 提交修改用户角色
const handleRoleChangeComfirm = async () => {
  const roleIds = editDrawerValue.allRoles
    .filter((role) => editDrawerValue.roleNames.includes(role.roleName))
    .map((role) => role.id);

  const res = await assignRole({
    userId: editDrawerValue.id,
    roleIdList: roleIds,
  });
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "更新成功",
    });
    onClose();
    emits("on-submit");
  } else {
    ElMessage({
      type: "error",
      message: `更新失败: ${res.data}`,
    });
  }
};

const handleComfirm = async (formRef) => {
  if (editDrawerValue.mode === "info") {
    console.log("info comfirm");
    await handleEditUserConfirm(formRef);
  } else {
    console.log("role comfirm");
    handleRoleChangeComfirm();
  }
};

onMounted(() => {
  console.log("edit drawer mounted");
  // 判断角色的全选状态
  const checkedCount = editDrawerValue.roleNames.length;
  const allCount = editDrawerValue.allRoles.length;
  editDrawerValue.checkAllRoles = checkedCount === allCount;
  editDrawerValue.isIndeterminate = checkedCount > 0 && checkedCount < allCount;
});
</script>

<template>
  <el-drawer
    v-model="visible"
    direction="rtl"
    :show-close="false"
    @close="handleClose"
  >
    <template #header>
      <el-tabs
        v-model="editDrawerValue.mode"
        @tab-click="
          (tab, event) => {
            editDrawerValue.mode = tab.props.name;
          }
        "
      >
        <el-tab-pane
          label="编辑信息"
          name="info"
        >
          编辑信息
        </el-tab-pane>
        <el-tab-pane
          label="分配角色"
          name="role"
        >
          分配角色
        </el-tab-pane>
      </el-tabs>
    </template>
    <template #default>
      <div v-if="editDrawerValue.mode === 'info'">
        <el-form
          ref="userFormRef"
          :rules="rules"
          :model="editDrawerValue"
          @submit.enter.prevent
          label-position="right"
          label-width="100px"
        >
          <el-form-item
            prop="username"
            label="用户名"
            required
          >
            <el-input
              v-model="editDrawerValue.username"
              placeholder="Please input username"
            />
          </el-form-item>
          <el-form-item
            prop="name"
            label="姓名"
            required
          >
            <el-input
              v-model="editDrawerValue.name"
              type="text"
              placeholder="Please input name"
            />
          </el-form-item>
        </el-form>
      </div>

      <div v-if="editDrawerValue.mode === 'role'">
        <el-form
          :model="editDrawerValue"
          @submit.enter.prevent
          label-position="right"
          label-width="100px"
        >
          <el-checkbox
            v-model="editDrawerValue.checkAllRoles"
            :indeterminate="editDrawerValue.isIndeterminate"
            @change="handleRoleCheckChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="editDrawerValue.roleNames"
            @change="handleAllCheckChange"
          >
            <el-checkbox
              v-for="role in editDrawerValue.allRoles"
              :key="role.id"
              :label="role.roleName"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          @click="handleComfirm(userFormRef)"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
