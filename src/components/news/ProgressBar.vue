<template>
  <div class="h-4 mt-1 progress relative rounded-full overflow-hidden bg-gray-200">
    <!-- <pre>{{ prop.percent }}</pre> -->
    <div 
      :style="`width:${prop.percent >= 100 ? 100 : prop.percent}%`" 
      :class="color" 
      class="h-full rounded-full flex items-center justify-center text-[10px] font-bold text-black transition-all duration-300" 
      role="progressbar" 
      aria-valuenow="0" 
      aria-valuemin="0" 
      aria-valuemax="100"
    >
      {{ Math.round(prop.percent) }}%
    </div>
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
