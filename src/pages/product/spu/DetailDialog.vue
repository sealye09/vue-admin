<script setup>
import { reactive, computed, watch } from "vue";

import { getSkuList } from "@/api/product/spu";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  detailId: {
    type: Number,
    required: true,
  },
});

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emits("update:modelValue", val);
  },
});

const emits = defineEmits(["update:modelValue"]);

// reactive ref
const skuInfo = reactive({
  data: [],
});

const fetchSkuInfo = async () => {
  if (!props.detailId) return;
  const res = await getSkuList(props.detailId);
  console.log("fetchSkuInfo ~ res:", res);
  Object.assign(skuInfo.data, res.data);
};

const handleClose = () => {
  visible.value = false;
};

watch(
  () => props.detailId,
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
