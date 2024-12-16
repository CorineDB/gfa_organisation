<script setup>
import { onMounted, computed, reactive, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import RecommandationService from "@/services/modules/recommandation.service";
import ActionAMenerService from "@/services/modules/action_a_mener.service";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getColorForValue } from "@/utils/findColorIndicator";
import { useRoute } from "vue-router";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { getFieldErrors } from "@/utils/helpers.js";

const route = useRoute();
const idEvaluation = route.params.e;
const organizationId = ref(route.params.s);
const authUser = ref("");
const idSelectStructure = ref("");
const errorsMesure = ref({});
const errorsActions = ref({});

const feuilleDeRoute = ref([]); /*reactive([
        {
          id: 1,
          action: "Évaluer les risques",
          start_at: "2024-12-01",
          end_at: "2025-01-26",
          statut: -1,
        },
        {
          id: 2,
          action: "Définir les objectifs",
          start_at: "2024-12-01",
          end_at: "2024-12-01",
          statut: 0,
        },
        {
          id: 3,
          action: "Mettre en place les outils",
          start_at: "2024-12-01",
          end_at: "2024-12-01",
          statut: 0,
        },
]);*/
const mesuresAPrendre = ref([]); /*reactive( [
        {
          id: 1,
          recommandation: "Évaluer les risques",
        },
        {
          id: 2,
          recommandation: "Définir les objectifs",
        },
        {
          id: 3,
          recommandation: "Mettre en place les outils",
          description: "Installer les outils nécessaires pour le suivi des mesures."
        }
      ]
); */

const plan = reactive([
  {
    recommandation: {
      id: "$2fgdfsdf",
      recommandation: "Recommandation 1",
      actionsAMener: [
        {
          id: "1",
          action: "Action 1",
          start_at: "2024-11-01",
          end_at: "2024-12-01",
          validated_at: null,
          statut: 1,
          est_valider: true,
        },
        {
          id: "2",
          action: "Action 2",
          start_at: "2024-11-05",
          end_at: "2024-12-05",
          validated_at: "2024-11-10",
          statut: 0,
          est_valider: false,
        },
      ],
    },
  },
  {
    recommandation: {
      id: "$3dsdfsdf",
      recommandation: "Recommandation 2",
      actionsAMener: [
        {
          id: "3",
          action: "Action 3",
          start_at: "2024-12-01",
          end_at: "2025-01-01",
          validated_at: null,
          statut: -1,
          est_valider: false,
        },
      ],
    },
  },
]);

const isLoading = ref(false);
const collapsedIndex = ref(null);

const showMesureModal = ref(false);
const showActionModal = ref(false);

const isCreate = ref(true);
const currentFactuel = ref("");
const currentPerception = ref("");
const currentProfileGouvernance = ref("");

const recommandationPayload = reactive({ recommandation: "", evaluationId: idEvaluation });
const actionPayload = reactive({ action: "", start_at: "", end_at: "", recommandationId: mesuresAPrendre.length ? mesuresAPrendre[0].id : "", indicateurs: [], evaluationId: idEvaluation });

const openMesureModal = () => {
  showMesureModal.value = true;
};

const openActionModal = () => {
  showActionModal.value = true;
};

const submitMesureData = () => (isCreate.value ? createMesureData() : updateMesureData());
const submitActionData = () => (isCreate.value ? createActionData() : updateActionData());

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
};

const toggleCollapse = (index) => {
  // Toggle the collapsed index: expand if closed, close if open
  collapsedIndex.value = collapsedIndex.value === index ? null : index;
};

const resetMesureForm = () => {
  recommandationPayload.recommandation = "";
  showMesureModal.value = false;
  errorsMesure.value = {};
};

const resetActionForm = () => {
  actionPayload.action = "";
  actionPayload.start_at = "";
  actionPayload.end_at = "";
  actionPayload.recommandationId = "";
  actionPayload.indicateurs = [];
  showActionModal.value = false;
  errorsActions.value = {};
};

const createMesureData = async () => {
  isLoading.value = true;
  await RecommandationService.create(recommandationPayload)
    .then(() => {
      isLoading.value = false;
      getMesuresData();
      resetMesureForm();
      toast.success("Recommandation créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      if (e.response && e.response.status === 422) {
        errorsMesure.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }
      toast.error("Vérifier les informations et ressayer.");
    });
};

