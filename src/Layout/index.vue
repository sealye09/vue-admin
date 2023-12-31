<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Icon } from "@iconify/vue";

import useAppStore from "@/store/modules/appStore";
import useUserStore from "@/store/modules/userStore";

import SideBar from "./SideBar.vue";
import BreadCrumb from "./BreadCrumb.vue";

const router = useRouter();
const store = useAppStore();
const userStore = useUserStore();

const fullscreen = ref(false);

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

window.addEventListener("fullscreenchange", () => {
  fullscreen.value = !fullscreen.value;
});

function handleFullScreen() {
  let element = document.documentElement;
  if (fullscreen.value) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      // IE11
      element.msRequestFullscreen();
    }
  }
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
          :title="store.isSiderBarOpen ? '显示菜单' : '隐藏菜单'"
        >
          <el-icon
            size="24"
            class="hover:cursor-pointer hover:text-blue-500/80 transition-colors"
          >
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
          <el-icon
            size="24"
            class="hover:cursor-pointer hover:text-blue-500/80 transition-colors"
            @click="handleFullScreen"
            :title="fullscreen ? '退出全屏' : '全屏'"
          >
            <Icon
              v-if="fullscreen"
              icon="heroicons:arrows-pointing-in"
            />
            <Icon
              v-else
              icon="heroicons:arrows-pointing-out"
            />
          </el-icon>
          <el-icon
            size="24"
            class="hover:cursor-pointer hover:text-blue-500/80 transition-colors"
            title="切换语言"
          >
            <Icon icon="heroicons:language" />
          </el-icon>
          <el-icon
            size="24"
            class="hover:cursor-pointer hover:text-blue-500/80 transition-colors"
            @click="store.toggleColorMode"
            title="切换主题"
          >
            <Icon
              v-if="store.colorMode === 'dark'"
              icon="heroicons:moon"
            />
            <Icon
              v-else
              icon="heroicons:sun"
            />
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
                <el-dropdown-item
                  title="个人中心"
                  @click="toPersonCenter"
                >
                  <el-icon>
                    <Icon icon="heroicons:user"></Icon>
                  </el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item
                  title="退出"
                  @click="handleLogout"
                >
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
          <div class="p-5 border rounded-md shadow-sm">
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
