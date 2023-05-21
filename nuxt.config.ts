export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "~/assets/main.scss",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["nuxt-icon", "@pinia/nuxt"],
  app: {
    head: {
      title: "PromptBuilder",
    },
  },
});
