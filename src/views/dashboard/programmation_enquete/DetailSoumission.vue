<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const idEvaluation = route.params.e;
const idSoumission = route.params.s;
const isLoading = ref(true);
const soumission = ref({});
const filterSoumission = ref([]);

const getSoumission = async () => {
  await EvaluationService.getOneSoumissionsEvaluation(idEvaluation, idSoumission)
    .then((result) => {
      soumission.value = result.data.data;
      filterSoumission.value = soumission.value?.formulaire_de_gouvernance?.categories_de_gouvernance;
      isLoading.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoading.value = false;
      toast.error("Une erreur est survenue: Détail soumission.");
    });
};

const goBack = () => {
  router.push({
    name: "SoumissionsEnqueteDeCollecte",
    params: {
      id: route.params.e,
    },
  });
};

const filterOptions = computed(() => soumission.value?.formulaire_de_gouvernance?.options_de_reponse);

onMounted(() => getSoumission());
</script>
<template>
  <div>
    <div v-if="!isLoading">
      <div class="flex justify-between mt-4 items-center">
        <h2 class="text-lg font-medium intro-y">Détail Soumissions</h2>
        <button class="btn btn-primary" @click="goBack">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
      </div>

      <table v-if="soumission?.type == 'factuel'" class="w-full my-10 border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
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
          <template v-for="gouvernance in filterSoumission" :key="gouvernance.id">
            <tr class="bg-green-100">
              <td colspan="6" class="font-semibold">{{ gouvernance.nom }}</td>
              <!-- <td class="text-right">{{ gouvernance.indice_factuel }}</td>
              <td class=""></td> -->
            </tr>
            <template v-for="categorie in gouvernance.categories_de_gouvernance" :key="categorie.id">
              <template v-for="(sousCategorie, scIndex) in categorie.categories_de_gouvernance" :key="sousCategorie.id">
                <template v-for="(question, qIndex) in sousCategorie.questions_de_gouvernance" :key="question.id">
                  <tr>
                    <!-- Première cellule de catégorie principale avec rowspan -->
                    <td class="font-semibold text-center" v-if="scIndex === 0 && qIndex === 0" :rowspan="categorie.categories_de_gouvernance.reduce((sum, sc) => sum + sc.questions_de_gouvernance.length, 0)">
                      {{ categorie.nom }}
                    </td>
                    <!-- Première cellule de sous-catégorie avec rowspan -->
                    <td class="text-center" v-if="qIndex === 0" :rowspan="sousCategorie.questions_de_gouvernance.length">
                      {{ sousCategorie.nom }}
                    </td>
                    <td>{{ question.nom }}</td>
                    <td class="text-center">{{ question.reponse_de_la_collecte?.nom }}</td>
                    <td class="text-right">{{ question.reponse_de_la_collecte?.point }}</td>
                    <td class="text-center">{{ question.reponse_de_la_collecte?.sourceDeVerification }}</td>
                  </tr>
                </template>
              </template>
              <!-- Ligne Score factuel après chaque catégorie principale -->
            </template>
          </template>
        </tbody>
      </table>
      <table v-else class="w-full my-12 border border-collapse table-auto border-slate-500" cellpadding="2" cellspacing="0">
        <thead class="text-left bg-gray-400">
          <tr class="font-semibold text-white bg-blue-900">
            <th class="py-2 text-center border border-slate-600">Principes</th>
            <th class="py-2 text-center border border-slate-600">Questions opérationnelles</th>
            <th v-for="(option, index) in filterOptions" :key="index" class="py-2 text-center border border-slate-600">{{ option.libelle }}</th>
          </tr>
        </thead>
        <tbody v-for="(principe, index) in filterSoumission" :key="principe.id" class="text-black">
          <!-- Première ligne avec rowspan pour afficher le nom du principe -->
          <tr v-if="principe.questions_de_gouvernance.length > 0">
            <td :rowspan="principe.questions_de_gouvernance.length" class="p-2 font-semibold text-center border border-slate-600">{{ principe.nom }}</td>
            <td class="py-2 border border-slate-600">{{ principe.questions_de_gouvernance[0].nom }}</td>
            <td v-for="(option, index) in filterOptions" :key="index" class="py-2 text-center border border-slate-600">
              <template v-if="principe.questions_de_gouvernance[0].reponse_de_la_collecte.optionDeReponseId == option.id">
                <input class="pointer-events-none form-check-input" type="checkbox" value="" checked />
              </template>
            </td>
          </tr>
          <!-- Lignes pour afficher chaque question de gouvernance du principe -->
          <tr v-for="(question, qIndex) in principe.questions_de_gouvernance.slice(1)" :key="question.id">
            <td class="py-2 text-center border border-slate-600">{{ question.nom }}</td>
            <td v-for="(option, index) in filterOptions" :key="index" class="py-2 text-center border border-slate-600">
              <template v-if="question.reponse_de_la_collecte.optionDeReponseId == option.id">
                <input :id="`n-${index}${option.id}`" class="pointer-events-none form-check-input" type="checkbox" value="" checked />
              </template>
            </td>
          </tr>
          <!-- Dernière ligne pour afficher l'indice de perception du principe -->
          <!-- <tr class="font-semibold text-black">
            <td class="py-2 text-right border border-slate-600">Indice de perception du principe</td>
            <td class="py-2 text-left border border-slate-600">{{ principe.indice_de_perception }}</td>
          </tr> -->
        </tbody>
      </table>
    </div>
    <LoaderSnipper v-else />
  </div>
</template>

<style scoped>
table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 8px;
  padding-inline: 4px;
}
</style>
