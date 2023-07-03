<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isSlectable: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["on-edit", "on-delete", "on-selection-change"]);

const onSelectionChange = (val) => {
  emits("on-selection-change", val);
};

const onEdit = (index, row) => {
  emits("on-edit", index, row);
};

const onDelete = (index, row) => {
  emits("on-delete", index, row);
};
</script>

<template>
  <el-table
    :data="props.data"
    border
    stripe
    @selection-change="onSelectionChange"
  >
    <el-table-column
      v-if="props.isSlectable"
      type="selection"
    ></el-table-column>
    <el-table-column
      v-for="(column, index) in props.columns"
      :sortable="column.sortable"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
    />

    <el-table-column
      label="Operations"
      width="200"
    >
      <template #default="scope">
        <el-button
          title="Edit User"
          size="small"
          @click="onEdit(scope.$index, scope.row)"
        >
          Edit
        </el-button>
        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="取消"
          title="确认删除吗？"
          @confirm="onDelete(scope.$index, scope.row)"
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
    <template #empty>
      <el-skeleton
        v-show="props.isLoading"
        :rows="8"
        animated
      >
      </el-skeleton>
    </template>
  </el-table>
</template>