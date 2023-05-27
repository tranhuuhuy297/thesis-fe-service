<template>
  <div style="position: relative">
    <v-img
      :src="`https://${prompt?.image_src}`"
      cover
      class="pointer mb-2 img"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    />
  </div>
</template>

<script setup>
defineProps({
  prompt: null,
});
const isHover = ref(false);
</script>

<style scoped>
.img:hover {
  opacity: 0.8;
}
</style>
