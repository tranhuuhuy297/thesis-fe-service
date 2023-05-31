import { defineStore } from "pinia";

export const useParamStore = defineStore("paramStore", {
  state: () => ({
    listParam: [],
    isLoadedParam: false,
  }),
  getters: {
    getNameListParam() {
      return this.listParam.map((item) => item.name).sort();
    },
  },
  actions: {
    setListParam(listParam) {
      this.listParam = listParam;
      this.isLoadedParam = true;
    },
  },
});
