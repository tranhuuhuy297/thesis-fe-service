<template>
  <div class="d-flex px-4">
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
  </div>
  <div class="mt-2">
    <div v-if="styleName === 'Layouts'" class="d-flex flex-wrap">
      <div class="w-25 pa-4">
        <img src="~/assets/image_style/layouts/album_cover.png" class="w-100" />
        <div class="d-flex justify-center bg-bg-2">Album Cover</div>
      </div>
      <div class="w-25 pa-4">
        <img
          src="~/assets/image_style/layouts/anatomical_drawing.png"
          class="w-100"
        />
        <div class="d-flex justify-center bg-bg-2">Anatomical Drawing</div>
      </div>
      <div class="w-25 pa-4">
        <img
          src="~/assets/image_style/layouts/character_design.png"
          class="w-100"
        />
        <div class="d-flex justify-center bg-bg-2">Character Designr</div>
      </div>
      <div class="w-25 pa-4">
        <img src="~/assets/image_style/layouts/game_assets.png" class="w-100" />
        <div class="d-flex justify-center bg-bg-2">Game Assets</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const keywordStyle = {
  Layouts: [
    "Album Cover",
    "Anatomical Drawing",
    "Character Design",
    "Game Assets",
  ],
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
