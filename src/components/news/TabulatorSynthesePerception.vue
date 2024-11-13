<template>
  <table class="w-full my-12 border border-collapse table-auto border-slate-500" cellpadding="2" cellspacing="0">
    <thead class="text-left bg-gray-400">
      <tr class="py-2 border-b-8 border-white" :style="{ 'background-color': getColorForValue(indicegouvernace) }">
        <td colspan="2" class="font-semibold text-center">Indice factuel de gouvernance</td>
        <td class="text-left">{{ indicegouvernace }}</td>
      </tr>
      <tr class="font-semibold text-white bg-blue-900">
        <th class="py-2 text-center border border-slate-600">Principes</th>
        <th class="py-2 text-center border border-slate-600">Questions opérationnelles</th>
        <th class="py-2 text-center border border-slate-600">Scores</th>
      </tr>
    </thead>
    <tbody v-for="(principe, index) in data" :key="principe.id" class="text-black" :style="{ 'background-color': getColorForValue(principe.indice_de_perception) }">
      <!-- Première ligne avec rowspan pour afficher le nom du principe -->
      <tr v-if="principe.questions_de_gouvernance.length > 0">
        <td :rowspan="principe.questions_de_gouvernance.length + 1" class="p-2 font-semibold text-center border border-slate-600">{{ principe.nom }}</td>
        <td class="py-2 border border-slate-600">{{ principe.questions_de_gouvernance[0].nom }}</td>
        <td class="py-2 border border-slate-600">{{ principe.questions_de_gouvernance[0].moyenne_ponderee }}</td>
      </tr>
      <!-- Lignes pour afficher chaque question de gouvernance du principe -->
      <tr v-for="(question, qIndex) in principe.questions_de_gouvernance.slice(1)" :key="question.id" :style="{ 'background-color': getColorForValue(question.moyenne_ponderee) }">
        <td class="py-2 text-center border border-slate-600">{{ question.nom }}</td>
        <td class="py-2 text-center border border-slate-600">{{ question.moyenne_ponderee }}</td>
      </tr>
      <!-- Dernière ligne pour afficher l'indice de perception du principe -->
      <tr class="font-semibold text-black">
        <td class="py-2 text-right border border-slate-600">Indice de perception du principe</td>
        <td class="py-2 text-left border border-slate-600">{{ principe.indice_de_perception }}</td>
      </tr>
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
  padding-inline: 2px;
}
</style>
