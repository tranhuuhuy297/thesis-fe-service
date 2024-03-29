<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Upload</span>
    <div class="mt-2 text-h6">Upload your prompt images here</div>
  </div>
  <div class="d-flex justify-space-between align-end mt-8">
    <v-btn
      text="Select file"
      color="info"
      size="x-large"
      variant="flat"
      class="rounded-lg text-none"
      @click="isShowDialog = true"
    ></v-btn>
    <div class="d-flex align-end">
      <v-icon icon="mdi-image" class="mr-1" color="success"></v-icon>
      <span style="font-size: 14px">{{ imageCount }}</span>

      <v-divider vertical class="mx-2"></v-divider>

      <v-icon icon="mdi-heart" class="mr-1" color="primary-2"></v-icon>
      <span style="font-size: 14px">
        {{ upvoteCount }}
      </span>
    </div>
  </div>
  <v-divider class="my-4"></v-divider>
  <div class="mt-8 d-flex">
    <div class="mx-1 w-25">
      <div v-for="(image, index) in imagesCol_0" :key="`${index}_imagesCol_0`">
        <FeedsImage
          :is-show-delete="true"
          :prompt="image"
          @deleted-prompt="handleDeletedPrompt"
        ></FeedsImage>
      </div>
    </div>
    <div class="mx-1 w-25">
      <div v-for="(image, index) in imagesCol_1" :key="`${index}_imagesCol_1`">
        <FeedsImage
          :is-show-delete="true"
          :prompt="image"
          @deleted-prompt="handleDeletedPrompt"
        ></FeedsImage>
      </div>
    </div>
    <div class="mx-1 w-25">
      <div v-for="(image, index) in imagesCol_2" :key="`${index}_imagesCol_2`">
        <FeedsImage
          :is-show-delete="true"
          :prompt="image"
          @deleted-prompt="handleGetImage"
        ></FeedsImage>
      </div>
    </div>
    <div class="mx-1 w-25">
      <div v-for="(image, index) in imagesCol_3" :key="`${index}_imagesCol_3`">
        <FeedsImage
          :is-show-delete="true"
          :prompt="image"
          @deleted-prompt="handleGetImage"
        ></FeedsImage>
      </div>
    </div>
  </div>
  <div v-if="isLoadingImage" class="d-flex justify-center">
    <v-progress-circular indeterminate color="success"></v-progress-circular>
  </div>
  <v-dialog v-model.trim="isShowDialog" width="auto">
    <v-card>
      <v-card-text class="mb-2">
        <div class="d-flex mt-4 w-100">
          <div
            class="d-flex rounded justify-center align-center bg-bg-1 rounded pa-2"
            style="max-width: 40vw; min-width: 30vw"
          >
            <v-btn
              v-if="!file"
              prepend-icon="mdi-camera"
              class="text-none"
              text="Your image"
              size="large"
              variant="outlined"
              @click="handleSelectFile"
            ></v-btn>
            <v-img
              v-else
              class="pointer"
              :src="fileImage"
              style="height: 75vh; width: auto"
              @click="handleSelectFile"
            ></v-img>
          </div>
          <v-divider vertical class="mx-4"></v-divider>
          <div style="min-width: 30vw">
            <v-textarea
              v-model.trim="prompt"
              variant="outlined"
              density="compact"
              hide-details
              auto-grow
              autofocus
              bg-color="bg-1"
              label="Prompt"
            >
            </v-textarea>
            <v-btn
              prepend-icon="mdi-upload"
              variant="flat"
              color="info"
              class="mt-2"
              size="large"
              :loading="isLoadingCreate"
              @click="handlePreprocessing"
            >
              Upload
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-file-input
    v-model.trim="file"
    id="file"
    style="display: none"
  ></v-file-input>
</template>

<script setup>
import { useUserStore } from "~/stores/User";
import Compressor from "compressorjs";

const userStore = useUserStore();
function handleSelectFile() {
  document.getElementById("file").click();
}

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const file = ref("");

// dialog
const isShowDialog = ref(false);

watch(
  () => isShowDialog.value,
  (val) => {
    if (!val) {
      prompt.value = "";
      file.value = null;
      fileImage.value = null;
    }
  }
);
const prompt = ref("");
const isLoadingCreate = ref(false);

function handlePreprocessing() {
  if (!file.value) {
    useNuxtApp().$toast.warning("Image is required!");
    return;
  }

  if (!prompt.value) {
    useNuxtApp().$toast.warning("Prompt is required!");
    return;
  }

  if (!file.value[0].type.includes("image")) {
    useNuxtApp().$toast.warning("Invalid image!");
    return;
  }

  isLoadingCreate.value = true;

  const formData = new FormData();
  let image = null;
  new Compressor(file.value[0], {
    quality: 0.8,
    success(result) {
      image = new File([result], `${file.value[0].name}`);
      // formData.append("image", file.value[0]);
      formData.append("image", image);
      formData.append("user_id", userStore.id);
      formData.append("prompt", prompt.value);
      handleCreateImage(formData);
    },
    error(err) {
      console.log(err.message);
    },
  });
}

async function handleCreateImage(formData) {
  const { data } = await useFetch(`${baseURL}/image`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  isLoadingCreate.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Upload image successfully!");
    isShowDialog.value = false;
    page.value = 0;
    listImages.value = [];
    handleGetImage();
  }
}

const fileImage = ref(null);
watch(
  () => file.value,
  () => {
    if (file.value) {
      const theReader = new FileReader();
      theReader.onloadend = async () => {
        fileImage.value = await theReader.result;
      };
      theReader.readAsDataURL(file.value[0]);
    }
  }
);

const page = ref(0);
const size = ref(20);
const imageCount = ref(0);

const isLoadingImage = ref(false);
const notLoad = ref(false);

async function handleGetImage() {
  isLoadingImage.value = true;
  const { data } = await useFetch(`${baseURL}/image`, {
    method: "GET",
    params: {
      user_id: userStore.id,
      page: page.value,
      size: size.value,
    },
  });
  isLoadingImage.value = false;
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    imageCount.value = count;
    if (result.length === 0) {
      notLoad.value = true;
      return;
    }
    listImages.value.push(...result);
  }
}

const listImages = ref([]);
const imagesCol_0 = computed(() => {
  return listImages.value.filter((image, index) => {
    if (index % 4 === 0) {
      return image;
    }
  });
});
const imagesCol_1 = computed(() => {
  return listImages.value.filter((image, index) => {
    if (index % 4 === 1) {
      return image;
    }
  });
});
const imagesCol_2 = computed(() => {
  return listImages.value.filter((image, index) => {
    if (index % 4 === 2) {
      return image;
    }
  });
});
const imagesCol_3 = computed(() => {
  return listImages.value.filter((image, index) => {
    if (index % 4 === 3) {
      return image;
    }
  });
});

onMounted(() => {
  nextTick(() => {
    handleGetImage();
    handleGetListUpvote();
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
      handleGetImage();
    }
  }
  window?.addEventListener("scroll", handleScroll);
});

function handleDeletedPrompt() {
  page.value = 0;
  listImages.value = [];
  handleGetImage();
  handleGetListUpvote();
}

const upvoteCount = ref(0);

async function handleGetListUpvote(deep = false) {
  const { data } = await useFetch(`${baseURL}/upvote`, {
    method: "GET",
    query: {
      user_receiver_id: userStore.id,
      deep: deep,
    },
  });
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    upvoteCount.value = count;
  }
}
</script>
