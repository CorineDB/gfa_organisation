<template>
    <div class="chart-container" style="position: relative; height: auto; width: 600px;">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { Chart } from "chart.js";
  
  // Define the props for the labels and the values for the three indices
  const props = defineProps({
    labels: {
      type: Array,
      required: true,
    },
    synthetiqueValues: {
      type: Array,
      required: true,
    },
    factuelValues: {
      type: Array,
      required: true,
    },
    perceptionValues: {
      type: Array,
      required: true,
    },
  });
  
  // Create a reference for the chart canvas element
  const chartCanvas = ref(null);
  
  // Function to render the chart
  const renderChart = () => {
    if (chartCanvas.value) {
      // Create a new chart using Chart.js
      new Chart(chartCanvas.value.getContext("2d"), {
        type: "bar", // Type of chart (vertical bar)
        data: {
          labels: props.labels, // Labels passed as props
          datasets: [
            {
              label: "Indice Synthétique",
              data: props.synthetiqueValues, // Values for Synthétique Indice
              backgroundColor: "#4CAF50", // Green color for bars
              borderColor: "#388E3C", // Darker green border color
              borderWidth: 0,
              borderRadius: 2,
              barThickness: 7, // Customize the thickness of the bars
            },
            {
              label: "Indice Factuel",
              data: props.factuelValues, // Values for Factuel Indice
              backgroundColor: "#FF9800", // Orange color for bars
              borderColor: "#F57C00", // Darker orange border color
              borderWidth: 0,
              borderRadius: 2,
              barThickness: 7, // Customize the thickness of the bars
            },
            {
              label: "Indice de Perception",
              data: props.perceptionValues, // Values for Perception Indice
              backgroundColor: "#2196F3", // Blue color for bars
              borderColor: "#1976D2", // Darker blue border color
              borderWidth: 0,
              borderRadius: 2,
              barThickness: 7, // Customize the thickness of the bars
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top', // Positions the legend at the top
              align: 'start', // Aligns the legend to the left
              labels: {
                boxWidth: 8, // Adjusts the size of the legend icon
                boxHeight: 9,
                textAlign: 'center',
                padding: 10, // Adds spacing between legend items
              },
            },
            tooltip: {
              enabled: true, // Enable tooltips
              callbacks: {
                // Format the tooltip value as raw number (0 to 1)
                label: function (tooltipItem) {
                  return `${tooltipItem.raw}`; // Display value without multiplying
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Principes de gouvernance", // Label for X-axis
                color: '#000', // Set color for X-axis title
                font: {
                  size: 14, // Font size
                  weight: 'bold', // Font weight
                },

                padding: {
                  top: 20, // Space between the X-axis title and the chart
                },
              },
              grid: {
                offset: true,
                display: false, // Hides the grid on the x-axis
              },
              ticks: {
                autoSkip: false,
              }
            },
            y: {
              min: 0, // Set the minimum value to 0
              max: 1, // Set the maximum value to 1 (no multiplication)
              //maintainAspectRatio: false,
              title: {
                display: true,
                text: "Indices", // Label for Y-axis
                color: '#000', // Set color for X-axis title
                font: {
                  size: 14, // Font size
                  weight: 'bold', // Font weight
                },
                
                padding: {
                  bottom: 20, // Space between the X-axis title and the chart
                },
              },
              grid: {
                display: false, // Hides the grid on the y-axis
              },
              ticks: {
                beginAtZero: true, // Keeps y-axis starting at zero
                stepSize: 0.25, // Set step size to 0.25 (this will give you ticks at 0.0, 0.25, 0.5, etc.)
                callback: function (value) {
                    if(value == 0 || value == 1)
                        return value;
                    else
                        return value.toFixed(2); // Display raw value (0.00, 0.25, etc.)
                },
              },
            },
          },
        },
      });
    }
  };
  
  // Use onMounted to render the chart after the component is mounted
  onMounted(() => {
    renderChart();
  });
  </script>
  
  <style scoped>
  .chart-container {
    margin: 0px auto;
  }
  </style>  