<template>
  <div>
    <div class="">
          <select
            class="px-11 py-2 mt-1 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
            name=""
            id=""
          >
            <option class="font-semibold">Tous</option>
            <option class="font-semibold" v-for="i in 5" :key="i.id" value="">
              projet {{ i }}
            </option>
          </select>
    </div>

    <div class="grid grid-cols-2 gap-8 my-6 items-center">
      <div>
            <apexchart
              width="80%"
              type="pie"
              :options="chartOptions"
              :series="chartOptions.series"
            ></apexchart>
      </div>
      <div>
            <apexchart
              type="bar"
              height="350"
              :options="chartOptionsExBar"
              :series="series"
            ></apexchart>
      </div>

      <div>
            <apexchart
              width="80%"
              type="pie"
              :options="chartOptionsFi"
              :series="chartOptionsFi.series"
            ></apexchart>
      </div>

      <div>
            <apexchart
              type="bar"
              height="350"
              :options="chartOptionsFiBar"
              :series="series"
            ></apexchart>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

      series: [
        {
          name: "Inflation",
          data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
        },
      ],

      chartOptionsExBar: {
        chart: {
          height: 350,
          type: "bar",
        },

        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },

        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },

          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },

        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          position: "top",
          axisBorder: {
            show: false,
          },

          axisTicks: {
            show: false,
          },

          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },

        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%";
            },
          },
        },

        title: {
          text: "Taux execution du projet",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        }
      },

      chartOptionsFiBar: {
        chart: {
          height: 350,
          type: "bar",
        },

        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },

        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },

        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          position: "top",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        title: {
          text: "Taux financier",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        },
      },

      chartOptions: {
        series: [44, 55],
        chart: {
          width: 380,
          type: "pie",
        },

        labels: ["Executé", "Non éxecute"],
        title: {
          text: "STATISTIQUE TAUX FINANCIER",
          align: "left",
          style: {
            fontSize: "18px",
          },
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ]
      },

      chartOptionsFi: {
        series: [44, 55],
        chart: {
          width: 380,
          type: "pie",
        },

        labels: ["Utilisé", "Non utilise"],
        title: {
          text: "STATISTIQUE TAUX FINANCIER",
          align: "left",
          style: {
            fontSize: "18px",
          },
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ]
      },

    }
  }
}
</script>

<style>

</style>