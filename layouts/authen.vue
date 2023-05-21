<template>
  <div class="d-flex pa-4" style="height: 100vh">
    <div
      class="d-flex align-center justify-center flex-grow-1"
      style="max-width: 50%"
    >
      <slot />
    </div>
    <div
      class="rounded-xl bg-primary flex-grow-1 pointer pa-8"
      style="max-width: 50%"
      @click="navigateTo({ path: '/' })"
    >
      <div
        class="text-h2 text-text-1 font-weight-bold d-flex justify-center mt-16"
      >
        PromptBuilder
      </div>
      <img
        src="~/assets/image/logo.png"
        alt="prompt builder"
        style="height: 80%; width: 80%; object-fit: cover"
        class="d-flex justify-center mt-4 mx-auto"
      />
    </div>
  </div>
</template>
