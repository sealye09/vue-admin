import { defineStore } from "pinia";

const useCountStore = defineStore({
  id: "count",
  state: () => ({ num: 1 }),
  actions: {
    increment() {
      this.num += 1;
    },
  },

  persist: true,
  debug: true,
});

export default useCountStore;
