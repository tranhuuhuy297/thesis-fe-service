<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Feeds</span>
    <div class="mt-2 text-h6">Exploring newest prompt images</div>
  </div>
  <v-text-field
    v-model.trim="textSearch"
    variant="outlined"
    class="mt-8 w-50"
    label="Search AI Images"
    density="compact"
    hide-details
    @keydown.prevent.enter="handleGetListSemanticImage"
  >
    <template #append-inner>
      <v-btn
        icon="mdi-reload"
        text
        color="info"
        size="x-small"
        @click="handleReset"
      ></v-btn>
    </template>
  </v-text-field>
  <v-divider class="my-4"></v-divider>
  <div class="d-flex mt-8 text-h3">
    <div class="mx-1 w-25">
      <div
        v-for="(prompt, index) in newestImages0"
        :key="`${index}_prompt_col0`"
      >
        <FeedsImage :prompt="prompt"></FeedsImage>
      </div>
    </div>
    <div class="mx-1 w-25">
      <div
        v-for="(prompt, index) in newestImages1"
        :key="`${index}_prompt_col1`"
      >
        <FeedsImage :prompt="prompt"></FeedsImage>
      </div>
    </div>
    <div class="mx-1 w-25">
      <div
        v-for="(prompt, index) in newestImages2"
        :key="`${index}_prompt_col2`"
      >
        <FeedsImage :prompt="prompt"></FeedsImage>
      </div>
    </div>
    <div class="mx-1 w-25">
      <div
        v-for="(prompt, index) in newestImages3"
        :key="`${index}_prompt_col3`"
      >
        <FeedsImage :prompt="prompt"></FeedsImage>
      </div>
    </div>
  </div>
  <div v-if="isLoadingImage" class="d-flex justify-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/User";

const userStore = useUserStore();

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const page = ref(0);
const size = ref(20);

const textSearch = ref("");

const route = useRoute();

onMounted(() => {
  nextTick(() => {
    textSearch.value = route?.query?.textSearch;
    if (textSearch.value) handleGetListSemanticImage();
    else handleGetListImage();
  });
});

const isLoadingImage = ref(false);
const listImages = ref([]);
const notLoad = ref(false);

function handleReset() {
  textSearch.value = "";
  listImages.value = [];
  page.value = 0;
  handleGetListImage();
}

async function handleGetListSemanticImage() {
  if (textSearch.value === "") {
    handleReset();
    return;
  }
  listImages.value = [];
  isLoadingImage.value = true;
  const { data } = await useFetch(`${baseURL}/image/search/semantic-search`, {
    method: "GET",
    query: {
      query: textSearch.value,
      user_sender_id: userStore.id,
    },
  });
  isLoadingImage.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    listImages.value = result;
  }
}

async function handleGetListImage() {
  isLoadingImage.value = true;
  const { data } = await useFetch(`${baseURL}/image`, {
    method: "GET",
    query: {
      user_sender_id: userStore.id,
      page: page.value,
      size: size.value,
    },
  });
  isLoadingImage.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    if (result.length === 0) {
      notLoad.value = true;
      return;
    }
    listImages.value.push(...result);
  }
}

const newestImages0 = computed(() => {
  return listImages.value.filter((prompt, index) => {
    if (index % 4 === 0) {
      return prompt;
    }
  });
});
const newestImages1 = computed(() => {
  return listImages.value.filter((prompt, index) => {
    if (index % 4 === 1) {
      return prompt;
    }
  });
});
const newestImages2 = computed(() => {
  return listImages.value.filter((prompt, index) => {
    if (index % 4 === 2) {
      return prompt;
    }
  });
});
const newestImages3 = computed(() => {
  return listImages.value.filter((prompt, index) => {
    if (index % 4 === 3) {
      return prompt;
    }
  });
});

onMounted(() => {
  function handleScroll() {
    if (textSearch.value) return;
    if (notLoad.value) return;
    if (
      document?.documentElement?.clientHeight + window?.scrollY >=
      document?.documentElement?.scrollHeight
    ) {
      page.value += 1;
      handleGetListImage();
    }
  }
  window?.addEventListener("scroll", handleScroll);
});
</script>
