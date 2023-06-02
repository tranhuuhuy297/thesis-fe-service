<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Stats</span>
    <div class="mt-2 text-h6">Search for the best prompts</div>
  </div>
  <div class="mt-8 text-h5">
    <v-tabs v-model="currentTab" color="text-1">
      <v-tab :value="1" :class="{ 'font-weight-bold': currentTab === 1 }">
        Newest
      </v-tab>
      <v-tab :value="2" :class="{ 'font-weight-bold': currentTab === 2 }">
        Top Upvote
      </v-tab>
    </v-tabs>
    <v-divider style="margin-top: 1px"></v-divider>
    <v-window v-model="currentTab" class="flex-grow-1 mt-4">
      <div v-if="currentTab === 1" class="d-flex ml-2">
        <div class="w-25 mr-2">
          <div
            v-for="(prompt, index) in newestPromptCol0"
            :key="`${index}_prompt_col0`"
          >
            <StatsImage :prompt="prompt"></StatsImage>
          </div>
        </div>
        <div class="w-25 mr-2">
          <div
            v-for="(prompt, index) in newestPromptCol1"
            :key="`${index}_prompt_col1`"
          >
            <StatsImage :prompt="prompt"></StatsImage>
          </div>
        </div>
        <div class="w-25 mr-2">
          <div
            v-for="(prompt, index) in newestPromptCol2"
            :key="`${index}_prompt_col2`"
          >
            <StatsImage :prompt="prompt"></StatsImage>
          </div>
        </div>
        <div class="w-25 mr-2">
          <div
            v-for="(prompt, index) in newestPromptCol3"
            :key="`${index}_prompt_col3`"
          >
            <StatsImage :prompt="prompt"></StatsImage>
          </div>
        </div>
      </div>
    </v-window>
  </div>
</template>

<script setup>
import { usePromptStore } from "~/stores/Prompt";

const currentTab = ref(1);
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/prompt`;

const promptStore = usePromptStore();

const page = ref(0);
const size = ref(20);
const textSearch = ref("");

const route = useRoute();

onMounted(() => {
  textSearch.value = route.query?.textSearch;
});

onMounted(() => {
  nextTick(() => {
    promptStore.setNewestListPrompt([]);
    page.value = 0;
    size.value = 20;
    handleGetListPrompt();
  });
});

async function handleGetListPrompt() {
  const { data, pending } = await useLazyFetch(`${baseURL}`, {
    method: "GET",
    query: textSearch.value
      ? { page: page.value, size: size.value, search: textSearch.value }
      : {
          page: page.value,
          size: size.value,
        },
  });
  if (!data.value) return;
  const { result, code, msg } = data?.value;
  if (code === CODE_SUCCESS) {
    const validPrompt = result.filter((prompt) => {
      return prompt.image_src;
    });
    const newestListPrompt = [...promptStore.newestListPrompt, ...validPrompt];
    promptStore.setNewestListPrompt(newestListPrompt);
  }
}

const newestPromptCol0 = computed(() => {
  return promptStore.newestListPrompt.filter((prompt, index) => {
    if (index % 4 === 0) {
      return prompt;
    }
  });
});
const newestPromptCol1 = computed(() => {
  return promptStore.newestListPrompt.filter((prompt, index) => {
    if (index % 4 === 1) {
      return prompt;
    }
  });
});
const newestPromptCol2 = computed(() => {
  return promptStore.newestListPrompt.filter((prompt, index) => {
    if (index % 4 === 2) {
      return prompt;
    }
  });
});
const newestPromptCol3 = computed(() => {
  return promptStore.newestListPrompt.filter((prompt, index) => {
    if (index % 4 === 3) {
      return prompt;
    }
  });
});

onMounted(() => {
  function handleScroll() {
    if (
      document?.documentElement?.clientHeight + window?.scrollY >=
      document?.documentElement?.scrollHeight
    ) {
      page.value += 1;
      handleGetListPrompt();
    }
  }
  window?.addEventListener("scroll", handleScroll);
});
</script>
