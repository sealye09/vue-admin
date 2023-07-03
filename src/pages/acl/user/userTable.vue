<script setup>
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  handleEdit: {
    type: Function,
    required: true,
  },
  handleDelete: {
    type: Function,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <el-table
    :data="props.users"
    border
    stripe
  >
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
          @click="handleEdit(scope.$index, scope.row)"
        >
          Edit
        </el-button>
        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="取消"
          title="确认删除吗？"
          @confirm="handleDelete(scope.$index, scope.row)"
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
