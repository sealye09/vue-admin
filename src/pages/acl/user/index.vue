<script setup>
import { reactive, computed, onMounted, ref, watch, nextTick } from "vue";
import { toString } from "lodash";
import {
  getUsers,
  addUser,
  deleteUserById,
  updateUserById,
  deleteUsersByIds,
  getUserRoles,
  assignRole,
} from "@/api/acl/user.js";
import dataTable from "@/components/dataTable.vue";

// ref reactive
const tableData = reactive({
  data: [],
  total: 10,
  pageSize: 10,
  currentPage: 1,
  isLoading: false,
  pageSizes: [10, 20, 30, 40, 1, 2],
  layout: "prev, pager, next, jumper, ->, sizes, total",
  isLoading: false,
  isSlectable: true,
  columns: [
    {
      prop: "id",
      label: "ID",
      sortable: true,
      width: 120,
    },
    {
      prop: "username",
      label: "用户名",
      sortable: true,
    },
    {
      prop: "name",
      label: "姓名",
      sortable: true,
    },
    {
      prop: "roleName",
      label: "角色名称",
      sortable: true,
    },
    {
      prop: "createTime",
      label: "创建时间",
      sortable: true,
    },
    {
      prop: "updateTime",
      label: "更新时间",
      sortable: true,
    },
  ],
});

const addUserDialogValue = reactive({
  username: "",
  password: "",
  name: "",
  visible: false,
});

const editUserDrawerValue = reactive({
  mode: "info",
  id: "",
  name: "",
  username: "",
  roleNames: [],
  allRoles: [],
  checkAllRoles: false,
  isIndeterminate: false,
  visible: false,
});

const filters = reactive({
  username: "",
  roleName: "",
  id: "",
});

const selectedRows = ref([]);

const addUserForm = ref();
const editUserInfoForm = ref();

// computed
const filteredUsers = computed(() => {
  return tableData.data.filter((user) => {
    const upperUsername = user.username.toUpperCase();
    const upperUsernameFilter = filters.username.toUpperCase();
    return (
      upperUsername.includes(upperUsernameFilter) &&
      toString(user.roleName).includes(filters.roleName) &&
      toString(user.id).includes(filters.id)
    );
  });
});

// watch
watch(
  () => [tableData.currentPage, tableData.pageSize],
  async (newVal, oldVal) => {
    fetchData();
  },
);

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

// functions
const fetchData = async () => {
  tableData.isLoading = true;
  const res = await getUsers(tableData.currentPage, tableData.pageSize);
  console.log(res);
  tableData.data = res.data.records;
  tableData.total = res.data.total;
  tableData.isLoading = false;
};

const clearFilters = () => {
  filters.username = "";
  filters.roleName = "";
  filters.id = "";
};

// event handlers
const handleAddUser = async (formRef) => {
  if (!formRef) return;
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      const res = await addUser({
        username: addUserDialogValue.username,
        name: addUserDialogValue.name,
        password: addUserDialogValue.password,
      });
      ElMessage({
        type: "success",
        message: "添加成功",
      });
      fetchData();
      addUserDialogValue.visible = false;
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
    addUserDialogValue.username = "";
    addUserDialogValue.name = "";
    addUserDialogValue.password = "";
    addUserDialogValue.visible = false;
  });
};

// 点击Edit按钮事件
const handleEditUserClick = async (idx, data) => {
  console.log("get edit data:", idx, data);
  editUserDrawerValue.id = data.id;
  editUserDrawerValue.name = data.name;
  editUserDrawerValue.username = data.username;
  const res = await getUserRoles(editUserDrawerValue.id);
  console.log(res);
  editUserDrawerValue.roleNames = res.data.assignRoles.map((role) => role.roleName);
  editUserDrawerValue.allRoles = res.data.allRolesList;
  editUserDrawerValue.visible = true;
};

const handleEditUserConfirm = async (formRef) => {
  console.log("edit user confirm:", editUserDrawerValue);
  if (!formRef) return;
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      const res = await updateUserById({
        id: editUserDrawerValue.id,
        name: editUserDrawerValue.name,
        username: editUserDrawerValue.username,
      });
      if (res.code === 200) {
        ElMessage({
          type: "success",
          message: "更新成功",
        });
        editUserDrawerValue.visible = false;
        fetchData();
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

const handleDeleteUser = async (idx, data) => {
  console.log("get delete data:", idx, data);
  const id = data.id;
  const res = await deleteUserById(id);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    fetchData();
  } else {
    ElMessage({
      type: "error",
      message: `删除失败: ${res.data}`,
    });
  }
};

const handleDeleteManyUsers = async () => {
  console.log("delete many:", selectedRows.value);
  const selectedIds = selectedRows.value.map((row) => row.id);
  console.log(selectedIds);
  const res = await deleteUsersByIds(selectedIds);
  console.log(res);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    fetchData();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};

const handleSelectionChange = (val) => {
  console.log("get value:", val);
  selectedRows.value = val;
};

const handleSizeChange = (val) => {
  tableData.currentPage = 1;
  console.log(`${val} items per page`);
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};

const handleAllCheckChange = (value) => {
  console.log(value);
  console.log(editUserDrawerValue.roleNames);
  const checkedCount = value.length;
  const allCount = editUserDrawerValue.allRoles.length;
  editUserDrawerValue.checkAllRoles = checkedCount === allCount;
  editUserDrawerValue.isIndeterminate = checkedCount > 0 && checkedCount < allCount;
};

const handleRoleCheckChange = (val) => {
  console.log(val);
  editUserDrawerValue.roleNames = val
    ? editUserDrawerValue.allRoles.map((role) => role.roleName)
    : [];
  console.log(editUserDrawerValue.roleNames);
  editUserDrawerValue.isIndeterminate = false;
};

// 提交修改用户角色
const handleRoleChangeComfirm = async () => {
  const roleIds = editUserDrawerValue.allRoles
    .filter((role) => editUserDrawerValue.roleNames.includes(role.roleName))
    .map((role) => role.id);

  const res = await assignRole({
    userId: editUserDrawerValue.id,
    roleIdList: roleIds,
  });
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "更新成功",
    });
    editUserDrawerValue.visible = false;
    fetchData();
  } else {
    ElMessage({
      type: "error",
      message: `更新失败: ${res.data}`,
    });
  }
};

