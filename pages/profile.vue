<template>
  <div class="text-h3 font-weight-bold">
    User <span class="text-primary-2">Profile</span>
    <div class="mt-2 text-h6">Update your profile information</div>
  </div>
  <div class="mt-8 d-flex pl-6">
    <div class="w-25">
      <v-img
        :src="`https://${userStore.image_src}`"
        style="max-width: 100%"
        cover
        class="pointer img"
        @click="handleSelectFile"
      ></v-img>
    </div>
    <v-divider vertical class="mx-8 border-opacity-50"></v-divider>
    <div class="flex-grow-1">
      <div>Username - <span class="font-italic text-bg-3">Can edit</span></div>
      <v-text-field
        v-model.trim="username"
        variant="outlined"
        hide-details
        bg-color="bg-1"
        class="mt-1 w-75"
        prepend-inner-icon="mdi-account-outline"
      />
      <div class="mt-4">Email</div>
      <v-text-field
        v-model.trim="userStore.gmail"
        class="mt-1 w-75"
        variant="outlined"
        bg-color="bg-3"
        hide-details
        prepend-inner-icon="mdi-email-outline"
        readonly
      ></v-text-field>
      <div class="d-flex mt-8">
        <v-btn
          size="large"
          color="info"
          class="font-weight-bold mr-2"
          @click="handleUpdateInformation"
          :loading="isLoadingUpdate"
        >
          Update account
        </v-btn>
        <!-- <v-btn size="large" color="error" class="font-weight-bold text-text-1">
          Delete account
        </v-btn> -->
      </div>
    </div>
  </div>
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
const username = ref(userStore.username);
const isLoadingUpdate = ref(false);

async function handleUpdateInformation() {
  isLoadingUpdate.value = true;
  const formData = new FormData();
  if (file.value[0]) {
    formData.append("image", file.value[0]);
  }
  formData.append("username", username.value);
  const { data } = await useFetch(
    `${baseURL}/user/${userStore.id}/update_information`,
    {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }
  );
  isLoadingUpdate.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Update successfully!");
    setTimeout(() => {
      document.cookie = "token=;";
      document.cookie = "exp=;";
      setTimeout(() => {
        navigateTo("/login");
      }, 200);
    }, 500);
  }
}
</script>

<style scoped>
.img:hover {
  opacity: 0.8;
}
</style>
