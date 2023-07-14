<template>
  <div
    class="d-flex"
    v-for="(builderType, index) in styleStore.listBuilderType"
    :key="index"
  >
    <v-btn
      :text="builderType.name"
      :variant="
        selectedBuilderType?.name === builderType.name ? 'elevated' : 'outlined'
      "
      :color="selectedBuilderType?.name === builderType.name ? 'info' : ''"
      @click="selectedBuilderType = builderType"
    >
    </v-btn>
  </div>
  <div v-if="selectedBuilderType" class="d-flex flex-wrap mt-4">
    <div
      v-for="(image, index) in styleStore.listBuilderValue[selectedBuilderType]"
      :key="`builder_value_${index}`"
      class="pointer w-25 img"
      @click="
        isShowWeight = true;
        selectedValue = image;
      "
    >
      <v-img :src="`${image?.image_src}`" cover></v-img>
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
          <div>{{ selectedValue?.name }}</div>
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
            :src="`${selectedValue?.image_src}`"
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

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const styleStore = useStyleStore();

const selectedBuilderType = ref(null);

const isLoadingGetListBuilderType = ref(false);
async function handleGetListBuilderType() {
  if (styleStore.listBuilderType.length > 0) {
    return;
  }
  isLoadingGetListBuilderType.value = true;
  const { data } = await useFetch(`${baseURL}/builder_type`, {
    method: "GET",
    params: {
      page: 0,
      size: 100,
    },
  });
  isLoadingGetListBuilderType.value = false;
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    styleStore.setListBuilderType(result);
  }
}

watch(
  () => selectedBuilderType.value,
  () => {
    handleGetListBuilderValue();
  }
);

async function handleGetListBuilderValue() {
  const { data } = await useFetch(`${baseURL}/builder_value`, {
    method: "GET",
    params: {
      page: 0,
      size: 100,
      builder_type_id: selectedBuilderType.value?.id,
    },
  });
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    styleStore.setListBuilderValue(selectedBuilderType.value, result);
  }
}

onMounted(() => {
  nextTick(() => {
    handleGetListBuilderType();
  });
});

const isShowWeight = ref(false);
const selectedValue = ref(null);

const listStyle = ref([]);
const styleWeight = ref(1);

function handleAddWeight() {
  listStyle.value.push({
    name: selectedValue.value?.name,
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
