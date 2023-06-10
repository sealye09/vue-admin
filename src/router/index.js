import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/components/Layout.vue";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: Layout,
    redirect: "/users",
    children: [
      {
        path: "users",
        name: "users",
        component: () => import("@/pages/users/index.vue"),
      },
      {
        path: "categories",
        name: "categories",
        component: () => import("@/pages/categories/index.vue"),
      },
      {
        path: "goods",
        name: "goods",
        component: () => import("@/pages/goods/index.vue"),
      },
      {
        path: "orders",
        name: "orders",
        component: () => import("@/pages/orders/index.vue"),
      },
      {
        path: "params",
        name: "params",
        component: () => import("@/pages/params/index.vue"),
      },
      {
        path: "reports",
        name: "reports",
        component: () => import("@/pages/reports/index.vue"),
      },
      {
        path: "rights",
        name: "rights",
        component: () => import("@/pages/rights/index.vue"),
      },
      {
        path: "roles",
        name: "roles",
        component: () => import("@/pages/roles/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
