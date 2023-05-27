import { defineStore } from "pinia";

export const usePromptStore = defineStore("promptStore", {
  state: () => ({
    newestListPrompt: [],
    isLoadedPrompt: false,
  }),
  getters: {},
  actions: {
    setNewestListPrompt(prompts) {
      this.newestListPrompt = prompts;
      this.isLoadedPrompt = true;
    },
  },
});
