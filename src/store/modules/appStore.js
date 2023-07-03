import { ref } from "vue";
import { defineStore } from "pinia";

const useAppStore = defineStore({
  id: "app-store",
  state: () => ({
    isSiderBarOpen: false,
    colorMode: "light",
  }),

  actions: {
    toggleSideBar() {
      this.isSiderBarOpen = !this.isSiderBarOpen;
    },
    toggleColorMode() {
      this.colorMode = this.colorMode === "light" ? "dark" : "light";
    },
  },

  persist: true,
});

export default useAppStore;
