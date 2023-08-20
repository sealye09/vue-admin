<script setup>
import { onMounted, reactive } from "vue";
import { getCat1, getCat2, getCat3 } from "@/api/product/attr.js";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["on-change"]);

const selectState = reactive({
  cat1List: [],
  cat1: { id: "", name: "" },
  cat2List: [],
  cat2: { id: "", name: "" },
  cat3List: [],
  cat3: { id: "", name: "" },
});

const defaultState = {
  cat1: { id: "", name: "" },
  cat2: { id: "", name: "" },
  cat3: { id: "", name: "" },
};

// 一级分类变化时，获取并更新二级分类和三级分类
const handleCat1Change = async (val) => {
  const res = await getCat2(val.id);
  Object.assign(selectState, {
    ...defaultState,
    cat1: { id: val.id, name: val.name },
    cat2List: res.data,
  });
  emits("on-change", {
    cat1: { ...selectState.cat1 },
    cat2: { ...selectState.cat2 },
    cat3: { ...selectState.cat3 },
    complete: false,
  });
};

// 二级分类变化时，获取并更新三级分类
const handleCat2Change = async (val) => {
  const res = await getCat3(val.id);
  Object.assign(selectState, {
    cat2: { id: val.id, name: val.name },
    cat3: defaultState.cat3,
    cat3List: res.data,
  });

  emits("on-change", {
    cat1: { ...selectState.cat1 },
    cat2: { ...selectState.cat2 },
    cat3: { ...selectState.cat3 },
    complete: false,
  });
};

// 三级分类变化时，触发事件
const handleCat3Change = (val) => {
  selectState.cat3 = { id: val.id, name: val.name };
  emits("on-change", {
    cat1: { ...selectState.cat1 },
    cat2: { ...selectState.cat2 },
    cat3: { ...selectState.cat3 },
    complete: true,
  });
};

onMounted(async () => {
  const res = await getCat1();
  selectState.cat1List = res.data;
});
</script>

<template>
  <div class="w-full flex justify-center gap-12">
    <el-select
      v-model="selectState.cat1"
      placeholder="一级分类"
      value-key="id"
      clearable
      :disabled="props.disabled"
      @change="handleCat1Change"
    >
      <el-option
        v-for="item in selectState.cat1List"
        :key="item.id"
        :label="item.name"
        :value="item"
      />
    </el-select>

    <el-select
      v-model="selectState.cat2"
      placeholder="二级分类"
      value-key="id"
      clearable
      :disabled="props.disabled"
      @change="handleCat2Change"
    >
      <el-option
        v-for="item in selectState.cat2List"
        :key="item.id"
        :label="item.name"
        :value="item"
      />
    </el-select>

    <el-select
      v-model="selectState.cat3"
      placeholder="三级分类"
      value-key="id"
      clearable
      :disabled="props.disabled"
      @change="handleCat3Change"
    >
      <el-option
        v-for="item in selectState.cat3List"
        :key="item.id"
        :label="item.name"
        :value="item"
      />
    </el-select>
  </div>
</template>
