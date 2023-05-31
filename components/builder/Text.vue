<template>
  <div class="d-flex px-4">
    <div class="text-h5 font-weight-bold text-text-2 w-100 align-self-center">
      Text
    </div>
    <div class="d-flex">
      <v-autocomplete
        v-model="textName"
        :items="Object.keys(keywordText)"
        variant="outlined"
        density="compact"
        hide-details
        style="width: 300px"
      ></v-autocomplete>
    </div>
  </div>
  <div class="mt-2"></div>
</template>

<script setup>
const textName = ref("");
const keywordText = {};
</script>
