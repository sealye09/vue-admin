<script setup>
import { ref, computed, watch, onMounted, reactive, provide } from "vue";
import { toString } from "lodash";

import { getTrademarks, removeTrademark } from "@/api/product/trademark.js";
import DataTable from "@/components/DataTable.vue";

import AddDialog from "./AddDialog.vue";
import editDialog from "./EditDialog.vue";

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
      label: "品牌名称",
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

const addDialogVisible = ref(false);

const editDialogVisible = ref(false);
const editDialogValue = reactive({
  tmName: "",
  logoUrl: "",
  fileList: [],
  preview: false,
  previewUrl: "",
});

provide("editDialogValue", editDialogValue);

const filters = reactive({
  tmName: "",
  id: "",
});

const filteredData = computed(() => {
  return tableData.data.filter((item) => {
    return toString(item.tmName).includes(filters.tmName) && toString(item.id).includes(filters.id);
  });
});

const clearFilters = () => {
  filters.id = "";
  filters.tmName = "";
};

const fetchData = async () => {
  tableData.isLoading = true;
  const res = await getTrademarks(tableData.currentPage, tableData.pageSize);
  console.log(res);
  tableData.data = res.data.records;
  tableData.total = res.data.total;
  tableData.isLoading = false;
};

const handleEditClick = (row, data) => {
  editDialogValue.tmName = data.tmName;
  editDialogValue.logoUrl = data.logoUrl;
  editDialogValue.fileList = [{ name: data.logoUrl, url: data.logoUrl }];
  editDialogVisible.value = true;
};

const handleDelete = async (row, data) => {
  console.log("delete", row, data);
  const res = await removeTrademark(data.id);
  if (res.code === 200) {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    fetchData();
  } else {
    ElMessage({
      message: res.data,
      type: "error",
    });
  }
};

// watch
watch(
  () => [tableData.currentPage, tableData.pageSize],
  async (newVal, oldVal) => {
    fetchData();
  }
);

onMounted(() => {
  fetchData();
});
</script>

<template>
  <add-dialog
    v-model="addDialogVisible"
    @on-submit="fetchData"
  />

  <edit-dialog
    v-model="editDialogVisible"
    @on-submit="fetchData"
  />

  <div class="space-y-8">
    <div class="w-full flex justify-center items-center gap-12">
      <el-input
        type="text"
        v-model="filters.tmName"
        placeholder="search by name"
        clearable
      />
      <el-input
        type="text"
        v-model="filters.id"
        placeholder="search by id"
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
      <el-button
        type="primary"
        @click="() => (addDialogVisible = true)"
      >
        添加品牌
      </el-button>

      <data-table
        :data="filteredData"
        :columns="tableData.columns"
        :is-loading="tableData.isLoading"
        :is-slectable="tableData.isSlectable"
        @on-edit="handleEditClick"
        @on-delete="handleDelete"
      />

      <el-pagination
        background
        v-model:current-page="tableData.currentPage"
        v-model:page-size="tableData.pageSize"
        :is-slectable="tableData.isSlectable"
        :page-sizes="tableData.pageSizes"
        :layout="tableData.layout"
        :total="tableData.total"
        :disabled="tableData.isLoading"
        @size-change="
          (val) => {
            tableData.currentPage = 1;
            tableData.pageSize = val;
          }
        "
        @current-change="
          (val) => {
            tableData.currentPage = val;
          }
        "
      />
    </div>
  </div>
</template>
