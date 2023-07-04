import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    username: "",
    gmail: "",
    id: "",
  }),
  getters: {},
  actions: {
    setUser(user) {
      this.username = user.username;
      this.gmail = user.gmail;
      this.id = user.id;
    },
    reset() {
      this.username = "";
      this.gmail = "";
      this.id = "";
    },
  },
});
