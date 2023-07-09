import { defineStore } from "pinia";

export const useStyleStore = defineStore("styleStore", {
  state: () => ({
    listBuilderValue: {},
  }),
  getters: {},
  actions: {
    setListBuilderValue(builderType, listBuilderValue) {
      if (!builderType) return;
      this.listBuilderValue[builderType] = listBuilderValue;
    },
  },
});
