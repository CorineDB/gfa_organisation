<template>
  <!-- List rankings dynamically -->
  <div v-for="(org, index) in rankingData" :key="index" class="flex flex-col py-2">
    <div class="flex items-center justify-between">
      <!-- Organization Name and Logo -->
      <div class="flex items-center space-x-2">
        <img :src="org.image" alt="Org Logo" class="w-6 h-6 rounded-full" />
        <span class="text-sm font-medium organization-name">{{ org.name }}</span>
      </div>
      <!-- Submission Count -->
      <span class="text-sm font-bold text-gray-800"> {{ org.percent * 100 }} % </span>
    </div>

    <!-- Horizontal Progress Bar -->
    <div class="mt-2">
      <div class="relative w-full h-1 bg-gray-200 rounded-full" style="height: 5px">
        <div
          class="absolute top-0 left-0 h-1 rounded-full"
          :class="getProgressBarColor(org.percent)"
          :style="{
            width: org.percent * 100 + '%',
            backgroundColor: getBarColor(org.percent),
            borderRadius: '10px',
            height: '4px',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define the prop for the ranking data
const props = defineProps({
  rankingData: {
    type: Array,
    required: true,
  },
});

// Function to determine the color based on the percent value
const getBarColor = (percent) => {
  if (percent < 0.25) return "#FF0000"; // Red for below 25%
  if (percent < 0.5) return "#C00000"; // Dark Red for 25% to 50%
  if (percent < 0.75) return "#FFC000"; // Yellow for 50% to 75%
  return "#00B050"; // Green for above 75%
};

const getProgressBarColor = (percent) => {
  if (percent < 25) return "bg-red-500";
  if (percent < 50) return "bg-yellow-500";
  if (percent < 75) return "bg-blue-500";
  return "bg-green-500";
};
</script>

<style scoped>
.ranking-container {
  margin: 0px auto;
  padding: 0px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.organization-image {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 1rem; /* Space between image and text */
}

.organization-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.organization-name {
  font-weight: bold;
  color: #333;
}

.organization-percent {
  color: #666;
}

.progress-bar-container {
  width: 100%;
  background-color: #e0e0e0;
  height: 5px;
  border-radius: 10px;
}

.progress-bar {
  height: 100%;
  border-radius: 10px;
}
</style>
