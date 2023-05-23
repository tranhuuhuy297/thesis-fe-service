<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Builder</span>
  </div>
  <div class="mt-2 text-h6">Create best prompts with suggestions</div>
  <div class="mt-4 d-flex justify-center align-center px-10">
    <v-btn
      prepend-icon="mdi-reload"
      variant="outlined"
      color="error"
      size="large"
      text="Reset"
      @click="handleReset"
    />
    <div class="el-prompt pa-4 mx-2" style="word-wrap: break-word">
      {{ prompt }}
    </div>
    <v-btn
      variant="outlined"
      prepend-icon="mdi-content-copy"
      size="large"
      text="Copy"
      @click="handleCopy"
    />
  </div>
  <div
    class="mt-4 rounded-lg bg-bg-1 pa-2 d-flex"
    style="max-height: calc(100vh - 300px)"
  >
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'IMAGE_LINK' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'IMAGE_LINK' ? 'primary-2' : ''"
          text="Image link"
          prepend-icon="mdi-link-variant"
          @click="suggestButton = 'IMAGE_LINK'"
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
          :variant="suggestButton === 'TEXT' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'TEXT' ? 'primary-2' : ''"
          text="Text"
          prepend-icon="mdi-text"
          @click="suggestButton = 'TEXT'"
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
          :variant="suggestButton === 'STYLE' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'STYLE' ? 'primary-2' : ''"
          text="Style"
          prepend-icon="mdi-palette-outline"
          @click="suggestButton = 'STYLE'"
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
          <v-select
            v-model="style.name"
            :items="listKeyWordStyle"
            variant="outlined"
            density="compact"
            hide-details
            @update:modelValue="style.value = ''"
          ></v-select>
          <span v-if="keywordStyle[style.name]" class="mx-1">-</span>
          <v-select
            v-if="keywordStyle[style.name]"
            v-model="style.value"
            :items="keywordStyle[style.name]"
            variant="outlined"
            density="compact"
            hide-details
            bg-color="bg-2"
          ></v-select>
        </div>
      </div>
    </div>
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'PARAM' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'PARAM' ? 'primary-2' : ''"
          text="Param"
          prepend-icon="mdi-wrench-cog-outline"
          @click="suggestButton = 'PARAM'"
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
          <v-select
            v-model="param.name"
            :items="listKeyWordParam"
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
          </v-select>
          <span v-if="keywordParam[param.name]" class="mx-1">-</span>
          <div v-if="keywordParam[param.name]" style="min-width: 30%">
            <v-select
              v-if="keywordParam[param.name]?.listValue"
              v-model="param.value"
              :items="keywordParam[param.name]?.listValue"
              variant="outlined"
              density="compact"
              hide-details
              bg-color="bg-2"
            >
            </v-select>
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
  <div class="mt-4 rounded-lg bg-bg-1 pa-4 d-flex">
    <BuilderStyle v-if="suggestButton === 'STYLE'"></BuilderStyle>
    <BuilderParam v-if="suggestButton === 'PARAM'"></BuilderParam>
  </div>
</template>

<script setup>
const suggestButton = ref("STYLE");

const prompt = ref("");
function handleCopy() {
  navigator.clipboard.writeText(prompt.value);
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
const keywordStyle = {
  Layouts: ["Album Cover", "Anatomical Drawing"],
  Textures: ["3d Fractals", "Agate"],
  Colors: ["Apricot Color", "Aqua Colors"],
  Artist: ["Adrian Donoghue", "Adrian Tomine"],
  Camera: ["100mm", "14mm"],
  Era: ["1100s", "1200s"],
  Themes: ["Academicism", "Acid Pixie"],
  Styles: ["3d", "Abstract Art"],
  Techniques: ["16 Bit", "3d Printed"],
  Lighting: ["Backlighting", "Blacklight"],
  "Movies, Games": ["American Horror Story", "Animal Crossing"],
  Architecture: ["Afrocentric Interior Design", "Antebellum Architecture"],
  Fashion: ["Academia Outfit", "Androgynous Outfit"],
  Emojis: ["⏰", "☀️"],
  Characters: ["Absent Mindned Professor", "African"],
  Background: ["A stone Route To The Moon", "Airport"],
};
const listKeyWordStyle = computed(() => {
  return Object.keys(keywordStyle);
});
const styleTemplate = { name: "", value: "" };
const listStyle = ref([{ ...styleTemplate }]);
function handleAddStyle() {
  listStyle.value.push({ ...styleTemplate });
}

// Param
const keywordParam = {
  Version: { shortName: "--v", listValue: ["5", "4", "3", "2", "1"] },
  "Aspect Ratio": { shortName: "--ar", listValue: null, placeHolder: "16:9" },
  Chaos: { shortName: "--chaos", listValue: null, placeHolder: "0-100" },
  "Image Weight": { shortName: "--iw", listValue: null, placeHolder: "0.5-2" },
};
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
