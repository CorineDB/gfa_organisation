<template>
  <div>
     <!-- <pre>{{ activite }}</pre> -->
    <Chart type="doughnut" :width="width" :height="height" :data="data" :activite="activite" :options="options" />
  </div>
 
</template>

<script setup>
import { computed } from "vue";
import { useDarkModeStore } from "@/stores/dark-mode";
import { useColorSchemeStore } from "@/stores/color-scheme";
import { colors } from "@/utils/colors";

const props = defineProps({
  width: {
    type: [Number, String],
    default: "auto",
  },
  height: {
    type: [Number, String],
    default: "auto",
  },
  activite: {
    type: Array,
    default: [15, 10, 65],
  },
});

const darkMode = computed(() => useDarkModeStore().darkMode);
const colorScheme = computed(() => useColorSchemeStore().colorScheme);

const chartData = [15, 10, 65];
const chartColors = () => [
  colors.primary(0.9),      // Terminé
  colors.pending(0.9),     // En cours
  colors.warning(0.9),     // En retard
  colors.slate[400](0.9),  // Non démarrée
];

const data = computed(() => {
  return {
    labels: [
      "Terminé",
      "En cours",
      "En retard",
      "Non démarrée"
    ],
    datasets: [
      {
        data: props.activite,
        backgroundColor: colorScheme.value ? chartColors() : "",
        hoverBackgroundColor: colorScheme.value ? chartColors() : "",
        borderWidth: 5,
        borderColor: darkMode.value ? colors.darkmode[700]() : colors.slate[200](),
      },
    ],
  };
});

const options = computed(() => {
  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "82%",
  };
});
</script>
