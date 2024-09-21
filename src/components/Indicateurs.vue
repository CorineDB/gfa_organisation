<template>
  <div>
    <div class="activite-stat h-full  overflow-auto ">
      <div class="entete-activite   h-24 items-start py-3 bg-yellow-600">
        <div class="flex justify-center ">
          <div class="flex items-center space-x-2">
            <div>
              <span class="bg-yellow-700 p-1 block rounded-2xl shadow-sm  text-white">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="2.5em"
                  width="2.5em" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M184 448h48c4.4 0 8-3.6 8-8V72c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v368c0 4.4 3.6 8 8 8zM88 448h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8H88c-4.4 0-8 3.6-8 8v144c0 4.4 3.6 8 8 8zM280.1 448h47.8c4.5 0 8.1-3.6 8.1-8.1V232.1c0-4.5-3.6-8.1-8.1-8.1h-47.8c-4.5 0-8.1 3.6-8.1 8.1v207.8c0 4.5 3.6 8.1 8.1 8.1zM368 136.1v303.8c0 4.5 3.6 8.1 8.1 8.1h47.8c4.5 0 8.1-3.6 8.1-8.1V136.1c0-4.5-3.6-8.1-8.1-8.1h-47.8c-4.5 0-8.1 3.6-8.1 8.1z">
                  </path>
                </svg>
              </span>
            </div>
            <div class="text-white">
              <h2 class="uppercase text-sm font-semibold hover:font-bold py-2">indicateurs</h2>
            </div>
          </div>
        </div>

        <div style="" class="relative   top-2 px-2  ">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead
              class="text-xs text-gray-700 uppercase border-b border-gray-300 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="p-6">
                  INDICATEURS
                </th>
                <th scope="col" class="p-6">
                  VALEUR CIBLE
                </th>
                <th scope="col" class="p-6">
                  VALEUR ACTUELLE
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(suivis_indicateur, index) in suivis_indicateurs" :key="index"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <!-- <hover-ligne :code="suivis_indicateur.indicateur" :libelle="suivis_indicateur.commentaire">
                </hover-ligne> -->
                <td class="py-4 px-6">
                  {{ suivis_indicateur.indicateur }}
                </td>
                <td class="py-4 px-6">
                  {{ suivis_indicateur.valeurCible }}
                </td>
                <td class="py-4 px-6">
                  <span>
                    {{ suivis_indicateur.valeurRealise }}
                  </span>
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
export default {
  components: { HoverLigne },
  props: ['suivis_indicateurs'],
  data() {
    return {

    };
  },
}
</script>

<style>

</style>