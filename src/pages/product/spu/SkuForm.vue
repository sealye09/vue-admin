<script setup>
import { ref, reactive, onMounted } from "vue";

import { getAttr } from "@/api/product/attr";
import { getSpuInfo, addSku } from "@/api/product/spu";

const props = defineProps({
  cat1Id: {
    type: [String, Number],
    required: true,
  },
  cat2Id: {
    type: [String, Number],
    required: true,
  },
  spuId: {
    type: [String, Number],
    required: true,
  },
});

// ref reactive
const skuData = reactive({
  category3Id: "", //三级分类的ID
  spuId: "", //已有的SPU的ID
  tmId: "", //SPU品牌的ID
  skuName: "", //sku名字
  price: "", //sku价格
  weight: "", //sku重量
  skuDesc: "", //sku的描述

  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuImageList: [],
  skuDefaultImg: "",
});

//平台属性
const attrArr = ref([]);
//销售属性
const saleArr = ref([]);
//照片的数据
const imgArr = ref([]);
//获取table组件实例
const table = ref();

// emit
const emits = defineEmits(["change-scene"]);

const initSkuData = async () => {
  const { cat1Id, cat2Id, spuId } = props;

  const spuRes = await getSpuInfo(spuId);
  console.log("🚀 ~ file: SkuForm.vue:58 ~ initSkuData ~ spuRes:", spuRes);
  Object.assign(skuData, spuRes.data, { spuId });

  //获取平台属性
  const attrRes = await getAttr(cat1Id, cat2Id, skuData.category3Id);
  console.log("🚀 ~ file: SkuForm.vue:63 ~ initSkuData ~ attrRes:", attrRes);

  //平台属性
  attrArr.value = attrRes.data;
  //销售属性
  saleArr.value = spuRes.data.spuSaleAttrList;
  //图片
  imgArr.value = spuRes.data.spuImageList;
};

// event handler

const handleCancel = () => {
  emits("change-scene", "view");
};

const setDefaulImg = (row) => {
  //选中的图片才勾选
  table.value.toggleRowSelection(row, true);
  //收集图片地址
  skuData.skuDefaultImg = row.imgUrl;
};

const handleSubmit = async () => {
  //平台属性
  skuData.skuAttrValueList = attrArr.value.reduce((prev, next) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(":");
      prev.push({
        attrId,
        valueId,
      });
    }
    return prev;
  }, []);

  //销售属性
  skuData.skuSaleAttrValueList = saleArr.value.reduce((prev, next) => {
    if (next.saleIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(":");
      prev.push({
        saleAttrId,
        saleAttrValueId,
      });
    }
    return prev;
  }, []);

  // skuImageList
  skuData.skuImageList = imgArr.value.map((item) => {
    return {
      imgUrl: item.imgUrl,
      imgName: item.imgName,
    };
  });

  const res = await addSku(skuData);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "添加SKU成功",
    });
    emits("change-scene", "view");
  } else {
    ElMessage({
      type: "error",
      message: res.data || "添加SKU失败",
    });
  }
};

onMounted(() => {
  console.log(props);
  initSkuData();
});
</script>

<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input
        placeholder="SKU名称"
        v-model="skuData.skuName"
      />
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuData.price"
      />
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        type="number"
        v-model="skuData.weight"
      />
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuData.skuDesc"
      />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${item.id}:${saleAttrValue.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table
        border
        ref="table"
        :data="imgArr"
      >
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        />
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <el-image :src="row.imgUrl" />
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          prop="imgName"
        />
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button
              :type="skuData.skuDefaultImg == row.imgUrl ? 'success' : null"
              size="small"
              @click="setDefaulImg(row)"
            >
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="default"
        @click="handleSubmit"
      >
        保存
      </el-button>
      <el-button
        type="primary"
        size="default"
        @click="handleCancel"
      >
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
