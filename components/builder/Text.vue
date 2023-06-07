<template>
  <div
    v-for="(item, index) in listText"
    :key="index"
    class="d-flex mb-1 align-center"
  >
    <v-text-field
      v-model.trim="item.value"
      variant="outlined"
      hide-details
      density="compact"
      bg-color="bg-1"
      style="width: 80%"
    >
      <template #prepend-inner>
        <div v-if="item.negative" style="width: 40px" class="font-weight-bold">
          --no
        </div>
        <v-icon v-else icon="mdi-text" style="width: 40px"></v-icon>
        <v-divider vertical class="ml-2"></v-divider>
      </template>
    </v-text-field>
    <span v-if="!item.negative" class="mx-2 font-weight-bold">::</span>
    <v-text-field
      v-if="!item.negative"
      v-model.trim="item.weight"
      hide-details
      variant="outlined"
      density="compact"
      bg-color="bg-1"
      placeholder="weight"
    ></v-text-field>
  </div>
  <div class="d-flex mt-2">
    <v-btn
      text="Add new"
      variant="elevated"
      color="info"
      prepend-icon="mdi-plus-circle-outline"
      class="mr-2"
      @click="listText.push({ ...textTemplate })"
    >
    </v-btn>
    <v-btn
      text="Add negative"
      variant="elevated"
      color="primary"
      prepend-icon="mdi-plus-circle-outline"
      @click="listText.push({ ...textTemplate, negative: true })"
    >
    </v-btn>
  </div>
</template>

<script setup>
const textTemplate = { value: "", weight: "", negative: false };
const listText = ref([{ ...textTemplate }]);
const emit = defineEmits(["updateText"]);
watch(
  () => listText.value,
  () => {
    emit(
      "updateText",
      listText.value.filter((item) => item.value != "")
    );
  },
  { deep: true }
);
</script>
