<script setup>
import { reactive, computed, onMounted, ref, watch, provide } from "vue";
import { toString } from "lodash";

import { getRoles, deleteRoleById, deleteRolesByIds } from "@/api/acl/role.js";
import { getPermissions, getPermissionById } from "@/api/acl/menu.js";
import DataTable from "@/components/DataTable.vue";

import AddDialog from "./AddDialog.vue";
import EditDrawer from "./EditDrawer.vue";

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

const editDrawerValue = reactive({
  mode: "info",
  id: "",
  roleName: "",
  permissions: [],
  selectedPermissions: [],
});
const editDrawerVisible = ref(false);

provide("editDrawerValue", editDrawerValue);

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

const filterSelectArr = (allData, initArr) => {
  allData.forEach((item) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id);
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr);
    }
  });

  return initArr;
};

// events handlers
const openEditDrawer = async (idx, data) => {
  console.log("get edit data:", idx, data);
  editDrawerVisible.value = true;
  editDrawerValue.roleName = data.roleName;
  editDrawerValue.id = data.id;

  const res = await getPermissions();
  editDrawerValue.permissions = res.data;
  const res2 = await getPermissionById(editDrawerValue.id);
  editDrawerValue.selectedPermissions = filterSelectArr(res2.data, []);
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
  <add-dialog
    v-model="addDialogVisible"
    @on-submit="fetchData"
  />

  <edit-drawer
    v-model="editDrawerVisible"
    @on-submit="fetchData"
  />

  <div class="space-y-8">
    <div class="w-full flex justify-center items-center gap-12">
      <el-input
        type="text"
        placeholder="search user by role name"
        v-model="filters.roleName"
        clearable
      />
      <el-input
        type="text"
        placeholder="search user by id"
        v-model="filters.id"
        clearable
      />
      <el-button
        type="primary"
        @click="clearFilters"
      >
        Reset Filters
      </el-button>
    </div>

    <el-divider />

    <div class="space-y-6">
      <div class="flex gap-2">
        <el-button
          type="primary"
          @click="() => (addDialogVisible = true)"
        >
          添加角色
        </el-button>
        <el-button
          type="danger"
          @click="handleDeleteManyRoles"
        >
          批量删除
        </el-button>
      </div>

      <data-table
        :data="filteredRoles"
        :columns="tableData.columns"
        :is-loading="tableData.isLoading"
        :is-slectable="tableData.isSlectable"
        @on-edit="openEditDrawer"
        @on-delete="handleDeleteRole"
        @on-selection-change="handleSelectionChange"
      />

      <el-pagination
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
    </div>
  </div>
</template>
