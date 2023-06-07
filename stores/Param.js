import { defineStore } from "pinia";

export const useParamStore = defineStore("paramStore", {
  state: () => ({
    listParam: [],
    isLoadedParam: false,
    listShortName: {},
    listBuilderValue: {},
    listNameParam: [],
  }),
  getters: {},
  actions: {
    setListParam(listParam) {
      this.listParam = listParam;
      this.isLoadedParam = true;
      this.listNameParam = this.listParam.map((item) => item.name).sort();
      for (const param of this.listParam) {
        const paramName = param?.name;
        if (paramName) this.listShortName[paramName] = param.short_name;
      }
    },
    setListBuilderValue(builderType, listBuilderValue) {
      if (!builderType) return;
      this.listBuilderValue[builderType] = listBuilderValue;
    },
  },
});
