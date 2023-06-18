<template>
  <div v-for="(param, index) in listParam" :key="`param_${index}`" class="my-2">
    <v-text-field
      v-model="param.value"
      v-if="!param.listValue"
      variant="outlined"
      hide-details
      density="compact"
      :bg-color="param.value ? 'primary' : 'white'"
      :placeholder="param.min !== undefined ? `${param.min}-${param.max}` : ''"
      :label="`${param.name} ${param.shortName}`"
    ></v-text-field>
    <v-select
      v-else
      v-model="param.value"
      :items="param.listValue"
      variant="outlined"
      density="compact"
      hide-details
      :bg-color="param.value ? 'primary' : 'white'"
      :label="`${param.name} ${param.shortName}`"
    ></v-select>
  </div>
</template>

<script setup>
const listParam = ref([
  {
    name: "Anime Style",
    value: "",
    shortName: "--niji",
    listValue: ["yes", "no"],
  },
  {
    name: "Tile",
    value: "",
    value: "",
    shortName: "--tile",
    listValue: ["yes", "no"],
  },
  { name: "Aspect Ratio", value: "", shortName: "--ar" },
  { name: "Chaos", value: "", shortName: "--chaos", min: 0, max: 100 },
  { name: "Image Weight", value: "", shortName: "--iw", min: 0, max: 2 },
  { name: "Quality", value: "", shortName: "--q", min: 0.25, max: 1 },
  { name: "Repeat", value: "", shortName: "--r", min: 0, max: 40 },
  { name: "Seed", value: "", shortName: "--seed", min: 0, max: 4294967295 },
  { name: "Stop", value: "", shortName: "--stop", min: 10, max: 100 },
  { name: "Stylize", value: "", shortName: "--s", min: 0, max: 1000 },
]);

const emit = defineEmits(["updateParam"]);

watch(
  () => listParam,
  () => {
    emit("updateParam", listParam);
  },
  { deep: true }
);

defineExpose({ handleReset });
function handleReset() {
  for (const param of listParam.value) {
    param.value = "";
  }
}
</script>
