<script setup>
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
const props = defineProps(["menuList"]);
</script>

<script>
export default {
  name: "Menu",
};
</script>

<template>
  <template
    v-for="item in props.menuList"
    :key="item.path"
  >
    <!--没有子路由-->
    <template v-if="!item.children">
      <el-menu-item
        v-if="item.meta && !item.meta.hidden"
        :index="item.path"
      >
        <el-icon>
          <Icon :icon="item.meta.icon"></Icon>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但是只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        v-if="'hidden' in item.children[0].meta && !item.children[0].meta.hidden"
        :index="item.children[0].path"
      >
        <el-icon>
          <Icon :icon="item.children[0].meta.icon"></Icon>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由且个数大于一个1 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <template #title>
        <el-icon>
          <Icon :icon="item.meta.icon"></Icon>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<style scoped lang="scss">
.is-active {
  background: #C2C3C5;
}
</style>
