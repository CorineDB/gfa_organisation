<!-- <script>
import { defineComponent, onMounted } from "vue";
import Chart from "chart.js/auto";

export default defineComponent({
  name: "SubmissionsProgressionGraph",
  data() {
    return {
      submissionProgression: {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], // Time intervals
        datasets: [
          {
            label: "Factuel Tool",
            data: [1, 2, 3, 5, 6], // Number of submissions for Factuel Tool
            borderColor: "#4F46E5", // Factuel Tool Color
            backgroundColor: "rgba(79, 70, 229, 0.2)",
            fill: false,
          },
          {
            label: "Perception Tool",
            data: [0, 2, 5, 7, 10], // Number of submissions for Perception Tool
            borderColor: "#9333EA", // Perception Tool Color
            backgroundColor: "rgba(147, 51, 234, 0.2)",
            fill: false,
          },
        ],
      },
    };
  },
  methods: {
    renderSubmissionProgressionChart() {
      const ctx = document.getElementById("submissionProgressionChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: this.submissionProgression.labels,
          datasets: this.submissionProgression.datasets,
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw} submissions`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time (Days)",
                color: "#333",
                font: {
                  size: 14,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Submissions",
                color: "#333",
                font: {
                  size: 14,
                },
              },
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  mounted() {
    this.renderSubmissionProgressionChart();
  },
});
</script> -->

<script>
import { defineComponent, onMounted, reactive } from "vue";
import Chart from "chart.js/auto";

export default defineComponent({
  name: "SubmissionsProgressionGraph",
  data() {
    return {
      currentView: "daily", // View: daily or weekly
      submissionProgression: {
        daily: {
          labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], // Days
          datasets: [
            {
              label: "Factuel Tool (Percentage)",
              data: [1, 15, 23, 56, 69], // Progression in percentages
              borderColor: "#4F46E5",
              backgroundColor: "rgba(79, 70, 229, 0.2)",
              fill: false,
            },
            {
              label: "Perception Tool (Submissions)",
              data: [0, 2, 5, 7, 10], // Submissions count
              borderColor: "#9333EA",
              backgroundColor: "rgba(147, 51, 234, 0.2)",
              fill: false,
            },
          ],
        },
        weekly: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"], // Weeks
          datasets: [
            {
              label: "Factuel Tool (Percentage)",
              data: [8, 16, 28, 65], // Progression in percentages
              borderColor: "#4F46E5",
              backgroundColor: "rgba(79, 70, 229, 0.2)",
              fill: false,
            },
            {
              label: "Perception Tool (Submissions)",
              data: [3, 8, 15, 20], // Submissions count
              borderColor: "#9333EA",
              backgroundColor: "rgba(147, 51, 234, 0.2)",
              fill: false,
            },
          ],
        },
      },
      chart: null,
    };
  },
  methods: {
    setView(view) {
      this.currentView = view;
      this.renderChart();
    },
    renderChart() {
      const ctx = document.getElementById("submissionProgressionChart").getContext("2d");
      if (this.chart) this.chart.destroy(); // Destroy existing chart before re-rendering

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.submissionProgression[this.currentView].labels,
          datasets: this.submissionProgression[this.currentView].datasets,
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.dataset.label.includes("Percentage")
                    ? `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`
                    : `${tooltipItem.dataset.label}: ${tooltipItem.raw} submissions`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: this.currentView === "daily" ? "Days" : "Weeks",
                color: "#333",
                font: {
                  size: 14,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: this.currentView === "daily" ? "Percentage / Submissions" : "Percentage / Submissions",
                color: "#333",
                font: {
                  size: 14,
                },
              },
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  mounted() {
    this.renderChart();
  },
});
</script>
<style scoped>
#submissionProgressionChart {
  max-width: 100%;
  height: auto;
}
button.bg-blue-700 {
  background-color: #4F46E5;
}
</style>

  
  <template>
    <div class="bg-white ">
  
        <!-- Select Field for View Toggle -->
        <div class="mb-4">
        <select
            id="viewSelect"
            v-model="currentView"
            @change="renderChart"
            class="block w-auto px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
        </select>
        </div>
  
      <!-- Chart -->
      <canvas id="submissionProgressionChart"></canvas>
    </div>
  </template>
  