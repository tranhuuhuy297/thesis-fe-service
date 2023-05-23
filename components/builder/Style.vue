<template>
  <div class="text-h5 font-weight-bold text-text-2 w-100 align-self-center">
    Style
  </div>
  <div class="d-flex">
    <v-select
      v-model="styleName"
      :items="Object.keys(keywordStyle)"
      variant="outlined"
      density="compact"
      hide-details
      style="width: 300px"
    ></v-select>
  </div>
</template>

<script setup>
const keywordStyle = {
  Layouts: ["Album Cover", "Anatomical Drawing"],
  Textures: ["3d Fractals", "Agate"],
  Colors: ["Apricot Color", "Aqua Colors"],
  Artist: ["Adrian Donoghue", "Adrian Tomine"],
  Camera: ["100mm", "14mm"],
  Era: ["1100s", "1200s"],
  Themes: ["Academicism", "Acid Pixie"],
  Styles: ["3d", "Abstract Art"],
  Techniques: ["16 Bit", "3d Printed"],
  Lighting: ["Backlighting", "Blacklight"],
  "Movies, Games": ["American Horror Story", "Animal Crossing"],
  Architecture: ["Afrocentric Interior Design", "Antebellum Architecture"],
  Fashion: ["Academia Outfit", "Androgynous Outfit"],
  Emojis: ["⏰", "☀️"],
  Characters: ["Absent Mindned Professor", "African"],
  Background: ["A stone Route To The Moon", "Airport"],
};

const styleName = ref("");
</script>
