<template>
  <div class="width-100">
    <div class="text-h4 font-weight-bold">Verification</div>
    <div class="mt-1">Check your email and verify your account?</div>
    <div class="mt-6">
      <v-text-field
        v-model.trim="verifyCode"
        variant="outlined"
        prepend-inner-icon="mdi-key-outline"
        placeholder="Verify code"
        @keydown.prevent.enter="handleVerify"
      ></v-text-field>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "authen",
});

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/user`;

const route = useRoute();
const verifyCode = ref("");

async function handleVerify() {
  const { data } = await useFetch(`${baseURL}/verify`, {
    method: "POST",
    query: {
      gmail: route?.query?.email,
      verify_code: verifyCode.value,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Verify successfully!");
    setTimeout(() => {
      navigateTo({ path: "/login" });
    }, 1000);
  }
}
</script>
