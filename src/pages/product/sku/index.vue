<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { getSkuInfo, getSaleSku, getSkuList, removeSku, cancelSale } from "@/api/product/sku";
import { getCat1, getCat2, getCat3, getAttr } from "@/api/product/attr";

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
      width: 80,
    },
    {
      prop: "tmId",
      label: "品牌ID",
      sortable: true,
      width: 100,
    },
    {
      prop: "skuName",
      label: "SKU名称",
      sortable: true,
    },
    {
      prop: "price",
      label: "价格",
      sortable: true,
      width: 120,
    },
    {
      prop: "weight",
      label: "重量",
      sortable: true,
      width: 80,
    },
    {
      prop: "skuDefaultImg",
      label: "默认图片",
      isImg: true,
    },
    {
      prop: "skuDesc",
      label: "描述",
    },
  ],
});

const fetchSkuList = async () => {
  tableData.isLoading = true;
  const res = await getSkuList(tableData.currentPage, tableData.pageSize);
  tableData.data = res.data.records;
  tableData.total = res.data.total;
  tableData.isLoading = false;
};

const handleDelete = async (_, data) => {
  const { id } = data;
  const res = await removeSku(id);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: res.data ? res.data : "删除失败",
    });
  }
  fetchSkuList();
};

// watch
watch(
  () => [tableData.currentPage, tableData.pageSize],
  async (newVal, oldVal) => {
    fetchSkuList();
  }
);

onMounted(async () => {
  fetchSkuList();
});
</script>

<template>
  <data-table
    :data="tableData.data"
    :columns="tableData.columns"
    :is-loading="tableData.isLoading"
    @on-edit="handleEditClick"
    @on-delete="handleDelete"
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
  />
</template>

<style lang="scss" scoped></style>
