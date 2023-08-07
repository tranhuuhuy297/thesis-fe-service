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
      class="mr-2"
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
    <div style="width: 20%" class="d-flex align-center">
      <v-slider
        v-model="item.weight"
        hide-details
        color="info"
        density="compact"
        min="0"
        max="1"
        thumb-size="12px"
        step="0.1"
        :thumb-label="item.weight > 0 ? 'always' : ''"
      ></v-slider>
    </div>
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
      variant="text"
      text="GPT Support"
      class="text-none"
      :append-icon="isShowRandom ? 'mdi-menu-up' : 'mdi-menu-down'"
      @click="isShowRandom = !isShowRandom"
    ></v-btn>
  </div>
  <div v-if="isShowRandom">
    <v-divider class="my-4"></v-divider>
    <v-text-field
      v-model="hintText"
      variant="outlined"
      density="compact"
      hide-details
      bg-color="white"
      label="Subjects you want to generate"
      placeholder="cat, dog"
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
    <div
      v-for="(prompt, idx) in promptGen"
      :key="`prompt_${idx}`"
      class="bg-bg-1"
    >
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

const promptGen = ref([]);
const hintText = ref("");

async function handleGenerate() {
  useNuxtApp().$toast.info("This task might take about 30 seconds");
  promptGen.value = [];
  isLoadingGenerate.value = true;
  const { data } = await useFetch(`${baseURL}/prompt-generate`, {
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
  // listText.value.push({ ...textTemplate, value: prompt });
  for (const word of prompt.split(",")) {
    listText.value.push({ ...textTemplate, value: word.trim() });
  }
}

const textTemplate = { value: "", weight: 1 };
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
