import { ref } from "vue";
import { defineStore } from "pinia";

const useAppStore = defineStore({
  id: "app-store",
  state: () => ({
    isSiderBarOpen: false,
  }),

  actions: {
    toggleSideBar() {
      this.isSiderBarOpen = !this.isSiderBarOpen;
    },
  },

  persist: true,
});

export default useAppStore;
