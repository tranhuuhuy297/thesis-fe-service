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
        <div class="d-flex justify-space-between mt-4">
          <v-btn
            color="primary"
            text="Reset"
            @click="handleReset"
            class="text-none text-text-1"
            variant="flat"
            prepend-icon="mdi-reload"
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
              class="text-none text-text-1"
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
          bg-color="bg-1"
          :loading="isLoadingSearch"
          clearable
          @keydown.prevent.enter="handleSearchSemantic"
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
            v-for="(prompt, index) in semanticSearchResult"
            :key="`semantic_${index}`"
            style="border: 1px solid black; margin-bottom: 1px"
            class="pa-1 prompt pointer"
            @click="handleCopySuggestion(prompt)"
          >
            {{ prompt }}
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
      <div class="mt-4">
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
  useNuxtApp().$toast.warning("Reset created prompt!");
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
    if (param.listValue) {
      if (param.value === "no" || param.value === "") continue;
      else {
        paramPrompt.value += `${param.shortName} `;
        continue;
      }
    }
    if (param.value !== "") {
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
  const { data } = await useFetch(`${baseURL}/prompt/search/semantic-search`, {
    method: "GET",
    params: {
      query: semanticSearch.value,
    },
  });
  isLoadingSearch.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  semanticSearchResult.value = result.map((item) => item["metadata"]["prompt"]);
}

function handleCopySuggestion(prompt) {
  parentType.value = "Text";
  builderText.value?.handleCopySuggestion(prompt);
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
      negative_prompt: "",
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
</script>

<style scoped>
.prompt:hover {
  background-color: #34cc7b !important;
}

.none {
  display: none !important;
}
</style>
