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

const verifyCode = ref("");

async function handleVerify() {
  console.log(verifyCode.value);
}
</script>
