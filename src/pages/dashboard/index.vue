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
    <br />
    ref:<el-button @click="num++">{{ num }}</el-button>
    <br />
    pinia: <el-button @click="count.increment">{{ count.num }}</el-button>
  </div>

  <button
    class="bg-red-300 px-4 py-1 rounded-md text-white"
    @click="handleClick"
  >
    Post
  </button>
</template>

<style scoped></style>
