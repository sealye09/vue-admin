import { createRouter, createWebHistory } from "vue-router";
import { basicRoutes } from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes: basicRoutes,

  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

export default router;
