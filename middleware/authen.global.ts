export default defineNuxtRouteMiddleware((to, from) => {
  console.log("init middleware", process.client);
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
