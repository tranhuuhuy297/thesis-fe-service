<template>
  <div class="height-20 bg-bg-1 d-flex justify-space-between pa-2 px-8">
    <div class="d-flex align-center flex-grow-1 pointer">
      <div
        class="d-flex align-center rounded-lg bg-primary mr-4"
        @click="navigateTo({ path: '/' })"
      >
        <img
          src="~/assets/image/logo.png"
          width="56"
          height="56"
          alt="prompt builder"
        />
        <div class="mr-4 text-h5 text-text-1 font-weight-bold">
          PromptBuilder
        </div>
      </div>
    </div>
    <div class="d-flex align-center ml-16">
      <div
        class="mr-8 pointer pointer--link"
        @click="navigateTo({ path: '/builder' })"
      >
        Builder
      </div>
      <div
        class="mr-8 pointer pointer--link"
        @click="navigateTo({ path: '/stats' })"
      >
        Stats
      </div>
      <div
        class="mr-8 pointer pointer--link"
        @click="navigateTo({ path: '/resources' })"
      >
        Resources
      </div>
      <div
        class="mr-8 pointer pointer--link"
        @click="navigateTo({ path: '/generator' })"
      >
        Generator
      </div>
      <v-btn
        class="mr-4 font-weight-bold text-text-1"
        color="primary"
        text="Log in"
        size="large"
        @click="navigateTo({ path: '/login' })"
      />
    </div>
  </div>
</template>
