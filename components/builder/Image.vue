<template>
  <div style="position: relative" class="mb-4 pointer">
    <v-img :src="`https://${builderValue?.image_src}`" cover class="img" />
    <div
      class="d-flex align-center justify-center bg-primary-2 pa-2 px-4"
      style="border-radius: 0 0 5px 5px; height: 64px"
    >
      {{ builderValue?.name }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  builderValue: null,
});
</script>

<style scoped>
.img:hover {
  opacity: 0.8;
}
</style>