const handleComfirm = async (formRef) => {
  if (editUserDrawerValue.mode === "info") {
    console.log("info comfirm");
    await handleEditUserConfirm(formRef);
  } else {
    console.log("role comfirm");
    handleRoleChangeComfirm();
  }
};

// lifecycle hooks
onMounted(async () => {
  fetchData();
});
</script>

<template>
  <el-dialog
    width="40%"
    v-model="addUserDialogValue.visible"
    :close-on-click-modal="false"
    destroy-on-close
    title="添加用户"
  >
    <el-form
      :rules="rules"
      :model="addUserDialogValue"
      @submit.enter.prevent
      @keydown.native.enter="handleAddUser(addUserForm)"
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
            v-model="addUserDialogValue.username"
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
            v-model="addUserDialogValue.name"
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
            v-model="addUserDialogValue.password"
            type="password"
            placeholder="Please input password"
            show-password
          />
        </div>
      </el-form-item>
      <el-form-item class="">
        <span class="dialog-footer">
          <el-button @click="addUserDialogValue.visible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="handleAddUser(addUserForm)"
          >
            Add
          </el-button>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-drawer
    v-model="editUserDrawerValue.visible"
    direction="rtl"
    :show-close="false"
    @close="(editUserDrawerValue.visible = false), (editUserDrawerValue.mode = 'info')"
  >
    <template #header>
      <el-tabs
        v-model="editUserDrawerValue.mode"
        @tab-click="
          (tab, event) => {
            editUserDrawerValue.mode = tab.props.name;
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
      <div v-if="editUserDrawerValue.mode === 'info'">
        <el-form
          ref="editUserInfoForm"
          :rules="rules"
          :model="editUserDrawerValue"
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
              v-model="editUserDrawerValue.username"
              placeholder="Please input username"
            />
          </el-form-item>
          <el-form-item
            prop="name"
            label="姓名"
            required
          >
            <el-input
              v-model="editUserDrawerValue.name"
              type="text"
              placeholder="Please input name"
            />
          </el-form-item>
        </el-form>
      </div>

      <div v-if="editUserDrawerValue.mode === 'role'">
        <el-form
          :model="editUserDrawerValue"
          @submit.enter.prevent
          label-position="right"
          label-width="100px"
        >
          <el-checkbox
            v-model="editUserDrawerValue.checkAllRoles"
            :indeterminate="editUserDrawerValue.isIndeterminate"
            @change="handleRoleCheckChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="editUserDrawerValue.roleNames"
            @change="handleAllCheckChange"
          >
            <el-checkbox
              v-for="role in editUserDrawerValue.allRoles"
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
        <el-button @click="editUserDrawerValue.visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleComfirm(editUserInfoForm)"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>

  <div class="pb-6 flex flex-col gap-4">
    <div class="flex">
      <div class="block w-72 mr-8">
        <el-input
          type="text"
          v-model="filters.username"
          class="my-2"
          placeholder="search user by username"
          clearable
        />
      </div>
      <div class="block w-72 mr-8">
        <el-input
          type="text"
          v-model="filters.roleName"
          class="my-2"
          placeholder="search user by role name"
          clearable
        />
      </div>
      <div class="block w-72 mr-8">
        <el-input
          type="text"
          v-model="filters.id"
          class="my-2"
          placeholder="search user by id"
          clearable
        />
      </div>
      <el-button
        @click="clearFilters"
        type="primary"
        class="my-2"
      >
        Reset Filters
      </el-button>
    </div>

    <div class="flex gap-2">
      <el-button
        class="my-2"
        type="primary"
        @click="() => (addUserDialogValue.visible = true)"
      >
        添加用户
      </el-button>
      <el-button
        class="my-2"
        type="danger"
        @click="handleDeleteManyUsers"
      >
        批量删除
      </el-button>
    </div>
  </div>

  <data-table
    :data="filteredUsers"
    :columns="tableData.columns"
    :is-loading="tableData.isLoading"
    :is-slectable="tableData.isSlectable"
    @on-edit="handleEditUserClick"
    @on-delete="handleDeleteUser"
    @on-selection-change="handleSelectionChange"
  ></data-table>

  <el-pagination
    class="mt-6 mb-4 w-full"
    background
    v-model:current-page="tableData.currentPage"
    v-model:page-size="tableData.pageSize"
    :page-sizes="tableData.pageSizes"
    :layout="tableData.layout"
    :total="tableData.total"
    :disabled="tableData.isLoading"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
