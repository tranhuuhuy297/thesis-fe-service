import { defineStore } from "pinia";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    listImages: [],
    isLoadedImage: false,
  }),
  getters: {},
  actions: {
    setListImages(images) {
      this.listImages = images;
      this.isLoadedImage = true;
    },
  },
});
