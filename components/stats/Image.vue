<template>
  <div style="position: relative" @click="isShowDialog = true">
    <v-img
      :src="`https://${prompt?.image_src}`"
      cover
      class="pointer mb-2 img"
    />
  </div>
  <v-dialog v-model="isShowDialog">
    <v-card variant="outlined" class="bg-bg-1 mx-auto" max-width="1000">
      <v-card-text class="d-flex">
        <div
          class="rounded-lg w-50 d-flex align-center"
          style="width: 40%; border: 2px solid black"
        >
          <v-img
            :src="`https://${prompt?.image_src}`"
            cover
            style="max-width: 100%"
          />
        </div>
        <v-divider vertical class="mx-4 border-opacity-50" :thickness="2">
        </v-divider>
        <div class="flex-grow-1">
          <div class="text-h5">Prompt</div>
          <v-textarea
            :model-value="prompt?.prompt_content"
            variant="outlined"
            hide-details
            placeholder="Type your prompt here..."
            bg-color="bg-1"
            class="mt-1"
          />
          <div class="text-h5 mt-4">Negative Prompt</div>
          <v-textarea
            :model-value="prompt?.negative_prompt"
            variant="outlined"
            hide-details
            placeholder="Type your negative prompt here..."
            bg-color="bg-1"
            class="mt-1"
          />
          <div class="text-h5 mt-4">Model</div>
          <v-autocomplete
            :model-value="prompt?.model"
            :items="['midjourney', 'stable-diffustion']"
            variant="outlined"
            hide-details
            class="mt-1"
            bg-color="bg-1"
          ></v-autocomplete>
        </div>
      </v-card-text>
      <v-card-actions v-if="isShowDelete" class="d-flex justify-end mr-4 mb-2">
        <v-btn
          variant="text"
          text="Close"
          size="large"
          @click="isShowDialog = false"
        ></v-btn>
        <v-btn
          variant="flat"
          color="error"
          text="Delete"
          size="large"
          class="text-text-1 font-weight-bold"
          @click="isShowDeleteDialog = true"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowDeleteDialog" width="300px" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-error">Delete</span>
        </div>
        <div>Are you sure to delete this prompt?</div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end mr-4 mb-2">
        <v-btn variant="text" @click="isShowDeleteDialog = false">Cancel</v-btn>
        <v-btn
          variant="flat"
          color="error"
          :loading="isLoadingDelete"
          @click="handleDeletePrompt"
        >
          Delete
        </v-btn>
      </v-card-actions></v-card
    >
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  prompt: null,
  isShowDelete: false,
});

const emit = defineEmits(["deletedPrompt"]);

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const isShowDialog = ref(false);
const isShowDeleteDialog = ref(false);
const isLoadingDelete = ref(false);

async function handleDeletePrompt() {
  isLoadingDelete.value = true;
  const { data } = await useFetch(`${baseURL}/prompt/${props?.prompt.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  const { result, code, msg } = data.value;
  isLoadingDelete.value = false;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Delete successfully!");
    isShowDeleteDialog.value = false;
    setTimeout(() => {
      isShowDialog.value = false;
    }, 200);
    emit("deletedPrompt");
  }
}
</script>

<style scoped>
.img:hover {
  opacity: 0.8;
}
</style>
