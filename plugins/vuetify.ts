import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    // add theme
    theme: {
      defaultTheme: LIGHT_THEME,
      themes: {
        light,
      },
    },
  });

  app.vueApp.use(vuetify);
});
