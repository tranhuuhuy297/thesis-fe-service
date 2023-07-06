<template>
  <div style="position: relative" @click="isShowDialog = true">
    <v-img
      :src="`${prompt?.image_src}`"
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
      <v-card-text>
        <div class="text-h6 font-weight-bold d-flex al">
          <span class="text-info">Prompt Detail</span>
          <span class="mx-2">-</span>
          <span
            class="font-italic font-weight-medium pointer--link pointer"
            style="font-size: 14px"
            @click="navigateTo({ path: `/user/${prompt?.user_id}` })"
          >
            Click here to show more images of this user
          </span>
        </div>
        <div class="mt-4 d-flex">
          <div>
            <v-textarea
              bg-color="bg-1"
              label="Prompt"
              :model-value="prompt?.prompt"
              variant="outlined"
              hide-details
              auto-grow
              readonly
              style="min-width: 20vw"
            >
            </v-textarea>
            <v-btn
              prepend-icon="mdi-content-copy"
              color="success"
              text="Copy"
              class="text-none text-text-1 mt-4"
              variant="flat"
              @click="handleCopyPrompt"
            ></v-btn>
          </div>
          <v-img
            class="ml-4"
            :src="`${prompt?.image_src}`"
            style="max-width: 20vw"
          ></v-img>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowDialog = false">Close</v-btn>
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
        <v-img
          class="mt-4"
          :src="`${prompt?.image_src}`"
          style="max-width: 20vw"
        ></v-img>
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

const isUpvote = ref(false);
const countUpvote = ref(0);

onMounted(() => {
  nextTick(
    () => (
      (isUpvote.value = props.prompt.is_upvote),
      (countUpvote.value = props.prompt.count_upvote)
    )
  );
});

function handleDownload() {
  if (process.client) {
    window.open(`${props.prompt.image_src}`);
  }
}
</script>

<style scoped></style>
