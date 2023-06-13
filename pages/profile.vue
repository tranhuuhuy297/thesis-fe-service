<template>
  <div class="text-h3 font-weight-bold">
    User <span class="text-primary-2">Profile</span>
    <div class="mt-2 text-h6">
      Upload your prompt image <span class="text-primary-2">&</span> update your
      information
    </div>
  </div>
  <div class="mt-8">
    <div class="d-flex">
      <v-btn
        text="Upload"
        color="primary"
        size="large"
        variant="flat"
        prepend-icon="mdi-upload"
        class="font-weight-bold text-text-1 rounded-lg"
        @click="isShowDialog = true"
      ></v-btn>
    </div>
    <v-divider class="my-4"></v-divider>
    <div class="d-flex">
      <div class="mx-1" style="width: 20%"></div>
      <div class="mx-1" style="width: 20%"></div>
      <div class="mx-1" style="width: 20%"></div>
      <div class="mx-1" style="width: 20%"></div>
      <div class="mx-1" style="width: 20%"></div>
    </div>
  </div>
  <v-dialog v-model.trim="isShowDialog" width="auto" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Create prompt</span>
        </div>
        <div>1st step - You have to create prompt</div>
        <v-textarea
          v-model.trim="prompt"
          class="mt-4"
          variant="outlined"
          density="compact"
          auto-grow
          autofocus
          label="Prompt"
        ></v-textarea>
        <v-textarea
          v-model.trim="negativePrompt"
          variant="outlined"
          density="compact"
          label="Negative Prompt"
          auto-grow
          autofocus
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          variant="text"
          @click="
            isShowDialog = false;
            prompt = '';
            negativePrompt = '';
          "
          >Cancel</v-btn
        >
        <v-btn variant="flat" color="info" @click="handleCreatePrompt">
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

        <v-btn variant="flat" color="info" @click="handleCreateImage">
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
const prompt = ref("");
const negativePrompt = ref();
async function handleCreatePrompt() {
  isShowUpload.value = true;
}

const isShowUpload = ref(false);
async function handleCreateImage() {}

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
</script>

<style scoped></style>
