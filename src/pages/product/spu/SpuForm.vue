<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { Icon } from "@iconify/vue";
import {
  getAllTradeMark,
  getSpuImageList,
  getSpuHasSaleAttr,
  getAllSaleAttr,
  addOrUpdateSpu,
  getSpuInfo,
} from "@/api/product/spu";

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
  cat3Id: {
    type: [String, Number],
    default: "",
  },
  spuId: {
    type: [String, Number],
    default: "",
  },
});

const emits = defineEmits(["on-cancel", "on-submit"]);

const attrInputRef = ref(null);

// 存储所有的品牌数据
const tmList = ref([]);

// 存储照片墙的数据
const imgList = ref([]);

// 全部销售属性
const allSaleAttr = ref([]);

// 已有的SPU销售属性
const saleAttr = ref([]);

// 控制预览对话框的显示与隐藏
const previewVisible = ref(false);

// 存储预览图片地址
const previewImgUrl = ref("");

const defaultSpuData = {
  category3Id: "", // 收集三级分类的ID
  spuName: "", // SPU的名字
  description: "", // SPU的描述
  tmId: "", // 品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
};

// 存储已有的SPU对象
const spuData = reactive(Object.assign({}, defaultSpuData));

// 存储属性值的ID与属性值的名字
const attrSelector = ref("");

// 计算出当前SPU还未拥有的销售属性
const restAttr = computed(() => {
  const unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName;
    });
  });
  return unSelectArr;
});

// 照片墙点击预览按钮的时候触发的钩子
const handlePreview = (file) => {
  previewImgUrl.value = file.url;
  previewVisible.value = true;
};

const handleCancel = () => {
  emits("on-cancel", 1);
};

const handleSubmit = async () => {
  // 1:照片墙的数据
  spuData.spuImageList = imgList.value.map((item) => {
    return {
      imgName: item.name, //图片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    };
  });
  // 2:整理销售属性的数据
  spuData.spuSaleAttrList = saleAttr.value;
  const res = await addOrUpdateSpu(spuData);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: spuData.id ? "更新成功" : "添加成功",
    });
    emits("on-submit", 1);
  } else {
    ElMessage({
      type: "error",
      message: spuData.id ? "更新失败" : "添加失败",
    });
    emits("on-submit", 0);
  }
};

// 照片上传成功之前的钩子约束文件的大小与类型
const onBeforeUpload = (file) => {
  if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/gif") {
    if (file.size / 1024 / 1024 < 3) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传文件务必小于3M",
      });
      return false;
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件务必PNG|JPG|GIF",
    });
    return false;
  }
};

// 添加销售属性的方法
const addSaleAttr = () => {
  const [id, name] = attrSelector.value.split(":");
  saleAttr.value.push({
    baseSaleAttrId: id,
    saleAttrName: name,
    spuSaleAttrValueList: [],
  });
  attrSelector.value = "";
};

// 属性值按钮的点击事件
const toEdit = (row) => {
  row.flag = true;
  row.saleAttrValue = "";
  // 让input组件获取焦点
  if (attrInputRef.value) {
    attrInputRef.value.focus();
  }
};

const toLook = (row) => {
  if (row.saleAttrValue.trim() == "") {
    row.flag = false;
    return;
  }

  const { baseSaleAttrId, saleAttrValue } = row;
  const newSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  };

  // 判断属性值是否在数组当中存在
  const isRepeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue;
  });

  if (isRepeat) {
    ElMessage({
      type: "error",
      message: "属性值重复",
    });
    return;
  }

  row.spuSaleAttrValueList.push(newSaleAttrValue);
  row.flag = false;
};

// 添加SPU初始化请求方法
const initAddForm = async () => {
  if (!props.cat3Id) return;

  // 清空数据
  Object.assign(spuData, defaultSpuData);
  imgList.value = [];
  saleAttr.value = [];
  attrSelector.value = "";

  spuData.category3Id = props.cat3Id;

  //获取全部品牌的数据
  const tmRes = await getAllTradeMark();
  console.log("品牌数据", tmRes);
  tmList.value = tmRes.data;

  //获取整个项目全部SPU的销售属性
  const allAttrRes = await getAllSaleAttr();
  allSaleAttr.value = allAttrRes.data;
  console.log("全部销售属性数据", allAttrRes);
};

