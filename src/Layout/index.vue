<script setup>
import { ref } from "vue";
import { Menu as IconMenu, Setting } from "@element-plus/icons-vue";
const isCollapse = ref(false);
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};

const handleClck = () => {
  console.log("message");
  ElMessage({
    duration: 2000,
    message: "sss",
    type: "error",
  });
};
</script>

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
            >Vue Admin</span
          >
        </el-menu-item>

        <el-menu-item index="1">
          <el-icon>
            <DataBoard />
          </el-icon>
          <template #title>看板</template>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <template #title>商品管理</template>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon>
            <User />
          </el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon>
            <setting />
          </el-icon>
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
          >
            <Expand />
          </el-icon>
          <el-icon
            v-else
            size="18"
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
                  src="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
                  alt="avatar"
                />
              </span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main> <el-button @click="handleClck">sss</el-button></el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">
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