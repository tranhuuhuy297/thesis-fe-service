<template>
  <div class="d-flex justify-space-between align-center px-2">
    <div class="text-h5 font-weight-bold text-text-2 w-100">Style</div>
    <v-autocomplete
      v-model="styleName"
      :items="styleStore?.getNameListStyle"
      variant="outlined"
      density="compact"
      hide-details
      @update:modelValue="handleGetListBuilderValue(styleName)"
      style="width: 500px"
    ></v-autocomplete>
  </div>
  <div class="mt-4 ml-2 d-flex">
    <div class="w-25 mr-2">
      <div
        v-for="(image, index) in listImageBuilderValue0"
        :key="`${index}_image_col0`"
      >
        <BuilderImage :builder-value="image" />
      </div>
    </div>
    <div class="w-25 mr-2">
      <div
        v-for="(image, index) in listImageBuilderValue1"
        :key="`${index}_image_col1`"
      >
        <BuilderImage :builder-value="image" />
      </div>
    </div>
    <div class="w-25 mr-2">
      <div
        v-for="(image, index) in listImageBuilderValue2"
        :key="`${index}_image_col2`"
      >
        <BuilderImage :builder-value="image" />
      </div>
    </div>
    <div class="w-25 mr-2">
      <div
        v-for="(image, index) in listImageBuilderValue3"
        :key="`${index}_image_col3`"
      >
        <BuilderImage :builder-value="image" />
      </div>
    </div>
  </div>
</template>

<script setup>
const styleName = ref("");

import { useStyleStore } from "~/stores/Style";
const styleStore = useStyleStore();

function getListImageBuilderValue(items, colNumber) {
  if (!items) return;
  return items.filter((image, index) => {
    if (index % 4 === colNumber) {
      return image;
    }
  });
}
function handleGetListImageByModule() {
  const listBuilderValue = styleStore.listBuilderValue[styleName.value];
  listImageBuilderValue0.value = getListImageBuilderValue(listBuilderValue, 0);
  listImageBuilderValue1.value = getListImageBuilderValue(listBuilderValue, 1);
  listImageBuilderValue2.value = getListImageBuilderValue(listBuilderValue, 2);
  listImageBuilderValue3.value = getListImageBuilderValue(listBuilderValue, 3);
}

const listImageBuilderValue0 = ref([]);
const listImageBuilderValue1 = ref([]);
const listImageBuilderValue2 = ref([]);
const listImageBuilderValue3 = ref([]);

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;
async function handleGetListBuilderValue(builderType) {
  if (builderType in styleStore.listBuilderValue) {
    handleGetListImageByModule();
    return;
  }
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
    styleStore.setListBuilderValue(builderType, result);
    handleGetListImageByModule();
  }
}
</script>
