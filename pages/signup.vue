<template>
  <div class="width-90" style="min-width: 400px">
    <div class="text-h4 font-weight-bold">Sign Up</div>
    <div class="mt-1">Enter your details to get started</div>
    <div class="mt-7">Email</div>
    <v-text-field
      class="mt-1"
      variant="outlined"
      hide-details
      prepend-inner-icon="mdi-email-outline"
      placeholder="xxx@gmail.com"
    ></v-text-field>
    <div class="mt-4">Password</div>
    <v-text-field
      class="mt-1"
      variant="outlined"
      hide-details
      type="password"
      prepend-inner-icon="mdi-panda"
      placeholder="Abc@123"
    ></v-text-field>
    <div class="mt-4">Confirm password</div>
    <v-text-field
      class="mt-1"
      variant="outlined"
      hide-details
      type="password"
      prepend-inner-icon="mdi-panda"
      placeholder="Abc@123"
    ></v-text-field>
    <v-btn
      block
      class="mt-8 font-weight-bold text-text-1"
      size="x-large"
      variant="flat"
      color="primary"
      text="Create Account"
    />
    <div class="mt-5">
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
definePageMeta({
  layout: "authen",
});
</script>