const updateMesureData = async (id) => {
  isLoading.value = true;
  await RecommandationService.update(id, recommandationPayload)
    .then(() => {
      isLoading.value = false;
      getMesuresData();
      resetMesureForm();
      toast.success("Recommandation modifiée.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      if (e.response && e.response.status === 422) {
        errorsMesure.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }

      toast.error("Vérifier les informations et ressayer.");
    });
};

const createActionData = async () => {
  isLoading.value = true;
  await ActionAMenerService.create(actionPayload)
    .then(() => {
      isLoading.value = false;
      getFeuilleDeRouteData();
      resetActionForm();
      toast.success("Action créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      if (e.response && e.response.status === 422) {
        errorsActions.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }

      toast.error("Vérifier les informations et ressayer.");
    });
};

const updateActionData = async (id) => {
  isLoading.value = true;
  await ActionAMenerService.update(id, actionPayload)
    .then(() => {
      isLoading.value = false;
      getFeuilleDeRouteData();
      resetActionForm();
      toast.success("Action modifiée.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      if (e.response && e.response.status === 422) {
        errorsActions.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }

      toast.error("Vérifier les informations et ressayer.");
    });
};

const getMesuresData = async () => {
  isLoading.value = true;
  await EvaluationService.getRecommandationsEvaluation(idEvaluation)
    .then((result) => {
      mesuresAPrendre.value = result.data.data;
      isLoading.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoading.value = false;
      toast.error("Une erreur est survenue: Liste des enquêtes.");
    });
};

const getFeuilleDeRouteData = async () => {
  isLoading.value = true;
  await EvaluationService.getFeuilleDeRouteEvaluation(idEvaluation)
    .then((result) => {
      feuilleDeRoute.value = result.data.data;
      isLoading.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoading.value = false;
      toast.error("Une erreur est survenue: Liste des enquêtes.");
    });
};

