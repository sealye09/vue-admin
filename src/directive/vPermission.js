import useUserStore from "@/store/modules/userStore.js";

export default {
  install(app) {
    app.directive("permission", {
      mounted(el, binding) {
        const userStore = useUserStore();
        console.log("el", el);
        console.log("binding", binding);

        // arg 为指令的参数，给按钮添加的类名
        const arg = binding.arg || "is-disabled";
        // 获取指令的参数
        const btn = binding.value;
        // 检查用户权限
        const hasPermission = userStore.hasButton();

        if (!hasPermission) {
          el.classList.add(arg);
        }
      },
    });
  },
};
