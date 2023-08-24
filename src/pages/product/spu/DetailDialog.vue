<script setup>
import { reactive, inject, watch } from "vue";

import { getSkuList } from "@/api/product/spu";

const visible = inject("detailVisible");
const detailId = inject("detailId");

// reactive ref
const skuInfo = reactive({
  data: [],
});

const fetchSkuInfo = async () => {
  if (!detailId) return;
  const res = await getSkuList(detailId.value);
  console.log("fetchSkuInfo ~ res:", res);
  Object.assign(skuInfo.data, res.data);
};

const handleClose = () => {
  visible.value = false;
};

watch(
  () => detailId.value,
  async (newVal, oldVal) => {
    if (newVal) {
      fetchSkuInfo();
    }
  }
);
</script>

<template>
  <el-dialog
    width="40%"
    title="SKU列表"
    v-model="visible"
    @close="handleClose"
  >
    <el-table
      border
      :data="skuInfo.data"
    >
      <el-table-column
        label="SKU名字"
        prop="skuName"
      />
      <el-table-column
        label="SKU价格"
        prop="price"
      />
      <el-table-column
        label="SKU重量"
        prop="weight"
      />

      <el-table-column label="SKU图片">
        <template #="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<style scoped></style>
