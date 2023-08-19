<script setup>
import { reactive, computed, onMounted, ref, watch, provide } from "vue";
import { toString } from "lodash";
import { getRoles, deleteRoleById, deleteRolesByIds } from "@/api/acl/role.js";
import dataTable from "@/components/dataTable.vue";

import addDialog from "./addDialog.vue";
import editDialog from "./editDialog.vue";

// ref reactive
const tableData = reactive({
  data: [],
  total: 10,
  pageSize: 10,
  currentPage: 1,
  isSlectable: true,
  isLoading: false,
  pageSizes: [10, 20, 30, 40, 1, 2],
  layout: "prev, pager, next, jumper, ->, sizes, total",
  columns: [
    {
      prop: "id",
      label: "ID",
      sortable: true,
      width: 120,
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

const editDialogValue = reactive({
  id: "",
  roleName: "",
});
const editDialogVisible = ref(false);
const onEditDialogClose = () => {
  editDialogVisible.value = false;
};

provide("editDialogValue", editDialogValue);
provide("editDialogVisible", editDialogVisible);
provide("onEditDialogClose", onEditDialogClose);

const selectedRows = ref([]);

const filters = reactive({
  roleName: "",
  id: "",
});

// computed
const filteredRoles = computed(() => {
  return tableData.data.filter((role) => {
    const upperRoleName = role.roleName.toUpperCase();
    const upperRoleNameFilter = filters.roleName.toUpperCase();
    return upperRoleName.includes(upperRoleNameFilter) && toString(role.id).includes(filters.id);
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
  const res = await getRoles(tableData.currentPage, tableData.pageSize);
  console.log(res);
  tableData.data = res.data.records;
  tableData.total = res.data.total;
  tableData.isLoading = false;
};

const clearFilters = () => {
  filters.roleName = "";
  filters.id = "";
};

// events handlers
const openEditDialog = (idx, data) => {
  editDialogVisible.value = true;
  editDialogValue.roleName = data.roleName;
  editDialogValue.id = data.id;
};

const handleDeleteRole = async (idx, data) => {
  console.log("get delete data:", idx, data);
  const id = data.id;
  const res = await deleteRoleById(id);
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

const handleDeleteManyRoles = async () => {
  console.log("delete many:", selectedRows.value);
  const selectedIds = selectedRows.value.map((row) => row.id);
  console.log(selectedIds);
  const res = await deleteRolesByIds(selectedIds);
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

const handleSizeChange = (val) => {
  tableData.currentPage = 1;
  console.log(`${val} items per page`);
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};

const handleSelectionChange = (val) => {
  console.log("get value:", val);
  selectedRows.value = val;
};

// lifecycle hooks
onMounted(async () => {
  fetchData();
});
</script>

<template>
  <add-dialog @on-submit="fetchData" />

  <edit-dialog @on-submit="fetchData" />

  <div class="pb-6 flex flex-col gap-4">
    <div class="flex">
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
        添加角色
      </el-button>
      <el-button
        class="my-2"
        type="danger"
        @click="handleDeleteManyRoles"
      >
        批量删除
      </el-button>
    </div>
  </div>

  <data-table
    :data="filteredRoles"
    :columns="tableData.columns"
    :is-loading="tableData.isLoading"
    :is-slectable="tableData.isSlectable"
    @on-edit="openEditDialog"
    @on-delete="handleDeleteRole"
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
