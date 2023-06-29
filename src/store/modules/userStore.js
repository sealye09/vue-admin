import { reactive, ref } from "vue";
import { defineStore } from "pinia";

import { login as loginAPI, logout as logoutAPI, getUserInfo as userInfoAPI } from "@/api/user";

const useUserStore = defineStore(
  "user-store",

  () => {
    const userInfo = ref(null);
    const token = ref(null);

    async function login(username, password) {
      const { code, message, data: token } = await loginAPI(username, password);
      if (code === 200) {
        this.token = token;
        const res = await userInfoAPI();
        this.userInfo = res.data;
        return true;
      }
      return false;
    }

    function logout() {
      // API call

      // reset state
      this.token = null;
    }

    return {
      userInfo,
      token,
      login,
      logout,
    };
  },
  {
    persist: true,
    storage: localStorage,
  },
);

export default useUserStore;
