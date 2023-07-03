<script setup>
import { reactive, computed, onMounted, ref, watch } from "vue";
import { toString } from "lodash";
import {
  getRoles,
  addRole,
  deleteRoleById,
  updateRoleById,
  deleteRolesByIds,
} from "@/api/acl/role.js";
import dataTable from "@/components/dataTable.vue";

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

const addDialogValue = reactive({
  roleName: "",
  visible: false,
});

const editDialogValue = reactive({
  id: "",
  roleName: "",
  visible: false,
});

const selectedRows = ref([]);

const filters = reactive({
  roleName: "",
  id: "",
});

const editRoleForm = ref();
const addRoleForm = ref();

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
  },
);

// variables
const rules = {
  roleName: [{ required: true, message: "角色名不能为空", trigger: "blur" }],
};

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
const handleAddRole = async (formRef) => {
  if (!formRef) return;
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      const res = await addRole(addDialogValue.roleName);
      ElMessage({
        type: "success",
        message: "添加成功",
      });
      fetchData();
      addDialogValue.visible = false;
    } else {
      ElMessage({
        type: "error",
        message: "添加失败",
      });
      console.log("error submit!", res);
    }
  });

  // 清空
  addDialogValue.roleName = "";
};

const openEditDialog = (idx, data) => {
  editDialogValue.visible = true;
  editDialogValue.roleName = data.roleName;
  editDialogValue.id = data.id;
  editRoleForm.value = data;
};

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
      fetchData();
      editDialogValue.visible = false;
    } else {
      ElMessage({
        type: "error",
        message: "修改失败",
      });
      console.log("error submit!", res);
    }
  });
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
  <el-dialog
    width="40%"
    v-model="addDialogValue.visible"
    :close-on-click-modal="false"
    title="Add a role"
  >
    <el-form
      :rules="rules"
      :model="addDialogValue"
      label-position="right"
      label-width="100px"
      @submit.enter.prevent
      ref="addRoleForm"
    >
      <el-form-item
        prop="roleName"
        label="Role Name"
        required
      >
        <el-input v-model="addDialogValue.roleName" />
      </el-form-item>

      <el-form-item class="">
        <span class="dialog-footer">
          <el-button @click="addDialogValue.visible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="handleAddRole(addRoleForm)"
          >
            Add
          </el-button>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog
    width="40%"
    v-model="editDialogValue.visible"
    :close-on-click-modal="false"
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
        <el-input v-model="editDialogValue.roleName" />
      </el-form-item>

      <el-form-item class="">
        <span class="dialog-footer">
          <el-button @click="editDialogValue.visible = false">Cancel</el-button>
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
        @click="() => (addDialogValue.visible = true)"
      >
        添加用户
      </el-button>
      <el-button
        class="my-2"
        type="danger"
        @click="() => handleDeleteManyRoles()"
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
  >
  </data-table>
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
