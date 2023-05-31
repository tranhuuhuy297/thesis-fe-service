import { defineStore } from "pinia";

export const useStyleStore = defineStore("styleStore", {
  state: () => ({
    listStyle: [],
    isLoadedStyle: false,
    listBuilderValue: {},
  }),
  getters: {
    getNameListStyle() {
      return this.listStyle.map((item) => item.name).sort();
    },
  },
  actions: {
    setListStyle(listStyle) {
      this.listStyle = listStyle;
      this.isLoadedStyle = true;
    },
    setListBuilderValue(builderType, listBuilderValue) {
      if (!builderType) return;
      this.listBuilderValue[builderType] = listBuilderValue;
    },
  },
});
