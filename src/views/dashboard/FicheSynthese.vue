<script setup>
import { onMounted, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getColorForValue } from "../../utils/findColorIndicator";
import { useRoute, useRouter } from "vue-router";
import ChartSynthese from "../../components/news/ChartSynthese.vue";
import ChartCircular from "../../components/news/ChartCircular.vue";
import ExportationSyntheseFactuel from "../../components/news/ExportationSyntheseFactuel.vue";
import TabulatorSyntheseFactuel from "../../components/news/TabulatorSyntheseFactuel.vue";
import ChartScroreByPrincipe from "../../components/news/ChartScroreByPrincipe.vue";
import ChartOptionResponseByCategorieAndMember from "../../components/news/ChartOptionResponseByCategorieAndMember.vue";
import ChartProgressionByTime from "../../components/news/ChartProgressionByTime.vue";
import ChartScorePerceptionByPrincipe from "../../components/news/ChartScorePerceptionByPrincipe.vue";
import { computed } from "vue";
import ExportationSynthesePerception from "../../components/news/ExportationSynthesePerception.vue";
import TabulatorSynthesePerception from "../../components/news/TabulatorSynthesePerception.vue";
import ExportationResultatSynthese from "../../components/news/ExportationResultatSynthese.vue";

const router = useRouter();
const route = useRoute();
const idEvaluation = route.params.e;
const organizationId = ref("");
const idSelectStructure = ref("");
const dataForAllOrganisation = ref([]);
const datasFactuel = ref([]);
const datasPerception = ref([]);
const isLoadingData = ref(false);

const getDataCollection = async () => {
  isLoadingData.value = true;
  await SyntheseService.getForEvaluation(idEvaluation)
    .then((result) => {
      dataForAllOrganisation.value = result.data.data;
      datasFactuel.value = dataForAllOrganisation.value.analyse_factuel;
      datasPerception.value = dataForAllOrganisation.value.analyse_perception;
      isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      console.error(e);
      toast.error("Une erreur est survenue: Resultats des synthese .");
    });
};

const organisationsOfEvaluation = computed(() =>
  dataForAllOrganisation.value.map((org) => ({
    id: org.id,
    nom: org.nom,
    nom_point_focal: org.nom_point_focal,
    prenom_point_focal: org.prenom_point_focal,
  }))
);

const currentOrganisation = computed(() => dataForAllOrganisation.value.find((org) => org.id == idSelectStructure.value));

const currentFactuel = computed(() => currentOrganisation.value?.factuel);
const currentPerception = computed(() => currentOrganisation.value?.perception);
const currentProfileGouvernance = computed(() => currentOrganisation.value?.profile_de_gouvernance);

const changeStructure = () => {
  organizationId.value = idSelectStructure.value;
};

onMounted(async () => {
  await getDataCollection();
  idSelectStructure.value = dataForAllOrganisation.value[0].id;
});
</script>

