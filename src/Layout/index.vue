<script setup>
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Icon } from "@iconify/vue";
import useAppStore from "@/store/modules/appStore.js";
import SideBar from "./SideBar.vue";
import useUserStore from "../store/modules/userStore";
import BreadCrumb from "./BreadCrumb.vue";

const router = useRouter();
const store = useAppStore();
const userStore = useUserStore();

function toggleSideBar() {
  store.toggleSideBar();
}

function toPersonCenter() {
  ElMessage({
    message: "开发中...",
    type: "warning",
  });
}

async function handleLogout() {
  await userStore.logout();
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
    <el-container class="content h-screen">
      <el-header class="bg-gray-100">
        <div
          class="hide-sidebar"
          @click="toggleSideBar"
        >
          <el-icon size="24">
            <Icon
              v-if="store.isSiderBarOpen"
              icon="heroicons:chevron-double-right"
            >
            </Icon>
            <Icon
              v-else
              icon="heroicons:chevron-double-left"
            />
          </el-icon>
        </div>

        <div class="right h-full flex items-center gap-8">
          <el-icon size="24">
            <Icon icon="heroicons:arrows-pointing-out" />
          </el-icon>
          <el-icon size="24">
            <Icon icon="heroicons:language" />
          </el-icon>
          <el-icon size="24">
            <Icon icon="heroicons:cog-6-tooth" />
          </el-icon>
          <el-dropdown
            class="avatar"
            trigger="click"
          >
            <div>
              <span class="el-dropdown-link">
                <el-avatar
                  v-if="userStore && userStore.info && userStore.info.avatar"
                  :size="32"
                  :src="userStore.info.avatar"
                  alt="avatar"
                />
                <el-avatar
                  v-else
                  :size="32"
                  src="https://avatars.githubusercontent.com/u/77105397?v=4"
                  alt="avatar"
                />
              </span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="toPersonCenter">
                  <el-icon>
                    <Icon icon="heroicons:user"></Icon>
                  </el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="handleLogout">
                  <el-icon>
                    <Icon icon="heroicons:arrow-left-on-rectangle"></Icon>
                  </el-icon>
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-scrollbar class="scrollbar">
        <el-main>
          <BreadCrumb> </BreadCrumb>
          <el-divider />
          <div class='p-5 border rounded-md shadow-sm'>
            <router-view></router-view>
          </div>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.main-container {
  min-height: 100vh;
  position: relative;
}

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

.scrollbar {
  width: 100%;
  height: 100%;
}
</style>
