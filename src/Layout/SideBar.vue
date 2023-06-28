<script setup>
import { Menu as IconMenu, Setting } from "@element-plus/icons-vue";
import useAppStore from "@/store/modules/appStore.js";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

const router = useRouter();
const props = defineProps({
  isCollapse: Boolean,
});

const store = useAppStore();
</script>

<template>
  <el-aside class="sidebar-container bg-gray-100">
    <el-menu
      router
      unique-opened
      default-active="/dashboard"
      :collapse="store.isSiderBarOpen"
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

      <el-menu-item
        index="/dashboard"
        class="bg-gray-100"
      >
        <el-icon size="18">
          <Icon icon="bi:x-diamond" />
        </el-icon>
        <template #title>看板</template>
      </el-menu-item>
      <el-menu-item
        index="categories"
        class="bg-gray-100"
      >
        <el-icon size="18"> <Icon icon="bi:bag-dash" /></el-icon>
        <template #title>商品管理</template>
      </el-menu-item>
      <el-menu-item
        index="/users"
        class="bg-gray-100"
      >
        <el-icon size="18">
          <Icon icon="bi:person" />
        </el-icon>
        <template #title>用户管理</template>
      </el-menu-item>
      <el-menu-item
        index="/goods"
        class="bg-gray-100"
      >
        <el-icon size="18">
          <Icon icon="bi:cart-dash" />
        </el-icon>
        <template #title>商品管理</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.logo {
  transition: all 0.2s ease-in-out;
}
.el-aside {
  border-right: solid 1px $boderColor;
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
    border-bottom: solid 1px $boderColor;
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
}
</style>
