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
    <div v-for="(prompt, idx) in prompt_gen" :key="`prompt_${idx}`">
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

const hintText = ref("cat, dog, rain");

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const isLoadingGenerate = ref(false);
const prompt_gen = ref([
  "A clowder of cats and a pack of dogs frolic together under a gentle rain, their fur glistening with droplets.",
  "A pride of cats and a pack of dogs seek shelter from the pouring rain, forming a harmonious tableau of unity and companionship.",
  "A colony of cats and a pack of dogs explore the wet streets, their paws leaving imprints on the rain-soaked pavement.",
  "A mischief of cats and a pack of dogs playfully chase each other amidst the falling rain, creating a whimsical scene of joyful chaos.",
  "A group of cats and a pack of dogs huddle together under an umbrella, seeking refuge from the relentless rain.",
  "A litter of kittens and a pack of dogs curiously observe raindrops falling, their innocent gazes capturing the beauty of the moment.",
  "A swarm of cats and a pack of dogs navigate through puddles, their synchronized movements reflecting a dance in the rain.",
  "A band of cats and a pack of dogs find solace in a cozy corner, enjoying the rhythmic sound of raindrops against the windowpane.",
  "A cluster of cats and a pack of dogs gather around a waterlogged tree, their inquisitive nature piqued by the rain's transformative touch.",
  "A herd of cats and a pack of dogs traverse a meadow drenched in rain, creating a picturesque tableau of nature's resilience and harmony.",
]);

async function handleGenerate() {
  useNuxtApp().$toast.info("This task might take about 30 seconds");
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
