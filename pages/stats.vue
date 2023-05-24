<template>
  <div class="text-h3 font-weight-bold">
    Prompt <span class="text-primary-2">Stats</span>
  </div>
  <div class="mt-4 text-h5">
    <v-tabs v-model="currentTab" class="mt-8" color="text-1">
      <v-tab :value="1" :class="{ 'font-weight-bold': currentTab === 1 }">
        Newest
      </v-tab>
      <v-tab :value="2" :class="{ 'font-weight-bold': currentTab === 2 }">
        Top Upvote
      </v-tab>
    </v-tabs>
    <v-divider style="margin-top: 1px"></v-divider>
    <v-window v-model="currentTab" class="flex-grow-1 mt-4">
      <div v-if="currentTab === 1" class="d-flex ml-2">
        <div class="w-25 mr-2">
          <StatsImage img-src="image/test.png"></StatsImage>
          <StatsImage img-src="image/logo.png"></StatsImage>
          <StatsImage img-src="image/logo.png"></StatsImage>
        </div>
        <div class="w-25 mr-2">
          <StatsImage img-src="image/background.jpg"></StatsImage>
          <StatsImage img-src="image/logo.png"></StatsImage>
          <StatsImage img-src="image/test.png"></StatsImage>
        </div>
        <div class="w-25 mr-2">
          <StatsImage img-src="image/logo.png"></StatsImage>
          <StatsImage img-src="image/test.png"></StatsImage>
          <StatsImage img-src="image/background.jpg"></StatsImage>
        </div>
        <div class="w-25 mr-2">
          <StatsImage img-src="image/test.png"></StatsImage>
          <StatsImage img-src="image/background.jpg"></StatsImage>
          <StatsImage img-src="image/logo.png"></StatsImage>
        </div>
      </div>
    </v-window>
  </div>
</template>

<script setup>
const currentTab = ref(1);
</script>
