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
        v-model="textSearch"
        variant="outlined"
        density="comfortable"
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search AI images"
        @keydown.enter="handleSearch"
      >
      </v-text-field>
    </div>
    <div class="d-flex align-center ml-16">
      <div
        class="mr-8 pointer pointer--link"
        @click="navigateTo({ path: '/builder' })"
      >
        Builder
      </div>
      <div
        class="mr-8 pointer pointer--link"
        @click="navigateTo({ path: '/stats' })"
      >
        Stats
      </div>
      <div
        class="mr-8 pointer pointer--link"
        @click="navigateTo({ path: '/resources' })"
      >
        Resources
      </div>
      <div
        class="mr-6 pointer pointer--link"
        @click="navigateTo({ path: '/generator' })"
      >
        Generator
      </div>
      <v-btn
        v-if="token === undefined || token === 'undefined'"
        class="mr-2 font-weight-bold text-text-1 rounded-lg"
        size="large"
        text="Log In"
        color="primary"
        variant="outlined"
        @click="navigateTo({ path: '/login' })"
      >
      </v-btn>
      <v-btn
        v-else
        variant="outlined"
        class="mr-2 font-weight-bold text-text-1"
        color="primary"
        text="Log out"
        size="large"
        @click="handleLogOut"
      />
      <v-btn
        variant="flat"
        class="font-weight-bold text-text-1 rounded-lg"
        text="Upload"
        size="large"
        prepend-icon="mdi-upload"
        color="primary"
      ></v-btn>
    </div>
  </div>
</template>

<script setup>
import { usePromptStore } from "~/stores/Prompt";

const token = ref(null);
const textSearch = ref("");

const route = useRoute();

onMounted(() => {
  textSearch.value = route?.query?.textSearch;
});

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/prompt`;
const promptStore = usePromptStore();
async function handleSearch() {
  if (textSearch.value) {
    const { data, pending } = await useLazyFetch(`${baseURL}`, {
      method: "GET",
      query: {
        page: 0,
        size: 30,
        search: textSearch.value,
      },
    });
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
onMounted(() => {
  token.value = window?.localStorage.getItem("thesis-token");
});

function handleLogOut() {
  window?.localStorage.setItem("thesis-token", undefined);
  token.value = "";
  navigateTo({ path: "/login" });
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
