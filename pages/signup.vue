<template>
  <div class="width-90" style="min-width: 400px">
    <div class="text-h4 font-weight-bold">Sign Up</div>
    <div class="mt-1">Enter your details to get started</div>
    <v-form v-model="valid" validate-on="input" @submit.prevent="handleSignUp">
      <v-text-field
        v-model.trim="username"
        class="mt-6"
        label="Username"
        variant="outlined"
        :rules="[rules.required, rules.counter]"
        prepend-inner-icon="mdi-account-outline"
      ></v-text-field>
      <v-text-field
        class="mt-2"
        v-model.trim="gmail"
        label="Email"
        variant="outlined"
        prepend-inner-icon="mdi-email-outline"
        placeholder="xxx@gmail.com"
        :rules="[rules.required, rules.email]"
      ></v-text-field>
      <v-text-field
        v-model.trim="password"
        label="Password"
        variant="outlined"
        :type="showPassword ? 'text' : 'password'"
        class="mt-2"
        prepend-inner-icon="mdi-panda"
        placeholder="Abc@123"
        :rules="[rules.required]"
      >
        <template #append-inner>
          <v-btn
            :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            variant="text"
            size="small"
            @click="showPassword = !showPassword"
          ></v-btn>
        </template>
      </v-text-field>
      <v-text-field
        v-model.trim="confirmPassword"
        class="mt-2"
        label="Confirm password"
        variant="outlined"
        :type="showConfirmPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-panda"
        placeholder="Abc@123"
        :rules="[rules.required, confirmPasswordRule]"
      >
        <template #append-inner>
          <v-btn
            :icon="
              showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            variant="text"
            size="small"
            @click="showConfirmPassword = !showConfirmPassword"
          ></v-btn>
        </template>
      </v-text-field>
      <v-btn
        type="submit"
        block
        class="mt-2 font-weight-bold text-text-1 text-none"
        size="x-large"
        variant="flat"
        color="primary"
        text="Create Account"
        :loading="isLoadingSignUp"
      />
    </v-form>
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
const showPassword = ref(false);

const confirmPassword = ref("");
const showConfirmPassword = ref(false);

const confirmPasswordRule = (value) =>
  value === password.value || "Confirm password does not match";

const valid = ref(false);

const isLoadingSignUp = ref(false);
async function handleSignUp() {
  if (!valid.value) return;
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
