<script setup>
import { onMounted, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { colorsOptionFactuel, getColorForValue, optionResponses } from "../../utils/findColorIndicator";
import { useRouter } from "vue-router";
import FormulaireFactuel from "@/services/modules/toolsFactuel.service";

const router = useRouter();
const organizationId = ref("R5P1oK0OP6DmWGvB21RNoeb9Xpgdwr7PNQ4zy0LAM8KnVZEJa5xlOjYkeWBv8aJy");
const enqueteDeCollecteId = ref("RmLpz4vVan0mOqYvjBE8bVZ3DX7or9yB45RxA6Jp4MGkwlPedKL1z2gQe32BXnE1");
const selectStructureId = ref("");
const datasCollection = ref({});
const datasFactuel = ref([]);
const datasPerception = ref([]);
const structures = ref([]);
const isLoadingData = ref(false);

const getDataCollection = async () => {
  isLoadingData.value = true;
  await FormulaireFactuel.getDataFormFactuel(enqueteDeCollecteId.value, organizationId.value)
    .then((result) => {
      datasFactuel.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      console.error(e);
      toast.error("Une erreur est survenue: Resultats des collections .");
    });
};
const getDataCollectionPerception = async () => {
  isLoadingData.value = true;
  await FormulaireFactuel.getDataFormPerception(enqueteDeCollecteId.value, organizationId.value)
    .then((result) => {
      datasPerception.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      console.error(e);
      toast.error("Une erreur est survenue: Resultats des collections .");
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
  getDataCollectionPerception();
};

onMounted(() => {
  getDataCollection();
  getDataCollectionPerception();
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
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ datasCollection.nom }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td>10/10/2024</td>
                </tr>
              </tbody>
            </table>

            <table v-if="!isLoadingData" class="w-full my-12 border border-collapse table-auto border-slate-100" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-blue-900 border-l border-slate-100">
                <!-- <tr>
                  <th class="p-2 border-2 border-slate-100">Outil factuel</th>
                  <th class="p-2 border-2 border-slate-100">Nom</th>
                  <th class="p-2 border-2 border-slate-100">Actions</th>
                </tr> -->
              </thead>

              <tbody>
                <template v-for="(gouvernace, indexGouvernace) in datasFactuel" :key="indexGouvernace">
                  <!-- Gouvernance Row -->
                  <tr class="font-semibold text-white">
                    <td class="p-2 text-center border-2 border-slate-100 bg-primary">{{ indexGouvernace + 1 }}</td>
                    <td class="p-2 border-2 border-slate-100 bg-primary">{{ gouvernace.nom }}</td>
                    <td class="pl-2 space-x-1 text-left border-2 border-slate-100">
                      <!-- <span class="p-2.5 bg-red-600">
                        <input type="checkbox" checked />
                      </span>
                      <span class="p-2.5 bg-green-600">
                        <input type="checkbox" />
                      </span>
                      <span class="p-2.5 bg-yellow-600">
                        <input type="checkbox" />
                      </span>
                      <span class="p-2.5 bg-zinc-600">
                        <input type="checkbox" />
                      </span> -->
                    </td>
                  </tr>

                  <!-- Principes de Gouvernance -->
                  <template v-for="(principe, indexPrincipe) in gouvernace.principes_de_gouvernance" :key="indexPrincipe">
                    <tr class="font-semibold text-black border-slate-100 border-y-4">
                      <td class="p-2 text-center bg-blue-500 border-2 border-slate-100">{{ indexGouvernace + 1 }}. {{ indexPrincipe + 1 }}</td>
                      <td class="p-2 bg-blue-500 border-2 border-slate-100">{{ principe.nom }}</td>
                      <td class="pl-2 space-x-1 text-left bg-transparent border-2 border-slate-100">
                        <!-- <span class="p-2.5 bg-red-600">
                          <input type="checkbox" />
                        </span>
                        <span class="p-2.5 bg-green-600">
                          <input type="checkbox" checked />
                        </span>
                        <span class="p-2.5 bg-yellow-600">
                          <input type="checkbox" />
                        </span>
                        <span class="p-2.5 bg-zinc-600">
                          <input type="checkbox" />
                        </span> -->
                      </td>
                    </tr>

                    <!-- Critères de Gouvernance -->
                    <template v-for="(critere, indexCritere) in principe.criteres_de_gouvernance" :key="indexCritere">
                      <tr v-for="(indicateur, indexIndicateur) in critere.indicateurs_de_gouvernance" :key="indexIndicateur" class="font-bold bg-slate-200 border-slate-100 border-y-2">
                        <td class="p-2 text-center border-2 border-slate-100">{{ indexGouvernace + 1 }}. {{ indexPrincipe + 1 }}. {{ indexCritere + 1 }}</td>
                        <td class="p-2 border-y-2 border-slate-100">{{ indicateur.nom }}</td>
                        <td class="space-x-1 text-right">
                          <span v-for="(color, index) in colorsOptionFactuel" :key="index">
                            <span :style="`background-color: ${color.color}`" class="p-2.5">
                              <input type="checkbox" :checked="indicateur.reponses_collecter && indicateur.reponses_collecter[0] && indicateur.reponses_collecter[0].note == color.value" disabled />
                            </span>
                          </span>
                        </td>
                      </tr>
                    </template>
                  </template>
                </template>
              </tbody>
            </table>
            <LoaderSnipper v-else />
          </TabPanel>
          <!-- tab 2 -->
          <TabPanel class="leading-relaxed">
            <!-- Figure 8 : grille de notation et de détermination de la moyenne pondérée des questions opérationnelles -->
            <div class="w-full p-4 font-bold text-center text-white bg-blue-900 rounded">FICHE SYNTHESE SCORE FACTUEL GOUVERNANCE</div>

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
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ datasCollection.nom }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td>10/10/2024</td>
                </tr>
              </tbody>
            </table>
            <table v-if="!isLoadingData" class="w-full my-12 border border-collapse table-auto border-slate-100" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-blue-900 border-l border-slate-100">
                <!-- <tr>
                  <th class="p-2 border-2 border-slate-100">Outil factuel</th>
                  <th class="p-2 border-2 border-slate-100">Nom</th>
                  <th class="p-2 border-2 border-slate-100">Actions</th>
                </tr> -->
              </thead>

              <tbody>
                <!-- Principes de Gouvernance -->
                <!-- <tr>
                  <td v-for="(option, index) in optionResponses" :key="index" class="p-2 text-center">{{ option }}</td>
                </tr> -->
                <template v-for="(principe, indexPrincipe) in datasPerception" :key="indexPrincipe">
                  <tr class="font-semibold text-black border-slate-100 border-y-4">
                    <td class="p-2 text-center border-2 bg-slate-300 border-slate-100"></td>
                    <td class="p-2 border-2 bg-slate-300 border-slate-100">{{ principe.nom }}</td>
                    <td class="pl-2 space-x-1 text-left bg-transparent border-2 border-slate-100">
                      <!-- <span class="p-2.5 bg-red-600">
                          <input type="checkbox" />
                        </span>
                        <span class="p-2.5 bg-green-600">
                          <input type="checkbox" checked />
                        </span>
                        <span class="p-2.5 bg-yellow-600">
                          <input type="checkbox" />
                        </span>
                        <span class="p-2.5 bg-zinc-600">
                          <input type="checkbox" />
                        </span> -->
                    </td>
                  </tr>

                  <!-- Critères de Gouvernance -->

                  <tr v-for="(indicateur, indexIndicateur) in principe.indicateurs_de_gouvernance" :key="indexIndicateur" class="font-bold bg-green-100 border-slate-100 border-y-2">
                    <td class="p-2 text-center border-2 border-slate-100">{{ indexPrincipe + 1 }}. {{ indexIndicateur + 1 }}</td>
                    <td class="p-2 border-y-2 border-slate-100">{{ indicateur.nom }}</td>
                    <td class="p-2 border-y-2 border-slate-100">
                      <div class="flex space-x-3">
                        <!-- Flex pour l'alignement horizontal des réponses -->
                        <div v-for="(optionReponse, index) in indicateur.options_de_reponse" :key="index" class="flex flex-col items-center space-y-1">
                          <input type="checkbox" :checked="indicateur.reponses_collecter && indicateur.reponses_collecter[0] && optionReponse.note == indicateur.reponses_collecter[0].note" disabled />
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <LoaderSnipper v-else />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Preview>
  </PreviewComponent>
  <!-- END: Boxed Tab -->
</template>
