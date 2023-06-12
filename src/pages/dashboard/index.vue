<script setup>
import useCountStore from "@/store/modules/countStore.js";
import { ref } from "vue";
const count = useCountStore();
const num = ref(0);
</script>

<template>
  <div>
    dashboard
    <br />
    ref:<el-button @click="num++">{{ num }}</el-button>
    <br />
    pinia: <el-button @click="count.increment">{{ count.num }}</el-button>
  </div>
</template>

<style scoped></style>