<template>
  <PreviewComponent class="mt-5 intro-y _box">
    <Preview>
      <TabGroup>
        <TabList class="space-x-4 font-bold uppercase nav-boxed-tabs">
          <Tab class="w-full py-2 bg-white" tag="button">Résultat Synthétique</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Outil Factuel</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Outil de Perception</Tab>
        </TabList>

        <TabPanels v-show="!isLoadingData" class="mt-5">
          <!-- Synthétique -->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">FICHE RÉSULTATS SYNTHÉTIQUE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <ExportationResultatSynthese v-if="!isLoadingData && currentOrganisation?.profile_de_gouvernance" :org="currentOrganisation?.nom" :pointfocal="`${currentOrganisation?.nom_point_focal}  ${currentOrganisation?.prenom_point_focal}`" :dateevaluation="currentFactuel?.evaluatedAt" :datas="currentOrganisation?.profile_de_gouvernance" />
              </div>
            </div>
            <table class="w-full my-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    <TomSelect
                      v-model="idSelectStructure"
                      :options="{
                        placeholder: 'Sélectionner la structure',
                      }"
                      class="w-full"
                      @change="changeStructure"
                    >
                      <option v-for="(structure, index) in organisationsOfEvaluation" :key="index" :value="structure.id">{{ structure.nom }}</option>
                    </TomSelect>
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ currentOrganisation?.nom_point_focal }} {{ currentOrganisation?.prenom_point_focal }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td class="pl-2">{{ currentPerception?.evaluatedAt }}</td>
                </tr>
              </tbody>
            </table>
            <table class="w-full mb-12 border-collapse table-auto" cellpadding="4" cellspacing="0">
              <thead class="text-left bg-blue-900">
                <tr class="text-slate-800 bg-slate-300">
                  <th class="py-2 text-left border border-slate-900">Principes</th>
                  <th class="py-2 text-center border border-slate-900">Indice factuel</th>
                  <th class="py-2 text-center border border-slate-900">Indice de Perception</th>
                  <th class="py-2 text-center border border-slate-900">Indice Synthétique</th>
                </tr>
              </thead>

              <tbody class="bg-white">
                <tr v-for="(synthese, index) in currentProfileGouvernance" :key="index" class="pb-2 border border-slate-900">
                  <td class="py-1 font-">{{ synthese.nom }}</td>
                  <td class="py-1 text-right" :style="{ 'background-color': getColorForValue(synthese.indice_factuel) }">{{ synthese.indice_factuel }}</td>
                  <td class="py-1 text-right" :style="{ 'background-color': getColorForValue(synthese.indice_de_perception) }">{{ synthese.indice_de_perception }}</td>
                  <td class="py-1 text-right" :style="{ 'background-color': getColorForValue(synthese.indice_synthetique) }">{{ synthese.indice_synthetique }}</td>
                </tr>
              </tbody>
            </table>
            <!-- <ChartScroreByPrincipe />
            <ChartOptionResponseByCategorieAndMember />
            <ChartProgressionByTime />
            <ChartScorePerceptionByPrincipe /> -->
          </TabPanel>
          <!-- Factuel -->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">FICHE SYNTHESE SCORE FACTUEL GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <ExportationSyntheseFactuel v-if="!isLoadingData && currentFactuel" :org="currentOrganisation?.nom" :pointfocal="`${currentOrganisation?.nom_point_focal}  ${currentOrganisation?.prenom_point_focal}`" :dateevaluation="currentFactuel?.evaluatedAt" :datas="currentFactuel" />
              </div>
            </div>

            <table class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    <TomSelect
                      v-model="idSelectStructure"
                      :options="{
                        placeholder: 'Sélectionner la structure',
                      }"
                      class="w-full"
                      @change="changeStructure"
                    >
                      <option v-for="(structure, index) in organisationsOfEvaluation" :key="index" :value="structure.id">{{ structure.nom }}</option>
                    </TomSelect>
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ currentOrganisation?.nom_point_focal }} {{ currentOrganisation?.prenom_point_focal }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td class="pl-2">{{ currentPerception?.evaluatedAt }}</td>
                </tr>
              </tbody>
            </table>
            <table v-if="!isLoadingData && currentFactuel?.resultats" class="w-full max-w-screen-lg mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="font-semibold border-slate-300 bg-slate-300">
                  <td class="p-2">Principe</td>
                  <td class="p-2">Indice de perception</td>
                </tr>
                <template v-for="principe in currentFactuel?.resultats">
                  <tr>
                    <td class="p-2 font-medium border-b border-slate-300">{{ principe.nom }}</td>
                    <td :style="{ 'background-color': getColorForValue(principe.indice_factuel) }" class="text-center border-b border-slate-300">{{ principe.indice_factuel }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
            <!-- Tableau de synthese Factuel -->
            <TabulatorSyntheseFactuel v-if="!isLoadingData && currentFactuel?.synthese" :data="currentFactuel?.synthese" :indicegouvernace="currentFactuel?.indice_de_gouvernance" />
          </TabPanel>
          <!-- Perception-->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">FICHE SYNTHESE SCORE DE PERCEPTION GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <ExportationSynthesePerception v-if="!isLoadingData && currentPerception" :org="currentOrganisation?.nom" :pointfocal="`${currentOrganisation?.nom_point_focal}  ${currentOrganisation?.prenom_point_focal}`" :dateevaluation="currentPerception?.evaluatedAt" :current-perception="currentPerception" />
              </div>
            </div>
            <table class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    <TomSelect
                      v-model="idSelectStructure"
                      :options="{
                        placeholder: 'Sélectionner la structure',
                      }"
                      class="w-full"
                      @change="changeStructure"
                    >
                      <option v-for="(structure, index) in organisationsOfEvaluation" :key="index" :value="structure.id">{{ structure.nom }}</option>
                    </TomSelect>
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ currentOrganisation?.nom_point_focal }} {{ currentOrganisation?.prenom_point_focal }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td class="pl-2">{{ currentPerception?.evaluatedAt }}</td>
                </tr>
              </tbody>
            </table>
            <!-- Tableau de synthese Perception -->
            <TabulatorSynthesePerception :data="currentPerception?.synthese" :indicegouvernace="currentFactuel?.indice_de_gouvernance" v-if="!isLoadingData && currentPerception?.synthese" />
          </TabPanel>
        </TabPanels>
        <LoaderSnipper v-if="isLoadingData" />
      </TabGroup>
    </Preview>
  </PreviewComponent>
</template>

<style scoped>
table td {
  border: 1px solid rgb(0, 0, 0);
}
</style>
