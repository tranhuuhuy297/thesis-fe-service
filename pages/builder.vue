<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Builder</span>
  </div>
  <div class="mt-2 text-h6">Create Midjourney prompt with suggestions</div>
  <div class="d-flex mt-8">
    <div style="width: 40%; height: 100%">
      <div
        style="height: 100%"
        class="bg-bg-2 rounded-lg pa-4 mr-4 d-flex flex-column"
      >
        <div class="flex-grow-1 pointer" @click="handleCopy">
          <span class="font-italic text-text-2 mr-2">/imagine </span>
          <span style="word-wrap: break-word">{{ prompt }}</span>
          <v-tooltip v-if="prompt" activator="parent" location="top">
            Copy
          </v-tooltip>
        </div>
        <div class="d-flex mt-4">
          <v-btn
            color="primary"
            text="Reset"
            class="text-none text-text-1 mr-2"
            variant="flat"
            prepend-icon="mdi-reload"
            @click="handleReset"
          ></v-btn>
          <div class="d-flex">
            <!-- <v-btn
              prepend-icon="mdi-content-copy"
              color="success"
              text="Copy"
              class="text-none text-text-1"
              variant="text"
              @click="handleCopy"
            ></v-btn> -->
            <v-btn
              prepend-icon="mdi-hammer"
              color="success"
              text="Generate"
              class="text-none"
              variant="flat"
              :loading="isLoadingGenerate"
              @click="handleGenerate"
            ></v-btn>
          </div>
        </div>
      </div>
      <div class="bg-bg-2 rounded-lg pa-4 mr-4 mt-4">
        <v-text-field
          v-model.trim="semanticSearch"
          prepend-inner-icon="mdi-text-search-variant"
          variant="outlined"
          density="compact"
          label="Suggestions"
          bg-color="white"
          :loading="isLoadingSearch"
          clearable
          @keydown.prevent.enter="handleSearchSemantic"
          @click:clear="semanticSearchResult = []"
        ></v-text-field>
        <div style="max-height: 45vh; overflow-y: scroll">
          <div class="d-flex justify-center">
            <v-progress-circular
              v-if="isLoadingSearch"
              indeterminate
              color="primary-2"
            ></v-progress-circular>
          </div>
          <div
            v-for="(image, index) in semanticSearchResult"
            :key="`semantic_${index}`"
            class="d-flex align-center"
          >
            <!-- <v-btn
              size="x-small"
              icon="mdi-eye"
              variant="text"
              @click="
                isShowImageSuggestion = true;
                selectedSuggestion = image;
              "
            ></v-btn> -->
            <div
              class="pa-1 prompt pointer ml-1 flex-grow-1"
              style="border: 1px solid black; margin-bottom: 1px"
              @click="
                isShowImageSuggestion = true;
                selectedSuggestion = image;
              "
            >
              {{ image["prompt"] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-bg-2 rounded-lg pa-4" style="width: 70%; height: 100%">
      <div class="d-flex justify-space-between align-center">
        <div>
          <v-btn
            :variant="parentType === 'Image_Link' ? 'elevated' : 'outlined'"
            :color="parentType === 'Image_Link' ? 'primary-2' : ''"
            text="Image Link"
            class="mr-1"
            prepend-icon="mdi-link-variant"
            @click="parentType = 'Image_Link'"
          ></v-btn>
          <v-btn
            :variant="parentType === 'Text' ? 'elevated' : 'outlined'"
            :color="parentType === 'Text' ? 'primary-2' : ''"
            text="Text"
            class="mr-1"
            prepend-icon="mdi-text"
            @click="parentType = 'Text'"
          ></v-btn>
          <v-btn
            :variant="parentType === 'Style' ? 'elevated' : 'outlined'"
            :color="parentType === 'Style' ? 'primary-2' : ''"
            text="Style"
            class="mr-1"
            prepend-icon="mdi-palette-outline"
            @click="parentType = 'Style'"
          ></v-btn>
          <v-btn
            :variant="parentType === 'Param' ? 'elevated' : 'outlined'"
            :color="parentType === 'Param' ? 'primary-2' : ''"
            text="Param"
            prepend-icon="mdi-wrench-cog-outline"
            @click="parentType = 'Param'"
          ></v-btn>
        </div>
        <div>
          <v-btn
            prepend-icon="mdi-reload"
            variant="flat"
            color="primary"
            text="Reset"
            class="text-none"
            @click="handleResetEachType"
          >
          </v-btn>
        </div>
      </div>
      <v-divider class="my-4"></v-divider>
      <div>
        <div :class="{ none: parentType !== 'Image_Link' }">
          <BuilderImageLink
            ref="builderImageLink"
            @update-image-link="updateImageLink"
          ></BuilderImageLink>
        </div>
        <div :class="{ none: parentType !== 'Text' }">
          <BuilderText
            ref="builderText"
            @update-text="updateText"
          ></BuilderText>
        </div>
        <div :class="{ none: parentType !== 'Style' }">
          <BuilderStyle
            ref="builderStyle"
            @update-style="updateStyle"
          ></BuilderStyle>
        </div>
        <div :class="{ none: parentType !== 'Param' }">
          <BuilderParam
            ref="builderParam"
            @update-param="updateParam"
          ></BuilderParam>
        </div>
      </div>
    </div>
  </div>
  <v-dialog v-model.trim="isShowImageSuggestion" width="auto">
    <v-card>
      <v-card-text class="mb-2">
        <div class="mt-4 d-flex w-100">
          <div class="bg-bg-1 rounded d-flex justify-center align-center pa-2">
            <v-img
              :src="`${selectedSuggestion.image_src}`"
              style="height: 75vh; width: auto"
              :lazy-src="`${selectedSuggestion.image_src}`"
            ></v-img>
          </div>
          <v-divider vertical class="mx-4"></v-divider>
          <div
            class="d-flex flex-column"
            style="max-width: 40vw; min-width: 30vw"
          >
            <span
              class="pointer--link pointer mb-2 text-success font-weight-bold"
              @click="
                navigateTo({ path: `/user/${selectedSuggestion.user_id}` })
              "
            >
              @{{ username }}
            </span>
            <div class="mb-4 bg-bg-1 rounded pa-2">
              {{ selectedSuggestion.prompt }}
            </div>
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center mr-2">
                <v-icon
                  icon="mdi-heart"
                  size="small"
                  color="primary-2"
                  class="mr-1"
                ></v-icon>
                <span style="font-size: 12px">{{ numberUpvote }}</span>
              </div>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex align-center">
              <v-btn
                prepend-icon="mdi-plus"
                color="success"
                text="Add"
                class="text-none text-text-1"
                variant="flat"
                size="large"
                @click="handleCopySuggestion(selectedSuggestion.prompt)"
              ></v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useUserStore } from "~/stores/User";

const userStore = useUserStore();

const imageLinkPrompt = ref("");
const textPrompt = ref("");
const stylePrompt = ref("");
const paramPrompt = ref("");

const prompt = computed(() => {
  return `${imageLinkPrompt.value} ${textPrompt.value} ${stylePrompt.value} ${paramPrompt.value}`.trim();
});

function handleCopy() {
  if (!prompt.value) return;
  navigator.clipboard.writeText(prompt.value);
  useNuxtApp().$toast.success("Copy to clipboard!");
}

const parentType = ref("Text");
const builderImageLink = ref();
const builderText = ref();
const builderParam = ref();

function handleResetEachType() {
  if (parentType.value === "Image_Link") {
    handleResetImageLink();
  } else if (parentType.value === "Text") {
    handleResetText();
  } else if (parentType.value === "Style") {
    handleResetStyle();
  } else if (parentType.value === "Param") {
    handleResetParam();
  }
}

function handleResetImageLink() {
  imageLinkPrompt.value = "";
  builderImageLink.value?.handleReset();
}

function handleResetText() {
  textPrompt.value = "";
  builderText.value?.handleReset();
}

function handleResetStyle() {
  stylePrompt.value = "";
}

function handleResetParam() {
  paramPrompt.value = "";
  builderParam.value?.handleReset();
}

function handleReset() {
  handleResetImageLink();
  handleResetText();
  handleResetStyle();
  handleResetParam();
  useNuxtApp().$toast.success("Reset created prompt!");
}

//image link
function updateImageLink(listImageLink) {
  imageLinkPrompt.value = "";
  const tempImageLink = [];
  for (const imageLink of listImageLink) {
    tempImageLink.push(`${imageLink}`);
  }
  imageLinkPrompt.value = tempImageLink.join(", ");
}

//text
function updateText(listText) {
  textPrompt.value = "";
  const tempListText = [];
  for (const text of listText) {
    if (text.weight.toString() === "1" || !text.weight)
      tempListText.push(`${text.value}`);
    else tempListText.push(`${text.value}::${text.weight}`);
  }
  textPrompt.value = tempListText.join(", ");
}

//style
function updateStyle(listStyle) {
  stylePrompt.value = "";
  const tempListStyle = [];
  for (const style of listStyle) {
    if (style.weight.toString() === "1") tempListStyle.push(`${style.name}`);
    else tempListStyle.push(`${style.name}::${style.weight}`);
  }
  stylePrompt.value = tempListStyle.join(", ");
}

//param
function updateParam(listParam) {
  paramPrompt.value = "";
  for (const param of listParam.value) {
    if (!param.value) continue;
    if (param.type === "true-false") {
      if (param.value === "no" || param.value === "") continue;
      else {
        paramPrompt.value += `${param.shortName} `;
        continue;
      }
    }
    if (param.type === "slide" || param.type === "select") {
      paramPrompt.value += `${param.shortName} ${param.value} `;
    }
  }
}

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;
const semanticSearch = ref("");
const isLoadingSearch = ref(false);
const semanticSearchResult = ref([]);

async function handleSearchSemantic() {
  if (semanticSearch.value === "") return;
  isLoadingSearch.value = true;
  semanticSearchResult.value = [];
  const { data } = await useFetch(`${baseURL}/image/search/semantic-search`, {
    method: "GET",
    query: {
      query: semanticSearch.value,
    },
  });
  isLoadingSearch.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  semanticSearchResult.value = result;
}

function handleCopySuggestion(prompt) {
  parentType.value = "Text";
  builderText.value?.handleCopySuggestion(prompt);
  isShowImageSuggestion.value = false;
}

const isLoadingGenerate = ref(false);
async function handleGenerate() {
  if (!userStore.id) {
    useNuxtApp().$toast.warning("You need to login!");
    return;
  }
  if (prompt.value.trim() === "") {
    useNuxtApp().$toast.warning("Empty prompt!");
    return;
  }
  isLoadingGenerate.value = true;
  const { data } = await useFetch(`${baseURL}/prompt`, {
    method: "POST",
    body: {
      user_id: userStore.id,
      prompt: prompt.value,
    },
    params: {
      user_id: userStore.id,
    },
    query: {
      generate_image: true,
    },
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  isLoadingGenerate.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success(
      "Your image will appear in Upload. Please wait!"
    );
  }
}

const isShowImageSuggestion = ref(false);
const selectedSuggestion = ref(null);

watch(
  () => isShowImageSuggestion.value,
  (val) => {
    if (val) {
      handleGetUser();
      handleGetListUpvote();
    }
  }
);

const username = ref("");
async function handleGetUser() {
  const { data } = await useFetch(
    `${baseURL}/user/${selectedSuggestion.value.user_id}`,
    {
      method: "GET",
    }
  );
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    username.value = result?.username;
  }
}

const numberUpvote = ref(0);

async function handleGetListUpvote() {
  const { data } = await useFetch(`${baseURL}/upvote`, {
    method: "GET",
    query: {
      image_id: selectedSuggestion.value.id,
    },
  });
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    numberUpvote.value = count;
  }
}
</script>

<style scoped>
.prompt:hover {
  background-color: #34cc7b !important;
}

.none {
  display: none !important;
}
</style>
