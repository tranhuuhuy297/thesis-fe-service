import { useUserStore } from "~/stores/User";

export default defineNuxtRouteMiddleware((to, from) => {
  // console.log("init middleware", process.client);
  if (process.client) {
    console.log("middleware");
    const isLogin = getCookie("token");
    const expiredTime = getCookie("expire");

    const listAuthenPath = ["/upload", "/generator"];

    if (!isLogin || (isLogin && checkIsExpired(expiredTime))) {
      if (listAuthenPath.includes(to.fullPath)) {
        return navigateTo("/login");
      }
    } else {
      const userStore = useUserStore();
      const decoded_info = decodeJwt(isLogin);
      userStore.setUser(decoded_info);
      if (["/login", "/signup", "/verify"].includes(to.fullPath)) {
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
