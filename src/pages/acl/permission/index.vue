<script setup>
import { getPermissions } from "@/api/acl/menu.js";
import { ref, reactive, onMounted } from "vue";
import dataTable from "@/components/dataTable.vue";

const data = reactive({
  permissions: [],
  isLoading: false,
  columns: [
    {
      prop: "id",
      label: "ID",
      sortable: true,
    },
    {
      prop: "name",
      label: "名称",
      sortable: true,
    },
    {
      prop: "code",
      label: "权限值",
      sortable: true,
    },
    {
      prop: "createTime",
      label: "创建时间",
      sortable: true,
    },
    {
      prop: "updateTime",
      label: "更新时间",
      sortable: true,
    },
  ],
});

const getPermission = async () => {
  data.isLoading = true;
  const res = await getPermissions();
  console.log(res);
  data.permissions = res.data;
  data.isLoading = false;
};

onMounted(() => {
  getPermission();
});
</script>

<template>
  <data-table
    :data="data.permissions"
    :columns="data.columns"
    :is-loading="data.isLoading"
    :tree="true"
  ></data-table>
</template>

<style lang="scss" scoped></style>
