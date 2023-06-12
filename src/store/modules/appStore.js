import { ref } from "vue";
import { defineStore } from "pinia";

const useAppStore = defineStore(
  "app-store",
  () => {
    const isSiderBarOpen = ref(false);

    function toggleSideBar() {
      this.isSiderBarOpen = !this.isSiderBarOpen;
    }

    return {
      isSiderBarOpen,
      toggleSideBar,
    };
  },
  {
    persist: true,
    storage: localStorage,
  },
);

export default useAppStore;
