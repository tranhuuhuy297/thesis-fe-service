<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Builder</span>
  </div>
  <div class="mt-2 text-h6">Create best prompts with suggestions</div>
  <div class="mt-4 d-flex justify-center align-center flex-column px-10">
    <div class="el-prompt pa-4 mx-2" style="word-wrap: break-word">
      <span v-if="prompt">{{ prompt }}</span>
      <span v-else class="text-bg-3 font-italic">
        Your builder prompt will be right here
      </span>
    </div>
    <div class="d-flex mt-2">
      <v-btn
        prepend-icon="mdi-reload"
        color="error"
        text="Reset"
        @click="handleReset"
        class="mr-2"
      />
      <v-btn
        color="success"
        prepend-icon="mdi-content-copy"
        text="Copy"
        @click="handleCopy"
      />
    </div>
  </div>
  <div
    class="mt-4 rounded-lg bg-bg-1 pa-2 d-flex"
    style="max-height: calc(100vh - 300px)"
  >
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'ImageLink' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'ImageLink' ? 'primary-2' : ''"
          text="Image link"
          prepend-icon="mdi-link-variant"
          @click="suggestButton = 'ImageLink'"
        ></v-btn>
        <v-btn
          variant="flat"
          size="small"
          color="info"
          icon="mdi-plus"
          @click="handleAddImageLink"
        >
        </v-btn>
      </div>
      <div class="mt-4 el-list">
        <div
          v-for="(imageLink, index) in listImageLink"
          :key="`image_link_${index}`"
          class="mb-1"
        >
          <v-text-field
            v-model.trim="imageLink.value"
            density="compact"
            variant="outlined"
            hide-details
            placeholder="Type image link here"
            bg-color="bg-2"
          >
          </v-text-field>
          <img v-if="imageLink.value" :src="imageLink.value" class="w-50" />
        </div>
      </div>
    </div>
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'Text' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'Text' ? 'primary-2' : ''"
          text="Text"
          prepend-icon="mdi-text"
          @click="suggestButton = 'Text'"
        ></v-btn>
        <v-btn
          variant="flat"
          size="small"
          color="info"
          icon="mdi-plus"
          @click="handleAddText"
        >
        </v-btn>
      </div>
      <div class="mt-4 el-list">
        <div
          v-for="(text, index) in listText"
          :key="`image_link_${index}`"
          class="mb-1"
        >
          <v-text-field
            v-model.trim="text.value"
            density="compact"
            variant="outlined"
            hide-details
            placeholder="Type description here"
            bg-color="bg-2"
          >
          </v-text-field>
        </div>
      </div>
    </div>
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'Style' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'Style' ? 'primary-2' : ''"
          text="Style"
          prepend-icon="mdi-palette-outline"
          @click="suggestButton = 'Style'"
        ></v-btn>
        <v-btn
          variant="flat"
          size="small"
          color="info"
          icon="mdi-plus"
          @click="handleAddStyle"
        >
        </v-btn>
      </div>
      <div class="mt-4 el-list">
        <div
          v-for="(style, index) in listStyle"
          :key="`image_link_${index}`"
          class="mb-1 d-flex align-center"
        >
          <v-autocomplete
            v-model="style.name"
            :items="styleStore?.getNameListStyle"
            variant="outlined"
            density="compact"
            hide-details
            @update:modelValue="
              style.value = '';
              handleGetListBuilderValue(style.name);
            "
          ></v-autocomplete>
          <span v-if="styleStore?.listBuilderValue[style.name]" class="mx-1">
            -
          </span>
          <v-autocomplete
            v-if="styleStore?.listBuilderValue[style.name]"
            v-model="style.value"
            :items="
              styleStore?.listBuilderValue[style.name]
                .map((item) => item.name)
                .sort()
            "
            variant="outlined"
            density="compact"
            hide-details
            bg-color="bg-2"
          ></v-autocomplete>
        </div>
      </div>
    </div>
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'Param' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'Param' ? 'primary-2' : ''"
          text="Param"
          prepend-icon="mdi-wrench-cog-outline"
          @click="suggestButton = 'Param'"
        ></v-btn>
        <v-btn
          variant="flat"
          size="small"
          color="info"
          icon="mdi-plus"
          @click="handleAddParam"
        >
        </v-btn>
      </div>
      <div class="mt-4 el-list">
        <div
          v-for="(param, index) in listParam"
          :key="`image_link_${index}`"
          class="mb-1 d-flex align-center"
        >
          <v-autocomplete
            v-model="param.name"
            :items="paramStore?.getNameListParam"
            variant="outlined"
            density="compact"
            hide-details
            @update:modelValue="param.value = ''"
          >
            <template v-slot:selection="{ item }">
              <span>{{ item.title }}</span>
              <span>&nbsp;</span>
              <span class="text-text-2">
                {{ keywordParam[param.name]?.shortName }}
              </span>
            </template>
          </v-autocomplete>
          <span v-if="keywordParam[param.name]" class="mx-1">-</span>
          <div v-if="keywordParam[param.name]" style="min-width: 30%">
            <v-autocomplete
              v-if="keywordParam[param.name]?.listValue"
              v-model="param.value"
              :items="keywordParam[param.name]?.listValue"
              variant="outlined"
              density="compact"
              hide-details
              bg-color="bg-2"
            >
            </v-autocomplete>
            <v-text-field
              v-else
              v-model.trim="param.value"
              density="compact"
              variant="outlined"
              hide-details
              bg-color="bg-2"
              :placeholder="keywordParam[param.name]?.placeHolder"
            >
            </v-text-field>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-2 rounded-lg bg-bg-1 pa-4">
    <BuilderText v-if="suggestButton === 'Text'"></BuilderText>
    <BuilderStyle v-if="suggestButton === 'Style'"></BuilderStyle>
    <BuilderParam v-if="suggestButton === 'Param'"></BuilderParam>
  </div>
