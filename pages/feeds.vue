<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Feeds</span>
    <div class="mt-2 text-h6">Exploring newest prompt images</div>
  </div>
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
import { useImageStore } from "~/stores/Image";
import { useUserStore } from "~/stores/User";

const userStore = useUserStore();

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const page = ref(0);
const size = ref(20);

const imageStore = useImageStore();
onMounted(() => {
  nextTick(() => {
    handleGet();
  });
});

watch(
  () => imageStore.textSearch,
  () => {
    handleGet();
  }
);

function handleGet() {
  if (!imageStore.textSearch) {
    page.value = 0;
    size.value = 20;
    listImages.value = [];
    handleGetListImage();
    return;
  }
  handleGetListSemanticImage();
}

const isLoadingImage = ref(false);

async function handleGetListSemanticImage() {
  imageStore.setListImages([]);
  isLoadingImage.value = true;
  const { data } = await useFetch(`${baseURL}/image/search/semantic-search`, {
    method: "GET",
    query: {
      query: imageStore.textSearch,
      user_sender_id: userStore.id,
    },
  });
  isLoadingImage.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    imageStore.setListImages(result);
  }
}

const listImages = ref([]);
const notLoad = ref(false);
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
  const images = imageStore.textSearch
    ? imageStore.listImages
    : listImages.value;
  return images.filter((prompt, index) => {
    if (index % 4 === 0) {
      return prompt;
    }
  });
});
const newestImages1 = computed(() => {
  const images = imageStore.textSearch
    ? imageStore.listImages
    : listImages.value;
  return images.filter((prompt, index) => {
    if (index % 4 === 1) {
      return prompt;
    }
  });
});
const newestImages2 = computed(() => {
  const images = imageStore.textSearch
    ? imageStore.listImages
    : listImages.value;
  return images.filter((prompt, index) => {
    if (index % 4 === 2) {
      return prompt;
    }
  });
});
const newestImages3 = computed(() => {
  const images = imageStore.textSearch
    ? imageStore.listImages
    : listImages.value;
  return images.filter((prompt, index) => {
    if (index % 4 === 3) {
      return prompt;
    }
  });
});

onMounted(() => {
  function handleScroll() {
    if (imageStore.textSearch) return;
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
