<script setup>
import { onMounted, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getColorForValue } from "../../utils/findColorIndicator";
import { useRouter } from "vue-router";
import ChartSynthese from "../../components/news/ChartSynthese.vue";
import ChartCircular from "../../components/news/ChartCircular.vue";

const router = useRouter();
const organizationId = ref("R5P1oK0OP6DmWGvB21RNoeb9Xpgdwr7PNQ4zy0LAM8KnVZEJa5xlOjYkeWBv8aJy");
const enqueteDeCollecteId = ref("LrDVRGx0Gmqz79w1j3M2AlBbr6apLE5aKyK8XvDeOJYVZPo4dQgkRnx0mjpzOB7k");
const selectStructureId = ref("");
const datasCollection = ref({});
const datasFactuel = ref([]);
const datasPerception = ref([]);
const structures = ref([]);
const isLoadingData = ref(false);

const getDataCollection = async () => {
  isLoadingData.value = true;
  await SyntheseService.get(enqueteDeCollecteId.value, organizationId.value)
    .then((result) => {
      datasCollection.value = result.data.data;
      datasFactuel.value = datasCollection.value.analyse_factuel;
      datasPerception.value = datasCollection.value.analyse_perception;
      isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      console.error(e);
      // toast.error("Une erreur est survenue: Resultats des synthese .");
    });
};

const getStructure = async () => {
  await SyntheseService.getOrganizations()
    .then((result) => {
      structures.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des structures .");
    });
};

const changeStructure = () => {
  organizationId.value = selectStructureId.value;
  getDataCollection();
};

const getTotalIndicateurs = (principe) => {
  return principe.criteres_de_gouvernance.reduce((total, critere) => {
    return total + critere.indicateurs_de_gouvernance.length;
  }, 0);
};

onMounted(() => {
  getDataCollection();
  getStructure();
});
</script>

