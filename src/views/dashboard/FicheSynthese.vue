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
import DownloadPDFButton from "@/components/DownloadPDFButton.vue";

const router = useRouter();
const route = useRoute();
const idEvaluation = route.params.e;
const organizationId = ref("");
const authUser = ref("");
const idSelectStructure = ref("");
const dataForAllOrganisation = ref([]);
const datasFactuel = ref([]);
const datasPerception = ref([]);
const isLoadingData = ref(false);
const currentFactuel = ref("");
const currentPerception = ref("");
const currentProfileGouvernance = ref("");

const getDataCollection = async () => {
  isLoadingData.value = true;
  await SyntheseService.getForEvaluation(idEvaluation)
    .then((result) => {
      console.log(result.data);
      currentProfileGouvernance.value = result.data.data.profile_de_gouvernance;
      currentFactuel.value = result.data.data.factuel;
      currentPerception.value = result.data.data.perception; /* 
      dataForAllOrganisation.value = result.data.data;
      datasFactuel.value = dataForAllOrganisation.value.analyse_factuel;
      datasPerception.value = dataForAllOrganisation.value.analyse_perception; */
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

const currentOrganisation = computed(() => authUser.value);

/*const currentOrganisation = computed(() => dataForAllOrganisation.value.find((org) => org.id == idSelectStructure.value));

const currentFactuel = computed(() => currentOrganisation.value?.factuel);
const currentPerception = computed(() => currentOrganisation.value?.perception);
const currentProfileGouvernance = computed(() => currentOrganisation.value?.profile_de_gouvernance); */

const changeStructure = () => {
  organizationId.value = idSelectStructure.value;
};

onMounted(async () => {
  await getDataCollection();
  //idSelectStructure.value = dataForAllOrganisation.value[0].id;

  authUser.value = JSON.parse(localStorage.getItem("authenticateUser"));
});
</script>

<template>
  <div class="flex justify-between mt-4 items-center">
    <h2 class="text-lg font-medium intro-y">Fiche de synthèse</h2>
    <button class="btn btn-primary" @click="router.go(-1)">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
  </div>
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
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">FICHE SYNTHESE FACTUELLE GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <ExportationSyntheseFactuel v-if="!isLoadingData && currentFactuel" :org="authUser?.nom" :pointfocal="`${authUser?.profil?.nom_point_focal}  ${authUser?.profil?.prenom_point_focal}`" :dateevaluation="currentFactuel?.evaluatedAt" :datas="currentFactuel" />
                <DownloadPDFButton :tableIds="['table2AZ', 'tableKJI' ,'rpiper']" pageName="Fiche de synthèse Outils Factuel" format="a4" />
              </div>
            </div>

            <table id="table2AZ" class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    {{ authUser?.nom }}
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ authUser?.profil?.nom_point_focal }} {{ authUser?.profil?.prenom_point_focal }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td class="pl-2">{{ currentPerception?.evaluatedAt }}</td>
                </tr>
              </tbody>
            </table>
            <table id="tableKJI" v-if="!isLoadingData && currentFactuel?.resultats" class="w-full max-w-screen-lg mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="font-semibold border-slate-300 bg-slate-300">
                  <td class="p-2">Principe</td>
                  <td class="p-2">Indice factuel de gouvernance</td>
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
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">FICHE SYNTHESE DE PERCEPTION GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <ExportationSynthesePerception v-if="!isLoadingData && currentPerception" :org="authUser?.nom" :pointfocal="`${authUser?.profil?.nom_point_focal} ${authUser?.profil?.prenom_point_focal}`" :dateevaluation="currentPerception?.evaluatedAt" :current-perception="currentPerception" />
                <DownloadPDFButton :tableIds="['tableOPI', 'TabulatorSynthesePerception']" pageName="Fiche de synthèse Outils de perception" format="a4" />
              </div>
            </div>
            <table id="tableOPI" class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    {{ authUser.nom }}
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ authUser?.profil?.nom_point_focal }} {{ authUser?.profil?.prenom_point_focal }}</td>
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
