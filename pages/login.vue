<template>
  <div class="width-100">
    <div class="text-h4 font-weight-bold">Log In</div>
    <div class="mt-1">Let me help you create and share AI Art Prompts</div>
    <v-form validate-on="input" v-model="valid" @submit.prevent="handleLogin">
      <v-text-field
        v-model.trim="gmail"
        class="mt-6"
        variant="outlined"
        :rules="[rules.required, rules.email]"
        prepend-inner-icon="mdi-email-outline"
        placeholder="Email"
      ></v-text-field>
      <v-text-field
        class="mt-1"
        v-model.trim="password"
        variant="outlined"
        :type="showPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-panda"
        placeholder="Password"
        :rules="[rules.required]"
      >
        <template #append-inner>
          <v-btn
            :icon="!showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            variant="text"
            size="small"
            @click="showPassword = !showPassword"
          ></v-btn>
        </template>
      </v-text-field>
      <v-btn
        block
        class="mt-2 font-weight-bold text-text-1 text-none"
        size="x-large"
        variant="flat"
        color="primary"
        text="Log In"
        type="submit"
        :loading="isLoadingLogin"
      />
    </v-form>
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

const showPassword = ref(false);

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/user`;

const userStore = useUserStore();

const valid = ref(false);

const isLoadingLogin = ref(false);

async function handleLogin() {
  if (!valid.value) return;
  isLoadingLogin.value = true;
  const { data } = await useFetch(`${baseURL}/login`, {
    method: "POST",
    body: {
      gmail: gmail.value,
      password: sha256(password.value),
    },
  });
  isLoadingLogin.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    if (result["is_ban"]) {
      useNuxtApp().$toast.error("User is banned. Please contact to admin!");
      return;
    }
    userStore.setUser(result);
    document.cookie = `token=${result["access_token"]}`;
    document.cookie = `expire=${result["expire_time"]}`;
    navigateTo({ path: "/upload" });
  }
}
</script>