</template>

<script setup>
import { useStyleStore } from "~/stores/Style";
const styleStore = useStyleStore();
import { useParamStore } from "~/stores/Param";
const paramStore = useParamStore();

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

onMounted(() => {
  nextTick(() => {
    handleGetListStyle();
    handleGetListParam();
  });
});

async function handleGetListStyle() {
  const { data } = await useLazyFetch(`${baseURL}/builder_type`, {
    method: "GET",
    params: {
      page: 0,
      size: 100,
      parent_type: "Style",
    },
  });
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    styleStore.setListStyle(result);
  }
}

async function handleGetListBuilderValue(builderType) {
  if (builderType in styleStore.listBuilderValue) return;
  const { data } = await useLazyFetch(`${baseURL}/builder_value`, {
    method: "GET",
    params: {
      page: 0,
      size: 1000,
      builder_type_name: builderType,
    },
  });
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    styleStore.setListBuilderValue(builderType, result);
  }
}

async function handleGetListParam() {
  const { data } = await useLazyFetch(`${baseURL}/builder_type`, {
    method: "GET",
    params: {
      page: 0,
      size: 100,
      parent_type: "Param",
    },
  });
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    paramStore.setListParam(result);
  }
}

const suggestButton = ref("Style");

const prompt = ref("");
function handleCopy() {
  navigator.clipboard.writeText(prompt.value);
  useNuxtApp().$toast.success("Copy to clipboard!");
}
function handleReset() {
  listImageLink.value = [{ ...imageLinkTemplate }];
  listText.value = [{ ...textTemplate }];
  listStyle.value = [{ ...styleTemplate }];
  listParam.value = [{ ...paramTemplate }];
}

// image link
const imageLinkTemplate = { value: "" };
const listImageLink = ref([{ ...imageLinkTemplate }]);
function handleAddImageLink() {
  listImageLink.value.push({ ...imageLinkTemplate });
}

// text
const textTemplate = { value: "", weight: "" };
const listText = ref([{ ...textTemplate }]);
function handleAddText() {
  listText.value.push({ ...textTemplate });
}

// style
const keywordStyle = {};
const listKeyWordStyle = computed(() => {
  return Object.keys(keywordStyle);
});
const styleTemplate = { name: "", value: "" };
const listStyle = ref([{ ...styleTemplate }]);
function handleAddStyle() {
  listStyle.value.push({ ...styleTemplate });
}

// Param
const keywordParam = {};
const listKeyWordParam = computed(() => {
  return Object.keys(keywordParam);
});
const paramTemplate = { name: "", value: "" };
const listParam = ref([{ ...paramTemplate }]);
function handleAddParam() {
  listParam.value.push({ ...paramTemplate });
}

// computed prompt
const computedPrompt = computed(() => {
  let tempPrompt = [];
  // Image link
  for (const imageLink of listImageLink.value) {
    if (imageLink.value) {
      tempPrompt.push(imageLink.value);
    }
  }
  // Text
  for (const textPrompt of listText.value) {
    if (textPrompt.value) {
      tempPrompt.push(textPrompt.value);
    }
  }
  for (const style of listStyle.value) {
    if (style.name && style.value) {
      tempPrompt.push(style.value);
    }
  }
  let paramPrompt = [];
  for (const param of listParam.value) {
    if (param.name && param.value) {
      paramPrompt.push(
        `${keywordParam[param.name]["shortName"]} ${param.value}`
      );
    }
  }
  return tempPrompt.join(", ") + paramPrompt.join(" ");
});
watch(computedPrompt, (newVal) => {
  prompt.value = newVal;
});
</script>

<style scoped>
.el-prompt {
  border: 1px solid black;
  height: 100%;
  overflow: hidden;
}
.el-list {
  max-height: calc(100vh - 400px);
  overflow-y: scroll;
}
</style>
