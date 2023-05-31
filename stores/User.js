import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    username: "",
    gmail: "",
    token: "",
  }),
  getters: {},
  actions: {
    setUser(user) {
      this.username = user.username;
      this.gmail = user.gmail;
      this.token = user.token;
    },
  },
});
