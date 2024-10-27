<script setup>
import IconLoading from "../icons/IconLoading.vue";

const props = defineProps({
  loading: Boolean,
  label: {
    type: String,
    default: "Ajouter",
  },
});
</script>

<template>
  <button class="w-full px-2 py-2 my-3 align-top btn btn-primary" type="submit" :disabled="props.loading">
    <span class="text-sm font-semibold" v-if="!props.loading">
      {{ props.label }}
    </span>
    <span v-else class="flex items-center justify-center space-x-2">
      <span class="px-4 font-semibold"> Chargement ... </span>
      <IconLoading />
    </span>
  </button>
</template>
