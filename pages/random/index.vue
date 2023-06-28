<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Random</span>
  </div>
  <div class="mt-2 text-h6">
    Generate prompt based on some key word using GPT3.5
  </div>
  <div class="mt-8 px-16">
    <div class="d-flex justify-center align-center">
      <v-text-field
        v-model="hintText"
        variant="outlined"
        hide-details
        class="mb-4"
        bg-color="bg-1"
        label="Subjects you want to generate"
        @keydown.prevent.enter="handleGenerate"
      >
        <template #append-inner>
          <v-btn
            prepend-icon="mdi-robot-outline"
            color="success"
            text="Random"
            variant="flat"
            class="text-none"
            :loading="isLoadingGenerate"
            @click="handleGenerate"
          ></v-btn>
        </template>
      </v-text-field>
    </div>
    <div class="d-flex justify-center" v-if="prompt_gen.length > 0">
      <v-icon
        icon="mdi-menu-down"
        class="mb-4"
        size="36"
        color="success"
      ></v-icon>
    </div>
    <div
      v-for="(prompt, idx) in prompt_gen"
      :key="`prompt_${idx}`"
      class="mx-16"
    >
      <div
        style="border: 1px solid black"
        class="mb-1 pa-2 px-4 pointer prompt"
        @click="handleCopy(prompt)"
      >
        {{ prompt }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/User";
const userStore = useUserStore();

const hintText = ref("");

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const isLoadingGenerate = ref(false);
const prompt_gen = ref([]);
async function handleGenerate() {
  prompt_gen.value = [];
  isLoadingGenerate.value = true;
  const { data } = await useFetch(`${baseURL}/generate`, {
    method: "POST",
    body: {
      user_id: userStore.id,
      hint_text: hintText.value,
    },
  });
  isLoadingGenerate.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    prompt_gen.value = result;
    useNuxtApp().$toast.success("Generate successfully!");
  }
}

async function handleCopy(prompt) {
  navigator.clipboard.writeText(prompt);
  useNuxtApp().$toast.success("Copy to clipboard!");
}
</script>

<style scoped>
.prompt:hover {
  background: #34c77b;
}
</style>
