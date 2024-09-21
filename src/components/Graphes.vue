<template>
  <div class="graphe w-full">
      <div class="histogramme bg-white  p-2 shadow-sm">
        <div class="flex justify-between px-2 my-4 py-2">
          <!-- <h2 class="font-semibold text-gray-700 items-center  ">Tableau d'execution physique et financiere</h2> -->
          <!-- <div>
            <select name="" class="shadow  p-2 rounded-sm" id="">
              <option value="" disabled >Année</option>
              <option value="" v-for="i in 50" :key="i" > {{2000 + i}} </option>
            </select>
          </div> -->
        </div>
        <!-- <div >
          <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
        </div> -->
      </div>
      <div class="grid grid-cols-2 items-center gap-4">
        <div class="bg-white h-full mt-3 p-2 shadow-sm" >
          <div class="mb-3">
            <h2 class="text-sm font-semibold text-purple-500 py-1">Activités </h2>
            <p class=" text-sm leading-6">Taux d'execution global <br> PTBA {{currentDate.getFullYear()}} </p>
          </div>
          <apexchart type="donut" :options="chartOptionsCam1" :series="seriesCam1"></apexchart>
        </div>
         <div class="bg-white h-full mt-3 p-2 shadow-sm" >
          <div class="mb-3">
            <h2 class="text-sm font-semibold text-purple-500 py-1">Taux annuel </h2>
            <p class=" text-sm leading-6 ">Taux d'execution financiere <br> PTBA {{currentDate.getFullYear()}} </p>
          </div>
          <apexchart type="radialBar"  :options="chartOptionsCam2" :series="seriesCam2"></apexchart>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props:['projet'],

  data() {
    return {
      currentDate: new Date,
      series: [{
            name: 'Données 1',
            type: 'column',
            data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
        }, 
        {
            name: 'Données 2',
            type: 'line',
            data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
      }],
      chartOptions: {
            chart: {
              height: 350,
              type: 'line',
            },
            stroke: {
              width: [0, 4]
            },
            title: {
              text: 'text données 2'
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: [1]
            },
            labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
            xaxis: {
              type: 'datetime'
            },
            yaxis: [{
              title: {
                text: 'text données 1',
              },
            
            }, {
              opposite: true,
              title: {
                text: 'demo'
              }
            }]
      },

      seriesCam1: this.projet.tep_allProjets.percent,
      chartOptionsCam1: {
            chart: {
              width: 380,
              type: 'donut',
            },
            labels:this.projet.tep_allProjets.bailleurs,
            dataLabels: {
              enabled: false
            },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  show: false
                }
              }
            }],
            legend: {
              position: 'right',
              offsetY: 0,
              height: 230,
            }
      },

      seriesCam2: [this.projet.taux_financier.percent],
      chartOptionsCam2: {
        chart: {
          height: 350,
          type: 'radialBar',
        },
        plotOptions: {
              radialBar: {
                hollow: {
                  size: '70%',
                }
              },
        },
        labels: ['Taux'],
      },
          
    }
  }
}
</script>

<style>

</style>