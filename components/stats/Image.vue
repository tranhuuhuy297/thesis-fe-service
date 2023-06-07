<template>
  <div style="position: relative" @click="isShowDialog = true">
    <v-img
      :src="`https://${prompt?.image_src}`"
      cover
      class="pointer mb-2 img"
    />
    <div
      style="
        position: absolute;
        bottom: 4px;
        left: 4px;
        font-size: 12px;
        max-width: 100%;
      "
      class="font-weight-bold text-white text-truncate"
    >
      {{ prompt?.user_gmail ? `@${prompt?.user_gmail}` : "" }}
    </div>
  </div>
  <v-dialog v-model.trim="isShowDialog" persistent>
    <v-card class="bg-bg-1 mx-auto" max-width="50vw" max-height="100vh">
      <v-card-title class="d-flex justify-end">
        <v-btn icon="mdi-close" variant="text" @click="isShowDialog = false">
        </v-btn>
      </v-card-title>
      <v-card-text class="d-flex mt-0 pt-0 mb-2">
        <div
          class="rounded-lg w-50 d-flex align-center justify-center"
          style="position: relative"
        >
          <v-img :src="`https://${prompt?.image_src}`" cover />
        </div>
        <v-divider vertical class="mx-4 border-opacity-50" :thickness="2">
        </v-divider>
        <div class="flex-grow-1">
          <div v-if="!isShowDelete">
            <v-btn
              prepend-icon="mdi-heart"
              color="red"
              :text="count"
              :variant="isUpvote ? 'flat' : 'outlined'"
              class="mb-2"
              @click="handleUpvote"
            ></v-btn>
          </div>
          <div class="text-h5">Prompt</div>
          <v-textarea
            :model-value="prompt?.prompt_content"
            variant="outlined"
            hide-details
            placeholder="Type your prompt here..."
            bg-color="bg-1"
            class="mt-1"
            :readonly="!isShowDelete"
          />
          <div class="text-h5 mt-4">Negative Prompt</div>
          <v-textarea
            :model-value="prompt?.negative_prompt"
            variant="outlined"
            hide-details
            :placeholder="
              !isShowDelete ? '' : 'Type your negative prompt here...'
            "
            bg-color="bg-1"
            class="mt-1"
            :readonly="!isShowDelete"
          />
          <div class="text-h5 mt-4">Model</div>
          <v-autocomplete
            :model-value="prompt?.model"
            :items="['midjourney', 'stable-diffustion']"
            variant="outlined"
            hide-details
            class="mt-1"
            bg-color="bg-1"
            readonly
          ></v-autocomplete>
        </div>
      </v-card-text>
      <v-card-actions v-if="isShowDelete" class="d-flex justify-end">
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
          @click="isShowDeleteDialog = true"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model.trim="isShowDeleteDialog" width="auto" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-error">Delete</span>
        </div>
        <div>Are you sure to delete this prompt?</div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
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
import { useUserStore } from "~/stores/User";

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
  isLoadingDelete.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Delete successfully!");
    isShowDeleteDialog.value = false;
    setTimeout(() => {
      isShowDialog.value = false;
    }, 200);
    emit("deletedPrompt");
  }
}
const userStore = useUserStore();
async function handleUpvote() {
  if (isUpvote.value) {
    handleDownUpvote();
    return;
  }
  const { data } = await useFetch(`${baseURL}/upvote`, {
    method: "POST",
    body: {
      user_id: userStore.id,
      prompt_id: props.prompt.id,
    },
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  handleGetUpvote();
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Upvote successfully!");
  }
}

async function handleDownUpvote() {
  const { data } = await useFetch(`${baseURL}/upvote/${upvote.value?.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  handleGetUpvote();
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Downvote successfully!");
  }
}

watch(
  () => isShowDialog.value,
  () => {
    handleGetUpvote();
  }
);

const isUpvote = ref(false);
const count = ref(0);
const upvote = ref(null);
async function handleGetUpvote() {
  const { data } = await useFetch(
    `${baseURL}/upvote/user/${userStore.id}/prompt/${props.prompt.id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }
  );
  if (!data.value) return;
  const { result, code, msg } = data.value;
  isUpvote.value = result.isUpvote;
  count.value = result.count;
  upvote.value = result.upvote;
}
</script>

<style scoped>
.img:hover {
  opacity: 0.8;
}
</style>
