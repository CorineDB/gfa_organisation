<template>
  <Chart type="bar" :width="width" :height="height" :data="data" :options="options" />
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
});

const darkMode = computed(() => useDarkModeStore().darkMode);
const colorScheme = computed(() => useColorSchemeStore().colorScheme);

const data = computed(() => {
  return {
    labels: ["Redevabilité", "Transparence", "Egalité", "Participation", "Efficacité", "Mobilisation", "Evaluation", "Crontroleur de gestion"],
    datasets: [
      {
        label: "Critère",
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        data: [0, 0.1, 0.3, 0.5, 0.8, 0.9, 1, 0.54, 0.22],
        backgroundColor: colorScheme.value ? colors.primary() : "",
      },
      {
        label: "Indicateur",
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        data: [0, 0.1, 0.3, 0.5, 0.8, 0.9, 1, 0.54, 0.22],
        backgroundColor: darkMode.value ? colors.darkmode["200"]() : colors.slate["300"](),
      },
    ],
  };
});

const options = computed(() => {
  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.slate["500"](0.8),
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: colors.slate["500"](0.8),
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
          color: colors.slate["500"](0.8),
          callback: function (value) {
            return "" + value;
          },
        },
        grid: {
          color: darkMode.value ? colors.slate["500"](0.3) : colors.slate["300"](),
          borderDash: [2, 2],
          drawBorder: false,
        },
      },
    },
  };
});
</script>
