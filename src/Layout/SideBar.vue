<script setup>
import { Menu as IconMenu, Setting } from "@element-plus/icons-vue";
import useAppStore from "@/store/modules/appStore.js";

const props = defineProps({
  isCollapse: Boolean,
});

const store = useAppStore();
</script>

<template>
  <el-aside class="sidebar-container">
    <el-menu
      router
      unique-opened
      default-active="2"
      :collapse="store.isSiderBarOpen"
    >
      <el-menu-item class="aside-top">
        <el-icon class="logo">
          <img
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

      <el-menu-item index="/dashboard">
        <el-icon>
          <DataBoard />
        </el-icon>
        <template #title>看板</template>
      </el-menu-item>
      <el-menu-item index="categories">
        <el-icon><icon-menu /></el-icon>
        <template #title>商品管理</template>
      </el-menu-item>
      <el-menu-item index="/users">
        <el-icon>
          <User />
        </el-icon>
        <template #title>用户管理</template>
      </el-menu-item>
      <el-menu-item index="/goods">
        <el-icon>
          <setting />
        </el-icon>
        <template #title>商品管理</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped lang="scss">
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

.aside-top:hover {
  cursor: pointer;
  background: none;
}

.el-aside {
  img {
    -webkit-user-drag: none;
  }

  user-select: none;
  width: auto;
}
</style>
