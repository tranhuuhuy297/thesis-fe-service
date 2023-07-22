<template>
  <div v-for="(param, index) in listParam" :key="`param_${index}`" class="mr-2">
    <div class="d-flex align-center mb-2">
      <div
        class="pa-2 mr-4 bg-bg-1 d-flex align-center justify-space-between"
        style="border: 1px solid black; width: 80%"
        :class="{ 'bg-bg-3': param.value }"
      >
        <span>{{ param.name }}</span>
        <span style="font-size: 12px" class="text-text-2">{{
          param.guide
        }}</span>
      </div>
      <div style="width: 20%">
        <div v-if="param.type === 'true-false'" class="d-flex align-center">
          <v-radio-group v-model="param.value" inline hide-details>
            <v-radio
              v-for="(value, idx) in param.listValue"
              :key="idx"
              :label="value"
              :value="value"
            ></v-radio>
          </v-radio-group>
        </div>
        <div v-if="param.type === 'select'">
          <v-select
            v-model="param.value"
            hide-details
            variant="outlined"
            density="compact"
            :items="param['listValue']"
            bg-color="bg-1"
          ></v-select>
        </div>
        <div v-if="param.type === 'slide'" class="d-flex align-center">
          <v-slider
            v-model="param.value"
            hide-details
            color="info"
            density="compact"
            :min="param.min"
            :max="param.max"
            :step="param.step"
            thumb-size="12px"
            :thumb-label="param.value ? 'always' : ''"
          ></v-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const listParam = ref([
  {
    name: "Anime Style",
    value: "",
    guide: "an alternative model focused on anime-style images",
    type: "true-false",
    shortName: "--niji",
    listValue: ["yes", "no"],
  },
  {
    name: "Tile",
    value: "",
    guide: "used as repeating tiles to create seamless patterns",
    type: "true-false",
    shortName: "--tile",
    listValue: ["yes", "no"],
  },
  {
    name: "Aspect Ratio",
    value: "",
    guide: "change the aspect ratio of a generation",
    type: "select",
    shortName: "--ar",
    listValue: ["1:1", "16:9", "9:16", "3:2", "4:5"],
  },
  {
    name: "Chaos",
    value: "",
    guide: "higher values produce more unusual and unexpected generations",
    type: "slide",
    shortName: "--chaos",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    name: "Quality",
    value: "",
    guide: "how much rendering quality time you want to spend",
    type: "slide",
    shortName: "--q",
    min: 0.25,
    max: 1,
    step: 0.25,
  },
  // {
  //   name: "Repeat",
  //   value: "",
  //   guide: "create multiple Jobs from a single prompt",
  //   type: "slide",
  //   shortName: "--r",
  //   min: 1,
  //   max: 40,
  //   step: 1,
  // },
  {
    name: "Seed",
    value: "",
    guide:
      "using the same seed number and prompt will produce similar ending images",
    type: "slide",
    shortName: "--seed",
    min: 0,
    max: 1000,
    step: 1,
  },
  {
    name: "Stop",
    value: "",
    guide: "finish a Job partway through the process",
    type: "slide",
    shortName: "--stop",
    min: 10,
    max: 100,
    step: 1,
  },
  {
    name: "Stylize",
    value: "",
    guide:
      "how strongly Midjourney's default aesthetic style is applied to Jobs",
    type: "slide",
    shortName: "--s",
    min: 0,
    max: 1000,
    step: 1,
  },
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
