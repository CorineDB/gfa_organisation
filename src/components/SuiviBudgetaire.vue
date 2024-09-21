<template>
  <div>
    <div class="border my-4 rounded-lg border-gray-300 shadow-md">
      <!-- suivi budgetaire  current -->
      <div  class="current">
        <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">

            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

              <tr class="">
                <th scope="col" rowspan="2"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700  whitespace-nowrap">
                  Bailleurs
                </th>
                <th scope="col" rowspan="2"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700  whitespace-nowrap">
                  Activités
                </th>

                <th scope="col" rowspan="2"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700  whitespace-nowrap">
                  Année
                </th>

                <th scope="col" rowspan="2"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700  whitespace-nowrap">
                  Trimestre
                </th>
               
                <th scope="col" colspan="4"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                  Periode
                </th>
                <th scope="col" colspan="4"
                  class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">
                  Exercice
                </th>
                <th scope="col" colspan="4"
                  class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">
                 Cumul
                </th>
               


              </tr>

              <tr class="">

                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Budget
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Consommé
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                Disponible
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 TEF
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Budget
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Consommé
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                Disponible
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 TEF
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Budget
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Consommé
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                Disponible
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 TEF
                </th>
              </tr>

            </thead>
            <tbody>
              <tr v-for="(suivi,index) in suiviFinancier" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ suivi.bailleur }}
                </th>
                
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold">{{suivi.activite.codePta}}-{{suivi.activite.nom}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.annee}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.trimestre}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.periode.budjet | formatNumber}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.periode.consommer | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.periode.disponible | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.periode.pourcentage}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>

                <!-- periode-->



                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.exercice.budjet | formatNumber}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.exercice.consommer | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.exercice.disponible | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.exercice.pourcentage}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <!-- exercice-->

                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.cumul.budjet | formatNumber}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.cumul.consommer | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.cumul.disponible | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.cumul.pourcentage}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
               
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['suiviFinancier', 'annee'],

}
</script>

<style>

</style>