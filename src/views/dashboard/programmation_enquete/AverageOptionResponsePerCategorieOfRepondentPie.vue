<template>
  <div>
    <h2 class="text-lg font-bold mb-4">Count of Options Selected by Respondent Category</h2>
    <div class="relative max-w-3xl mx-auto">
      <canvas id="optionResponseBarChart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, BarElement, BarController, Tooltip, CategoryScale, LinearScale, Legend } from "chart.js";

// Register required components
Chart.register(BarElement, BarController, Tooltip, CategoryScale, LinearScale, Legend);

export default {
  name: "AverageOptionResponsePerCategorieOfRepondentPie",
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    renderChart() {
      // Categories of respondents
      const categories = ["Membre Administration", "Membre Association", "Employé Association"];

      // Example data: counts for each "option de réponse" per category
      const optionData = {
        "Ne peux répondre": [5, 3, 2],
        "Pas du tout": [4, 6, 3],
        "Faiblement": [6, 8, 5],
        "Moyennement": [7, 5, 4],
        "Dans une grande mesure": [3, 7, 6],
        "Totalement": [2, 4, 3],
      };

      // Colors for each option
      const optionColors = {
        "Ne peux répondre": "#6366F1",
        "Pas du tout": "#EF4444",
        "Faiblement": "#F59E0B",
        "Moyennement": "#10B981",
        "Dans une grande mesure": "#3B82F6",
        "Totalement": "#9333EA",
      };

      // Dataset preparation (no stacking)
      const datasets = Object.keys(optionData).map((option) => ({
        label: option, // Each option as a label
        data: optionData[option], // Corresponding data for each category
        backgroundColor: optionColors[option], // Assign color for each option
        borderRadius: 3,
        barThickness: 10, // Customize the thickness of the bars
      }));

      // Chart Configuration
      const ctx = document.getElementById("optionResponseBarChart").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: categories, // Categories as labels
          datasets, // Multiple datasets for each option
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top', // Positions the legend at the top
              labels: {
                boxWidth: 10, // Adjusts the size of the legend icon
                boxHeight: 10,
                textAlign: 'center',
                padding: 10, // Adds spacing between legend items
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.raw} Responses for ${tooltipItem.dataset.label}`;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: false,
              title: {
                display: true,
                text: "Categories des participants",
                font: {
                  size: 14, // Font size
                  weight: 'bold', // Font weight
                },
                
                padding: {
                  bottom: 20, // Space between the X-axis title and the chart
                }
              },
              grid: {
                display: false,
              },
              // Adjust spacing between bars
              ticks: {
                autoSkip: false, // Ensure that all labels are shown
              },
              // Control spacing between bars within a category
              categoryPercentage: 0.5, // Controls the width of all bars in a category
              barPercentage: 0.8, // Controls the width of individual bars within the category
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Nombre Options de Réponses",
                font: {
                  size: 14, // Font size
                  weight: 'bold', // Font weight
                },
                
                padding: {
                  bottom: 20, // Space between the X-axis title and the chart
                }
              },
              grid: {
                display: false,
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.renderChart();
  },
};
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: auto !important;
}
</style>