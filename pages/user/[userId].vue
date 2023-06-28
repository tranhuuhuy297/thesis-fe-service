<template>
  <div class="text-h3 font-weight-bold">
    User <span class="text-primary-2">Images</span>
    <div class="mt-2 text-h6">@{{ user?.username }} prompt images</div>
  </div>
  <div v-if="isLoadingImage" class="mt-8 d-flex justify-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
</template>

<script setup>
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const { userId } = useRoute().params;

const user = ref(null);
const isLoadingImage = ref(true);

onMounted(() => {
  nextTick(() => {
    handleGetUser();
    handleGetListImage();
  });
});

onMounted(() => {
  function handleScroll() {
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

async function handleGetUser() {
  const { data } = await useFetch(`${baseURL}/user/${userId}`, {
    method: "GET",
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    user.value = result;
  }
}

const page = ref(0);
const size = ref(20);
const listImages = ref([]);
const notLoad = ref(false);

async function handleGetListImage() {
  isLoadingImage.value = true;
  const { data } = await useFetch(`${baseURL}/image`, {
    method: "GET",
    params: {
      user_id: userId,
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
    listImages.value = result;
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
</script>
