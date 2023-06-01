import { useUserStore } from "~/stores/User";

export default defineNuxtRouteMiddleware((to, from) => {
  // console.log("init middleware", process.client);
  if (process.client) {
    const isLogin = getCookie("token");
    const expiredTime = getCookie("exp");

    if (!isLogin) {
      if (to.fullPath === "/upload") {
        return navigateTo("/login");
      }
    } else if (isLogin && checkIsExpired(expiredTime)) {
      if (to.fullPath === "/upload") {
        return navigateTo("/login");
      }
    } else if (isLogin) {
      const userStore = useUserStore();
      const decoded_info = decodeJwt(isLogin);
      userStore.setUser(decoded_info);
      if (to.fullPath === "/login") {
        return navigateTo("/upload");
      }
    }
  }
});

function checkIsExpired(expiredTime: any) {
  if (!expiredTime) return false;
  if (expiredTime < Date.now() / 1000) return true;
  return false;
}

function decodeJwt(token: any) {
  var base64Payload = token.split(".")[1];
  var payload = decodeURIComponent(
    atob(base64Payload)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(payload);
}
