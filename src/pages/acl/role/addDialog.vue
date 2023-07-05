<script setup>
import { ref, reactive, onMounted } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "title",
  },
  addDialogValue: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <el-dialog
    width="40%"
    v-model="props.visible"
    :close-on-click-modal="false"
    :title="props.title"
  >
    <el-form
      :rules="rules"
      :model="addDialogValue"
      label-position="right"
      label-width="100px"
      @submit.enter.prevent
      ref="addRoleForm"
    >
      <el-form-item
        prop="roleName"
        label="Role Name"
        required
      >
        <el-input v-model="addDialogValue.roleName" />
      </el-form-item>

      <el-form-item class="">
        <span class="dialog-footer">
          <el-button @click="addDialogValue.visible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="handleAddRole(addRoleForm)"
          >
            Add
          </el-button>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
