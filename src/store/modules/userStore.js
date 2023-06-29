import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import { asnycRoutes, basicRoutes, anyRoute } from "@/router/routes.js";
import router from "@/router/index.js";
import {
  login as loginReq,
  logout as logoutReq,
  getUserInfo as userInfoReq,
  getMenuList,
} from "@/api/user";

//用于过滤当前用户需要展示的异步路由
function filterAsyncRoutes(asnycRoutes, routes) {
  return asnycRoutes.filter((item) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        //硅谷333账号:product\trademark\attr\sku
        item.children = filterAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });
}

const useUserStore = defineStore({
  id: "user-store",

  state: () => ({
    info: null,
    token: null,
    menu: null,
  }),

  actions: {
    async login(username, password) {
      const { code, message, data } = await loginReq(username, password);
      if (code === 200) {
        this.token = data;
        return "ok";
      } else {
        return Promise.reject(new Error(res.message));
      }
    },

    async userInfo() {
      const res = await userInfoReq();

      if (res && res.code === 200) {
        this.info = {
          name: res.data.name,
          avatar: res.data.avatar,
          roles: res.data.roles,
        };
        //计算当前用户需要展示的异步路由
        const userRoutes = filterAsyncRoutes(cloneDeep(asnycRoutes), res.data.routes);

        //菜单需要的数据整理完毕
        this.menu = [...basicRoutes, ...userRoutes, anyRoute];
        //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        [...userRoutes, anyRoute].forEach((route) => {
          router.addRoute(route);
        });
        return "ok";
      } else {
        return Promise.reject(new Error(res.message));
      }
    },

    async logout() {
      // API call
      const res = await logoutReq();
      // reset state
      this.token = null;
      this.info = null;
      this.menu = null;
    },

    // async initMenu() {
    //   await this.menu.forEach((route) => {
    //     router.addRoute(route);
    //   });
    // },
  },
  persist: {
    paths: ["token"],
  },
});

export default useUserStore;
