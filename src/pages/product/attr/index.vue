<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import {
  getCat1,
  getCat2,
  getCat3,
  getAttr,
  addOrUpdateAttr,
  removeAttr,
} from "@/api/product/attr.js";

const selectState = reactive({
  cat1List: [],
  cat1Selected: "",
  cat2List: [],
  cat2Selected: "",
  cat3List: [],
  cat3Selected: "",
  attrList: [],
});

const tableData = reactive({
  data: [],
});

const tableEditData = reactive({
  attrList: [],
  attrId: "",
  attrName: "",
});

const isEditing = ref(false);

const toggleEdit = (idx, data) => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    tableEditData.attrList = data.attrValueList.map((item) => {
      return {
        id: item.id,
        attrId: item.attrId,
        valueName: item.valueName,
        show: true,
      };
    });
    tableEditData.attrId = data.id;
    tableEditData.attrName = data.attrName;
  } else {
    tableEditData.attrList = [];
  }
};

const onDeleteAttrValue = (idx, data) => {
  console.log("🚀 ~ file: index.vue:32 ~ onDelete ~ idx, data:", idx, data);
  tableData.data.splice(idx, 1);
};

const onDeleteAttr = async (idx, data) => {
  console.log("🚀 ~ file: index.vue:32 ~ onDelete ~ idx, data:", idx, data);
  const res = await removeAttr(data.id);
  if (res.code === 200) {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    getAttrList();
  } else {
    ElMessage({
      message: res.data ? res.data : "删除失败",
      type: "error",
    });
  }

  getAttrList();
};

const onAddAttrValue = () => {
  if (tableEditData.attrList[tableEditData.attrList.length - 1].valueName === "") {
    tableEditData.attrList.splice(tableEditData.attrList.length - 1, 1);
    ElMessage({
      message: "属性值不能为空",
      type: "error",
    });
  }

  tableEditData.attrList.push({
    id: "",
    attrId: tableEditData.attrId,
    valueName: "",
    show: false,
  });
};

const onAddAttr = () => {
  // 选择三级分类后，才能添加属性
  if (!selectState.cat3Selected) {
    ElMessage({
      message: "请先选择分类",
      type: "error",
    });
    return;
  }

  isEditing.value = true;

  tableEditData.attrName = "";
  tableEditData.attrList = [
    {
      id: "",
      attrId: "",
      valueName: "",
      show: false,
    },
  ];
};

const onInputBlur = (idx, data) => {
  data.show = true;
  console.log("🚀 ~ file: index.vue:43 ~ onInputBlur ~ idx, data", idx, data);
  if (data.valueName === "") {
    tableEditData.attrList.splice(idx, 1);
    ElMessage({
      message: "属性值不能为空",
      type: "error",
    });
  }
};

const handleAddAttr = async () => {
  console.log("🚀 ~ file: index.vue:80 ~ handleAddAttr ~ selectState", selectState);

  const res = await addOrUpdateAttr({
    attrName: tableEditData.attrName,
    attrValueList: tableEditData.attrList,
    categoryId: selectState.cat3Selected,
    categoryLevel: 3,
  });
  if (res.code === 200) {
    ElMessage({
      message: "添加成功",
      type: "success",
    });
    isEditing.value = false;
  } else {
    ElMessage({
      message: res.data ? res.data : "添加失败",
      type: "error",
    });
  }

  getAttrList();
};

const getAttrList = async () => {
  const res = await getAttr(
    selectState.cat1Selected,
    selectState.cat2Selected,
    selectState.cat3Selected
  );
  tableData.data = res.data;
};

// 一级分类变化时，获取并更新二级分类和三级分类
watch(
  () => selectState.cat1Selected,
  async (newVal) => {
    if (newVal) {
      const res = await getCat2(newVal);
      selectState.cat2List = res.data;
      selectState.cat2Selected = "";
      selectState.cat3List = [];
      selectState.cat3Selected = "";
      selectState.attrList = [];
    }
  }
);

// 二级分类变化时，获取并更新三级分类
watch(
  () => selectState.cat2Selected,
  async (newVal) => {
    if (newVal) {
      const res = await getCat3(newVal);
      selectState.cat3List = res.data;
      selectState.cat3Selected = "";
      selectState.attrList = [];
    }
  }
);

// 三级分类变化时，获取并更新属性列表
watch(
  () => selectState.cat3Selected,
  async (newVal) => {
    if (newVal) {
      getAttrList();
    } else {
      tableData.data = [];
    }
  }
);

onMounted(async () => {
  const res = await getCat1();
  selectState.cat1List = res.data;
});
</script>

<template>
  <div class="space-y-8 min-h-[70vh]">
    <div class="w-full flex justify-center gap-12">
      <el-select
        v-model="selectState.cat1Selected"
        placeholder="一级分类"
        :disabled="isEditing"
        clearable
      >
        <el-option
          v-for="item in selectState.cat1List"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-model="selectState.cat2Selected"
        placeholder="二级分类"
        :disabled="isEditing"
        clearable
      >
        <el-option
          v-for="item in selectState.cat2List"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-model="selectState.cat3Selected"
        placeholder="三级分类"
        :disabled="isEditing"
        clearable
      >
        <el-option
          v-for="item in selectState.cat3List"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>

    <div
      class="flex flex-col gap-4"
      v-if="isEditing"
    >
      <el-row>
        <div class="flex gap-2">
          <span class="text-sm inline-flex items-center text-gray-600 flex-shrink-0 h-full">
            属性名称
          </span>
          <div class="w-80">
            <el-input v-model="tableEditData.attrName" />
          </div>
        </div>
      </el-row>
      <div class="w-full flex">
        <el-button
          type="primary"
          @click="onAddAttrValue"
        >
          添加属性值
        </el-button>
      </div>

      <el-table
        border
        stripe
        :data="tableEditData.attrList"
      >
        <el-table-column
          prop="id"
          label="ID"
        />
        <el-table-column label="属性值">
          <template #default="scope">
            <span
              v-show="scope.row.show"
              @click="scope.row.show = false"
            >
              {{ scope.row.valueName }}
            </span>
            <el-input
              v-show="!scope.row.show"
              v-model="scope.row.valueName"
              @blur="onInputBlur(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template #default="scope">
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="确认删除吗？"
              @confirm="onDeleteAttrValue(scope.$index, scope.row)"
            >
              <template #reference>
                <el-button
                  title="Delete User"
                  size="small"
                  type="danger"
                >
                  Delete
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="w-full flex justify-end gap-4">
        <el-button @click="() => (isEditing = false)"> 取消 </el-button>
        <el-button
          type="primary"
          @click="handleAddAttr"
        >
          确认
        </el-button>
      </div>
    </div>

    <div
      class="flex flex-col gap-4"
      v-else
    >
      <div class="w-full flex">
        <el-button
          type="primary"
          @click="onAddAttr"
        >
          添加属性
        </el-button>
      </div>
      <el-table
        border
        stripe
        :data="tableData.data"
      >
        <el-table-column
          prop="id"
          label="ID"
        />
        <el-table-column
          prop="attrName"
          label="属性名称"
        />
        <el-table-column label="属性值">
          <template #="{ row, $index }">
            <el-tag
              v-for="(item, index) in row.attrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
        >
          <template #default="scope">
            <el-button
              title="Edit User"
              size="small"
              @click="toggleEdit(scope.$index, scope.row)"
            >
              Edit
            </el-button>
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="确认删除吗？"
              @confirm="onDeleteAttr(scope.$index, scope.row)"
            >
              <template #reference>
                <el-button
                  title="Delete User"
                  size="small"
                  type="danger"
                >
                  Delete
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
