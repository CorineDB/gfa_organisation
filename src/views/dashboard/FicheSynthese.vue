<script setup>
import { onMounted, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getColorForValue } from "../../utils/findColorIndicator";
import { useRoute, useRouter } from "vue-router";
import ChartSynthese from "../../components/news/ChartSynthese.vue";
import ChartCircular from "../../components/news/ChartCircular.vue";
import TableSyntheseFactuel from "../../components/news/TableSyntheseFactuel.vue";
import TableExample from "../../components/news/TableExample.vue";
import ChartScroreByPrincipe from "../../components/news/ChartScroreByPrincipe.vue";
import ChartOptionResponseByCategorieAndMember from "../../components/news/ChartOptionResponseByCategorieAndMember.vue";
import ChartProgressionByTime from "../../components/news/ChartProgressionByTime.vue";
import ChartScorePerceptionByPrincipe from "../../components/news/ChartScorePerceptionByPrincipe.vue";
import { computed } from "vue";
import TableSynthesePerception from "../../components/news/TableSynthesePerception.vue";

const router = useRouter();
const route = useRoute();
// Il faudra faire les get des organisationId et enqueteDeCollecteId depuis l'url avec router
const idEvaluation = route.params.e;
const organizationId = ref("R5P1oK0OP6DmWGvB21RNoeb9Xpgdwr7PNQ4zy0LAM8KnVZEJa5xlOjYkeWBv8aJy");
const enqueteDeCollecteId = ref("LrDVRGx0Gmqz79w1j3M2AlBbr6apLE5aKyK8XvDeOJYVZPo4dQgkRnx0mjpzOB7k");
const idSelectStructure = ref("");
const dataForAllOrganisation = ref([]);
const datasFactuel = ref([]);
const datasPerception = ref([]);
const structures = ref([]);
const isLoadingData = ref(false);
const datas = [
  {
    id: "KJX3Od8nrE8lA0MQGK5jRvLwD43Yq6BbMy12gz7NkZXOVJnameobpWd9Rm6L419Y",
    nom: "Gouvernance 2",
    indice_factuel: 0.3333333333333333,
    principes_de_gouvernance: [
      {
        id: "V0zMBvj6BY0m6lDbQ1dvLo54pZX9wPKo1x8ANnzE7eVGkMyOJqa2RjrgQDp5R4wq",
        nom: "Principes 1",
        score_factuel: 0.6666666666666666,
        criteres_de_gouvernance: [
          {
            id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
            nom: "Critere 1",
            indicateurs_de_gouvernance: [
              {
                id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                nom: "Rôles et responsabilité clairement",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.3,
              },
              {
                id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                nom: "Responsabilté",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.3,
              },
            ],
          },
          {
            id: "9aLDd6r2DW7jeJ63b8dGoVY1xZ4rBPRpGQl29kymqawK0EnvgNXzpALMAJMYb3Ne",
            nom: "Critere 2",
            indicateurs_de_gouvernance: [
              {
                id: "B3jz7YXwgM3Xo2YVpdBxewyrN70vz1PyZdWRLbZ46O5nq8A9EaGQjkDKmp8ebvd1",
                nom: "La réputation des services bénéficiaires sont conformes aux normes de qualité",
                type: "factuel",
                can_have_multiple_reponse: true,
                note: 1,
              },
              {
                id: "Z5jNqA9V0q74jgVAx2bwZOXeK5EyvGJb6QJdMY9pNLa36nmQRkz81rBoD0aMwmYe",
                nom: "Données de détermination de l'état de conformité",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.44,
              },
            ],
          },
        ],
      },
      {
        id: "V0zMBvj6BY0m6lDbQ1dvLo54pZX9wPKo1x8ANnzE7eVGkMyOJqa2RjrgQDp5R4wq",
        nom: "Principes 2",
        score_factuel: 0.33,
        criteres_de_gouvernance: [
          {
            id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
            nom: "Critere 3",
            indicateurs_de_gouvernance: [
              {
                id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                nom: "Rôles et responsabilité clairement",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.6,
              },
              {
                id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                nom: "Responsabilté",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.3,
              },
            ],
          },
          {
            id: "9aLDd6r2DW7jeJ63b8dGoVY1xZ4rBPRpGQl29kymqawK0EnvgNXzpALMAJMYb3Ne",
            nom: "Critere 4",
            indicateurs_de_gouvernance: [
              {
                id: "B3jz7YXwgM3Xo2YVpdBxewyrN70vz1PyZdWRLbZ46O5nq8A9EaGQjkDKmp8ebvd1",
                nom: "Les services  bénéficiaires sont conformes aux normes de qualité",
                type: "factuel",
                can_have_multiple_reponse: true,
                note: 0.7,
              },
              {
                id: "Z5jNqA9V0q74jgVAx2bwZOXeK5EyvGJb6QJdMY9pNLa36nmQRkz81rBoD0aMwmYe",
                nom: "Données de détermination de l'état de conformité",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.88,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "KJX3OdskljHUIHUI778QGK5jRvLwD43Yq6BbMy12gz7NkZXOVJnameobpWd9Rm6L419Y",
    nom: "Gouvernance 3",
    indice_factuel: 0.88,
    principes_de_gouvernance: [
      {
        id: "V0zMBvj6BY0m6lDbQ1dvLo54pZX9wPKo1x8ANnzE7eVGkMyOJqa2RjrgQDp5R4wq",
        nom: "Principes 1",
        score_factuel: 0.6666666666666666,
        criteres_de_gouvernance: [
          {
            id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
            nom: "Critere 1",
            indicateurs_de_gouvernance: [
              {
                id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                nom: "Rôles et responsabilité clairement",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.3,
              },
              {
                id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                nom: "Responsabilté",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.3,
              },
            ],
          },
          {
            id: "9aLDd6r2DW7jeJ63b8dGoVY1xZ4rBPRpGQl29kymqawK0EnvgNXzpALMAJMYb3Ne",
            nom: "Critere 2",
            indicateurs_de_gouvernance: [
              {
                id: "B3jz7YXwgM3Xo2YVpdBxewyrN70vz1PyZdWRLbZ46O5nq8A9EaGQjkDKmp8ebvd1",
                nom: "La réputation des services bénéficiaires sont conformes aux normes de qualité",
                type: "factuel",
                can_have_multiple_reponse: true,
                note: 1,
              },
              {
                id: "Z5jNqA9V0q74jgVAx2bwZOXeK5EyvGJb6QJdMY9pNLa36nmQRkz81rBoD0aMwmYe",
                nom: "Données de détermination de l'état de conformité",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.44,
              },
            ],
          },
        ],
      },
      {
        id: "V0zMBvj6BY0m6lDbQ1dvLo54pZX9wPKo1x8ANnzE7eVGkMyOJqa2RjrgQDp5R4wq",
        nom: "Principes 2",
        score_factuel: 0.33,
        criteres_de_gouvernance: [
          {
            id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
            nom: "Critere 3",
            indicateurs_de_gouvernance: [
              {
                id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                nom: "Rôles et responsabilité clairement",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.6,
              },
              {
                id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                nom: "Responsabilté",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.3,
              },
            ],
          },
          {
            id: "9aLDd6r2DW7jeJ63b8dGoVY1xZ4rBPRpGQl29kymqawK0EnvgNXzpALMAJMYb3Ne",
            nom: "Critere 4",
            indicateurs_de_gouvernance: [
              {
                id: "B3jz7YXwgM3Xo2YVpdBxewyrN70vz1PyZdWRLbZ46O5nq8A9EaGQjkDKmp8ebvd1",
                nom: "Les services  bénéficiaires sont conformes aux normes de qualité",
                type: "factuel",
                can_have_multiple_reponse: true,
                note: 0.7,
              },
              {
                id: "Z5jNqA9V0q74jgVAx2bwZOXeK5EyvGJb6QJdMY9pNLa36nmQRkz81rBoD0aMwmYe",
                nom: "Données de détermination de l'état de conformité",
                type: "factuel",
                can_have_multiple_reponse: false,
                note: 0.88,
              },
            ],
          },
        ],
      },
    ],
  },
];

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

const changeStructure = () => {
  organizationId.value = idSelectStructure.value;
};

onMounted(async () => {
  await getDataCollection();
  idSelectStructure.value = dataForAllOrganisation.value[0].id;
});
</script>

<template>
  <!-- BEGIN: Boxed Tab -->

  <!-- <TableExample /> -->
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
                <TableSyntheseFactuel :datas="datas" />
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
                  <td>{{ currentOrganisation?.evaluatedAt }}</td>
                </tr>
              </tbody>
            </table>
            <!-- <table v-if="!isLoadingData" class="mt-12 text-sm border-collapse table-fixed w-max">
              <tbody>
                <tr>
                  <th class="p-2">Principe</th>
                  <th class="p-2">Indice Factuel</th>
                </tr>
                <template v-for="(gouvernance, indexGouvernance) in datasFactuel" :key="indexGouvernance">
                  <tr v-for="(principe, indexPrincipe) in gouvernance.principes_de_gouvernance" class="border-b border-slate-300" :key="indexPrincipe">
                    <td class="p-2 font-medium">{{ principe.nom }}</td>
                    <td class="text-center">{{ principe.score_factuel }}</td>
                  </tr>
                </template>
              </tbody>
            </table> -->
            <!-- Tableau de synthese Factuel -->
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
              </tbody>
            </table>
            <!-- <ChartScroreByPrincipe />
            <ChartOptionResponseByCategorieAndMember />
            <ChartProgressionByTime />
            <ChartScorePerceptionByPrincipe /> -->
          </TabPanel>
          <!-- tab 2 -->
          <TabPanel class="leading-relaxed">
            <div class="w-full p-4 font-bold text-center text-white bg-blue-900 rounded">FICHE SYNTHESE SCORE DE PERCEPTION GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <TableSynthesePerception :org="currentOrganisation?.nom" :pointfocal="`${currentOrganisation?.nom_point_focal}  ${currentOrganisation?.prenom_point_focal}`" :dateevaluation="currentOrganisation?.evaluatedAt" :current-perception="currentPerception" />
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
                  <td>{{ currentOrganisation?.evaluatedAt }}</td>
                </tr>
              </tbody>
            </table>
            <table v-if="!isLoadingData" class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="font-semibold border-slate-300 bg-slate-300">
                  <td class="p-2">Principe</td>
                  <td class="p-2">Indice de perception</td>
                </tr>
                <tr v-for="(principe, indexPrincipe) in currentPerception?.synthese" class="border-b border-slate-300" :key="indexPrincipe">
                  <td class="p-2 font-medium">{{ principe.nom }}</td>
                  <td class="text-center">{{ principe.indice_de_perception }}</td>
                </tr>
              </tbody>
            </table>
            <!-- Tableau de synthese Perception -->
            <table v-if="!isLoadingData" class="w-full my-12 border border-collapse table-auto border-slate-500" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-gray-400">
                <tr class="border-b-8 border-white" :style="{ 'background-color': getColorForValue(currentPerception?.indice_de_gouvernance) }">
                  <td colspan="2" class="p-2 text-center">Indice factuel de gouvernance</td>
                  <td class="p-2 text-center">{{ currentPerception?.indice_de_gouvernance }}</td>
                </tr>
                <tr class="text-white bg-blue-900">
                  <th class="p-2 text-center border border-slate-600">Principes</th>
                  <th class="p-2 text-center border border-slate-600">Questions opérationnelles</th>
                  <th class="p-2 text-center border border-slate-600">Scores</th>
                </tr>
              </thead>
              <tbody v-for="(principe, index) in currentPerception?.synthese" :key="principe.id" class="text-black" :style="{ 'background-color': getColorForValue(principe.indice_de_perception) }">
                <!-- Première ligne avec rowspan pour afficher le nom du principe -->
                <tr v-if="principe.questions_de_gouvernance.length > 0">
                  <td :rowspan="principe.questions_de_gouvernance.length + 1" class="p-2 border border-slate-600 text-start">{{ principe.nom }}</td>
                  <td class="p-2 text-center border border-slate-600">{{ principe.questions_de_gouvernance[0].nom }}</td>
                  <td class="p-2 text-center border border-slate-600">{{ principe.questions_de_gouvernance[0].moyenne_ponderee }}</td>
                </tr>
                <!-- Lignes pour afficher chaque question de gouvernance du principe -->
                <tr v-for="(question, qIndex) in principe.questions_de_gouvernance.slice(1)" :key="question.id" :style="{ 'background-color': getColorForValue(question.moyenne_ponderee) }">
                  <td class="p-2 text-center border border-slate-600">{{ question.nom }}</td>
                  <td class="p-2 text-center border border-slate-600">{{ question.moyenne_ponderee }}</td>
                </tr>
                <!-- Dernière ligne pour afficher l'indice de perception du principe -->
                <tr class="text-black">
                  <td class="p-2 text-right border border-slate-600">Indice de perception du principe</td>
                  <td class="p-2 text-center border border-slate-600">{{ principe.indice_de_perception }}</td>
                </tr>
              </tbody>
            </table>
            <LoaderSnipper v-else />

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
</template>

<style scoped>
table td {
  border: 1px solid rgb(0, 0, 0);
}
</style>
