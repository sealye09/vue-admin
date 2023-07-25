<script setup>
import { ref } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "40%",
  },
  title: {
    type: String,
    default: "title",
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  onCancel: {
    type: Function,
    default: () => {
      console.log("cancel");
    },
  },
  onSubmit: {
    type: Function,
    default: () => {
      console.log("submit");
    },
  },
});

const formRef = ref(null);
</script>

<template>
  <el-dialog
    v-model="props.visible"
    :width="props.width"
    :title="props.title"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-form
      :rules="props.rules"
      :model="addDialogValue"
      label-position="right"
      label-width="100px"
      @keydown.enter.native="props.onSubmit(formRef)"
      @submit.enter.prevent
      ref="formRef"
    >
      <el-form-item
        prop="roleName"
        label="品牌名"
        required
      >
        <div class="w-4/5"><el-input v-model="addDialogValue.roleName" /></div>
      </el-form-item>

      <el-form-item>
        <span class="dialog-footer">
          <el-button @click="props.onCancel">取消</el-button>
          <el-button
            type="primary"
            @click="props.onSubmit(formRef)"
          >
            添加
          </el-button>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
