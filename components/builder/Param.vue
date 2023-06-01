<template>
  <div class="d-flex justify-space-between align-center px-2">
    <div class="text-h5 font-weight-bold text-text-2 w-100">Param</div>
    <v-autocomplete
      v-model="paramName"
      :items="paramStore?.getNameListParam"
      variant="outlined"
      density="compact"
      hide-details
      style="width: 500px"
    ></v-autocomplete>
  </div>
  <div class="mt-4 ml-2 d-flex">
    <div class="w-25 mr-2"></div>
    <div class="w-25 mr-2"></div>
    <div class="w-25 mr-2"></div>
    <div class="w-25 mr-2"></div>
  </div>
</template>

<script setup>
import { useParamStore } from "~/stores/Param";
const paramStore = useParamStore();
const paramName = ref("");
</script>
