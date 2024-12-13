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

const route = useRoute();
const idEvaluation = route.params.e;
const organizationId = ref(route.params.s);
const authUser = ref("");
const idSelectStructure = ref("");

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
const mesuresAPrendre = ref([]);  /*reactive( [
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
        recommandation: { id: "$2fgdfsdf", recommandation: "Recommandation 1",
        actionsAMener: [
          { 
            id: "1", 
            action: "Action 1", 
            start_at: "2024-11-01", 
            end_at: "2024-12-01", 
            validated_at: null, 
            statut: 1, 
            est_valider: true 
          },
          { 
            id: "2", 
            action: "Action 2", 
            start_at: "2024-11-05", 
            end_at: "2024-12-05", 
            validated_at: "2024-11-10", 
            statut: 0, 
            est_valider: false 
          },
        ],
         },
        
      },
      {
        recommandation: { id: "$3dsdfsdf", recommandation: "Recommandation 2",actionsAMener: [
          { 
            id: "3", 
            action: "Action 3", 
            start_at: "2024-12-01", 
            end_at: "2025-01-01", 
            validated_at: null, 
            statut: -1, 
            est_valider: false 
          },
        ] },
        
      }
    ]);

const isLoading = ref(false);
const collapsedIndex = ref(null);

const showMesureModal = ref(false);
const showActionModal = ref(false);

const isCreate = ref(true);
const currentFactuel = ref("");
const currentPerception = ref("");
const currentProfileGouvernance = ref("");

const recommandationPayload = reactive({"recommandation": "", "evaluationId":idEvaluation});
const actionPayload = reactive({"action": "", "start_at": "", "end_at": "", "recommandationId": mesuresAPrendre.length ? mesuresAPrendre[0].id : "", "indicateurs": [], "evaluationId": idEvaluation});

const openMesureModal = () => {
  showMesureModal.value = true
};

const openActionModal = () => {
  showActionModal.value = true
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
  showMesureModal.value = false
};

const resetActionForm = () => {
  actionPayload.action = "";
  actionPayload.start_at = "";
  actionPayload.end_at = "";
  actionPayload.recommandationId = "";
  actionPayload.indicateurs = [];
  showActionModal.value = false
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
const getStatus = (statut) => {
      const statuses = {
        "-1": "Non demarre",
        "0": "En cours",
        "1": "En retard",
        "2": "Terminer",
      };
      return statuses[statut] || "Unknown";
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

                <h2 class="text-xl font-semibold text-gray-800 mb-4">Feuille de Route des mesures a prendre</h2>
               
                <div>
                  <table cellspacing="0" cellpadding="10">
                    <thead>
                      <tr>
                        <th>Recommendation</th>
                        <th>Action</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Validated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- Loop through recommendations -->
                      <template v-for="recommendation in feuilleDeRoute.recommandations" :key="recommendation.id">
                        <!-- Recommendation row -->
                        <tr>
                          <td :rowspan="recommendation.actions_a_mener.length + 1">{{ recommendation.recommandation }}</td>
                          <td colspan="5" class="actions-header">
                            <!-- Placeholder for the first action row -->
                          </td>
                        </tr>

                        <!-- Loop through actions of the current recommendation -->
                        <tr v-for="action in recommendation.actions_a_mener" :key="action.id">
                          <td>{{ action.action }}</td>
                          <td>{{ getStatus(action.statut) }}</td>
                          <td>{{ action.start_at }}</td>
                          <td>{{ action.end_at }}</td>
                          <td>{{ action.validated_at }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>

                <!-- <table class="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-gray-200">
                      <th class="border border-gray-300 px-4 py-2 text-left">Action à mener</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Échéance</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody v-if="feuilleDeRoute.length > 0">
                    <tr 
                      v-for="(action, index) in feuilleDeRoute" 
                      :key="index" 
                      :class="{ 'bg-gray-50': index % 2 === 0 }"
                    >
                      <td class="border border-gray-300 px-4 py-2 truncate max-w-full">{{ action.action }}</td>
                      <td class="border border-gray-300 px-4 py-2">{{ formatDate(action.end_at) }}</td>
                      <td class="border border-gray-300 px-4 py-2">
                        <span 
                          :class="{
                            'text-green-600 font-semibold': action.statut === 1,
                            'text-yellow-600 font-semibold': action.statut === 0,
                            'text-red-600 font-semibold': action.statut === -1
                          }"
                        >
                          {{ action.statut === 1 ? 'Complété' : (action.statut === 0 ? 'En cours' : 'Non commencé') }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="3" class="text-center py-4">Aucune action disponible</td>
                    </tr>
                  </tbody>
                </table> -->


          </TabPanel>
          <!-- Perception-->
          <TabPanel class="leading-relaxed">
              <div class="flex flex-wrap items-center justify-between col-span-12 my-4 intro-y sm:flex-nowrap">
                <div class="flex"></div>
                <div class="flex">
                  <button class="mr-2 shadow-md btn btn-primary" @click="openMesureModal">Ajouter une mesure a prendre</button>       
                </div>
              </div>

                <table class="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-gray-200">
                      <th class="border border-gray-300 px-4 py-2 text-left">Mesure a prendre</th>
                    </tr>
                  </thead>
                  <tbody v-if="mesuresAPrendre.length > 0">
                    <tr 
                      v-for="(mesure, index) in mesuresAPrendre" 
                      :key="index" 
                      :class="{ 'bg-gray-50': index % 2 === 0 }"
                    >
                      <td class="border border-gray-300 px-4 py-2 truncate max-w-full">{{ mesure.recommandation }}</td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="3" class="text-center py-4">Aucune mesure disponible</td>
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

          <div class="flex w-full gap-4">
            <InputForm label="Début de l'enquete " v-model="actionPayload.start_at" type="date" />
            <InputForm label="Fin de l'enquete " v-model="actionPayload.end_at" type="date" />
          </div>

          <div class="">
            <label class="form-label">Recommandation </label>
            <TomSelect required="false" v-model="actionPayload.recommandationId" :options="{ placeholder: 'Selectionez la mesure auquel il est associe' }" class="w-full">
              <option v-for="(mesure, index) in mesuresAPrendre" :key="index" :value="mesure.id">{{ mesure.recommandation }}</option>
            </TomSelect>
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

.table th, .table td {
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
th, td {
  padding: 10px;
  text-align: left;
}
.actions-header {
  text-align: center;
  font-weight: bold;
}
</style>