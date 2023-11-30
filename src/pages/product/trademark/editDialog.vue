<script setup>
import { ref, inject, computed } from "vue";
import { Icon } from "@iconify/vue";

import { updateTrademark } from "@/api/product/trademark";

const props = defineProps({
  modelValue: {
    type: Boolean,
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

const editDialogValue = inject("editDialogValue");

const emits = defineEmits(["on-submit", "update:modelValue"]);

const formRef = ref(null);

const rules = {
  name: [
    { required: true, message: "请输入品牌名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
};

const handleSubmit = (formRef) => {
  formRef.validate(async (valid) => {
    if (valid) {
      const res = await updateTrademark(editDialogValue);
      console.log("🚀 ~ file: editDialog.vue:26 ~ formRef.validate ~ res:", res);

      if (res.code === 200) {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
        handleClose();
        emits("on-submit");
      } else {
        ElMessage({
          message: "修改失败",
          type: "error",
        });
      }
    } else {
      ElMessage({
        message: "修改失败,请检查表单",
        type: "error",
      });
      return false;
    }
  });
};

const handleClose = () => {
  visible.value = false;
  formRef.value.resetFields();
};

//上传图片组件 -> 上传图片之前触发的钩子函数
const beforeUpload = (rawFile) => {
  //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
  //要求:上传文件格式png|jpg|gif 4M
  if (rawFile.type == "image/png" || rawFile.type == "image/jpeg" || rawFile.type == "image/gif") {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传文件大小小于4M",
      });
      return false;
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件格式务必PNG|JPG|GIF",
    });
    return false;
  }
};
//图片上传成功钩子
const handleUploadSuccess = (response, uploadFile) => {
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  editDialogValue.logoUrl = response.data;
  editDialogValue.fileList = [{ name: response.data, url: response.data }];
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate("logoUrl");
};

const handlePreview = (file) => {
  editDialogValue.previewUrl = file.url;
  editDialogValue.preview = true;
};
</script>

<template>
  <div>
    <el-dialog v-model="editDialogValue.preview">
      <img
        w-full
        :src="editDialogValue.previewUrl"
        alt="预览"
      />
    </el-dialog>

    <el-dialog
      width="40%"
      title="修改品牌信息"
      v-model="visible"
      :close-on-click-modal="true"
      @close="handleClose"
    >
      <el-form
        :rules="rules"
        :model="editDialogValue"
        label-position="right"
        label-width="100px"
        @keydown.enter.native="handleSubmit(formRef)"
        @submit.enter.prevent
        ref="formRef"
      >
        <el-form-item
          prop="tmName"
          label="品牌名称"
          required
        >
          <div class="w-4/5"><el-input v-model="editDialogValue.tmName" /></div>
        </el-form-item>

        <el-form-item
          label="品牌LOGO"
          label-width="100px"
          prop="logoUrl"
        >
          <el-upload
            action="/api/admin/product/fileUpload"
            list-type="picture-card"
            :file-list="editDialogValue.fileList"
            :on-preview="handlePreview"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
          >
            <el-icon><Icon icon="heroicons:plus" /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <span class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button
              type="primary"
              @click="handleSubmit(formRef)"
            >
              修改
            </el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
