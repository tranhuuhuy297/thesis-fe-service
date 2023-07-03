<template>
  <div class="d-flex justify-end">
    <div style="width: 70%"></div>
    <v-autocomplete
      v-model.trim="styleName"
      :items="styleStore.listNameStyle"
      variant="outlined"
      density="compact"
      hide-details
      bg-color="bg-1"
      @update:modelValue="handleGetListBuilderValue(styleName)"
    ></v-autocomplete>
  </div>
  <div class="d-flex flex-wrap mt-2">
    <div
      v-for="(image, index) in styleStore.listBuilderValue[styleName]"
      :key="index"
      class="pa-2 pointer w-25 img"
      @click="
        isShowWeight = true;
        styleSelected = image;
      "
    >
      <v-img :src="`${image.image_src}`" cover></v-img>
      <div class="bg-bg-1 pa-1" style="border-radius: 0 0 5px 5px">
        {{ image?.name }}
      </div>
    </div>
  </div>
  <v-dialog v-model.trim="isShowWeight" persistent width="auto">
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Weight</span>
        </div>
        <div class="d-flex align-center">
          <div>{{ styleSelected?.name }}</div>
          <span class="font-weight-bold mx-2">::</span>
          <v-text-field
            v-model.trim="styleWeight"
            variant="outlined"
            hide-details
            density="compact"
            @keydown.prevent.enter="handleAddWeight"
          ></v-text-field>
        </div>
        <div class="d-flex align-center mt-4">
          <v-img
            :src="`${styleSelected?.image_src}`"
            width="350"
            height="350"
          ></v-img>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowWeight = false">Cancel</v-btn>
        <v-btn variant="flat" color="info" @click="handleAddWeight">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useStyleStore } from "~/stores/Style";
const styleStore = useStyleStore();

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const styleName = ref("Artists");

onMounted(() => {
  nextTick(() => {
    handleGetListStyle();
    handleGetListBuilderValue(styleName.value);
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
  if (!data.value) return;
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
      builder_type: builderType,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    styleStore.setListBuilderValue(builderType, result);
  }
}

const listStyle = ref([]);
const styleSelected = ref("");
const styleWeight = ref(1);
const isShowWeight = ref(false);

function handleAddWeight() {
  listStyle.value.push({
    name: styleSelected.value?.name,
    weight: styleWeight.value,
  });
  isShowWeight.value = false;
  styleWeight.value = 1;
}

const emit = defineEmits(["updateStyle"]);
watch(
  () => listStyle.value,
  () => {
    emit(
      "updateStyle",
      listStyle.value.filter((item) => item.value != "")
    );
  },
  { deep: true }
);
</script>