<template>
  <!-- BEGIN: Boxed Tab -->
  <PreviewComponent class="mt-5 intro-y _box">
    <Preview>
      <TabGroup>
        <TabList class="space-x-4 font-bold uppercase nav-boxed-tabs">
          <Tab class="w-full py-2 bg-white" tag="button">Outil Factuel</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Outil de Perception</Tab>
        </TabList>
        <TabPanels class="mt-5">
          <TabPanel class="leading-relaxed">
            <div class="w-full p-4 font-bold text-center text-white bg-blue-900 rounded">FICHE SYNTHESE SCORE FACTUEL GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <button id="tabulator-print" class="w-1/2 mr-2 btn btn-outline-secondary sm:w-auto"><PrinterIcon class="w-4 h-4 mr-2" /> Imprimer</button>
                <Dropdown class="w-1/2 sm:w-auto">
                  <DropdownToggle class="w-full btn btn-outline-secondary sm:w-auto">
                    <FileTextIcon class="w-4 h-4 mr-2" /> Exporter
                    <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter CSV </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter JSON </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter XLSX </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter HTML </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <table class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    <TomSelect
                      v-model="selectStructureId"
                      :options="{
                        placeholder: 'Sélectionner la structure',
                      }"
                      class="w-full"
                      @change="changeStructure"
                    >
                      <option v-for="(structure, index) in structures" :key="index" :value="structure.id">{{ structure.nom }}</option>
                    </TomSelect>
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ datasCollection.nom }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td>10/09/2024</td>
                </tr>
              </tbody>
            </table>
            <!-- <table v-if="!isLoadingData" class="mt-12 text-sm border-collapse table-fixed w-max">
              <thead class="text-left bg-gray-300 border border-slate-300">
                <tr>
                  <th class="p-2">Principe</th>
                  <th class="p-2">Indice Factuel</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(gouvernance, indexGouvernance) in datasFactuel" :key="indexGouvernance">
                  <tr v-for="(principe, indexPrincipe) in gouvernance.principes_de_gouvernance" class="border-b border-slate-300" :key="indexPrincipe">
                    <td class="p-2 font-medium">{{ principe.nom }}</td>
                    <td class="text-center">{{ principe.score_factuel }}</td>
                  </tr>
                </template>
              </tbody>
            </table> -->
            <!-- Figure 3 : Grille de notation des indicateurs de la gouvernance politique -->
            <table class="w-full my-12 border border-collapse table-auto border-slate-500" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-blue-900">
                <tr>
                  <th class="p-2 text-center text-white">Principes</th>
                  <th class="p-2 text-center text-white">Critères</th>
                  <th class="p-2 text-center text-white">Indicateur</th>
                  <th class="p-2 text-center text-white">Réponses (oui/non)</th>
                  <th class="p-2 text-center text-white">Notes</th>
                  <th class="p-2 text-center text-white">Source de vérification</th>
                </tr>
              </thead>

              <tbody class="text-black bg-white">
                <!-- Indice factuel de gouvernance -->
                <tr class="my-4 bg-blue-600 border-white border-y-8">
                  <td colspan="4" class="p-2 font-bold text-center">Indice factuel de gouvernance</td>
                  <td class="p-2 font-bold text-center">2</td>
                  <td></td>
                </tr>

                <!-- Deuxième section : Redevabilité - Transparence -->
                <tr class="bg-yellow-400">
                  <td rowspan="5" class="p-2 font-bold text-start">Redevabilité</td>
                  <td rowspan="5" class="p-2 text-center">Transparence</td>
                  <td class="p-2 text-center">Indépendance des organes de gouvernance</td>
                  <td class="p-2 text-center">Oui</td>
                  <td class="p-2 text-center">9</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <tr class="bg-green-400">
                  <td class="p-2 text-center">Accès à l'information</td>
                  <td class="p-2 text-center">Oui</td>
                  <td class="p-2 text-center">0,92</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <tr class="bg-red-400">
                  <td class="p-2 text-center">Partage des informations avec les parties prenantes</td>
                  <td class="p-2 text-center">Oui</td>
                  <td class="p-2 text-center">0,1</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <tr class="bg-yellow-400">
                  <td class="p-2 text-center">Publication des rapports financiers</td>
                  <td class="p-2 text-center">Non</td>
                  <td class="p-2 text-center">2</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <tr class="bg-yellow-400">
                  <td class="p-2 text-center">Transparence des mécanismes de prise de décision</td>
                  <td class="p-2 text-center">Oui</td>
                  <td class="p-2 text-center">1</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <!-- Ligne de score factuel pour la deuxième section -->
                <tr class="font-bold bg-yellow-400">
                  <td colspan="4" class="p-2 text-center">Score factuel</td>
                  <td class="p-2 text-center">033</td>
                  <!-- Remplacer par la note calculée -->
                  <td class="p-2 text-center"></td>
                </tr>
                <tr class="bg-green-400">
                  <td rowspan="5" class="p-2 font-bold text-start">Redevabilité</td>
                  <td rowspan="5" class="p-2 text-center">Transparence</td>
                  <td class="p-2 text-center">Indépendance des organes de gouvernance</td>
                  <td class="p-2 text-center">Oui</td>
                  <td class="p-2 text-center">9</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <tr class="bg-red-400">
                  <td class="p-2 text-center">Accès à l'information</td>
                  <td class="p-2 text-center">Oui</td>
                  <td class="p-2 text-center">0,92</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <tr class="bg-yellow-400">
                  <td class="p-2 text-center">Partage des informations avec les parties prenantes</td>
                  <td class="p-2 text-center">Oui</td>
                  <td class="p-2 text-center">0,1</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <tr class="bg-yellow-400">
                  <td class="p-2 text-center">Publication des rapports financiers</td>
                  <td class="p-2 text-center">Non</td>
                  <td class="p-2 text-center">2</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <tr class="bg-green-400">
                  <td class="p-2 text-center">Transparence des mécanismes de prise de décision</td>
                  <td class="p-2 text-center">Oui</td>
                  <td class="p-2 text-center">1</td>
                  <td class="p-2 text-center">Source</td>
                </tr>

                <!-- Ligne de score factuel pour la deuxième section -->
                <tr class="font-bold bg-green-400">
                  <td colspan="4" class="p-2 text-center">Score factuel</td>
                  <td class="p-2 text-center">033</td>
                  <!-- Remplacer par la note calculée -->
                  <td class="p-2 text-center"></td>
                </tr>

                <!-- Ajouter plus de sections si nécessaire -->
              </tbody>
            </table>
            <div class="report-chart">
              <ChartSynthese :height="275" class="mt-6 -mb-6" />
              <ChartCircular :height="275" class="mt-6 -mb-6" />
            </div>
          </TabPanel>
          <!-- tab 2 -->
          <TabPanel class="leading-relaxed">
            <div class="w-full p-4 font-bold text-center text-white bg-blue-900 rounded">FICHE SYNTHESE SCORE DE PERCEPTION GOUVERNANCE</div>
            <!-- Figure 8 : grille de notation et de détermination de la moyenne pondérée des questions opérationnelles -->
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <button id="tabulator-print" class="w-1/2 mr-2 btn btn-outline-secondary sm:w-auto"><PrinterIcon class="w-4 h-4 mr-2" /> Imprimer</button>
                <Dropdown class="w-1/2 sm:w-auto">
                  <DropdownToggle class="w-full btn btn-outline-secondary sm:w-auto">
                    <FileTextIcon class="w-4 h-4 mr-2" /> Exporter
                    <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter CSV </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter JSON </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter XLSX </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter HTML </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <table class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody class="text-black bg-green-400">
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    <TomSelect
                      v-model="selectStructureId"
                      :options="{
                        placeholder: 'Sélectionner la structure',
                      }"
                      class="w-full"
                      @change="changeStructure"
                    >
                      <option v-for="(structure, index) in structures" :key="index" :value="structure.id">{{ structure.nom }}</option>
                    </TomSelect>
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ datasCollection.nom }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td>10/09/2024</td>
                </tr>
              </tbody>
            </table>
            <!-- <table v-if="!isLoadingData" class="mt-12 text-sm border-collapse table-fixed w-max">
              <thead class="text-left bg-gray-300 border border-slate-300">
                <th class="p-2">Principe</th>
                <th class="p-2">Indice de perception</th>
              </thead>
              <tbody>
                <tr v-for="(principe, indexPrincipe) in datasPerception" class="border-b border-slate-300" :key="indexPrincipe">
                  <td class="p-2 font-medium">{{ principe.nom }}</td>
                  <td class="text-center">{{ prinxipe.indice_de_perception }}</td>
                </tr>
              </tbody>
            </table> -->

            <table v-if="!isLoadingData" class="w-full my-12 border border-collapse table-auto border-slate-500" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-gray-400">
                <tr class="border-b-8 border-white" :style="{ 'background-color': getColorForValue(datasPerception.indice_de_perception) }">
                  <td colspan="2" class="p-2 text-center">Indice factuel de gouvernace</td>
                  <td class="p-2 text-center">{{ datasPerception.indice_de_perception }}</td>
                </tr>
                <tr class="text-black">
                  <th class="p-2 text-center border border-slate-600">Principes</th>
                  <th class="p-2 text-center border border-slate-600">Questions opérationnelles</th>
                  <th class="p-2 text-center border border-slate-600">Score</th>
                </tr>
              </thead>

              <tbody v-for="(principe, index) in datasPerception.fiche_de_synthese_de_perception" :key="principe.id" class="text-black" :style="{ 'background-color': getColorForValue(principe.indice_de_perception) }">
                <tr v-if="principe.indicateurs_de_gouvernance.length > 0">
                  <td :rowspan="principe.indicateurs_de_gouvernance.length + 1" class="p-2 border border-slate-600 text-start">{{ principe.nom }}</td>
                  <td class="p-2 text-center border border-slate-600">{{ principe.indicateurs_de_gouvernance[0].nom }}</td>
                  <td class="p-2 text-center border border-slate-600">{{ principe.indicateurs_de_gouvernance[0].moyPQO }}</td>
                </tr>
                <tr v-for="(indicateur, index) in principe.indicateurs_de_gouvernance.slice(1)" :key="indicateur.id" :style="{ 'background-color': getColorForValue(indicateur.moyPQO) }">
                  <td class="p-2 text-center border border-slate-600">{{ indicateur.nom }}</td>
                  <td class="p-2 text-center border border-slate-600">{{ indicateur.moyPQO }}</td>
                </tr>
                <tr class="text-black" v-if="principe.indicateurs_de_gouvernance.length > 0">
                  <td class="p-2 text-right border border-slate-600">Indice de perception du principe</td>
                  <td class="p-2 text-center border border-slate-600">{{ principe.indice_de_perception }}</td>
                </tr>
              </tbody>
            </table>
            <LoaderSnipper v-else />
            <ChartSynthese v-if="!isLoadingData" :height="275" class="mt-6 -mb-6" />

            <!-- <h2 class="py-4 mr-5 text-lg font-medium">Indice de Gouvernace</h2>

            <table class="w-full mb-12 border-collapse table-auto" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-blue-900">
                <tr class="text-white border-t border-white bg-slate-600">
                  <th class="p-2 text-left" _colspan="11">Principes</th>
                  <th class="p-2 text-center">Indice de Perception</th>
                  <th class="p-2 text-center">Indice Synthétique</th>
                </tr>
              </thead>

              <tbody class="bg-white">
                <tr class="font-bold text-white bg-blue-900 border-t-8 border-white">
                  <td class="px-2" colspan="12">Gouvernance politique</td>
                </tr>
                <tr class="pb-2 border-b border-l-2">
                  <td class="px-4 py-1 font-medium bg-sky-500">Redevabilité</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>

                <tr class="pb-2 border-b border-l-2">
                  <td class="px-4 py-1 font-medium bg-sky-500">Transparence</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>

                <tr class="pb-2 border-b border-l-2">
                  <td class="px-4 py-1 font-medium bg-sky-500">Participation</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>

                <tr class="pb-2 border-b border-l-2">
                  <td class="px-4 py-1 font-medium bg-sky-500">Egalité et non-discrimination / inclusion</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>
              </tbody>
            </table> -->
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Preview>
  </PreviewComponent>
  <!-- END: Boxed Tab -->
</template>

<style scoped>
table td {
  border: 1px solid rgb(109, 109, 109);
}
</style>
