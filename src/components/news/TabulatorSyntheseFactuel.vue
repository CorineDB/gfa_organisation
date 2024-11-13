<template>
  <table class="w-full my-10 border-collapse table-auto border-slate-500" cellpadding="0" cellspacing="0">
    <thead class="text-white bg-blue-900">
      <tr>
        <th class="py-3 border border-slate-900">Principes</th>
        <th class="py-3 border border-slate-900">Critères</th>
        <th class="py-3 border border-slate-900">Indicateurs</th>
        <th class="py-3 border border-slate-900">Réponses</th>
        <th class="py-3 border border-slate-900">Note</th>
        <th class="py-3 border border-slate-900">Source de validation</th>
      </tr>
    </thead>
    <tbody>
      <tr :style="{ 'background-color': getColorForValue(indicegouvernace) }">
        <td colspan="4" class="font-semibold text-center">INDICE FACTUEL DE GOUVERNANCE</td>
        <td class="text-right">{{ indicegouvernace }}</td>
        <td class=""></td>
      </tr>
      <template v-for="gouvernance in data" :key="gouvernance.id">
        <tr :style="{ 'background-color': getColorForValue(gouvernance.indice_factuel) }">
          <td colspan="4" class="font-semibold">{{ gouvernance.nom }}</td>
          <td class="text-right">{{ gouvernance.indice_factuel }}</td>
          <td class=""></td>
        </tr>
        <template v-for="categorie in gouvernance.categories_de_gouvernance" :key="categorie.id">
          <template v-for="(sousCategorie, scIndex) in categorie.categories_de_gouvernance" :key="sousCategorie.id">
            <template v-for="(question, qIndex) in sousCategorie.questions_de_gouvernance" :key="question.id">
              <tr :style="{ 'background-color': getColorForValue(categorie.score_factuel) }">
                <!-- Première cellule de catégorie principale avec rowspan -->
                <td class="font-semibold text-center" v-if="scIndex === 0 && qIndex === 0" :rowspan="categorie.categories_de_gouvernance.reduce((sum, sc) => sum + sc.questions_de_gouvernance.length, 0) + 1">
                  {{ categorie.nom }}
                </td>
                <!-- Première cellule de sous-catégorie avec rowspan -->
                <td class="text-center" v-if="qIndex === 0" :rowspan="sousCategorie.questions_de_gouvernance.length">
                  {{ sousCategorie.nom }}
                </td>
                <td>{{ question.nom }}</td>
                <td class="text-center">{{ question.reponse.nom }}</td>
                <td class="text-right">{{ question.reponse.point }}</td>
                <td class="text-center">{{ question.reponse.sourceDeVerification }}</td>
              </tr>
            </template>
          </template>
          <!-- Ligne Score factuel après chaque catégorie principale -->
          <tr class="font-semibold" :style="{ 'background-color': getColorForValue(categorie.score_factuel) }">
            <td colspan="3" class="text-right">Score factuel</td>
            <td class="text-right">{{ categorie.score_factuel }}</td>
            <td class=""></td>
          </tr>
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
  padding-inline: 4px;
}
</style>
