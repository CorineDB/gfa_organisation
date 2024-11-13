<template>
  <table class="min-w-[1000px] my-10 border-collapse table-auto border-slate-500" cellpadding="4" cellspacing="0">
    <thead>
      <tr :style="{ 'background-color': getColorForValue(indicegouvernace) }">
        <th colspan="2" class="py-3 font-semibold text-center">INDICE FACTUEL DE GOUVERNANCE</th>
      </tr>
    </thead>
    <thead>
      <tr class="bg-white">
        <th class="py-3 font-semibold text-center">Code</th>
        <th class="py-3 font-semibold text-right">
          <span class="px-4 py-3" :style="{ 'background-color': getColorForValue(0) }"> Non oberservé [0-0,25] </span>
          <span class="px-4 py-3" :style="{ 'background-color': getColorForValue(0.3) }"> Partiellement observé [0,25-0,50] </span>
          <span class="px-4 py-3" :style="{ 'background-color': getColorForValue(0.6) }">Moyennement observé [0,50-0,75] </span>
          <span class="px-4 py-3" :style="{ 'background-color': getColorForValue(1) }">Observé [0,75-1] </span>
        </th>
      </tr>
    </thead>
    <thead class="text-white bg-blue-900">
      <tr>
        <th class="py-3 border border-slate-900">Principes</th>
        <th class="py-3 border border-slate-900">Critères</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="gouvernance in data" :key="gouvernance.id">
        <tr :style="{ 'background-color': getColorForValue(gouvernance.indice_factuel) }">
          <td colspan="2" class="font-semibold">{{ gouvernance.nom }}</td>
        </tr>
        <template v-for="categorie in gouvernance.categories_de_gouvernance" :key="categorie.id">
          <template v-for="(sousCategorie, scIndex) in categorie.categories_de_gouvernance" :key="sousCategorie.id">
            <template v-for="(question, qIndex) in sousCategorie.questions_de_gouvernance" :key="question.id">
              <tr :style="{ 'background-color': getColorForValue(categorie.score_factuel) }">
                <!-- Première cellule de catégorie principale avec rowspan -->
                <td class="font-semibold" v-if="scIndex === 0 && qIndex === 0" :rowspan="categorie.categories_de_gouvernance.reduce((sum, sc) => sum + sc.questions_de_gouvernance.length, 0)">
                  {{ categorie.nom }}
                </td>
                <!-- Première cellule de sous-catégorie avec rowspan -->
                <td class="" v-if="qIndex === 0" :rowspan="sousCategorie.questions_de_gouvernance.length">
                  {{ sousCategorie.nom }}
                </td>
              </tr>
            </template>
          </template>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { ref } from "vue";
import { getColorForValue } from "../../utils/findColorIndicator";
const props = defineProps({
  data: Array,
  indicegouvernace: [Number, String],
});
</script>

<style scoped>
table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 8px;
}
</style>
