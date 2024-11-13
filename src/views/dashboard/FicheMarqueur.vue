<script setup>
import { onMounted, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getColorForValue } from "../../utils/findColorIndicator";
import { useRoute, useRouter } from "vue-router";
import ExportationSyntheseFactuel from "../../components/news/ExportationSyntheseFactuel.vue";
import TabulatorMarqueurFactuel from "../../components/news/TabulatorMarqueurFactuel.vue";
import { computed } from "vue";
import ExportationSynthesePerception from "../../components/news/ExportationSynthesePerception.vue";
import TabulatorMarqueurPerception from "../../components/news/TabulatorMarqueurPerception.vue";

const router = useRouter();
const route = useRoute();
// Il faudra faire les get des organisationId et enqueteDeCollecteId depuis l'url avec router
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
          <Tab class="w-full py-2 bg-white" tag="button">Outil Factuel</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Outil de Perception</Tab>
        </TabList>

        <TabPanels v-show="!isLoadingData" class="mt-5">
          <!-- Factuel -->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">FICHE SYNTHESE SCORE FACTUEL GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <!-- <ExportationSyntheseFactuel v-if="!isLoadingData" :datas="currentFactuel" /> -->
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
            <!-- Tableau de marqueur Factuel -->
            <TabulatorMarqueurFactuel v-if="!isLoadingData" :data="currentFactuel?.synthese" :indicegouvernace="currentFactuel?.indice_de_gouvernance" />
            <!-- <ChartScroreByPrincipe />
            <ChartOptionResponseByCategorieAndMember />
            <ChartProgressionByTime />
            <ChartScorePerceptionByPrincipe /> -->
          </TabPanel>
          <!-- Perception-->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">FICHE SYNTHESE SCORE DE PERCEPTION GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <ExportationSynthesePerception v-if="!isLoadingData" :org="currentOrganisation?.nom" :pointfocal="`${currentOrganisation?.nom_point_focal}  ${currentOrganisation?.prenom_point_focal}`" :dateevaluation="currentPerception?.evaluatedAt" :current-perception="currentPerception" />
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
            <TabulatorMarqueurPerception :data="currentPerception?.synthese" :indicegouvernace="currentFactuel?.indice_de_gouvernance" v-if="!isLoadingData" />
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
