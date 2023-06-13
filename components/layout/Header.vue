<template>
  <div class="height-20 bg-bg-1 d-flex justify-space-between pa-2 px-8 scroll">
    <div class="d-flex align-center flex-grow-1 pointer">
      <div
        class="d-flex align-center rounded-lg bg-primary mr-4"
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
        label="Search AI Images"
        density="comfortable"
        hide-details
        prepend-inner-icon="mdi-magnify"
        :loading="isLoadingSearch"
        @keydown.enter="handleSearch"
      >
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
      <v-divider vertical class="mx-6 my-1"></v-divider>
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
            variant="text"
            color="success"
            size="large"
            class="text-none font-weight-bold"
            :text="userStore.username"
            prepend-icon="mdi-account-arrow-down-outline"
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
                name: 'Log Out',
                icon: 'mdi-logout-variant',
                navigateTo: '/logout',
              },
            ]"
            :key="index"
            :value="index"
          >
            <div @click="handleAction(item)">
              <v-icon :icon="item.icon" class="mr-2"></v-icon> {{ item.name }}
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
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
  } else {
    navigateTo(item.navigateTo);
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