const changeStructure = () => {
  organizationId.value = idSelectStructure.value;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(async () => {
  await getMesuresData();
  await getFeuilleDeRouteData();
  //await getDataCollection();
  //idSelectStructure.value = dataForAllOrganisation.value[0].id;

  authUser.value = JSON.parse(localStorage.getItem("authenticateUser"));
});
</script>

<template>
  <PreviewComponent class="mt-5 intro-y _box">
    <Preview>
      <TabGroup>
        <TabList class="space-x-4 font-bold uppercase nav-boxed-tabs">
          <Tab class="w-full py-2 bg-white" tag="button">Actions a mener</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Mesures a prendre</Tab>
        </TabList>

        <TabPanels v-show="!isLoading" class="mt-5">
          <!-- Factuel -->
          <TabPanel class="leading-relaxed">
            <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
              <div class="flex"></div>
              <div class="flex">
                <button class="mr-2 shadow-md btn btn-primary" @click="openActionModal">Ajouter une action a prendre</button>
              </div>
            </div>

            <h2 class="mb-4 text-xl font-semibold text-gray-800">Feuille de Route des mesures a prendre</h2>
            <table class="min-w-full border border-collapse border-gray-300">
              <thead>
                <tr class="bg-gray-200">
                  <th class="px-4 py-2 text-left border border-gray-300">Action à mener</th>
                  <th class="px-4 py-2 text-left border border-gray-300">Échéance</th>
                  <th class="px-4 py-2 text-left border border-gray-300">Statut</th>
                </tr>
              </thead>
              <tbody v-if="feuilleDeRoute.length > 0">
                <tr v-for="(action, index) in feuilleDeRoute" :key="index" :class="{ 'bg-gray-50': index % 2 === 0 }">
                  <td class="max-w-full px-4 py-2 truncate border border-gray-300">{{ action.action }}</td>
                  <td class="px-4 py-2 border border-gray-300">{{ formatDate(action.end_at) }}</td>
                  <td class="px-4 py-2 border border-gray-300">
                    <span
                      :class="{
                        'text-green-600 font-semibold': action.statut === 1,
                        'text-yellow-600 font-semibold': action.statut === 0,
                        'text-red-600 font-semibold': action.statut === -1,
                      }"
                    >
                      {{ action.statut === 1 ? "Complété" : action.statut === 0 ? "En cours" : "Non commencé" }}
                    </span>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="3" class="py-4 text-center">Aucune action disponible</td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
          <!-- Perception-->
          <TabPanel class="leading-relaxed">
            <div class="flex flex-wrap items-center justify-between col-span-12 my-4 intro-y sm:flex-nowrap">
              <div class="flex"></div>
              <div class="flex">
                <button class="mr-2 shadow-md btn btn-primary" @click="openMesureModal">Ajouter une mesure a prendre</button>
              </div>
            </div>

            <table class="min-w-full border border-collapse border-gray-300">
              <thead>
                <tr class="bg-gray-200">
                  <th class="px-4 py-2 text-left border border-gray-300">Mesure a prendre</th>
                </tr>
              </thead>
              <tbody v-if="mesuresAPrendre.length > 0">
                <tr v-for="(mesure, index) in mesuresAPrendre" :key="index" :class="{ 'bg-gray-50': index % 2 === 0 }">
                  <td class="max-w-full px-4 py-2 truncate border border-gray-300">{{ mesure.recommandation }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="3" class="py-4 text-center">Aucune mesure disponible</td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
        </TabPanels>
        <LoaderSnipper v-if="isLoading" />
      </TabGroup>
    </Preview>
  </PreviewComponent>

  <!-- Modal Register & Update Recommandation -->
  <Modal backdrop="static" :show="showMesureModal" @hidden="showMesureModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} une recommandation</h2>
    </ModalHeader>
    <form @submit.prevent="submitMesureData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <textarea name="recommandation" class="form-control" v-model="recommandationPayload.recommandation" cols="30" rows="4"></textarea>
          <div v-if="errorsMesure.recommandation" class="mt-2 text-danger">{{ getFieldErrors(errorsMesure.recommandation) }}</div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetMesureForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="mode" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->

  <!-- Modal Register & Update action -->
  <Modal backdrop="static" :show="showActionModal" @hidden="showActionModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} une action</h2>
    </ModalHeader>
    <form @submit.prevent="submitActionData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <textarea name="action" class="form-control" v-model="actionPayload.action" cols="30" rows="4"></textarea>
          <div v-if="errorsActions.action" class="mt-2 text-danger">{{ getFieldErrors(errorsActions.action) }}</div>
          <div class="flex w-full gap-4">
            <InputForm label="Début de l'enquete " :control="getFieldErrors(errorsActions.start_at)" v-model="actionPayload.start_at" type="date" />
            <InputForm label="Fin de l'enquete " :control="getFieldErrors(errorsActions.end_at)" v-model="actionPayload.end_at" type="date" />
          </div>

          <div class="">
            <label class="form-label">Recommandation </label>
            <TomSelect required="false" v-model="actionPayload.recommandationId" :options="{ placeholder: 'Selectionez la mesure auquel il est associe' }" class="w-full">
              <option v-for="(mesure, index) in mesuresAPrendre" :key="index" :value="mesure.id">{{ mesure.recommandation }}</option>
            </TomSelect>
            <div v-if="errorsActions.recommandationId" class="mt-2 text-danger">{{ getFieldErrors(errorsActions.recommandationId) }}</div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetActionForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="mode" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->
</template>

<style scoped>
.table {
  border-collapse: collapse;
  width: 100%;
}

.table th,
.table td {
  text-align: left;
  padding: 8px;
}

.table thead {
  background-color: #f3f4f6;
  font-weight: bold;
}

.table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}
</style>

<style scoped>
/* Layout and Fonts */
.action-plan {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.progress-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.summary-item {
  text-align: center;
  padding: 10px;
  flex: 1;
}

.status-icon {
  font-size: 30px;
}

.category {
  font-weight: bold;
}

.actions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.actions-table th,
.actions-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

/* Status Colors */
.status {
  font-weight: bold;
  text-transform: capitalize;
}

.status.en-cours {
  color: orange;
}

.status.terminer {
  color: green;
}

.status.en-retard {
  color: red;
}

/* Optional: Styling for better visual appearance */
.bg-gray-100 {
  background-color: #f7fafc;
}
.text-green-600 {
  color: #38a169;
}
.text-red-600 {
  color: #e53e3e;
}
.text-yellow-600 {
  color: #d69e2e;
}
</style>
