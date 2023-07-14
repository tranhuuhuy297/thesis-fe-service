import { defineStore } from "pinia";

export const useStyleStore = defineStore("styleStore", {
  state: () => ({
    listBuilderType: [],
    listBuilderValue: {},
  }),
  getters: {},
  actions: {
    setListBuilderType(items) {
      this.listBuilderType = items;
    },
    setListBuilderValue(builderType, listBuilderValue) {
      if (!builderType) return;
      this.listBuilderValue[builderType] = listBuilderValue;
    },
  },
});
