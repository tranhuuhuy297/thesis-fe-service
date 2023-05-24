<template>
  <div style="position: relative">
    <img
      :src="`/_nuxt/assets/${imgSrc}`"
      style="width: 100%; object-fit: contain"
      class="pointer"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    />
    <div
      v-if="isHover"
      style="position: absolute; bottom: 8px"
      class="text-white"
    >
      {{ imgSrc }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  imgSrc: String,
  prompt: String,
});
const isHover = ref(false);
</script>

<style scoped>
img:hover {
  opacity: 0.8;
}
</style>
