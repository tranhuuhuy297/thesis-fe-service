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
  <v-dialog v-model.trim="isShowDialog" width="auto">
    <v-card>
      <v-card-text class="mb-2">
        <div class="mt-4 d-flex w-100">
          <div class="bg-bg-1 rounded d-flex justify-center align-center pa-2">
            <v-img
              :src="`${prompt?.image_src}`"
              style="height: 75vh; width: auto"
              :lazy-src="`${prompt?.image_src}`"
            ></v-img>
          </div>
          <v-divider vertical class="mx-4"></v-divider>

          <div
            class="d-flex flex-column"
            style="max-width: 40vw; min-width: 30vw"
          >
            <span
              class="pointer--link pointer mb-2 text-success font-weight-bold"
              @click="navigateTo({ path: `/user/${prompt?.user_id}` })"
            >
              @{{ username }}
            </span>
            <div class="mb-4 bg-bg-1 rounded pa-2">
              {{ prompt?.prompt }}
            </div>
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-end mr-2">
                <v-icon
                  icon="mdi-heart"
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
                class="text-none text-text-1"
                :color="isUpvote ? 'primary-2' : ''"
                :variant="isUpvote ? 'flat' : 'text'"
                size="large"
                @click="handleUpvote"
              ></v-btn>
              <v-btn
                prepend-icon="mdi-content-copy"
                color="success"
                text="Copy"
                class="text-none text-text-1"
                variant="flat"
                size="large"
                @click="handleCopyPrompt"
              ></v-btn>
            </div>
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
            width="350"
            height="350"
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
    if (val) {
      handleGetUser();
      handleGetListUpvote();
    }
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
const upvoteId = ref("");

async function handleGetListUpvote() {
  const { data } = await useFetch(`${baseURL}/upvote`, {
    method: "GET",
    query: {
      image_id: props.prompt.id,
    },
  });
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    numberUpvote.value = count;
    const listUpvoteUserId = result.map((item) => item.user_sender_id);

    if (listUpvoteUserId.includes(userStore.id)) {
      isUpvote.value = true;
      upvoteId.value = result.filter(
        (item) => item.user_sender_id === userStore.id
      )[0].id;
    }
  }
}

async function handleUpvote() {
  isUpvote.value = !isUpvote.value;

  if (isUpvote.value) {
    const { data } = await useFetch(`${baseURL}/upvote`, {
      method: "POST",
      body: {
        user_sender_id: userStore.id,
        user_receiver_id: props.prompt.user_id,
        image_id: props.prompt.id,
      },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });
    if (!data.value) return;
    const { result, code, msg } = data.value;
    if (code === CODE_SUCCESS) {
      handleGetListUpvote();
      useNuxtApp().$toast.success("Upvote successfully!");
    }
  } else {
    const { data } = await useFetch(`${baseURL}/upvote/${upvoteId.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });
    if (!data.value) return;
    const { result, code, msg } = data.value;
    if (code === CODE_SUCCESS) {
      handleGetListUpvote();
      useNuxtApp().$toast.info("Downvote successfully!");
    }
  }
}
</script>

<style scoped></style>
