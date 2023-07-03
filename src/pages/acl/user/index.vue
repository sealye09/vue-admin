<script setup>
import { reactive, computed, onMounted, ref, watch } from "vue";
import { getUsers } from "@/api/acl/user.js";
import userTable from "./userTable.vue";
import { add } from "lodash";

const tableData = reactive({
  data: [],
  total: 10,
  pageSize: 10,
  currentPage: 1,
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

const usernameFilter = ref("");

const filteredUsers = computed(() => {
  return tableData.data.filter((user) => {
    const upperUsername = user.username.toUpperCase();
    const upperUsernameFilter = usernameFilter.value.toUpperCase();
    return upperUsername.includes(upperUsernameFilter);
  });
});
const dialogFormVisible = ref(false);
const dialogValue = reactive({
  username: "",
  password: "",
  role: "",
});

const addUser = (user, data) => {
  console.log("add", user, data);
};

const editUser = (user, data) => {
  console.log("edit", user, data);
};

const deleteUser = (user, data) => {
  console.log("delete", user, data);
};

const clearFilter = () => {
  usernameFilter.value = "";
};

onMounted(async () => {
  fetchData();
});

const fetchData = async () => {
  tableData.isLoading = true;
  const res = await getUsers(tableData.currentPage, tableData.pageSize);
  console.log(res);
  tableData.data = res.data.records;
  tableData.total = res.data.total;
  tableData.isLoading = false;
};

const handleSizeChange = (val) => {
  tableData.currentPage = 1;
  console.log(`${val} items per page`);
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};

watch(
  () => [tableData.currentPage, tableData.pageSize],
  async (newVal, oldVal) => {
    fetchData();
  },
);
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="Add a user"
  >
    <el-form
      :model="dialogValue"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="Username">
        <el-input v-model="dialogValue.username" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="dialogValue.password" />
      </el-form-item>
      <el-form-item label="Role">
        <el-input v-model="dialogValue.role" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="() => (addUser(dialogValue), (dialogFormVisible = false))"
        >
          Add
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="pb-6 flex gap-4">
    <div class="w-72 mr-8">
      <el-input
        type="text"
        v-model="usernameFilter"
        class="my-2"
        placeholder="search user by username"
        clearable
      />
    </div>
    <el-button
      @click="clearFilter"
      type="primary"
      class="my-2"
    >
      Reset
    </el-button>
    <el-button
      class="my-2"
      @click="() => (dialogFormVisible = true)"
    >
      Add
    </el-button>
  </div>

  <user-table
    :users="filteredUsers"
    :columns="tableData.columns"
    :handle-edit="editUser"
    :handle-delete="deleteUser"
    :is-loading="tableData.isLoading"
  >
  </user-table>
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
