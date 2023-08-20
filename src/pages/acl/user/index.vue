<script setup>
import { reactive, computed, onMounted, ref, watch, provide } from "vue";
import { toString } from "lodash";
import { getUsers, deleteUserById, deleteUsersByIds, getUserRoles } from "@/api/acl/user.js";
import dataTable from "@/components/dataTable.vue";

import addDialog from "./addDialog.vue";
import editDrawer from "./editDrawer.vue";

// ref reactive
const tableData = reactive({
  data: [],
  total: 10,
  pageSize: 10,
  currentPage: 1,
  isLoading: false,
  pageSizes: [10, 20, 30, 40, 1, 2],
  layout: "prev, pager, next, jumper, ->, sizes, total",
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

const addDialogVisible = ref(false);
const onAddDialogClose = () => {
  addDialogVisible.value = false;
};
provide("addDialogVisible", addDialogVisible);
provide("onAddDialogClose", onAddDialogClose);

const editDrawerVisible = ref(false);
const editDrawerValue = reactive({
  mode: "info",
  id: "",
  name: "",
  username: "",
  roleNames: [],
  allRoles: [],
  checkAllRoles: false,
  isIndeterminate: false,
});
const onEditDrawerClose = () => {
  editDrawerVisible.value = false;
};
provide("editDrawerVisible", editDrawerVisible);
provide("onEditDrawerClose", onEditDrawerClose);
provide("editDrawerValue", editDrawerValue);

const filters = reactive({
  username: "",
  roleName: "",
  id: "",
});

const selectedRows = ref([]);

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
  }
);

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
// 点击Edit按钮事件
const handleEditClick = async (idx, data) => {
  console.log("get edit data:", idx, data);
  editDrawerValue.id = data.id;
  editDrawerValue.name = data.name;
  editDrawerValue.username = data.username;
  const res = await getUserRoles(editDrawerValue.id);
  console.log(res);
  editDrawerValue.roleNames = res.data.assignRoles.map((role) => role.roleName);
  editDrawerValue.allRoles = res.data.allRolesList;
  editDrawerVisible.value = true;
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
  if (selectedRows.value.length === 0) {
    ElMessage({
      type: "warning",
      message: "请选择用户",
    });
    return;
  }

  const selectedIds = selectedRows.value.map((row) => row.id);
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

// lifecycle hooks
onMounted(async () => {
  fetchData();
});
</script>

<template>
  <add-dialog @on-submit="fetchData" />

  <edit-drawer @on-submit="fetchData" />

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
        @click="() => (addDialogVisible = true)"
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
    @on-edit="handleEditClick"
    @on-delete="handleDeleteUser"
    @on-selection-change="handleSelectionChange"
  />

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
