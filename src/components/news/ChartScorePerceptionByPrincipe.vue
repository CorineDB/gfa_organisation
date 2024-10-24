<template>
  <div>
    <canvas id="myPieChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

// Enregistrer les éléments nécessaires pour Chart.js
Chart.register(PieController, ArcElement, Tooltip, Legend);

onMounted(() => {
  const ctx = document.getElementById("myPieChart").getContext("2d");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Inclusion", "Efficacité", "Transparence", "Participation", "Redevabilité"],
      datasets: [
        {
          data: [25.7, 20.0, 14.3, 22.9, 17.1], // Les valeurs de chaque secteur
          backgroundColor: ["#6a0dad", "#ff0000", "#008000", "#ffa500", "#87ceeb"], // Couleurs des secteurs
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
});
</script>

<style scoped>
canvas {
  width: 600px;
  height: 600px;
  margin: auto;
}
</style>
