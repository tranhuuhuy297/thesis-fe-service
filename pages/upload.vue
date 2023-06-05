<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Upload</span>
    <div class="mt-2 text-h6">Upload your image prompt</div>
  </div>
  <div class="mt-8 d-flex flex-grow-1">
    <v-file-input
      v-model="file"
      id="file"
      variant="outlined"
      density="comfortable"
      hide-details
      bg-color="bg-2"
      class="mx-4"
      label="Image describe your prompt"
      style="display: none"
    ></v-file-input>
    <div
      class="rounded-lg pointer d-flex align-center justify-center"
      style="width: 40%; border: 2px solid black"
      @click="handleSelectFile"
    >
      <span v-if="!file">
        <v-icon icon="mdi-image" class="mr-1"> </v-icon>Upload your image here
      </span>
      <img v-else :src="fileImage" style="object-fit: cover; width: 80%" />
    </div>
    <v-divider
      vertical
      class="mx-4 border-opacity-50"
      :thickness="2"
    ></v-divider>
    <div class="flex-grow-1 text-text-1">
      <div class="">Prompt</div>
      <v-textarea
        v-model.trim="prompt"
        variant="outlined"
        hide-details
        placeholder="Type your prompt here..."
        bg-color="bg-1"
        class="mt-1"
      />
      <div class="mt-4">Negative Prompt</div>
      <v-textarea
        v-model.trim="negativePrompt"
        variant="outlined"
        hide-details
        placeholder="Type your negative prompt here..."
        bg-color="bg-1"
        class="mt-1"
      />
      <div class="mt-4">Model</div>
      <v-autocomplete
        v-model="model"
        :items="['midjourney', 'stable-diffustion']"
        variant="outlined"
        hide-details
        class="mt-1"
        bg-color="bg-1"
      ></v-autocomplete>
      <v-btn
        color="primary"
        size="x-large"
        class="mt-6"
        text="Upload"
        prepend-icon="mdi-upload"
        block
        variant="flat"
        :loading="isLoadingUpload"
        @click="handleUploadPrompt"
      ></v-btn>
    </div>
  </div>
  <v-divider class="mt-10"></v-divider>
  <div class="d-flex mt-3">
    <div class="w-25 mr-2">
      <div v-for="(prompt, index) in userPrompt0" :key="`${index}_prompt_col0`">
        <StatsImage
          :is-show-delete="true"
          :prompt="prompt"
          @deleted-prompt="handleDeletePrompt"
        ></StatsImage>
      </div>
    </div>
    <div class="w-25 mr-2">
      <div v-for="(prompt, index) in userPrompt1" :key="`${index}_prompt_col1`">
        <StatsImage
          :is-show-delete="true"
          :prompt="prompt"
          @deleted-prompt="handleDeletePrompt"
        ></StatsImage>
      </div>
    </div>
    <div class="w-25 mr-2">
      <div v-for="(prompt, index) in userPrompt2" :key="`${index}_prompt_col2`">
        <StatsImage
          :is-show-delete="true"
          :prompt="prompt"
          @deleted-prompt="handleDeletePrompt"
        ></StatsImage>
      </div>
    </div>
    <div class="w-25 mr-2">
      <div v-for="(prompt, index) in userPrompt3" :key="`${index}_prompt_col3`">
        <StatsImage
          :is-show-delete="true"
          :prompt="prompt"
          @deleted-prompt="handleDeletePrompt"
        ></StatsImage>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/User";
import { useUserPromptStore } from "~/stores/UserPrompt";

function handleSelectFile() {
  document.getElementById("file").click();
}

const prompt = ref("");
const negativePrompt = ref("");
const model = ref("midjourney");
const file = ref(null);
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
const userStore = useUserStore();

const isLoadingUpload = ref(false);

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;
async function handleUploadPrompt() {
  if (!file.value || !prompt.value) return;
  isLoadingUpload.value = true;
  const formData = new FormData();
  formData.append("image", file.value[0]);
  formData.append("prompt_content", prompt.value);
  formData.append("negative_prompt", negativePrompt.value);
  formData.append("model", model.value);
  const { data } = await useLazyFetch(
    `${baseURL}/user/${userStore.id}/prompt`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }
  );
  isLoadingUpload.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Upload successfully!");
    nextTick(() => {
      handleReset();
      page.value = 0;
      size.value = 20;
      userPromptStore.setListUserPrompt([]);
      handleGetListUserPrompt();
    });
  }
}

function handleReset() {
  prompt.value = "";
  negativePrompt.value = "";
  model.value = "midjourney";
  file.value = null;
}

const userPromptStore = useUserPromptStore();

const page = ref(0);
const size = ref(20);
onMounted(() => {
  nextTick(() => {
    page.value = 0;
    size.value = 20;
    userPromptStore.setListUserPrompt([]);
    handleGetListUserPrompt();
  });
  function handleScroll() {
    if (
      document?.documentElement?.clientHeight + window?.scrollY >=
      document?.documentElement?.scrollHeight
    ) {
      page.value += 1;
      handleGetListUserPrompt();
    }
  }
  window?.addEventListener("scroll", handleScroll);
});

async function handleGetListUserPrompt() {
  const { data } = await useFetch(`${baseURL}/user/${userStore.id}/prompt`, {
    method: "GET",
    params: {
      page: page.value,
      size: size.value,
    },
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    const listUserPrompt = [...userPromptStore.listUserPrompt, ...result];
    userPromptStore.setListUserPrompt(listUserPrompt);
  }
}

const userPrompt0 = computed(() => {
  return userPromptStore.listUserPrompt.filter((prompt, index) => {
    if (index % 4 === 0) {
      return prompt;
    }
  });
});
const userPrompt1 = computed(() => {
  return userPromptStore.listUserPrompt.filter((prompt, index) => {
    if (index % 4 === 1) {
      return prompt;
    }
  });
});
const userPrompt2 = computed(() => {
  return userPromptStore.listUserPrompt.filter((prompt, index) => {
    if (index % 4 === 2) {
      return prompt;
    }
  });
});
const userPrompt3 = computed(() => {
  return userPromptStore.listUserPrompt.filter((prompt, index) => {
    if (index % 4 === 3) {
      return prompt;
    }
  });
});

function handleDeletePrompt() {
  page.value = 0;
  size.value = 20;
  userPromptStore.setListUserPrompt([]);
  handleGetListUserPrompt();
}
</script>
