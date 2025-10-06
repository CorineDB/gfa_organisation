<template>
  <div>
    <canvas ref="barChart" style="height: 500px !important; width: 100% !important; max-height: 500px !important"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart } from "chart.js";

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Refs
const barChart = ref(null);
let chartInstance = null;

// Method to format data for Chart.js
const formatChartData = () => {
  const labels = props.data.map((item) => `${item.annee}`);
  const realisedValues = props.data.map((item) => item.valeur_realiser.moy);
  const targetValues = props.data.map((item) => item.valeurCible.moy);

  return {
    labels,
    datasets: [
      {
        label: "Valeur Réalisée",
        data: realisedValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: "Valeur Cible",
        data: targetValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };
};

// Method to render chart
const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const chartData = formatChartData();
  chartInstance = new Chart(barChart.value, {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Trimestre",
          },
          grouped: true,
        },
        y: {
          title: {
            display: true,
            text: "Valeurs",
          },
          beginAtZero: true,
        },
      },
    },
  });
};

// Watch for changes in data and re-render chart
watch(
  () => props.data,
  () => {
    renderChart();
  },
  { deep: true }
);

// Mount chart
onMounted(() => {
  renderChart();
});
</script>

<style>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
