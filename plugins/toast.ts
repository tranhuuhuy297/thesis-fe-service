import Vue3Toastify, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 2000,
    position: toast.POSITION.BOTTOM_RIGHT,
    transition: toast.TRANSITIONS.BOUNCE,
    theme: "colored",
    hideProgressBar: true,
    closeButton: false,
  });

  return {
    provide: { toast },
  };
});
