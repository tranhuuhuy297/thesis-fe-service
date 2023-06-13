<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Upload</span>
    <div class="mt-2 text-h6">Upload your prompt image here</div>
  </div>
  <div class="mt-8">
    <div class="d-flex">
      <v-btn
        text="Select file"
        color="info"
        size="large"
        variant="flat"
        class="rounded-lg"
        @click="isShowDialog = true"
      ></v-btn>
    </div>
    <v-divider class="my-4"></v-divider>
    <div class="d-flex">
      <div class="mx-1 w-25">
        <div
          v-for="(image, index) in imagesCol_0"
          :key="`${index}_imagesCol_0`"
        >
          <v-img :src="`https://${image?.image_src}`"></v-img>
        </div>
      </div>
      <div class="mx-1 w-25">
        <div
          v-for="(image, index) in imagesCol_1"
          :key="`${index}_imagesCol_1`"
        >
          <v-img :src="`https://${image?.image_src}`"></v-img>
        </div>
      </div>
      <div class="mx-1 w-25">
        <div
          v-for="(image, index) in imagesCol_2"
          :key="`${index}_imagesCol_2`"
        >
          <v-img :src="`https://${image?.image_src}`"></v-img>
        </div>
      </div>
      <div class="mx-1 w-25">
        <div
          v-for="(image, index) in imagesCol_3"
          :key="`${index}_imagesCol_3`"
        >
          <v-img :src="`https://${image?.image_src}`"></v-img>
        </div>
      </div>
    </div>
  </div>
  <v-dialog v-model.trim="isShowDialog" width="auto" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Create prompt</span>
        </div>
        <div>1st step - You have to create prompt</div>
        <div class="d-flex mt-4">
          <v-textarea
            v-model.trim="prompt"
            variant="outlined"
            density="compact"
            auto-grow
            autofocus
            bg-color="bg-1"
            class="mx-2"
            label="Prompt"
          ></v-textarea>
          <v-textarea
            v-model.trim="negativePrompt"
            variant="outlined"
            density="compact"
            label="Negative Prompt"
            class="mx-2"
            bg-color="bg-1"
            auto-grow
            autofocus
          ></v-textarea>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          variant="text"
          @click="
            isShowDialog = false;
            prompt = '';
            negativePrompt = '';
          "
        >
          Cancel
        </v-btn>
        <v-btn
          variant="flat"
          color="info"
          @click="handleCreatePrompt"
          :loading="isLoadingCreatePrompt"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model.trim="isShowUpload" width="auto" persistent>
    <v-card>
      <v-card-text style="min-width: 50vw">
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Upload image</span>
        </div>
        <div>Final step - Upload your image</div>
        <div
          class="w-100 mt-4 rounded-lg d-flex justify-center align-center pointer"
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
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          variant="text"
          @click="
            isShowUpload = false;
            file = null;
            fileImage = null;
          "
        >
          Cancel
        </v-btn>

        <v-btn
          variant="flat"
          color="info"
          @click="handleCreateImage"
          :loading="isLoadingCreateImage"
        >
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-file-input
    v-model.trim="file"
    id="file"
    variant="outlined"
    density="comfortable"
    hide-details
    bg-color="bg-2"
    class="mx-4"
    label="Image describe your prompt"
    style="display: none"
  ></v-file-input>
</template>

<script setup>
import { useUserStore } from "~/stores/User";

const userStore = useUserStore();
function handleSelectFile() {
  document.getElementById("file").click();
}

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const file = ref("");

// dialog
const isShowDialog = ref(false);
const isLoadingCreatePrompt = ref(false);
const prompt = ref("");
const negativePrompt = ref();
const promptCreated = ref(null);
async function handleCreatePrompt() {
  isLoadingCreatePrompt.value = true;
  const { data } = await useFetch(`${baseURL}/prompt`, {
    method: "POST",
    body: {
      user_id: userStore.id,
      prompt: prompt.value,
      negative_prompt: negativePrompt.value,
    },
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  isLoadingCreatePrompt.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    isShowUpload.value = true;
    useNuxtApp().$toast.success("Create prompt successfully!");
    promptCreated.value = result;
  }
}

const isShowUpload = ref(false);
const isLoadingCreateImage = ref(false);

async function handleCreateImage() {
  isLoadingCreateImage.value = true;
  const formData = new FormData();
  formData.append("image", file.value[0]);
  formData.append("user_id", userStore.id);
  formData.append("prompt_id", promptCreated?.value.id);
  const { data } = await useFetch(`${baseURL}/image`, {
    method: "POST",
    body: formData,
  });
  isLoadingCreateImage.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Upload image successfully!");
    isShowUpload.value = false;
    file.value = null;
    fileImage.value = null;
    isShowDialog.value = false;
    prompt.value = "";
    negativePrompt.value = "";
    page.value = 0;
    size.value = 20;
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

async function handleGetImage() {
  const { data } = await useFetch(`${baseURL}/image/user/${userStore.id}`, {
    method: "GET",
    params: {
      page: page.value,
      size: size.value,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    listImages.value = result;
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
</script>

<style scoped></style>