// 更新SPU初始化请求方法
const initEditForm = async () => {
  if (!props.spuId) return;

  const spuRes = await getSpuInfo(props.spuId);
  Object.assign(spuData, spuRes.data);

  //获取全部品牌的数据
  const tmRes = await getAllTradeMark();
  console.log("品牌数据", tmRes);
  tmList.value = tmRes.data;

  //获取某一个品牌旗下全部售卖商品的图片
  const imgRes = await getSpuImageList(props.spuId);
  imgList.value = imgRes.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    };
  });
  console.log("图片数据", imgRes);

  //获取已有的SPU销售属性的数据
  const attrRes = await getSpuHasSaleAttr(props.spuId);
  saleAttr.value = attrRes.data;
  console.log("已有销售属性数据", attrRes);

  //获取整个项目全部SPU的销售属性
  const allAttrRes = await getAllSaleAttr();
  allSaleAttr.value = allAttrRes.data;
  console.log("全部销售属性数据", allAttrRes);
};

onMounted(async () => {
  if (props.mode == "add") {
    // 添加SPU
    console.log("添加SPU, add mode");
    await initAddForm();
  } else {
    // 更新SPU
    console.log("更新SPU, edit mode");
    await initEditForm();
  }
});
</script>

<template>
  <el-dialog v-model="previewVisible">
    <img
      w-full
      :src="previewImgUrl"
      alt="图片预览"
    />
  </el-dialog>

  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请你输入SPU名称"
        v-model="spuData.spuName"
      />
    </el-form-item>

    <el-form-item label="SPU品牌">
      <el-select v-model="spuData.tmId">
        <el-option
          v-for="item in tmList"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        row="6"
        placeholder="请你输入SPU描述"
        v-model="spuData.description"
      />
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        v-model:file-list="imgList"
        :on-preview="handlePreview"
        :before-upload="onBeforeUpload"
      >
        <Icon icon="heroicons:plus-solid" />
      </el-upload>
    </el-form-item>

    <el-form-item label="SPU销售属性">
      <div class="w-full">
        <div class="space-x-4">
          <el-select
            v-model="attrSelector"
            :placeholder="restAttr.length ? `还未选择${restAttr.length}个` : '无'"
          >
            <el-option
              v-for="item in restAttr"
              :key="item.id"
              :label="item.name"
              :value="`${item.id}:${item.name}`"
            />
          </el-select>

          <el-button
            type="primary"
            :disabled="!attrSelector"
            @click="addSaleAttr"
          >
            <Icon icon="heroicons:plus-solid" />
            添加属性
          </el-button>
        </div>

        <el-table
          class="mt-4"
          border
          :data="saleAttr"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          />

          <el-table-column
            label="销售属性名字"
            width="120px"
            prop="saleAttrName"
          />

          <el-table-column label="销售属性值">
            <template #="{ row, $index }">
              <el-tag
                v-for="(item, index) in row.spuSaleAttrValueList"
                class="mx-1"
                :key="row.id"
                closable
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input
                v-show="row.flag"
                ref="attrInputRef"
                class="my-4"
                placeholder="请你输入属性值"
                v-model="row.saleAttrValue"
                @blur="row.flag = false"
                @keyup.enter="toLook(row)"
              />
              <el-button
                v-show="!row.flag"
                class="mx-2"
                type="primary"
                size="small"
                round
                @click="toEdit(row)"
              >
                <Icon icon="heroicons:plus-solid" />
              </el-button>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="120px"
          >
            <template #="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                round
                @click="saleAttr.splice($index, 1)"
              >
                <Icon icon="heroicons:archive-box-x-mark" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :disabled="!saleAttr.length"
        @click="handleSubmit"
      >
        保存
      </el-button>
      <el-button
        type="primary"
        @click="handleCancel"
      >
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>
