<script setup>
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import useAppStore from "@/store/modules/appStore.js";
import SideBar from "./SideBar.vue";

const router = useRouter();
const store = useAppStore();

function toggleSide() {
  store.toggleSideBar();
}

function toPersonCenter() {
  ElMessage({
    message: "开发中...",
    type: "warning",
  });
}

function handleLogout() {
  ElMessage({
    message: "退出成功",
    type: "success",
  });
  router.replace("/login");
}
</script>

<template>
  <el-container class="main-container">
    <side-bar :isCollapse="store.isSiderBarOpen" />
    <el-container>
      <el-header>
        <div
          class="hide-sidebar"
          @click="toggleSide"
        >
          <el-icon
            size="20"
            v-if="store.isSiderBarOpen"
          >
            <Expand />
          </el-icon>
          <el-icon
            v-else
            size="20"
          >
            <Fold />
          </el-icon>
        </div>

        <div class="right">
          <el-dropdown class="avatar">
            <div>
              <span class="el-dropdown-link">
                <el-avatar
                  :size="32"
                  src="https://avatars.githubusercontent.com/u/77105397?v=4"
                  alt="avatar"
                />
              </span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="toPersonCenter">个人中心</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">
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
