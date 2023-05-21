<template>
  <div class="width-100">
    <div class="text-h4 font-weight-bold">Log In</div>
    <div class="mt-1">Let me help you create and share AI Art Prompts</div>
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
    <v-btn
      block
      class="mt-8 font-weight-bold text-text-1"
      size="x-large"
      variant="flat"
      color="primary"
      text="Sign In"
    />
    <!-- <div
      class="mt-10 text-primary-3 font-weight-bold pointer"
      @click="navigateTo({ path: '/forgot-password' })"
    >
      Forgot Password?
    </div> -->
    <div class="mt-5">
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

<script>
definePageMeta({
  layout: "authen",
});
</script>
