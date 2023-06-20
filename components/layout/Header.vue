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
            icon="mdi-camera"
            variant="text"
            @click="navigateTo('/upload')"
          >
          </v-btn>
        </template>
      </v-text-field>
    </div>
    <div class="d-flex align-center ml-10">
      <div
        class="mr-6 pointer pointer--link"
        @click="navigateTo({ path: '/builder' })"
      >
        Builder
      </div>
      <!-- <div
        class="mr-6 pointer pointer--link"
        @click="navigateTo({ path: '/resources' })"
      >
        Resources
      </div> -->
      <div
        class="pointer mr-6 pointer--link"
        @click="navigateTo({ path: '/generator' })"
      >
        Generator
      </div>
      <div
        class="pointer pointer--link"
        @click="navigateTo({ path: '/feeds' })"
      >
        Feeds
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
            v-model="username"
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
        <v-btn
          variant="flat"
          color="info"
          :loading="isLoadingUpdate"
          @click="handleUpdateProfile"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useImageStore } from "~/stores/Image";
import { useUserStore } from "~/stores/User";

const imageStore = useImageStore();
const userStore = useUserStore();

const textSearch = ref("");
const token = ref("");

const route = useRoute();

onMounted(() => {
  textSearch.value = route?.query?.textSearch;
  token.value = getCookie("token");
});

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const isLoadingSearch = ref(false);

function handleSearch() {
  navigateTo({ path: "/feeds", query: { textSearch: textSearch.value } });
  handleGetListSemanticImage();
}

function logout() {
  document.cookie = "token=;";
  document.cookie = "expire=;";
  setTimeout(() => {
    navigateTo("/login");
  }, 200);
}

function handleAction(item) {
  if (item.navigateTo === "/logout") {
    logout();
  } else if (item.navigateTo === "/profile") {
    isShowProfile.value = true;
  } else {
    navigateTo(item.navigateTo);
  }
}

const isShowProfile = ref(false);
const isLoadingUpdate = ref(false);
const username = ref(`${userStore.username}`);
async function handleUpdateProfile() {
  isLoadingUpdate.value = true;
  const { data } = await useFetch(`${baseURL}/user/${userStore.id}`, {
    method: "PUT",
    body: {
      username: username.value,
    },
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  isLoadingUpdate.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Update profile successfully!");
    setTimeout(() => {
      logout();
    }, 500);
  }
}

async function handleGetListSemanticImage() {
  const { data } = await useFetch(`${baseURL}/image/search/semantic-search`, {
    method: "GET",
    query: {
      query: textSearch.value,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    imageStore.setListImages(result.map((item) => item.metadata));
  }
}
</script>

<style scoped>
.scroll {
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 999;
}
</style>
