<template>
  <table class="w-full my-12 border border-collapse table-auto border-slate-500" cellpadding="4" cellspacing="0">
    <thead class="text-left bg-gray-400">
      <tr class="" :style="{ 'background-color': getColorForValue(indicegouvernace) }">
        <td colspan="2" class="py-3 font-semibold text-center">Indice factuel de gouvernance</td>
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
    <tbody class="text-black">
      <template v-for="(principe, pIndex) in data" :key="principe.id">
        <tr :style="{ 'background-color': getColorForValue(principe.indice_de_perception) }">
          <td colspan="2" class="p-2 font-semibold">{{ principe.nom }}</td>
        </tr>

        <tr v-for="(question, qIndex) in principe.questions_de_gouvernance" :key="question.id" :style="{ 'background-color': getColorForValue(question.moyenne_ponderee) }">
          <td class="py-2 font-semibold">QOP{{ cumulativeIndex(pIndex, qIndex) }}</td>
          <td class="py-2">{{ question.nom }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { getColorForValue } from "../../utils/findColorIndicator";

const props = defineProps({
  data: Array,
  indicegouvernace: [Number, String],
});

const cumulativeIndex = (pIndex, qIndex) => {
  let totalQuestions = 0;
  for (let i = 0; i < pIndex; i++) {
    totalQuestions += props.data[i].questions_de_gouvernance.length;
  }
  return totalQuestions + qIndex + 1; // +1 to start index from 1
};
</script>

<style scoped>
table td {
  /* border: 1px solid rgb(46, 46, 46); */
  padding-inline: 6px;
}
</style>
