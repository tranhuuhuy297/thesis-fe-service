<template>
  <div class="height-20 bg-bg-1 d-flex justify-space-between pa-2 px-8 scroll">
    <div class="d-flex align-center flex-grow-1">
      <div
        class="d-flex align-center rounded-lg bg-primary mr-4 pointer"
        @click="navigateTo({ path: '/' })"
      >
        <img
          src="~/assets/image/logo.png"
          width="56"
          height="56"
          alt="prompt builder"
        />
        <div class="mr-4 text-h5 text-text-1 font-weight-bold">
          PromptBuilder
        </div>
      </div>
      <v-text-field
        v-model.trim="textSearch"
        variant="outlined"
        placeholder="Search AI Images"
        density="comfortable"
        hide-details
        prepend-inner-icon="mdi-magnify"
        :loading="isLoadingSearch"
        @keydown.enter="handleSearch"
      >
        <template #append-inner>
          <v-divider vertical class="mr-3"></v-divider>
          <v-btn
            prepend-icon="mdi-camera"
            variant="text"
            @click="navigateTo('/upload')"
          >
            Upload
          </v-btn>
        </template>
      </v-text-field>
    </div>
    <div class="d-flex align-center ml-16">
      <div
        class="mr-6 pointer pointer--link"
        @click="navigateTo({ path: '/builder' })"
      >
        Builder
      </div>
      <div
        class="mr-6 pointer pointer--link"
        @click="navigateTo({ path: '/stats' })"
      >
        Stats
      </div>
      <!-- <div
        class="mr-6 pointer pointer--link"
        @click="navigateTo({ path: '/resources' })"
      >
        Resources
      </div> -->
      <div
        class="pointer pointer--link"
        @click="navigateTo({ path: '/generator' })"
      >
        Generator
      </div>
      <v-divider vertical class="mx-5 my-1"></v-divider>
      <v-btn
        v-if="!token"
        class="font-weight-bold text-text-1 rounded-lg"
        size="large"
        text="Log In"
        color="primary"
        variant="flat"
        @click="navigateTo({ path: '/login' })"
      >
      </v-btn>
      <v-menu v-if="token">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="tonal"
            color="info"
            size="large"
            class="text-none font-weight-bold"
            :text="`@${userStore.username}`"
          >
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in [
              {
                name: 'Profile',
                icon: 'mdi-face-man-profile',
                navigateTo: '/profile',
              },
              {
                name: 'Statistic',
                icon: 'mdi-chart-line',
                navigateTo: '/user-statistics',
              },
              {
                name: 'Log Out',
                icon: 'mdi-logout-variant',
                navigateTo: '/logout',
              },
            ]"
            :key="index"
            :value="index"
            @click="handleAction(item)"
          >
            <div>
              <v-icon :icon="item.icon" class="mr-2"></v-icon> {{ item.name }}
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
  <v-dialog
    v-model.trim="isShowProfile"
    width="auto"
    min-width="400px"
    persistent
  >
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-info">User Profile</span>
        </div>
        <div>Update your information</div>
        <div class="mt-4">
          <v-text-field
            :model-value="userStore.username"
            variant="outlined"
            label="Username"
            bg-color="bg-1"
          ></v-text-field>
          <v-text-field
            :model-value="userStore.gmail"
            variant="outlined"
            label="Email"
            readonly
            bg-color="bg-3"
          ></v-text-field>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowProfile = false">Cancel</v-btn>
        <v-btn variant="flat" color="info" @click="handleUpdateProfile">
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { usePromptStore } from "~/stores/Prompt";
import { useUserStore } from "~/stores/User";

const userStore = useUserStore();

const textSearch = ref("");
const token = ref("");

const route = useRoute();

onMounted(() => {
  textSearch.value = route?.query?.textSearch;
  token.value = getCookie("token");
});

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/prompt`;
const promptStore = usePromptStore();

const isLoadingSearch = ref(false);

async function handleSearch() {
  promptStore.setNewestListPrompt([]);
  if (textSearch.value) {
    isLoadingSearch.value = true;
    const { data } = await useLazyFetch(`${baseURL}`, {
      method: "GET",
      query: {
        page: 0,
        size: 30,
        search: textSearch.value,
      },
    });
    isLoadingSearch.value = false;
    if (!data.value) return;
    const { result, code, msg } = data.value;
    if (code === CODE_SUCCESS) {
      const validPrompt = result.filter((prompt) => {
        return prompt.image_src;
      });
      promptStore.setNewestListPrompt(validPrompt);
    }
    navigateTo({ path: "/stats", query: { textSearch: textSearch.value } });
  }
}

function handleAction(item) {
  if (item.navigateTo === "/logout") {
    document.cookie = "token=;";
    document.cookie = "exp=;";
    setTimeout(() => {
      navigateTo("/login");
    }, 200);
  } else if (item.navigateTo === "/profile") {
    isShowProfile.value = true;
  } else {
    navigateTo(item.navigateTo);
  }
}

const isShowProfile = ref(false);
async function handleUpdateProfile() {}
</script>

<style scoped>
.scroll {
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 999;
}
</style>
