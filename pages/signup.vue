<template>
  <div class="width-90" style="min-width: 400px">
    <div class="text-h4 font-weight-bold">Sign Up</div>
    <div class="mt-1">Enter your details to get started</div>
    <v-text-field
      v-model.trim="username"
      class="mt-6"
      label="Username"
      variant="outlined"
      prepend-inner-icon="mdi-account-outline"
    ></v-text-field>
    <v-text-field
      v-model.trim="gmail"
      label="Email"
      variant="outlined"
      prepend-inner-icon="mdi-email-outline"
      placeholder="xxx@gmail.com"
    ></v-text-field>
    <v-text-field
      v-model.trim="password"
      label="Password"
      variant="outlined"
      type="password"
      prepend-inner-icon="mdi-panda"
      placeholder="Abc@123"
    ></v-text-field>
    <v-text-field
      v-model.trim="confirmPassword"
      label="Confirm password"
      variant="outlined"
      type="password"
      prepend-inner-icon="mdi-panda"
      placeholder="Abc@123"
    ></v-text-field>
    <v-btn
      block
      class="font-weight-bold text-text-1 text-none"
      size="x-large"
      variant="flat"
      color="primary"
      text="Create Account"
      :loading="isLoadingSignUp"
      @click="handleSignUp"
    />
    <div class="mt-4">
      Already have an account?
      <span
        class="text-primary-3 font-weight-bold pointer"
        @click="navigateTo({ path: '/login' })"
      >
        Log In
      </span>
    </div>
  </div>
</template>

<script setup>
import { sha256 } from "ohash";

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/user`;

const username = ref("");
const gmail = ref("");
const password = ref("");
const confirmPassword = ref("");

const isLoadingSignUp = ref(false);
async function handleSignUp() {
  if (password.value !== confirmPassword.value) {
    useNuxtApp().$toast.error("Confirm password is invalid!");
    return;
  }
  isLoadingSignUp.value = true;
  const { data } = await useFetch(`${baseURL}/signup`, {
    method: "POST",
    body: {
      username: username.value,
      gmail: gmail.value,
      password: sha256(password.value),
    },
  });
  isLoadingSignUp.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Sign Up successfully!");
    setTimeout(() => {
      navigateTo({ path: "/login" });
    }, 1000);
  }
}

definePageMeta({
  layout: "authen",
});
</script>
