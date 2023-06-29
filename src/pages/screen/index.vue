<script setup>
import { ref } from "vue";
import useCountStore from "@/store/modules/countStore.js";
import request from "@/utils/request";
const count = useCountStore();
const num = ref(0);

const handleClick = () => {
  request.get("admin/product/test/read");
};
</script>

<template>
  <div>screen</div>
</template>

<style scoped></style>
