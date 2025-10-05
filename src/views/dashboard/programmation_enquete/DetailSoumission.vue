<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
//import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import EvaluationService from "@/services/modules/enquetes_de_gouvernance/evaluation.gouvernance.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const idEvaluation = route.params.e;
const idSoumission = route.params.s;
const type = route.query.type;
const isLoading = ref(true);
const soumission = ref({});
const filterSoumission = ref([]);

const getSoumission = async () => {
  //await EvaluationService.getOneSoumissionsEvaluation(idEvaluation, idSoumission, type)
  await EvaluationService.getSoumissionsFactuelEvaluation(idEvaluation)
    .then((result) => {
      soumission.value = result.data.data.factuel;
      // console.log("Soumission factuel : ", result.data.data);
      filterSoumission.value = soumission.value?.categories_de_gouvernance;
      isLoading.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoading.value = false;
      toast.error("Une erreur est survenue: Détail soumission.");
    });
};


const getSoumissions = async () => {
  isLoading.value = true;
  await EvaluationService.getSoumissionsEvaluation(idEvaluation)
    .then((result) => {
      //datas.value = result.data.data;
      soumission.value = result.data.data.factuel;
      filterSoumission.value = soumission.value?.categories_de_gouvernance;

     console.log("getDatas", soumission.value);

      /* if (datas.value.factuel?.comite_members) {
        localStorage.setItem("member", JSON.stringify(datas.value.factuel.comite_members));
      } */

      isLoading.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoading.value = false;
      toast.error("Une erreur est survenue: Liste des enquêtes.");
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

const filterOptions = computed(() => soumission.value?.options_de_reponse);

onMounted(() => { getSoumission(); });
</script>
<template>
  <div>
    <div v-if="!isLoading">
      <div class="flex justify-between mt-4 items-center">
        <h2 class="text-lg font-medium intro-y">Détail Soumissions</h2>
        <button class="btn btn-primary" @click="goBack">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
      </div>

      <table v-if="type == 'factuel'" class="w-full my-10 border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
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
                  <!-- <pre>{{ question.reponse_de_la_collecte.preuves }}</pre> -->

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
                    <td class="text-center">{{ question.reponse_de_la_collecte?.point }}</td>
                    <td class="p-3">
                      <div class="space-y-3">
                        <!-- Source de vérification (si sourceIsRequired est true) -->
                        <div v-if="soumission.options_de_reponse.find((option) => option.id == question.reponse_de_la_collecte.optionDeReponseId)?.sourceIsRequired" class="mb-3">
                          <div class="text-xs font-semibold text-gray-600 uppercase mb-1">Source de vérification</div>
                          <div v-if="question.reponse_de_la_collecte?.sourceDeVerification" class="text-sm text-gray-800 bg-blue-50 p-2 rounded">
                            {{ question.reponse_de_la_collecte?.sourceDeVerification }}
                          </div>
                          <div v-else class="text-sm text-red-600 italic bg-red-50 p-2 rounded">
                            Aucune source de vérification n'a été renseignée
                          </div>
                        </div>

                        <!-- Description (si descriptionIsRequired est true) -->
                        <div v-if="soumission.options_de_reponse.find((option) => option.id == question.reponse_de_la_collecte.optionDeReponseId)?.descriptionIsRequired" class="mb-3">
                          <div class="text-xs font-semibold text-gray-600 uppercase mb-1">Description</div>
                          <div v-if="question.reponse_de_la_collecte?.description" class="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                            {{ question.reponse_de_la_collecte?.description }}
                          </div>
                          <div v-else class="text-sm text-red-600 italic bg-red-50 p-2 rounded">
                            Aucune description n'a été renseignée
                          </div>
                        </div>

                        <!-- Preuves (si preuveIsRequired est true) -->
                        <div v-if="soumission.options_de_reponse.find((option) => option.id == question.reponse_de_la_collecte.optionDeReponseId)?.preuveIsRequired">
                          <!-- Instruction de la preuve -->
                          <!-- <div v-if="soumission.options_de_reponse.find((option) => option.id == question.reponse_de_la_collecte.optionDeReponseId)?.instructionPreuve" class="mb-2">
                            <div class="text-xs font-semibold text-gray-600 uppercase mb-1">Instruction</div>
                            <div class="text-sm text-gray-700 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                              {{ soumission.options_de_reponse.find((option) => option.id == question.reponse_de_la_collecte.optionDeReponseId)?.instructionPreuve }}
                            </div>
                          </div> -->

                          <!-- Liste des preuves -->
                          <div v-if="question.reponse_de_la_collecte?.preuves && question.reponse_de_la_collecte.preuves.length > 0">
                            <div class="text-xs font-semibold text-gray-600 uppercase mb-2">Preuves ({{ question.reponse_de_la_collecte.preuves.length }})</div>
                            <ul class="space-y-1">
                              <li v-for="(doc, docIndex) in question.reponse_de_la_collecte.preuves" :key="docIndex" class="flex items-center gap-2 p-2 bg-green-50 rounded hover:bg-green-100 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <a :href="doc.url" download class="text-sm text-blue-600 hover:text-blue-800 hover:underline flex-1 truncate" :title="doc.nom">
                                  {{ doc.nom }}
                                </a>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </li>
                            </ul>
                          </div>
                          <div v-else class="text-sm text-red-600 italic bg-red-50 p-2 rounded">
                            Aucune preuve n'a été renseignée
                          </div>
                        </div>
                      </div>
                    </td>

                    
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
