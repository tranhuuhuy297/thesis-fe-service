<template>
  <div class="body">
    <div class="search-field">
      <div class="d-flex justify-center">
        <svg height="80" width="1000">
          <text x="50%" y="60%" text-anchor="middle" class="text-h2">
            Prompt Builder
          </text>
        </svg>
      </div>
      <v-text-field
        v-model.trim="textSearch"
        variant="outlined"
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search AI images"
        @keydown.enter="handleSearch"
      >
      </v-text-field>
      <div class="d-flex justify-center mt-2">
        <v-btn
          class="mr-4 font-weight-bold text-text-1 rounded-lg"
          color="primary"
          text="Builder"
          size="x-large"
          variant="outlined"
          prepend-icon="mdi-cog"
          @click="navigateTo({ path: '/builder' })"
        />
        <v-btn
          class="mr-4 font-weight-bold text-text-1 rounded-lg"
          color="primary"
          text="Upload"
          prepend-icon="mdi-camera"
          size="x-large"
          @click="navigateTo('/upload')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "empty",
});

const textSearch = ref("");
async function handleSearch() {
  if (textSearch.value) {
    navigateTo({ path: "/feeds", query: { textSearch: textSearch.value } });
  }
}
</script>

<style scoped>
.body {
  background: url("~/assets/image/background.jpg");
  background-size: cover !important;
  height: 100vh;
  width: 100vw;
}
.search-field {
  position: fixed;
  top: 30%;
  left: 25%;
  right: 25%;
}

svg text {
  text-transform: uppercase;
  animation: stroke 3s;
  stroke-width: 2;
  stroke: #333333;
}
@keyframes stroke {
  0% {
    fill: rgba(72, 138, 20, 0);
    stroke: #333333;
    stroke-dashoffset: 25%;
    stroke-dasharray: 0 50%;
    stroke-width: 2;
  }
  70% {
    fill: rgba(72, 138, 20, 0);
    stroke: #333333;
  }
  80% {
    fill: rgba(72, 138, 20, 0);
    stroke: #333333;
    stroke-width: 3;
  }
  100% {
    fill: #333333;
    stroke: rgba(54, 95, 160, 0);
    stroke-dashoffset: -25%;
    stroke-dasharray: 50% 0;
    stroke-width: 0;
  }
}
</style>
