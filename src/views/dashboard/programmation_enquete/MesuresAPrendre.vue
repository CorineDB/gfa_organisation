<script setup>
import { onMounted, computed, reactive, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import RecommandationService from "@/services/modules/enquetes_de_gouvernance/recommandation.service";
import ActionAMenerService from "@/services/modules/enquetes_de_gouvernance/action_a_mener.service";
import EvaluationService from "@/services/modules/enquetes_de_gouvernance/evaluation.gouvernance.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getColorForValue } from "@/utils/findColorIndicator";
import { useRouter, useRoute } from "vue-router";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { getFieldErrors } from "@/utils/helpers.js";
import DeleteButton from "@/components/news/DeleteButton.vue";

const route = useRoute();
const router = useRouter();
const idEvaluation = route.params.e;
const organizationId = ref(route.params.s);
const authUser = ref("");
const idSelectStructure = ref("");

const idSelect = ref("");

const feuilleDeRoute = ref([]);
const mesuresAPrendre = ref([]);
const errorsMesure = ref({});
const errorsActions = ref({});

const isLoading = ref(false);
const collapsedIndex = ref(null);

const showMesureModal = ref(false);
const showDeleteMesureModal = ref(false);
const showActionModal = ref(false);
const showDeleteActionModal = ref(false);

let isCreate = ref(true);
const currentFactuel = ref("");
const currentPerception = ref("");
const currentProfileGouvernance = ref("");

const recommandationPayload = reactive({ recommandation: "", evaluationId: idEvaluation, indicateurs: [], principes_factuel_de_gouvernance: [], questions_operationnelle: [], principes_de_perception_de_gouvernance: [] });
const actionPayload = reactive({ action: "", start_at: "", end_at: "", recommandationId: mesuresAPrendre.length ? mesuresAPrendre[0].id : "", indicateurs: [], principes_factuel_de_gouvernance: [], questions_operationnelle: [], principes_de_perception_de_gouvernance: [], evaluationId: idEvaluation });

const openMesureModal = () => {
  showMesureModal.value = true;
};

const editMesureModal = (mesure) => {
  // mode.value = "Modifier";
  isCreate.value = false;
  recommandationPayload.recommandation = mesure.recommandation;
  showMesureModal.value = true;
  idSelect.value = mesure.id;
};

const openActionModal = () => {
  showActionModal.value = true;
};

const editActionModal = (action) => {
  isCreate.value = false;
  actionPayload.action = action.action;
  actionPayload.start_at = action.start_at;
  actionPayload.end_at = action.end_at;
  actionPayload.recommandationId = action.recommandationId;
  showActionModal.value = true;
  idSelect.value = action.id;
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
  recommandationPayload.indicateurs = [];
  recommandationPayload.questions_operationnelle = [];
  recommandationPayload.principes_factuel_de_gouvernance = [];
  recommandationPayload.principes_de_perception_de_gouvernance = [];
  showMesureModal.value = false;
  isCreate.value = true;
  errorsMesure.value = {};
};

const resetActionForm = () => {
  actionPayload.action = "";
  actionPayload.start_at = "";
  actionPayload.end_at = "";
  actionPayload.recommandationId = "";
  actionPayload.indicateurs = [];
  actionPayload.questions_operationnelle = [];
  actionPayload.principes_factuel_de_gouvernance = [];
  actionPayload.principes_de_perception_de_gouvernance = [];
  showActionModal.value = false;
  isCreate.value = true;
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
  await RecommandationService.update(idSelect.value, recommandationPayload)
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

const handleDeleteMesure = (params) => {
  idSelect.value = params.id;
  showDeleteMesureModal.value = true;
};

const deleteMesureData = async () => {
  isLoading.value = true;
  await RecommandationService.destroy(idSelect.value)
    .then(() => {
      showDeleteMesureModal.value = false;
      isLoading.value = false;
      toast.success("Recommandation supprimée");
      getMesuresData();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
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
  await ActionAMenerService.update(idSelect.value, actionPayload)
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

const handleDeleteAction = (params) => {
  idSelect.value = params.id;
  showDeleteActionModal.value = true;
};

const deleteActionData = async () => {
  isLoading.value = true;
  await ActionAMenerService.destroy(idSelect.value)
    .then(() => {
      showDeleteActionModal.value = false;
      isLoading.value = false;
      toast.success("Action correctionnelle supprimée");
      getFeuilleDeRouteData();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
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
const getStatus = (statut) => {
  const statuses = {
    "-1": "Non demarre",
    0: "En cours",
    1: "En retard",
    2: "Terminer",
  };
  return statuses[statut] || "Unknown";
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(async () => {
  console.log(idEvaluation.value)
  await getMesuresData();
  await getFeuilleDeRouteData();
  //await getDataCollection();
  //idSelectStructure.value = dataForAllOrganisation.value[0].id;

  authUser.value = JSON.parse(localStorage.getItem("authenticateUser"));
});

const goBack = () => {
  router.push({
    name: "SoumissionsEnqueteDeCollecte",
    params: {
      id: route.params.e,
    },
  });
};
</script>

<template>
  <div class="flex justify-between mt-4 items-center">
    <h2 class="text-lg font-medium intro-y">Action à mener et recommandation</h2>
    <button class="btn btn-primary" @click="goBack">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
  </div>
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

            <h2 class="text-xl font-semibold text-gray-800 mb-4">Feuille de Route des mesures a prendre</h2>

            <div>
              <table cellspacing="0" cellpadding="10">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Validated At</th>
                    <th>Actions</th>
                    <!-- New Actions column -->
                  </tr>
                </thead>
                <tbody>
                  <!-- Loop through recommendations -->
                  <template v-for="recommendation in feuilleDeRoute.recommandations" :key="recommendation.id">
                    <!-- Recommendation row -->
                    <!-- <tr>
                          <td :rowspan="recommendation.actions_a_mener.length + 1">{{ recommendation.recommandation }}</td>
                          <td colspan="5" class="actions-header">
                            
                          </td>
                        </tr> -->

                    <tr class="highlight-row">
                      <td colspan="5">{{ recommendation.recommandation }}</td>
                      <td class="actions-cell">
                        <!-- Actions buttons for the recommendation -->
                        <button class="action-button mr-2" @click="editMesureModal(recommendation)"><EditIcon class="w-4 h-4" /></button>
                        <button class="action-button mr-2" @click="handleDeleteMesure(recommendation)"><TrashIcon class="w-4 h-4" /></button>
                      </td>
                    </tr>
                    <!-- Loop through actions of the current recommendation -->
                    <tr v-for="action in recommendation.actions_a_mener" :key="action.id">
                      <td>{{ action.action }}</td>
                      <td>{{ getStatus(action.statut) }}</td>
                      <td>{{ action.start_at }}</td>
                      <td>{{ action.end_at }}</td>
                      <td>{{ action.validated_at }}</td>
                      <td class="actions-cell">
                        <!-- Action buttons for each individual action -->
                        <button class="action-button mr-2" @click="editActionModal(action)"><EditIcon class="w-4 h-4" /></button>
                        <button class="action-button mr-2" @click="handleDeleteAction(action)"><TrashIcon class="w-4 h-4" /></button>
                        <!-- <button class="action-button" @click="editActionModal(action)">Edit</button>
                        <button class="action-button" @click="handleDeleteAction(action)">Delete</button> -->
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
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
              <!-- <option value=""></option> -->
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

  <!-- Modal Delete -->
  <Modal :show="showDeleteActionModal" @hidden="showDeleteActionModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Suppression</div>
        <div class="mt-2 text-slate-500">Supprimer cette action correctionnelle?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteActionData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->

  <!-- Modal Delete -->
  <Modal :show="showDeleteMesureModal" @hidden="showDeleteMesureModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Suppression</div>
        <div class="mt-2 text-slate-500">Supprimer cette recommandation?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteMesureData" />
      </div>
    </ModalBody>
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

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 10px;
  text-align: left;
}
.actions-header {
  text-align: center;
  font-weight: bold;
}
.highlight-row {
  background-color: #f0f8ff; /* Light blue for highlighting */
  background-color: rgb(15, 52, 96); /* Darker blue accent color */
  color: #f0f8ff; /* Light blue for highlighting */
  font-weight: bold;
}
</style>
