<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { getSpu, getSpuHasSaleAttr } from "@/api/product/spu";
import catSelector from "@/components/catSelector.vue";
import { Icon } from "@iconify/vue";

// ref reactive
const tableData = reactive({
  data: [],
  total: 10,
  pageSize: 10,
  currentPage: 1,
  isLoading: false,
  pageSizes: [10, 20, 30, 40, 1, 2],
  layout: "prev, pager, next, jumper, ->, sizes, total",
  hasOperate: false,
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
      prop: "description",
      label: "SPU描述",
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

const onAdd = (index, row) => {
  console.log("🚀 ~ file: index.vue:52 ~ onAdd ~ index, row", index, row);
};

const onView = (index, row) => {
  console.log("🚀 ~ file: index.vue:52 ~ onView ~ index, row", index, row);
};

const onEdit = (index, row) => {
  console.log("🚀 ~ file: index.vue:52 ~ onEdit ~ index, row", index, row);
};

const onDelete = (index, row) => {
  console.log("🚀 ~ file: index.vue:52 ~ onDelete ~ index, row", index, row);
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
      :hasOperate="tableData.hasOperate"
    >
      <template #operate>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              title="添加SKU"
              circle
              @click="onAdd(scope.$index, scope.row)"
            >
              <Icon icon="heroicons:plus-solid" />
            </el-button>

            <el-button
              type="info"
              title="查看SKU信息"
              circle
              @click="onView(scope.$index, scope.row)"
            >
              <Icon icon="heroicons:eye" />
            </el-button>

            <el-button
              type="warning"
              title="编辑SPU"
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
                  title="删除SPU"
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
