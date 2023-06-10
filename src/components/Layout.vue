<template>
  <el-container class="main-container">
    <el-aside class="sidebar-container">
      <el-menu
        default-active="2"
        :collapse="isCollapse"
        unique-opened
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <template #title>Navigator Two</template>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><document /></el-icon>
          <template #title>Navigator Three</template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <template #title>商品管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div
          class="hide-sidebar"
          @click="() => (isCollapse = !isCollapse)"
        >
          <el-icon
            size="18"
            v-if="isCollapse"
            ><Expand
          /></el-icon>
          <el-icon
            v-else
            size="18"
            ><Fold
          /></el-icon>
        </div>

        <div class="right">
          <div class="avatar">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-avatar
                  :size="50"
                  src="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
                  alt="avatar"
                />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue";

const isCollapse = ref(false);
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>

<style>
.el-header {
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px var(--el-menu-border-color);
}

.hide-sidebar {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
.avatar {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  border-radius: 50%;
}
</style>
