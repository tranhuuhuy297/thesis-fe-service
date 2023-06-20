import { defineStore } from "pinia";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    listImages: [],
    isLoadedImage: false,
    textSearch: "",
  }),
  getters: {},
  actions: {
    setListImages(images) {
      this.listImages = images;
      this.isLoadedImage = true;
    },
    setTextSearch(text) {
      this.textSearch = text;
    },
  },
});
