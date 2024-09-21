<template>
  <div id="chart" class="bg-white  p-2 shadow-sm">
    <div class="mb-3">
      <h2 class="text-sm font-semibold text-purple-500 py-1">Taux  annuel </h2>
      <p class=" text-sm leading-6 ">Taux d'engagement  <br> sur 12 mois </p>
    </div>
    <apexchart width="500" type="line" :options="options" :series="series"></apexchart>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Jui', 'Jul', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec']
        }
      },
      series: [{
        name: "taux d'engagement",
        data: [3,5,10,20,30, 40, 45, 50, 49, 60, 70, 91]
      }]
    }
  }
}
</script>

<style>

</style>