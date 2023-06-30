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
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "favicon.png",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "http://localhost:5001/api",
    },
  },
});
