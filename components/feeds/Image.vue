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
      <v-card-text class="mb-2 d-flex">
        <div
          class="bg-bg-1 rounded d-flex justify-center align-center pa-2"
          style="max-width: 40vw; min-width: 30vw"
        >
          <v-img
            :src="`${selected?.image_src}`"
            style="height: 75vh; width: auto"
            :lazy-src="`${selected?.image_src}`"
          ></v-img>
        </div>
        <v-divider vertical class="mx-4"></v-divider>

        <div
          class="d-flex flex-column"
          style="max-width: 40vw; min-width: 30vw"
        >
          <span
            class="pointer--link pointer text-success font-weight-bold"
            @click="navigateTo({ path: `/user/${selected?.user_id}` })"
          >
            @{{ username }}
          </span>
          <div class="mb-2 text-text-2 font-italic" style="font-size: 12px">
            {{ create_time }}
          </div>
          <div class="mb-4 bg-bg-1 rounded pa-2">
            {{ selected?.prompt }}
          </div>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-end mr-2">
              <v-icon icon="mdi-heart" color="primary-2" class="mr-1"></v-icon>
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
          <v-divider class="my-2"></v-divider>
          <v-progress-circular
            v-if="isLoadingSameImage"
            indeterminate
            color="success"
          ></v-progress-circular>
          <div class="d-flex flex-wrap" v-if="listSameImage.length > 0">
            <div
              v-for="(img, idx) in listSameImage"
              :key="`${idx}_img`"
              class="pa-1"
              style="width: 25%"
              @click="
                selected = img;
                handleShowSameImage(img);
              "
            >
              <v-img
                :src="`${img.image_src}`"
                :lazy-src="`${img.image_src}`"
                class="img pointer"
              ></v-img>
            </div>
          </div>
          <v-pagination
            v-if="listSameImage.length > 0"
            v-model="pageSame"
            :length="lengthSame"
            density="comfortable"
            class="mt-1"
            active-color="primary"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            variant="flat"
            :total-visible="5"
          ></v-pagination>
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
        <div>Are you sure to delete this selected?</div>
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

const emit = defineEmits(["deletedPrompt", "upvotedPrompt"]);

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const isShowDialog = ref(false);
const isShowDeleteDialog = ref(false);
const isLoadingDelete = ref(false);

const selected = ref(null);

onMounted(() => {
  selected.value = { ...props.prompt };
});

watch(
  () => isShowDialog.value,
  (val) => {
    if (val) {
      handleGetUser();
      handleGetListUpvote();
      pageSame.value = 1;
      listSameImage.value = [];
      handleGetListSameImage(selected.value.prompt);
    }
  }
);

const username = ref("");
async function handleGetUser() {
  const { data } = await useFetch(`${baseURL}/user/${selected.value.user_id}`, {
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
  const { data } = await useFetch(`${baseURL}/image/${props?.prompt?.id}`, {
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
  navigator.clipboard.writeText(selected.value.prompt);
  useNuxtApp().$toast.success("Copy to clipboard!");
}

function handleDownload() {
  if (process.client) {
    window.open(`${selected.value.image_src}`);
  }
}

const numberUpvote = ref(0);
const isUpvote = ref(false);
const upvoteId = ref("");

async function handleGetListUpvote() {
  const { data } = await useFetch(`${baseURL}/upvote`, {
    method: "GET",
    query: {
      image_id: selected.value.id,
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
  if (!userStore.id) {
    useNuxtApp().$toast.warning("You have to log in!");
    return;
  }
  isUpvote.value = !isUpvote.value;

  if (isUpvote.value) {
    const { data } = await useFetch(`${baseURL}/upvote`, {
      method: "POST",
      body: {
        user_sender_id: userStore.id,
        user_receiver_id: selected.value.user_id,
        image_id: selected.value.id,
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
      emit("upvotedPrompt");
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

const pageSame = ref(1);
const sizeSame = ref(8);
const lengthSame = ref(10);
const isLoadingSameImage = ref(false);
const listSameImage = ref([]);

async function handleGetListSameImage(query) {
  isLoadingSameImage.value = true;
  const { data } = await useFetch(`${baseURL}/image`, {
    method: "GET",
    query: {
      query: query,
      page: pageSame.value - 1,
      size: sizeSame.value,
    },
  });
  isLoadingSameImage.value = false;
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    lengthSame.value = parseInt(count / sizeSame.value) + 1;
    listSameImage.value = result.filter((item) => item.id != props?.prompt?.id);
  }
}

function handleShowSameImage(img) {
  pageSame.value = 1;
  listSameImage.value = [];
  handleGetUser();
  handleGetListUpvote();
  handleGetListSameImage(img.prompt);
}

watch(
  () => pageSame.value,
  () => {
    handleGetListSameImage(selected.value.prompt);
  }
);

const create_time = computed(() => {
  const date = new Date(props?.prompt?.create_time * 1000);
  return `${date.getHours()}:${date.getMinutes()}, ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
});
</script>

<style scoped></style>
