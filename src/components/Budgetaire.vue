<template>
  <div class="stat-fin h-full overflow-auto">
    <div class="text-sm bg-primary border border-primary shadow grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-6 text-white">
      <div class="flex items-center space-x-2">
        <!-- box icons -->
        <div class="bg-blue-500 p-3 rounded-lg">
          <i class="bx bx-coin-stack bx-sm"></i>
        </div>
        <div>
          <h2 class="uppercase font-semibold hover:font-bold py-2">
            Montant du projet
          </h2>
          <p class="hover:font-bold">{{ projet.pret | formatNumber }} XOF </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <!-- box icons -->
        <div class="bg-purple-800 p-3 rounded-lg">
          <i class="bx bx-coin-stack bx-sm"></i>
        </div>
        <div>
          <h2 class="uppercase font-semibold hover:font-bold py-2">
            budget national
          </h2>
          <p class="hover:font-bold">{{ projet.budgetNational | formatNumber}} XOF </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <!-- box icons -->
        <div class="bg-yellow-600 p-3 rounded-lg">
          <i class="bx bx-coin-stack bx-sm"></i>
        </div>
        <div>
          <h2 class="uppercase hover:font-bold font-semibold py-2">
            Decaissement bailleur
          </h2>
          <p class="hover:font-bold">{{ projet.total_decaissement_bailleur | formatNumber}} XOF</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <!-- box icons -->
        <div class="bg-red-500 p-3 rounded-lg">
          <i class="bx bx-coin-stack bx-sm"></i>
        </div>
        <div>
          <h2 class="uppercase font-semibold hover:font-bold py-2">
            Realisation globale
          </h2>
          <p class="hover:font-bold">{{ projet.total_realisation | formatNumber}} XOF</p>
        </div>
      </div>
    </div>
    <div class="activite-stat my-6">
      <div class="entete-activite relative h-24 items-start py-3 bg-gray-600">
        <div class="grid grid-cols-3 gap-4">
          <div class="flex items-center space-x-2">
            <div>
              <span class="text-green-500">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="2.5em"
                  width="2.5em" xmlns="http://www.w3.org/2000/svg">
                  <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                </svg>
              </span>
            </div>
            <div class="text-white">
              <h2 class="uppercase text-sm font-semibold hover:font-bold py-2">
                terminer
              </h2>
              <p class="hover:font-bold">{{projet.statistiqueActivite.effectue}} / {{projet.statistiqueActivite.total}}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div>
              <span class="text-yellow-500">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="2.5em"
                  width="2.5em" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536 1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071 3.536-3.535 1.414 1.415-3.536 3.535z">
                  </path>
                </svg>
              </span>
            </div>
            <div class="text-white">
              <h2 class="uppercase text-sm font-semibold hover:font-bold py-2">
                en cours
              </h2>
              <p class="hover:font-bold">{{projet.statistiqueActivite.enCours}} / {{projet.statistiqueActivite.total}}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div>
              <span class="text-red-500">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="2.5em"
                  width="2.5em" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z">
                  </path>
                </svg>
              </span>
            </div>
            <div class="text-white">
              <h2 class="uppercase text-sm font-semibold hover:font-bold py-2">
                en retard
              </h2>
              <p class="hover:font-bold">{{projet.statistiqueActivite.enRetard}} / {{projet.statistiqueActivite.total}}
              </p>
            </div>
          </div>
        </div>

        <div class="relative top-2 px-2 overflow-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead
              class="text-xs text-gray-700 uppercase border-b border-gray-300 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="p-6">ACTIVITE</th>
                <th scope="col" class="p-6">TEP ACTUEL</th>
                <th scope="col" class="p-6">STATUS</th>
              </tr>
            </thead>
            <tbody>

              <tr v-for="(suivi, index) in projet.suivis" :key="index"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="py-4 px-6">{{suivi.nom}}</td>
                <!-- <hover-ligne :code="suivi.activite.nom" libelle="lorem ipsum dolor"></hover-ligne> -->
                <td class="py-4 px-6">{{ suivi.poidsActuel.toFixed(2) }}</td>
                <td class="py-4 px-6">
                  <span class="text-green-500"> {{ getStatus(suivi.statut).libelle }} </span>
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
import HoverLigne from "@/components/HoverLigne";
import { extractFormData, getStringValueOfStatutCode } from "@/utils/index";
export default {
  components: { HoverLigne },
  props: ['projet'],

  methods: {

    test() {
      return "cool";
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },
  },
};
</script>

<style>

</style>
