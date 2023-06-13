<template>
  <div style="position: relative" @click="isShowDialog = true">
    <v-img
      :src="`https://${prompt?.image_src}`"
      cover
      class="pointer mb-2 img"
    />
    <v-btn
      :icon="isUpvote ? 'mdi-heart' : 'mdi-heart-broken'"
      :color="isUpvote ? 'error' : 'white'"
      style="position: absolute; top: 2px; right: 2px"
      variant="text"
      @click.stop="handleUpvote"
    ></v-btn>
  </div>
  <v-dialog v-model.trim="isShowDialog" width="auto" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold d-flex al">
          <span class="text-info">Prompt Detail</span>
          <span class="mx-2">-</span>
          <span class="font-italic font-weight-medium" style="font-size: 14px">
            @{{ prompt.user_gmail }}
          </span>
        </div>
        <div class="mt-4 d-flex">
          <v-textarea
            bg-color="bg-1"
            label="Prompt"
            :model-value="prompt.prompt"
            variant="outlined"
            class="mx-2"
            auto-grow
            readonly
          >
            <template #append-inner>
              <v-btn
                prepend-icon="mdi-content-copy"
                color="success"
                text="Copy"
                class="text-none text-text-1"
                variant="flat"
                @click="handleCopyPrompt"
              ></v-btn>
            </template>
          </v-textarea>
          <v-textarea
            bg-color="bg-1"
            label="Negative Prompt"
            :model-value="prompt.negative_prompt"
            variant="outlined"
            class="mx-2"
            auto-grow
            readonly
          >
            <template #append-inner>
              <v-btn
                prepend-icon="mdi-content-copy"
                color="success"
                text="Copy"
                class="text-none text-text-1"
                variant="flat"
                @click="handleCopyNegPrompt"
              ></v-btn>
            </template>
          </v-textarea>
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

async function handleDeletePrompt() {}
const userStore = useUserStore();

watch(
  () => isShowDialog.value,
  () => {}
);

function handleCopyPrompt() {
  navigator.clipboard.writeText(props.prompt.prompt);
  useNuxtApp().$toast.success("Copy to clipboard!");
}

function handleCopyNegPrompt() {
  navigator.clipboard.writeText(props.prompt.negative_prompt);
  useNuxtApp().$toast.success("Copy to clipboard!");
}

const isUpvote = ref(false);

onMounted(() => {
  nextTick(() => (isUpvote.value = props.prompt.is_upvote));
});

function handleUpvote() {
  const { data } = useFetch(`${baseURL}/upvote`, {
    method: isUpvote.value ? "DELETE" : "POST",
    body: {
      user_id: userStore.id,
      prompt_id: props.prompt.prompt_id,
    },
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  isUpvote.value = !isUpvote.value;
  useNuxtApp().$toast.success("Successfully!");
}
</script>

<style scoped>
.img:hover {
  opacity: 0.8;
}
</style>
