import Layout from "@/Layout/index.vue";

//任意路由
export const anyRoute = {
  //任意路由
  path: "/:pathMatch(.*)*",
  redirect: "/404",
  name: "Any",
  meta: {
    title: "任意路由",
    hidden: true,
    icon: "DataLine",
  },
};

export const basicRoutes = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    meta: {
      title: "",
      hidden: false,
      icon: "",
    },
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        meta: {
          title: "首页",
          hidden: false,
          icon: "heroicons:clipboard",
        },
        component: () => import("@/pages/dashboard/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
      hidden: true,
      icon: "",
    },
    component: () => import("@/pages/login/index.vue"),
  },

  {
    path: "/404",
    name: "404",
    meta: {
      title: "404",
      hidden: true,
      icon: "",
    },
    component: () => import("@/pages/404/index.vue"),
  },
  {
    path: "/screen",
    name: "Screen",
    meta: {
      hidden: false,
      title: "数据大屏",
      icon: "heroicons:computer-desktop",
    },
    component: () => import("@/pages/screen/index.vue"),
  },
];

// 异步路由
export const asnycRoutes = [
  {
    path: "/acl",
    name: "Acl",
    meta: {
      title: "权限管理",
      icon: "heroicons:key",
    },
    component: () => import("@/layout/index.vue"),
    redirect: "/acl/user",
    children: [
      {
        path: "/acl/user",
        name: "User",
        component: () => import("@/pages/acl/user/index.vue"),
        meta: {
          title: "用户管理",
          icon: "heroicons:user",
        },
      },
      {
        path: "/acl/role",
        name: "Role",
        component: () => import("@/pages/acl/role/index.vue"),
        meta: {
          title: "角色管理",
          icon: "heroicons:finger-print",
        },
      },
      {
        path: "/acl/permission",
        name: "Permission",
        component: () => import("@/pages/acl/permission/index.vue"),
        meta: {
          title: "菜单管理",
          icon: "heroicons:squares-2x2",
        },
      },
    ],
  },
  {
    path: "/product",
    name: "Product",
    meta: {
      title: "商品管理",
      icon: "heroicons:shopping-bag",
    },
    component: () => import("@/layout/index.vue"),
    redirect: "/product/trademark",
    children: [
      {
        path: "/product/trademark",
        component: () => import("@/pages/product/trademark/index.vue"),
        name: "Trademark",
        meta: {
          title: "品牌管理",
          icon: "heroicons:paper-airplane",
        },
      },
      {
        path: "/product/attr",
        component: () => import("@/pages/product/attr/index.vue"),
        name: "Attr",
        meta: {
          title: "属性管理",
          icon: "heroicons:tag",
        },
      },
      {
        path: "/product/spu",
        component: () => import("@/pages/product/spu/index.vue"),
        name: "Spu",
        meta: {
          title: "SPU管理",
          icon: "heroicons:magnifying-glass-solid",
        },
      },
      {
        path: "/product/sku",
        component: () => import("@/pages/product/sku/index.vue"),
        name: "Sku",
        meta: {
          title: "SKU管理",
          icon: "heroicons:paper-clip-20-solid",
        },
      },
    ],
  },
];
