<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Upload</span>
    <div class="mt-2 text-h6">Upload your prompt images here</div>
  </div>
  <v-btn
    text="Select file"
    color="info"
    size="large"
    variant="flat"
    class="rounded-lg text-none mt-8"
    @click="isShowDialog = true"
  ></v-btn>
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
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <v-dialog v-model.trim="isShowDialog" width="auto" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Upload prompt & image</span>
        </div>
        <div class="mt-4 d-flex">
          <div class="w-50">
            <v-textarea
              v-model.trim="prompt"
              variant="outlined"
              density="compact"
              auto-grow
              autofocus
              bg-color="bg-1"
              class="mr-4"
              :rules="[rules.required]"
              placeholder="Prompt"
            ></v-textarea>
            <v-textarea
              v-model.trim="negativePrompt"
              variant="outlined"
              density="compact"
              placeholder="Negative prompt"
              class="mr-4 mt-1"
              bg-color="bg-1"
              auto-grow
              autofocus
            ></v-textarea>
          </div>
          <v-divider vertical></v-divider>
          <div
            class="rounded-lg d-flex justify-center align-center pointer flex-grow-1 mx-2"
            @click="handleSelectFile"
          >
            <div>
              <v-btn
                v-if="!fileImage"
                prepend-icon="mdi-camera"
                class="text-none"
                text="Your image"
                variant="outlined"
              ></v-btn>
              <v-img
                :src="fileImage"
                style="max-width: 50vw; max-height: 50vh"
              ></v-img>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowDialog = false"> Cancel </v-btn>
        <v-btn
          variant="flat"
          color="info"
          @click="handlePreprocessing"
          :loading="isLoadingCreate"
        >
          Upload
        </v-btn>
      </v-card-actions>
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
      negativePrompt.value = "";
      file.value = null;
      fileImage.value = null;
    }
  }
);
const prompt = ref("");
const negativePrompt = ref();

const isLoadingCreate = ref(false);

function handlePreprocessing() {
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
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
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
}
</script>

<style scoped></style>
