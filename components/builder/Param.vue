<template>
  <div class="text-h5 font-weight-bold text-text-2 w-100 align-self-center">
    Param
  </div>
  <div class="d-flex">
    <v-select
      v-model="paramName"
      :items="Object.keys(keywordParam)"
      variant="outlined"
      density="compact"
      hide-details
      style="width: 300px"
    ></v-select>
  </div>
</template>

<script setup>
const paramName = ref("");
const keywordParam = {
  Version: { shortName: "--v", listValue: ["5", "4", "3", "2", "1"] },
  "Aspect Ratio": { shortName: "--ar", listValue: null, placeHolder: "16:9" },
  Chaos: { shortName: "--chaos", listValue: null, placeHolder: "0-100" },
  "Image Weight": { shortName: "--iw", listValue: null, placeHolder: "0.5-2" },
};
</script>
