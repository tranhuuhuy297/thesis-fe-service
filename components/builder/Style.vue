<template>
  <div class="d-flex flex-wrap">
    <div
      v-for="(style, index) in listStyleName"
      :key="`style_${index}`"
      class="pa-1"
    >
      <v-btn
        :variant="styleName === style.name ? 'elevated' : 'outlined'"
        :color="styleName === style.name ? 'info' : ''"
        :text="style.name"
        :prepend-icon="style.icon"
        size="small"
        class="text-none"
        @click="styleName = style.name"
      ></v-btn>
    </div>
  </div>
  <v-divider class="my-4"></v-divider>
  <div v-if="styleName">
    <div class="d-flex align-center">
      <div class="w-50"></div>
      <v-select
        v-if="styleStore.listBuilderValue[styleName]"
        v-model="selectedBuilderType"
        variant="outlined"
        density="compact"
        hide-details
        :items="Object.keys(styleStore.listBuilderValue[styleName]).sort()"
      ></v-select>
      <div v-else class="d-flex justify-center">
        <v-progress-circular indeterminate color="success">
        </v-progress-circular>
      </div>
    </div>
    <div v-if="selectedBuilderType" class="d-flex flex-wrap">
      <div
        v-for="(image, index) in styleStore.listBuilderValue[styleName][
          selectedBuilderType
        ]"
        :key="`builder_value_${index}`"
        class="pa-2 pointer w-25 img"
        @click="
          isShowWeight = true;
          styleSelected = image;
        "
      >
        <v-img :src="`${image?.image_src}`" cover></v-img>
        <div class="bg-bg-1 pa-1" style="border-radius: 0 0 5px 5px">
          {{ image?.name }}
        </div>
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

const listStyleName = ref([
  { name: "Artists", icon: "mdi-brush-outline" },
  { name: "Camera, Film And Lenses", icon: "mdi-camera-outline" },
  { name: "Colors", icon: "mdi-palette-outline" },
  { name: "Design Styles", icon: "mdi-pencil-ruler" },
  { name: "Digital", icon: "mdi-television" },
  { name: "Lighting", icon: "mdi-lightbulb-outline" },
  { name: "Themes", icon: "mdi-theme-light-dark" },
]);

onMounted(() => {
  nextTick(() => {
    handleGetListBuilderValue(styleName.value);
  });
});

watch(
  () => styleName.value,
  () => {
    selectedBuilderType.value = "";
    handleGetListBuilderValue(styleName.value);
  }
);

const selectedBuilderType = ref("");

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
