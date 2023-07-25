<script setup>
import { ref, onMounted, reactive } from "vue";
import { getTrademarks } from "@/api/product/trademark.js";
import dataTable from "@/components/dataTable.vue";
import addDialog from "./addDialog.vue";

const tableData = reactive({
  data: [],
  total: 10,
  pageSize: 10,
  currentPage: 1,
  isLoading: false,
  pageSizes: [10, 20, 30, 40, 1, 2],
  layout: "prev, pager, next, jumper, ->, sizes, total",
  isLoading: false,
  columns: [
    {
      label: "ID",
      prop: "id",
      width: 80,
    },
    {
      label: "商标名称",
      prop: "tmName",
    },
    {
      label: "商标图片",
      prop: "logoUrl",
      isImg: true,
    },
    {
      label: "创建时间",
      prop: "createTime",
    },
    {
      label: "更新时间",
      prop: "updateTime",
    },
  ],
});

const addDialogValue = reactive({
  title: "添加品牌",
  roleName: "",
  visible: false,
});

const editDialogValue = reactive({
  id: "",
  roleName: "",
  visible: false,
});

const editRoleForm = ref();

const filters = reactive({
  roleName: "",
  id: "",
});

const fetchData = async () => {
  tableData.isLoading = true;
  const res = await getTrademarks();
  console.log(res);
  tableData.data = res.data.records;
  tableData.isLoading = false;
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <add-dialog
    :visible="addDialog.visible"
    :on-cancel="() => (addDialog.visible = false)"
    :on-submit="() => (addDialog.visible = false)"
    :title="addDialog.title"
  ></add-dialog>

  <el-dialog
    width="40%"
    v-model="editDialogValue.visible"
    destroy-on-close
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
        <div class="w-4/5"><el-input v-model="editDialogValue.roleName" /></div>
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
        添加品牌
      </el-button>
      <el-button
        class="my-2"
        type="danger"
        @click="() => console.log('delete')"
      >
        批量删除
      </el-button>
    </div>
  </div>
  <data-table
    :data="tableData.data"
    :columns="tableData.columns"
    :is-loading="tableData.isLoading"
    :is-slectable="tableData.isSlectable"
    @on-edit="() => console.log('edit')"
    @on-delete="() => console.log('delete')"
    @on-selection-change="() => console.log('selection change')"
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
    @size-change="
      (val) => {
        tableData.currentPage = 1;
        console.log(`${val} items per page`);
      }
    "
    @current-change="
      (val) => {
        console.log(`current page: ${val}`);
      }
    "
  />
</template>
