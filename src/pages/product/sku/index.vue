<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";

import { onSaleSku, getSkuList, removeSku, cancelSale } from "@/api/product/sku";

import DetailDialog from "./DetailDialog.vue";

// ref reactive
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

const detailVisible = ref(false);
const detailId = ref("");

// 获取sku列表
const fetchSkuList = async () => {
  tableData.isLoading = true;
  const res = await getSkuList(tableData.currentPage, tableData.pageSize);
  tableData.data = res.data.records;
  tableData.total = res.data.total;
  tableData.isLoading = false;
};

// 上架/下架
const onToggleSaleStatus = async (index, row) => {
  console.log("🚀 ~ file: index.vue:52 ~ onAdd ~ index, row", index, row);
  if (row.isSale) {
    const res = await cancelSale(row.id);
    console.log("🚀 ~ file: index.vue:71 ~ onToggleSaleStatus ~ res:", res);
    if (res.code === 200) {
      ElMessage({
        type: "success",
        message: "下架成功",
      });
      fetchSkuList();
    } else {
      ElMessage({
        type: "error",
        message: res.data ? res.data : "下架失败",
      });
    }
  } else {
    const res = await onSaleSku(row.id);
    console.log("🚀 ~ file: index.vue:85 ~ onToggleSaleStatus ~ res:", res);

    if (res.code === 200) {
      ElMessage({
        type: "success",
        message: "上架成功",
      });
      fetchSkuList();
    } else {
      ElMessage({
        type: "error",
        message: res.data ? res.data : "上架失败",
      });
    }
  }
};

// 查看详情
const onView = (index, row) => {
  console.log("🚀 ~ file: index.vue:52 ~ onView ~ index, row", index, row);
  detailId.value = row.id;
  detailVisible.value = true;
};

const onEdit = (index, row) => {
  console.log("🚀 ~ file: index.vue:52 ~ onEdit ~ index, row", index, row);
  ElMessage({
    type: "warning",
    message: "开发中...",
  });
};

const onDelete = async (_, data) => {
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
  <detail-dialog
    v-model="detailVisible"
    :detail-id="detailId"
  />

  <data-table
    :data="tableData.data"
    :columns="tableData.columns"
    :is-loading="tableData.isLoading"
    :is-slectable="tableData.isSlectable"
    :hasOperate="tableData.hasOperate"
  >
    <template #operate>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="scope.row.isSale"
            type="warning"
            title="下架"
            circle
            @click="onToggleSaleStatus(scope.$index, scope.row)"
          >
            <Icon icon="heroicons:arrow-down" />
          </el-button>

          <el-button
            v-else
            type="primary"
            title="上架"
            circle
            @click="onToggleSaleStatus(scope.$index, scope.row)"
          >
            <Icon icon="heroicons:arrow-up" />
          </el-button>

          <el-button
            type="info"
            title="查看SKU详情"
            circle
            @click="onView(scope.$index, scope.row)"
          >
            <Icon icon="heroicons:eye" />
          </el-button>

          <el-button
            type="warning"
            title="编辑SKU信息"
            circle
            @click="onEdit(scope.$index, scope.row)"
          >
            <Icon icon="heroicons:pencil-square" />
          </el-button>

          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            title="确认删除吗？"
            @confirm="onDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button
                type="danger"
                title="删除SKU"
                circle
              >
                <Icon icon="heroicons:archive-box-x-mark" />
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
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
  />
</template>

<style lang="scss" scoped></style>
