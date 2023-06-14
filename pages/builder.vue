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
        <div class="flex-grow-1">
          <span class="font-italic text-text-2 mr-2">/imagine </span>
          <span style="word-wrap: break-word">{{ prompt }}</span>
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
          <v-btn
            prepend-icon="mdi-content-copy"
            color="success"
            text="Copy"
            class="text-none text-text-1"
            variant="flat"
            @click="handleCopy"
          ></v-btn>
        </div>
      </div>
      <div class="bg-bg-2 rounded-lg pa-4 mr-4 mt-4">
        <v-text-field
          v-model.trim="semanticSearch"
          prepend-inner-icon="mdi-text-search-variant"
          variant="outlined"
          density="compact"
          label="Semantic Search"
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
      <div class="mt-4">
        <BuilderImageLink
          v-if="parentType === 'Image_Link'"
          ref="builderImageLink"
          @update-image-link="updateImageLink"
        ></BuilderImageLink>
        <BuilderText
          v-if="parentType === 'Text'"
          ref="builderText"
          @update-text="updateText"
        ></BuilderText>
        <BuilderStyle
          v-if="parentType === 'Style'"
          @update-style="updateStyle"
        ></BuilderStyle>
        <BuilderParam
          v-if="parentType === 'Param'"
          ref="builderParam"
          @update-param="updateParam"
        ></BuilderParam>
      </div>
    </div>
  </div>
</template>

<script setup>
const imageLinkPrompt = ref("");
const textPrompt = ref("");
const stylePrompt = ref("");
const paramPrompt = ref("");

const prompt = computed(() => {
  return `${imageLinkPrompt.value} ${textPrompt.value} ${stylePrompt.value} ${paramPrompt.value}`;
});

function handleCopy() {
  navigator.clipboard.writeText(prompt.value);
  useNuxtApp().$toast.success("Copy to clipboard!");
}

const builderImageLink = ref();
const builderText = ref();
const builderParam = ref();
function handleReset() {
  imageLinkPrompt.value = "";
  textPrompt.value = "";
  stylePrompt.value = "";
  paramPrompt.value = "";
  builderImageLink.value?.handleReset();
  builderText.value?.handleReset();
  builderParam.value?.handleReset();
  useNuxtApp().$toast.warning("Reset created prompt!");
}

const parentType = ref("Style");

//image link
function updateImageLink(listImageLink) {
  imageLinkPrompt.value = "";
  for (const imageLink of listImageLink) {
    imageLinkPrompt.value += `${imageLink}, `;
  }
}

//text
function updateText(listText) {
  textPrompt.value = "";
  for (const text of listText) {
    if (text.negative) textPrompt.value += `--no ${text.value}, `;
    else {
      if (text.weight.toString() === "1" || !text.weight)
        textPrompt.value += `${text.value}, `;
      else textPrompt.value += `${text.value}::${text.weight}, `;
    }
  }
}

//style
function updateStyle(listStyle) {
  stylePrompt.value = "";
  for (const style of listStyle) {
    if (style.weight.toString() === "1") stylePrompt.value += `${style.name}, `;
    else stylePrompt.value += `${style.name}::${style.weight}, `;
  }
}

//param
function updateParam(listParam) {
  paramPrompt.value = listParam;
}

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;
const semanticSearch = ref("");
const isLoadingSearch = ref(false);
const semanticSearchResult = ref([]);
async function handleSearchSemantic() {
  isLoadingSearch.value = true;
  semanticSearchResult.value = [];
  const { data } = await useFetch(`${baseURL}/semantic-search`, {
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
  navigator.clipboard.writeText(prompt);
  useNuxtApp().$toast.success("Copy to clipboard!");
}
</script>

<style scoped>
.prompt:hover {
  background-color: #34cc7b !important;
}
</style>
