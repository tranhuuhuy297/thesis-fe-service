<template>
  <div class="width-90" style="min-width: 400px">
    <div class="text-h4 font-weight-bold">Sign Up</div>
    <div class="mt-1">Enter your details to get started</div>
    <v-text-field
      class="mt-7"
      label="Username"
      variant="outlined"
      hide-details
      prepend-inner-icon="mdi-account-outline"
    ></v-text-field>
    <v-text-field
      class="mt-6"
      label="Email"
      variant="outlined"
      hide-details
      prepend-inner-icon="mdi-email-outline"
      placeholder="xxx@gmail.com"
    ></v-text-field>
    <v-text-field
      class="mt-6"
      label="Password"
      variant="outlined"
      hide-details
      type="password"
      prepend-inner-icon="mdi-panda"
      placeholder="Abc@123"
    ></v-text-field>
    <v-text-field
      class="mt-6"
      label="Confirm password"
      variant="outlined"
      hide-details
      type="password"
      prepend-inner-icon="mdi-panda"
      placeholder="Abc@123"
    ></v-text-field>
    <v-btn
      block
      class="mt-8 font-weight-bold text-text-1 text-none"
      size="x-large"
      variant="flat"
      color="primary"
      text="Create Account"
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
definePageMeta({
  layout: "authen",
});
</script>
