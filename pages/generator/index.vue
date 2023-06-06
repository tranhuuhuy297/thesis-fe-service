<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Generator</span>
  </div>
  <div class="mt-2 text-h6">Random generate prompt with GPT2 tuning</div>
  <div class="mt-8 d-flex flex-column justify-center align-center">
    <v-text-field
      v-model.trim="context"
      variant="outlined"
      hide-details
      bg-color="bg-2"
      class="w-75"
      placeholder="cat, rain"
      style="border: 1px solid black"
      @keydown.prevent.enter="handleGenerate"
    >
      <template #append-inner>
        <v-btn color="error" text="Reset" @click="handleReset"></v-btn>
      </template>
    </v-text-field>
    <v-btn
      color="info"
      text="Generate"
      size="large"
      class="mt-4"
      prepend-icon="mdi-hammer"
      :loading="isLoading"
      @click="handleGenerate"
    ></v-btn>
    <div class="mt-4 w-75" v-if="generatedPrompt.length">
      <div
        v-for="(prompt, id) in generatedPrompt"
        :key="id"
        style="border: 1px solid black"
        class="mb-2 pa-3 text-h6 pointer prompt-gen"
        @click="handleCopy(prompt)"
      >
        {{ prompt }}
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/generator`;
const context = ref("");
const isLoading = ref(false);

const generatedPrompt = ref([]);

async function handleGenerate() {
  if (!context.value) return;
  isLoading.value = true;
  const { data } = await useFetch(baseURL, {
    method: "POST",
    body: {
      context: context.value,
    },
  });
  isLoading.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  generatedPrompt.value = result;
}

function handleReset() {
  context.value = "";
  generatedPrompt.value = [];
}

function handleCopy(prompt) {
  navigator.clipboard.writeText(prompt);
  useNuxtApp().$toast.success("Copy to clipboard!");
}
</script>

<style scoped>
.prompt-gen:hover {
  background-color: #34cc7b !important;
  font-weight: 600 !important;
}
</style>
