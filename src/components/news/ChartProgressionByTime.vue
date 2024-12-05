<template>
  <div>
    <canvas ref="chartCanvas" style="height: 600px; width: 100%"></canvas>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default defineComponent({
  name: "LineChart",
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    const chartInstance = ref(null);

    const createChart = (processedData) => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
      chartInstance.value = new Chart(chartCanvas.value, {
        type: "line",
        data: processedData,
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
                text: "Année",
              },
            },
            y: {
              title: {
                display: true,
                text: "Score",
              },
              min: 0,
              max: 1,
            },
          },
        },
      });
    };

    const processChartData = () => {
      const defaultYear = "0";
      const defaultValues = {
        indice_factuel: 0,
        indice_de_perception: 0,
        indice_synthetique: 0,
      };

      const extendedData = { [defaultYear]: [defaultValues], ...props.chartData };

      const labels = Object.keys(extendedData);
      const datasets = [
        {
          label: "indice_factuel",
          data: labels.map((year) => extendedData[year].reduce((sum, item) => sum + item.indice_factuel, 0) / extendedData[year].length),
          borderColor: "red",
          backgroundColor: "red",
          fill: false,
        },
        {
          label: "indice_de_perception",
          data: labels.map((year) => extendedData[year].reduce((sum, item) => sum + item.indice_de_perception, 0) / extendedData[year].length),
          borderColor: "orange",
          backgroundColor: "orange",
          fill: false,
        },
        {
          label: "indice_synthetique",
          data: labels.map((year) => extendedData[year].reduce((sum, item) => sum + item.indice_synthetique, 0) / extendedData[year].length),
          borderColor: "pink",
          backgroundColor: "pink",
          fill: false,
        },
      ];

      return { labels, datasets };
    };

    onMounted(() => {
      const initialData = processChartData();
      createChart(initialData);
    });

    watch(
      () => props.chartData,
      () => {
        const updatedData = processChartData();
        createChart(updatedData);
      },
      { deep: true }
    );

    return {
      chartCanvas,
    };
  },
});
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
