import nprogress from "nprogress";

import router from "@/router";
import useUserStore from "@/store/modules/userStore";

import "nprogress/nprogress.css";

nprogress.configure({ showSpinner: false });

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  if (!!to.meta.title) {
    document.title = `后台管理 - ${to.meta.title}`;
  }
  nprogress.start();

  const token = userStore.token;
  const info = userStore.info;

  // 用户登录判断
  if (token) {
    // 登录成功,访问login,不能访问,指向首页
    if (to.path == "/login") {
      next({ path: "/" });
    } else {
      // 登录成功访问其余六个路由(登录排除)
      // 有用户信息
      if (info) {
        next();
      } else {
        try {
          // 获取用户信息
          await userStore.userInfo();
          // 万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
          next({ ...to });
        } catch (error) {
          // token过期
          await userStore.logout();
          next({ path: "/login", query: { redirect: to.path } });
        }
      }
    }
  } else {
    // 用户未登录判断
    if (to.path == "/login") {
      next();
    } else {
      next({ path: "/login", query: { redirect: to.path } });
    }
  }
});

// 全局后置守卫
router.afterEach((to, from) => {
  nprogress.done();
});
