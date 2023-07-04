<script setup>
import { useRouter } from "vue-router";
import notFoundImg from "@/assets/images/404.png";
const router = useRouter();
const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="flex w-full h-full justify-center bg-gray-100">
    <div class="mx-auto">
      <img
        class="h-[480px] w-[760px]"
        :src="notFoundImg"
        alt="not found image"
      />
      <div
        class="hover:underline hover:cursor-pointer text-blue-600"
        @click="goHome"
      >
        回到首页...
      </div>
    </div>
  </div>
</template>
