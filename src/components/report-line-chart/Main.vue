<template>
  <Chart type="line" :width="width" :height="height" :data="data" :options="options" />
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
  graphData: {
    type: Object,
  }
});



const darkMode = computed(() => useDarkModeStore().darkMode);
const colorScheme = computed(() => useColorSchemeStore().colorScheme);

const data = computed(() => {
  return props.graphData
});

const options = computed(() => {
  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
          color: darkMode.value
            ? colors.slate["500"](0.3)
            : colors.slate["300"](),
          borderDash: [3, 3],
          drawBorder: false,
        },
      },
    },
  };
});
</script>
