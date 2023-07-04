<script setup>
import { ref } from "vue";
import useCountStore from "@/store/modules/countStore.js";

const countStore = useCountStore();
const num = ref(0);
</script>

<template>
  <span class="text-xl text-amber-600 hover:text-orange-600/80">dashboard</span>
  <el-divider />
  <div class="flex flex-col gap-4 my-2">
    <div class="flex gap-2 items-center">
      <span>Vue ref</span>
      <el-button
        type="primary"
        @click="num++"
      >
        {{ num }}
      </el-button>
    </div>
    <div class="flex gap-4 items-center">
      <span>pinia </span>
      <el-button
        type="primary"
        @click="countStore.increment"
      >
        {{ countStore.num }}
      </el-button>
    </div>
  </div>
</template>

<style scoped></style>
