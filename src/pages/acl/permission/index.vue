<script setup>
import { ref, reactive, onMounted } from "vue";

import {
  getPermissions,
  updatePermission,
  addPermission,
  removePermissionById,
} from "@/api/acl/menu.js";

const data = reactive({
  permissions: [],
  isLoading: false,
  rowKey: "id",
  columns: [
    {
      prop: "id",
      label: "ID",
      sortable: true,
    },
    {
      prop: "name",
      label: "名称",
      sortable: true,
    },
    {
      prop: "code",
      label: "权限值",
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

//存储菜单的数据
const PermisstionArr = ref([]);

const menuData = reactive({
  code: "",
  level: 0,
  name: "",
  pid: 0,
  mode: "",
});

const dialogVisible = ref(false);

const getPermission = async () => {
  data.isLoading = true;
  const res = await getPermissions();
  console.log(res);
  data.permissions = res.data;
  data.isLoading = false;
};

//添加菜单按钮的回调
const handleAddClick = (row) => {
  //清空数据
  Object.assign(menuData, {
    id: 0,
    code: "",
    level: 0,
    name: "",
    pid: 0,
    mode: "add",
  });
  //对话框显示出来
  dialogVisible.value = true;
  //收集新增的菜单的level数值
  menuData.level = row.level + 1;
  //给谁新增子菜单
  menuData.pid = row.id;
};

//编辑已有的菜单
const handleEditClick = (row) => {
  dialogVisible.value = true;
  //点击修改按钮:收集已有的菜单的数据进行更新
  Object.assign(menuData, { ...row, mode: "edit" });
};

//确定按钮的回调
const handleComfirm = async () => {
  //发请求:新增子菜单 | 更新某一个已有的菜单的数据
  const res =
    menuData.mode === "add" ? await addPermission(menuData) : await updatePermission(menuData);

  if (res.code == 200) {
    dialogVisible.value = false;
    ElMessage({ type: "success", message: menuData.mode === "add" ? "添加成功" : "更新成功" });
    getPermission();
  } else {
    ElMessage({ type: "error", message: res.data ? res.data : "操作失败" });
  }
};

//删除按钮回调
const handleRemove = async (id) => {
  let res = await removePermissionById(id);
  if (res.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getPermission();
  } else {
    ElMessage({ type: "error", message: res.data ? res.data : "删除失败" });
  }
};

onMounted(() => {
  getPermission();
});
</script>

<template>
  <el-table
    :data="data.permissions"
    row-key="id"
    border
  >
    <el-table-column
      v-for="(item, index) in data.columns"
      :label="item.label"
      :prop="item.prop"
      :key="index"
    />

    <el-table-column label="操作">
      <!-- row:即为已有的菜单对象|按钮的对象的数据 -->
      <template #="{ row, $index }">
        <el-button
          v-if="row.level != 4"
          type="primary"
          size="small"
          @click="handleAddClick(row)"
        >
          {{ row.level == 3 ? "添加功能" : "添加菜单" }}
        </el-button>
        <el-button
          v-if="row.level != 1"
          type="warning"
          size="small"
          @click="handleEditClick(row)"
        >
          编辑
        </el-button>
        <el-popconfirm
          v-if="row.level != 1"
          width="260px"
          :title="`你确定要删除${row.name}?`"
          @confirm="handleRemove(row.id)"
        >
          <template #reference>
            <el-button
              type="danger"
              size="small"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
  >
    <!-- 表单组件:收集新增与已有的菜单的数据 -->
    <el-form>
      <el-form-item label="名称">
        <el-input
          placeholder="请你输入菜单名称"
          v-model="menuData.name"
        />
      </el-form-item>
      <el-form-item label="权限">
        <el-input
          placeholder="请你输入权限数值"
          v-model="menuData.code"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleComfirm"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
