<script setup>
import { ref, computed } from "vue";
import useAppStore from "@/store/modules/appStore.js";
import { useRouter } from "vue-router";
import Menu from "./Menu.vue";
import useUserStore from "../store/modules/userStore";

const router = useRouter();
const props = defineProps({
  isCollapse: Boolean,
});

const activeItem = computed(() => {
  return router.currentRoute.value.path;
});

const defaultOpens = computed(() => {
  const path = router.currentRoute.value.path;
  const opens = [];
  const splitPath = path.slice(1, path.length - 1).split("/");
  splitPath.reduce((prev, curr) => {
    opens.push(prev + "/" + curr);
    splitPath.push(prev + "/" + curr);
    return prev + "/" + curr;
  }, "");
  return opens;
});

const appStore = useAppStore();
const userStore = useUserStore();
</script>

<template>
  <el-aside class="sidebar-container bg-gray-100">
    <el-scrollbar class="scrollbar">
      <el-menu
        router
        text-color="#303133"
        active-text-color="rgba(59, 130, 246, 0.8)"
        background-color="#F3F4F6"
        :default-openeds="defaultOpens"
        :default-active="activeItem"
        :collapse="appStore.isSiderBarOpen"
      >
        <el-menu-item
          class="aside-top bg-gray-100"
          @click="() => router.push('/')"
        >
          <el-icon class="logo">
            <img
              class="w-full h-full"
              src="@/assets/vue.svg"
              alt="logo"
            />
          </el-icon>
          <span
            class="title"
            v-if="!isCollapse"
            >Vue Admin
          </span>
        </el-menu-item>
        <Menu :menuList="userStore.menu"></Menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.logo {
  transition: all 0.2s ease-in-out;
}
.el-aside {
  border-right: solid 1px var(--el-menu-border-color);
  height: 100vh;
  overflow-x: hidden;
  img {
    -webkit-user-drag: none;
  }

  user-select: none;
  width: auto;

  .aside-top:hover {
    @apply bg-gray-100;
  }

  .aside-top {
    height: 60px;
    width: auto;
    border-bottom: solid 1px var(--el-menu-border-color);
    align-items: center;
    .logo {
      display: flex;
      align-items: center;
    }
    .title {
      padding-left: 0.75rem;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
    }
  }
  .el-menu {
    width: $sideBarWidth;
    margin: 0;
    border-right: none;
  }

  .el-menu--collapse {
    width: $hideSideBarWidth;
  }

  .scrollbar {
    width: 100%;
    height: 100%;
  }
}
</style>
