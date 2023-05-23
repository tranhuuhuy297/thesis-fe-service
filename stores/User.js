import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    gmail: "",
  }),
  getters: {},
  actions: {
    setUser(gmail) {
      this.gmail = gmail;
    },
  },
});
