<template>
  <div style="position: relative" @click="isShowDialog = true">
    <v-img
      :src="`${prompt?.image_src}`"
      :lazy-src="`${prompt?.image_src}`"
      cover
      class="pointer mb-2 img"
      style="border: 1px solid black"
    />
    <v-btn
      v-if="isShowDelete"
      icon="mdi-delete"
      color="error"
      style="position: absolute; top: 2px; right: 2px"
      variant="text"
      @click.stop="isShowDeleteDialog = true"
    ></v-btn>
    <v-btn
      icon="mdi-download"
      color="info"
      style="position: absolute; bottom: 2px; right: 2px"
      variant="text"
      @click.stop="handleDownload"
    ></v-btn>
  </div>
  <v-dialog v-model.trim="isShowDialog" width="auto" persistent>
    <v-card>
      <v-card-text class="mb-2">
        <div class="text-h6 font-weight-bold d-flex">
          <div class="flex-grow-1 d-flex align-center">
            <span class="text-info">Prompt Detail</span>
            <span class="mx-2">-</span>
            <span
              class="font-italic font-weight-medium pointer--link pointer"
              style="font-size: 14px"
              @click="navigateTo({ path: `/user/${prompt?.user_id}` })"
            >
              @{{ username }}
            </span>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            color="info"
            @click="isShowDialog = false"
          ></v-btn>
        </div>
        <div class="mt-4 d-flex w-100">
          <div class="mr-8 d-flex flex-column">
            <div class="mb-4 bg-bg-2 rounded pa-2">
              {{ prompt?.prompt }}
            </div>
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center mr-2">
                <v-icon
                  icon="mdi-heart"
                  size="small"
                  color="primary-2"
                  class="mr-1"
                ></v-icon>
                <span style="font-size: 12px">{{ numberUpvote }}</span>
              </div>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex align-center justify-space-between">
              <v-btn
                :prepend-icon="isUpvote ? 'mdi-heart' : 'mdi-heart-outline'"
                text="Upvote"
                size="small"
                class="text-none text-text-1"
                :color="isUpvote ? 'primary-2' : ''"
                :variant="isUpvote ? 'flat' : 'text'"
                @click="handleUpvote"
              ></v-btn>
              <v-btn
                prepend-icon="mdi-content-copy"
                size="small"
                color="success"
                text="Copy"
                class="text-none text-text-1"
                variant="flat"
                @click="handleCopyPrompt"
              ></v-btn>
            </div>
            <v-divider class="my-2"></v-divider>
            <div>
              <div
                v-for="(comment, index) in listComment"
                :key="`${index}_comment`"
                class="bg-bg-1 pa-2 rounded-lg mb-2"
              >
                <div
                  class="font-italic text-info pointer"
                  style="font-size: 10px"
                >
                  @{{ comment.username }}
                </div>
                <div>{{ comment.text }}</div>
              </div>
            </div>
          </div>
          <div
            class="bg-bg-1 rounded d-flex justify-center align-center"
            style="height: 80vh; width: auto; min-width: 40%"
          >
            <v-img
              :src="`${prompt?.image_src}`"
              :lazy-src="`${prompt?.image_src}`"
            ></v-img>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model.trim="isShowDeleteDialog" width="auto" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-error">Delete</span>
        </div>
        <div>Are you sure to delete this prompt?</div>
        <div class="d-flex align-center justify-center">
          <v-img
            class="mt-4"
            :src="`${prompt?.image_src}`"
            style="max-width: 30vw"
          ></v-img>
        </div>
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
      </v-card-actions>
    </v-card>
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

watch(
  () => isShowDialog.value,
  (val) => {
    if (val) handleGetUser();
  }
);

const username = ref("");
async function handleGetUser() {
  const { data } = await useFetch(`${baseURL}/user/${props.prompt?.user_id}`, {
    method: "GET",
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    username.value = result?.username;
  }
}

async function handleDeletePrompt() {
  isLoadingDelete.value = true;
  const { data } = await useFetch(`${baseURL}/image/${props.prompt.id}`, {
    method: "DELETE",
    params: {
      user_id: userStore.id,
    },
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  isLoadingDelete.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    isShowDeleteDialog.value = false;
    useNuxtApp().$toast.success("Delete successfully!");
    emit("deletedPrompt");
  }
}
const userStore = useUserStore();

function handleCopyPrompt() {
  navigator.clipboard.writeText(props.prompt.prompt);
  useNuxtApp().$toast.success("Copy to clipboard!");
}

function handleDownload() {
  if (process.client) {
    window.open(`${props.prompt.image_src}`);
  }
}

const numberUpvote = ref(0);
const isUpvote = ref(false);
async function handleUpvote() {
  isUpvote.value = !isUpvote.value;
  if (isUpvote.value) numberUpvote.value += 1;
  else numberUpvote.value -= 1;
}
</script>

<style scoped></style>
