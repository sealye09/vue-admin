<script setup>
import { reactive, computed, onMounted, ref, watch } from "vue";
import { toString } from "lodash";
import { getUsers, addUser, deleteUserById, updateUserById, deleteUsers } from "@/api/acl/user.js";
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
      prop: "createTime",
      label: "创建时间",
      sortable: true,
    },
    {
      prop: "updateTime",
      label: "更新时间",
      sortable: true,
    },
    {
      prop: "username",
      label: "用户名",
      sortable: true,
    },
    {
      prop: "roleName",
      label: "角色名称",
      sortable: true,
    },
  ],
});

const dialogValue = reactive({
  username: "",
  password: "",
  visible: false,
});

const filters = reactive({
  username: "",
  roleName: "",
  id: "",
});

const addUserForm = ref();

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
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
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
        username: dialogValue.username,
        password: dialogValue.password,
      });
      ElMessage({
        type: "success",
        message: "添加成功",
      });
      fetchData();
      dialogValue.visible = false;
    } else {
      ElMessage({
        type: "error",
        message: "添加失败",
      });
      console.log("error submit!", fields);
    }
  });

  // 清空
  dialogValue.username = "";
  dialogValue.password = "";
};

const handleEditUser = (idx, data) => {
  console.log("get edit data:", idx, data);
  const id = data.id;
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

const handleSelectionChange = (val) => {
  console.log("get value:", val);
};

const handleSizeChange = (val) => {
  tableData.currentPage = 1;
  console.log(`${val} items per page`);
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};

// lifecycle hooks
onMounted(async () => {
  fetchData();
});
</script>

<template>
  <el-dialog
    width="40%"
    v-model="dialogValue.visible"
    :close-on-click-modal="false"
    @submit="handleAddUser"
    title="Add a user"
  >
    <el-form
      :rules="rules"
      :model="dialogValue"
      @submit.enter.prevent
      label-position="right"
      label-width="100px"
      ref="addUserForm"
    >
      <el-form-item
        prop="username"
        label="Username"
        required
      >
        <el-input v-model="dialogValue.username" />
      </el-form-item>
      <el-form-item
        prop="password"
        label="Password"
        required
      >
        <el-input v-model="dialogValue.password" />
      </el-form-item>
      <el-form-item class="">
        <span class="dialog-footer">
          <el-button @click="dialogValue.visible = false">Cancel</el-button>
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
        @click="() => (dialogValue.visible = true)"
      >
        添加用户
      </el-button>
      <el-button
        class="my-2"
        type="danger"
        @click="() => console.log('delete many')"
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
    @on-edit="handleEditUser"
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
