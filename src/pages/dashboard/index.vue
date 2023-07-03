<script setup>
import { ref } from "vue";
import useCountStore from "@/store/modules/countStore.js";
import { getMenuList } from "@/api/user/user.js";
const count = useCountStore();
const num = ref(0);

const handleClick = async () => {
  const res = await getMenuList();
  console.log(res);
};
</script>

<template>
  <div>
    dashboard
    <div class="flex flex-col gap-4 my-2">
      <div class="flex gap-2 items-center">
        <span>Vue ref</span>
        <el-button
          type="primary"
          @click="num++"
          >{{ num }}</el-button
        >
      </div>
      <div class="flex gap-4 items-center">
        <span>pinia </span>
        <el-button
          type="primary"
          @click="count.increment"
          >{{ count.num }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
