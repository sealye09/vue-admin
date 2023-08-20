<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { getSpu, getSpuHasSaleAttr } from "@/api/product/spu";
import catSelector from "@/components/catSelector.vue";

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
      width: 120,
    },
    {
      prop: "spuName",
      label: "SPU名称",
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

const selectState = reactive({
  cat1: { id: "", name: "" },
  cat2: { id: "", name: "" },
  cat3: { id: "", name: "" },
  complete: false,
});

const handleSelectChange = (val) => {
  console.log("🚀 ~ file: index.vue:16 ~ handleSelectChange ~ val", val);
  Object.assign(selectState, val);
  if (selectState.complete) {
    fetchSpu(selectState.cat3.id);
  } else {
    tableData.data = [];
  }
};

const fetchSpu = async (catId) => {
  const res = await getSpu(tableData.currentPage, tableData.pageSize, catId);
  console.log("🚀 ~ file: index.vue:52 ~ onMounted ~ res:", res);
  tableData.data = res.data.records;
  tableData.total = res.data.total;
};
</script>

<template>
  <div class="space-y-8">
    <cat-selector @on-change="handleSelectChange" />

    <data-table
      :data="tableData.data"
      :columns="tableData.columns"
      :is-loading="tableData.isLoading"
      :is-slectable="tableData.isSlectable"
      @on-edit="handleEditClick"
      @on-delete="handleDeleteUser"
      @on-selection-change="handleSelectionChange"
    />

    <el-pagination
      v-show="selectState.complete"
      class="mt-6 mb-4 w-full"
      background
      v-model:current-page="tableData.currentPage"
      v-model:page-size="tableData.pageSize"
      :page-sizes="tableData.pageSizes"
      :layout="tableData.layout"
      :total="tableData.total"
      :disabled="tableData.isLoading"
    />
  </div>
</template>

<style lang="scss" scoped></style>
