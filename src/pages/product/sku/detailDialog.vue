<script setup>
import { reactive, watch, computed } from "vue";

import { getSkuInfo } from "@/api/product/sku";

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
  skuImageList: [],
});

const fetchSkuInfo = async () => {
  if (!props.detailId) return;
  const res = await getSkuInfo(props.detailId);
  console.log("fetchSkuInfo ~ res:", res);
  Object.assign(skuInfo, res.data);
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
    title="SKU详情"
    v-model="visible"
    @close="handleClose"
  >
    <el-row style="margin: 10px 0px">
      <el-col :span="6">名称</el-col>
      <el-col :span="18">{{ skuInfo.skuName }}</el-col>
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">描述</el-col>
      <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">价格</el-col>
      <el-col :span="18">{{ skuInfo.price }}</el-col>
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">平台属性</el-col>
      <el-col :span="18">
        <el-tag
          style="margin: 5px"
          v-for="item in skuInfo.skuAttrValueList"
          :key="item.id"
          >{{ item.valueName }}</el-tag
        >
      </el-col>
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">销售属性</el-col>
      <el-col :span="18">
        <el-tag
          style="margin: 5px"
          v-for="item in skuInfo.skuSaleAttrValueList"
          :key="item.id"
          >{{ item.saleAttrValueName }}</el-tag
        >
      </el-col>
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">商品图片</el-col>
      <el-col
        v-if="skuInfo.skuImageList.length"
        :span="18"
      >
        <el-carousel
          :interval="4000"
          type="card"
          height="200px"
        >
          <el-carousel-item
            v-for="item in skuInfo.skuImageList"
            :key="item.id"
          >
            <img
              :src="item.imgUrl"
              alt=""
              style="width: 100%; height: 100%"
            />
          </el-carousel-item>
        </el-carousel>
      </el-col>

      <el-col
        v-else
        :span="18"
      >
      </el-col>
    </el-row>
  </el-dialog>
</template>
