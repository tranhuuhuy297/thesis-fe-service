<template>
  <div
    v-for="(item, index) in paramStore.listNameParam"
    :key="index"
    class="d-flex align-center mb-1"
  >
    <div
      style="width: 40%; border: 1px solid black"
      class="d-flex justify-space-between pa-2 bg-bg-1"
    >
      {{ item }}
      <span class="font-weight-bold">
        {{ paramStore.listShortName[item] }}
      </span>
    </div>
    <v-divider class="mx-2" vertical></v-divider>
    <div style="width: 30%">
      <v-select
        v-model="listParam[paramStore.listShortName[item]]"
        v-if="yesNoSelectList.includes(item)"
        :items="['yes', 'no']"
        density="compact"
        variant="outlined"
        bg-color="bg-1"
        hide-details
      ></v-select>
      <v-text-field
        v-model="listParam[paramStore.listShortName[item]]"
        v-else-if="!yesNoSelectList.includes(item) && item !== 'Version'"
        variant="outlined"
        bg-color="bg-1"
        density="compact"
        hide-details
      ></v-text-field>
      <v-select
        v-model="listParam[paramStore.listShortName[item]]"
        v-else-if="item === 'Version'"
        :items="['5', '4', '5', '2', '1']"
        density="compact"
        variant="outlined"
        bg-color="bg-1"
        hide-details
      >
      </v-select>
    </div>
  </div>
</template>

<script setup>
import { useParamStore } from "~/stores/Param";
const paramStore = useParamStore();

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const paramName = ref("");

const yesNoSelectList = ref(["Upbeta", "Tile", "Anime Style", "Light Upscale"]);

onMounted(() => {
  nextTick(() => {
    handleGetListParam();
  });
});

async function handleGetListParam() {
  const { data } = await useLazyFetch(`${baseURL}/builder_type`, {
    method: "GET",
    params: {
      page: 0,
      size: 100,
      parent_type: "Param",
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    paramStore.setListParam(result);
  }
}

async function handleGetListBuilderValue(builderType) {
  if (builderType in paramStore.listBuilderValue) return;
  const { data } = await useLazyFetch(`${baseURL}/builder_value`, {
    method: "GET",
    params: {
      page: 0,
      size: 1000,
      builder_type_name: builderType,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    paramStore.setListBuilderValue(builderType, result);
  }
}

const emit = defineEmits(["updateParam"]);
const listParam = ref({});

watch(
  () => listParam,
  () => {
    let paramPrompt = "";
    for (const param in listParam.value) {
      if (listParam.value[param] === "yes") {
        paramPrompt += `${param} `;
        continue;
      }
      if (listParam.value[param] === "no") {
        continue;
      }
      if (listParam.value[param]) {
        paramPrompt += `${param} ${listParam.value[param]} `;
      }
    }
    emit("updateParam", paramPrompt);
  },
  { deep: true }
);

defineExpose({ handleReset });
function handleReset() {
  listParam.value = [];
}
</script>
