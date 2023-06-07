import { defineStore } from "pinia";

export const useStyleStore = defineStore("styleStore", {
  state: () => ({
    listStyle: [],
    isLoadedStyle: false,
    listBuilderValue: {},
    listNameStyle: [],
  }),
  getters: {},
  actions: {
    setListStyle(listStyle) {
      this.listStyle = listStyle;
      this.isLoadedStyle = true;
      this.listNameStyle = this.listStyle.map((item) => item.name).sort();
    },
    setListBuilderValue(builderType, listBuilderValue) {
      if (!builderType) return;
      this.listBuilderValue[builderType] = listBuilderValue;
    },
  },
});
