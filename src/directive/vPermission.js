import useUserStore from "@/store/modules/userStore.js";
import { computed } from "vue";

export default {
  install(app) {
    app.directive("permission", {
      mounted(el, binding) {
        // arg 为指令的参数，给按钮添加的类名
        const arg = binding.arg || "is-disabled";
        console.log("🚀 ~ file: vPermission.js:11 ~ mounted ~ arg:", arg);
        // 获取指令的参数
        const btn = binding.value;
        console.log("🚀 ~ file: vPermission.js:14 ~ mounted ~ btn:", btn);
        // 检查用户权限
        const hasPermission = computed(() => {
          return useUserStore().hasButton(btn);
        });

        if (!hasPermission.value) {
          el.classList.add(arg);
          el.disabled = true;
          el.ariaDisabled = true;
        } else {
          el.classList.remove(arg);
          el.disabled = false;
          el.ariaDisabled = false;
        }
      },
    });
  },
};
