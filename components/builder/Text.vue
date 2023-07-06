<template>
  <div
    v-for="(item, index) in listText"
    :key="index"
    class="d-flex mb-1 align-center"
  >
    <v-text-field
      v-model.trim="item.value"
      variant="outlined"
      hide-details
      density="compact"
      bg-color="bg-1"
      style="width: 80%"
    >
      <template #append-inner>
        <v-btn
          color="error"
          variant="text"
          size="small"
          icon="mdi-delete"
          class="text-none"
          @click="handleDelete(index)"
        ></v-btn>
      </template>
    </v-text-field>
    <span class="mx-2 font-weight-bold">::</span>
    <v-text-field
      v-model.trim="item.weight"
      hide-details
      variant="outlined"
      density="compact"
      bg-color="bg-1"
      placeholder="weight"
    ></v-text-field>
  </div>
  <div class="mt-4 d-flex align-center">
    <v-btn
      text="Add new"
      variant="elevated"
      color="info"
      prepend-icon="mdi-plus-circle-outline"
      class="mr-2 text-none"
      @click="listText.push({ ...textTemplate })"
    >
    </v-btn>
    <v-btn
      variant="flat"
      color="success"
      text="GPT Support"
      class="text-none"
      :append-icon="isShowRandom ? 'mdi-menu-down' : 'mdi-menu-up'"
      @click="isShowRandom = !isShowRandom"
    ></v-btn>
  </div>
  <div v-if="isShowRandom" class="mt-8 mx-2">
    <v-text-field
      v-model="hintText"
      variant="outlined"
      density="compact"
      hide-details
      bg-color="bg-1"
      label="Subjects you want to generate"
      class="mb-2"
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
    <div class="d-flex justify-center" v-if="promptGen.length > 0">
      <v-icon
        icon="mdi-menu-down"
        class="mb-2"
        size="36"
        color="success"
      ></v-icon>
    </div>
    <div v-for="(prompt, idx) in promptGen" :key="`prompt_${idx}`">
      <div
        style="border: 1px solid black"
        class="mb-1 pa-2 px-4 pointer prompt"
        @click="handlePushToText(prompt)"
      >
        {{ prompt }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/User";
const userStore = useUserStore();
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const isShowRandom = ref(false);
const isLoadingGenerate = ref(false);

const promptGen = ref([
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
const hintText = ref("cat, dog, rain");

async function handleGenerate() {
  useNuxtApp().$toast.info("This task might take about 30 seconds");
  promptGen.value = [];
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
    promptGen.value = result;
    useNuxtApp().$toast.success("Generate successfully!");
  }
}

function handlePushToText(prompt) {
  listText.value.push({ ...textTemplate, value: prompt });
}

const textTemplate = { value: "", weight: "" };
const listText = ref([{ ...textTemplate }]);

const emit = defineEmits(["updateText"]);

watch(
  () => listText.value,
  () => {
    emit(
      "updateText",
      listText.value.filter((item) => item.value != "")
    );
  },
  { deep: true }
);

defineExpose({ handleReset, handleCopySuggestion });

function handleReset() {
  listText.value = [{ ...textTemplate }];
}

function handleDelete(_id) {
  listText.value = listText.value.filter((item, index) => index !== _id);
}

function handleCopySuggestion(prompt) {
  listText.value.push({ ...textTemplate, value: prompt });
}
</script>

<style scoped>
.prompt:hover {
  background: #34c77b;
}
</style>
