<template>
  <v-text-field
    v-model.trim="imageLink"
    variant="outlined"
    hide-details
    density="compact"
    placeholder="https://i.imgur.com/h9vHggg.png"
    bg-color="bg-1"
    @keydown.prevent.enter="handleAddImage"
  >
    <template #prepend-inner>
      <v-icon icon="mdi-link-variant"></v-icon>
    </template>
  </v-text-field>
  <div class="d-flex mt-4" style="flex-wrap: wrap">
    <div
      v-for="(imageLink, index) in listImageLink"
      :key="index"
      class="w-25 pa-2 pointer img"
      @click="
        selectedImageIndex = index;
        isShowDelete = true;
      "
    >
      <v-img :src="imageLink" cover alt="image"></v-img>
    </div>
  </div>
  <v-dialog v-model.trim="isShowDelete" width="auto" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-error">Delete</span>
        </div>
        <div>Are you sure to remove this image?</div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowDelete = false">Cancel</v-btn>
        <v-btn variant="flat" color="error" @click="handleRemoveImage">
          Delete
        </v-btn>
      </v-card-actions></v-card
    >
  </v-dialog>
</template>

<script setup>
const imageLink = ref("");
const listImageLink = ref([]);
function handleAddImage() {
  if (!imageLink.value) return;
  listImageLink.value.unshift(imageLink.value);
  imageLink.value = "";
}

const selectedImageIndex = ref(null);
const isShowDelete = ref(false);
function handleRemoveImage() {
  listImageLink.value = listImageLink.value.filter(
    (item, index) => index != selectedImageIndex.value
  );
  selectedImageIndex.value = null;
  isShowDelete.value = false;
}
const emit = defineEmits(["updateImageLink"]);
watch(
  () => listImageLink.value,
  () => {
    emit(
      "updateImageLink",
      listImageLink.value.filter((item) => item.value != "")
    );
  },
  { deep: true }
);

defineExpose({ handleReset });
function handleReset() {
  listImageLink.value = [];
}
</script>

<style scoped>
.img:hover {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
