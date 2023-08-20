<script setup>
import { ref, inject, onMounted } from "vue";
import { toString } from "lodash";
import { updateRoleById } from "@/api/acl/role.js";
import { assignAcl } from "@/api/acl/menu.js";

// ref reactive
const editRoleForm = ref();
const treeRef = ref();

// provide inject
const editDrawerValue = inject("editDrawerValue");
const visible = inject("editDrawerVisible");
const onClose = inject("onEditDrawerClose");

// emits
const emits = defineEmits(["on-submit"]);

// variables
const rules = {
  roleName: [
    { required: true, message: "角色名不能为空", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "角色名长度在 2 到 20 个字符",
      trigger: "blur",
    },
  ],
};

const props = {
  label: "name",
  children: "children",
};

// handle events
const handleEditRole = async (formRef) => {
  console.log("get edit data:", editDrawerValue);
  if (!formRef) return;
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      await updateRoleById(editDrawerValue.id, editDrawerValue.roleName);
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

const handleAssignPermission = async () => {
  console.log("assign permission");
  const res = await assignAcl({
    roleId: editDrawerValue.id,
    permissionIdList: treeRef.value.getCheckedKeys(),
  });
  console.log("🚀 ~ file: editDrawer.vue:66 ~ handleAssignPermission ~ res:", res);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "分配权限成功",
    });
    onClose();
    emits("on-submit");
  } else {
    ElMessage({
      type: "error",
      message: res.data ? res.data : "分配权限失败",
    });
  }
};

const handleSubmit = (formRef) => {
  if (editDrawerValue.mode === "info") {
    handleEditRole(formRef);
  } else {
    handleAssignPermission();
  }
};

const handleClose = () => {
  onClose();
  editDrawerValue.mode = "info";
};
</script>

<template>
  <el-drawer
    v-model="visible"
    direction="rtl"
    destroy-on-close
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
          label="分配权限"
          name="premission"
        >
          分配权限
        </el-tab-pane>
      </el-tabs>
    </template>

    <template #default>
      <div v-if="editDrawerValue.mode === 'info'">
        <el-form
          :rules="rules"
          :model="editDrawerValue"
          label-position="right"
          label-width="100px"
          @submit.enter.prevent
          ref="editRoleForm"
        >
          <el-form-item
            prop="roleName"
            label="角色名称"
            required
          >
            <div class="w-4/5"><el-input v-model="editDrawerValue.roleName" /></div>
          </el-form-item>
        </el-form>
      </div>

      <div v-else>
        <el-tree
          ref="treeRef"
          show-checkbox
          default-expand-all
          node-key="id"
          :data="editDrawerValue.permissions"
          :default-checked-keys="editDrawerValue.selectedPermissions"
          :props="props"
        />
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit(editRoleForm)"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>