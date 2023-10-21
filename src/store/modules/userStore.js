import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import { asyncRoutes, basicRoutes, anyRoute } from "@/router/routes.js";
import router from "@/router/index.js";
import {
  login as loginReq,
  logout as logoutReq,
  getUserInfo as userInfoReq,
  getMenuList,
} from "@/api/user/user.js";

//用于过滤当前用户需要展示的异步路由
function filterAsyncRoutes(allRoutes, names) {
  const res = [];
  allRoutes.forEach((route) => {
    const tmp = { ...route };
    if (names.includes(tmp.name)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, names);
      }
      res.push(tmp);
    }
  });
  return res;
}

const useUserStore = defineStore({
  id: "user-store",

  state: () => ({
    info: null,
    token: null,
    menu: null,
    buttons: null,
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
        this.buttons = res.data.buttons;
        console.log("服务端路由：", res.data.routes);
        console.log("本地全量路由：", asyncRoutes);
        //计算当前用户需要展示的异步路由
        const userRoutes = filterAsyncRoutes(cloneDeep(asyncRoutes), res.data.routes);
        console.log("过滤后的路由：", userRoutes);

        //菜单需要的数据整理完毕
        this.menu = [...basicRoutes, ...userRoutes, anyRoute];
        //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        userRoutes.forEach((route) => {
          router.addRoute(route);
        });
        router.addRoute(anyRoute);
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

    hasButton(btn) {
      return this.buttons.includes(btn);
    },
  },
  persist: {
    paths: ["token"],
  },
});

export default useUserStore;
