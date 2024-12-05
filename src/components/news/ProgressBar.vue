<template>
  <div class="h-4 mt-1 progress">
    <div :style="`width:${prop.percent >= 100 ? 100 : prop.percent}%`" :class="color" class="rounded-full progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">{{ Math.round(prop.percent) }} %</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const prop = defineProps({
  percent: [Number, String],
});

const color = computed(() => {
  if (prop.percent < 40) {
    return "bg-pending";
  } else if (prop.percent < 80) {
    return "bg-primary";
  } else {
    return "bg-success";
  }
});
</script>

<style scoped></style>
