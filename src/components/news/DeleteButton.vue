<script setup>
import IconLoading from "../icons/IconLoading.vue";

const props = defineProps({
  loading: Boolean,
  label: {
    type: String,
    default: "Supprimer",
  },
});
</script>

<template>
  <button class="btn btn-danger" :disabled="props.loading">
    <span class="text-sm font-semibold" v-if="!props.loading">
      {{ props.label }}
    </span>
    <span v-else class="flex items-center justify-center space-x-2">
      <span class="px-2 font-semibold"> Suppression ... </span>
      <IconLoading />
    </span>
  </button>
</template>
