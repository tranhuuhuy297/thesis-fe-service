<template>
  <LayoutHeader></LayoutHeader>
  <div class="text-text-1 pa-8 mt-16">
    <slot />
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/User";

const userStore = useUserStore();

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

async function handleGetUser() {
  const { data } = await useFetch(`${baseURL}/user/${userStore.id}`, {
    method: "GET",
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_NOT_FOUND) {
    logout();
  }
  if (code === CODE_SUCCESS) {
    if (result?.is_ban) logout();
  }
}

function logout() {
  userStore.reset();
  document.cookie = "token=;";
  document.cookie = "expire=;";
  setTimeout(() => {
    navigateTo("/login");
  }, 200);
}

onMounted(() => {
  nextTick(() => {
    handleGetUser();
  });
});
</script>
