<script setup>
import { ref, reactive, provide, watch } from "vue";
import { Icon } from "@iconify/vue";

import { getSpu, removeSpu } from "@/api/product/spu";
import catSelector from "@/components/catSelector.vue";

import DetailDialog from "./DetailDialog.vue";
import SpuForm from "./SpuForm.vue";
import SkuForm from "./SkuForm.vue";

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

const formMode = ref("view");
const spuMode = ref("add");

const detailVisible = ref(false);
provide("detailVisible", detailVisible);
const detailId = ref("");
provide("detailId", detailId);

const chosenSpuId = ref("");

watch(
  () => [tableData.currentPage, tableData.pageSize],

  ([currentPage, pageSize]) => {
    fetchSpu(selectState.cat3.id);
  }
);

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

const onAddSku = (_, row) => {
  chosenSpuId.value = row.id;
  formMode.value = "sku";
};

const onAddSpu = () => {
  if (!selectState.cat3.id) {
    ElMessage({
      type: "warning",
      message: "请先选择三级分类",
    });
    return;
  }

  spuMode.value = "add";
  formMode.value = "spu";
};

const onView = (_, row) => {
  detailId.value = row.id;
  detailVisible.value = true;
};

const onEdit = (_, row) => {
  chosenSpuId.value = row.id;
  spuMode.value = "edit";
  formMode.value = "spu";
};

const onDelete = (_, row) => {
  removeSpu(row.id).then((res) => {
    console.log("🚀 ~ file: index.vue:52 ~ onDelete ~ res", res);
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
    fetchSpu(selectState.cat3.id);
  });
};
</script>

<template>
  <detail-dialog />

  <div class="space-y-8 min-h-[70vh]">
    <cat-selector
      :disabled="formMode !== 'view'"
      @on-change="handleSelectChange"
    />

    <el-divider />

    <spu-form
      v-if="formMode === 'spu'"
      :mode="spuMode"
      :cat3-id="selectState.cat3.id"
      :spu-id="chosenSpuId"
      @change-scene="(val) => (formMode = val)"
    />

    <sku-form
      v-if="formMode === 'sku'"
      :cat1-id="selectState.cat1.id"
      :cat2-id="selectState.cat2.id"
      :spu-id="chosenSpuId"
      @change-scene="(val) => (formMode = val)"
    />

    <div
      v-if="formMode === 'view'"
      class="space-y-6"
    >
      <el-button
        type="primary"
        @click="onAddSpu"
      >
        添加SPU
      </el-button>

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
                @click="onAddSku(scope.$index, scope.row)"
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
  </div>
</template>

<style lang="scss" scoped></style>
