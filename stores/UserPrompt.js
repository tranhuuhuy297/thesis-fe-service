import { defineStore } from "pinia";

export const useUserPromptStore = defineStore("userPromptStore", {
  state: () => ({
    listUserPrompt: [],
    isLoadedUserPrompt: false,
  }),
  getters: {},
  actions: {
    setListUserPrompt(listUserPrompt) {
      this.listUserPrompt = listUserPrompt;
      this.isLoadedUserPrompt = true;
    },
  },
});
