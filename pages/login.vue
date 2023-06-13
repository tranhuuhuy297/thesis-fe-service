<template>
  <div class="width-100">
    <div class="text-h4 font-weight-bold">Log In</div>
    <div class="mt-1">Let me help you create and share AI Art Prompts</div>
    <v-text-field
      v-model.trim="gmail"
      class="mt-7"
      variant="outlined"
      hide-details
      label="Email"
      prepend-inner-icon="mdi-email-outline"
      placeholder="xxx@gmail.com"
    ></v-text-field>
    <v-text-field
      v-model.trim="password"
      class="mt-6"
      variant="outlined"
      hide-details
      type="password"
      label="Password"
      prepend-inner-icon="mdi-panda"
      placeholder="Abc@123"
    ></v-text-field>
    <v-btn
      block
      class="mt-8 font-weight-bold text-text-1 text-none"
      size="x-large"
      variant="flat"
      color="primary"
      text="Log In"
      :loading="isLoadingLogin"
      @click="handleLogin"
    />
    <!-- <div
      class="mt-10 text-primary-3 font-weight-bold pointer"
      @click="navigateTo({ path: '/forgot-password' })"
    >
      Forgot Password?
    </div> -->
    <div class="mt-4">
      Don't have an account?
      <span
        class="text-primary-3 font-weight-bold pointer"
        @click="navigateTo({ path: '/signup' })"
      >
        Sign Up
      </span>
    </div>
  </div>
</template>

<script setup>
import { sha256 } from "ohash";
import { useUserStore } from "~/stores/User";

definePageMeta({
  layout: "authen",
});
const gmail = ref("");
const password = ref("");
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/user`;

const userStore = useUserStore();

const isLoadingLogin = ref(false);

async function handleLogin() {
  isLoadingLogin.value = true;
  const { data } = await useFetch(`${baseURL}/login`, {
    method: "POST",
    body: {
      gmail: gmail,
      password: sha256(password.value),
    },
  });
  isLoadingLogin.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    userStore.setUser(result);
    document.cookie = `token=${result["access_token"]}`;
    document.cookie = `exp=${result["exp"]}`;
    navigateTo({ path: "/upload" });
  }
}
</script>
