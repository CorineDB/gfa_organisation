<template>
  <Chart
    type="doughnut"
    :width="width"
    :height="height"
    :data="data"
    :options="options"
  />
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
  chartData: {
    type: Array,
    default: [15, 10, 65] ,

    
  }
});

const darkMode = computed(() => useDarkModeStore().darkMode);
const colorScheme = computed(() => useColorSchemeStore().colorScheme);

const chartData = [15, 4, 0];
const chartColors = () => [
  colors.primary(0.9),
  colors.danger(0.9),
  colors.warning(0.9),
];

const data = computed(() => {
  return {
    labels: ["Bon", "Passable", "Mediocre"],
    datasets: [
      {
        data: props.chartData,
        backgroundColor: ['#3AAA35', '#F39200', '#BE1622'],
        hoverBackgroundColor: ['#3AAA35', '#F39200', '#BE1622'],
        borderWidth: 5,
        borderColor: darkMode.value ? colors.darkmode[700]() : colors.white,
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
    cutout: "80%",
  };
});
</script>
