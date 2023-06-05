<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Generator</span>
  </div>
  <div class="mt-2 text-h6">Random generate prompt</div>
  <div class="mt-8 d-flex flex-column justify-center align-center">
    <v-text-field
      v-model="context"
      variant="outlined"
      hide-details
      bg-color="bg-2"
      class="w-75"
      placeholder="cat, rain"
      style="border: 2px solid black"
    ></v-text-field>
    <v-btn
      color="info"
      text="Generate"
      size="large"
      class="mt-4"
      prepend-icon="mdi-hammer"
      :loading="isLoading"
      @click="handleGenerate"
    ></v-btn>
    <div class="mt-4" v-if="generatedPrompt.length"></div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/generator`;
const context = ref("");
const isLoading = ref(false);

const generatedPrompt = ref([]);

async function handleGenerate() {
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
</script>
