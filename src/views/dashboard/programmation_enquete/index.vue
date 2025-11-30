<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
//import LoaderSnipper from "@/components/LoaderSnipper.vue";

import EvaluationService from "@/services/modules/enquetes_de_gouvernance/evaluation.gouvernance.service";
import ResultatSyntheseService from "@/services/modules/enquetes_de_gouvernance/synthese.service";

import FormulaireFactuel from "@/services/modules/enquetes_de_gouvernance/formFactuel.service";
import FormulaireDePerception from "@/services/modules/enquetes_de_gouvernance/formPerception.service";
import { useRouter } from "vue-router";
import OngService from "@/services/modules/ong.service";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ChartProgressionByTime from "../../../components/news/ChartProgressionByTime.vue";
import ProgressBar from "../../../components/news/ProgressBar.vue";
import ChartScroreByPrincipe from "../../../components/news/ChartScroreByPrincipe.vue";
import { getFieldErrors } from "../../../utils/helpers";

const router = useRouter();

const authUser = reactive({});
const idFormFactuel = ref("");
const idFormPerception = ref("");
const currentProfileGouvernance = [
  { id: 35, nom: "Redevabilité", indice_de_perception: 0.4017361111111111, indice_factuel: 0, indice_synthetique: 0.4017361111111111 },
  { id: 32, nom: "Transparence", indice_de_perception: 0.4375, indice_factuel: 0, indice_synthetique: 0.4375 },
  { id: 33, nom: "Participation", indice_de_perception: 0.3958333333333333, indice_factuel: 0, indice_synthetique: 0.3958333333333333 },
  { id: 36, nom: "Egalité et non- discrimination / inclusion", indice_de_perception: 0.4416666666666666, indice_factuel: 0, indice_synthetique: 0.4416666666666666 },
];
const payload = reactive({
  intitule: "",
  description: "",
  objectif_attendu: 0,
  annee_exercice: new Date().getFullYear(),
  debut: "",
  fin: "",
  formulaires_de_gouvernance: [],
  organisations: [],
});

const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isLoadingDataScore = ref(false);
const isCreate = ref(true);
const datas = ref([]);
const datasScore = ref([]);
const organisations = ref([]);
const formulairesFactuel = ref([]);
const formulairesPerception = ref([]);
const currentScore = ref({});
const currentOrganisationScore = ref("");
const ongSelectedScore = ref("");
const yearSelectedOng = ref("");
const errors = ref({});

const createData = async () => {
  payload.formulaires_de_gouvernance = [idFormFactuel.value, idFormPerception.value];
  isLoading.value = true;
  await EvaluationService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("évaluation créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      if (e.response && e.response.status === 422) {
        errors.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }
      console.error(e);
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await EvaluationService.get()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des évaluations.");
    });
  // initTabulator();
};

const getEvolutionByScore = async (id) => {
  isLoadingDataScore.value = true;

  //await ProgrammeService.scoresAuFilDuTemps(id)
  await ResultatSyntheseService.getEvolutionByScore(id)
    .then((result) => {
      datasScore.value = result.data.data;
      currentScore.value = datasScore.value[0]?.scores;
      isLoadingDataScore.value = false;
    })
    .catch((e) => {
      isLoadingDataScore.value = false;
      e.response?.data?.message ? toast.error(e.response?.data?.message) : toast.error("Une erreur est survenue: Score.");
    });
};
const getFormsFactuel = async () => {
  await FormulaireFactuel.get()
    .then((result) => {
      formulairesFactuel.value = result.data.data;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des formulaires factuel.");
    });
};
const getFormsPerception = async () => {
  await FormulaireDePerception.get()
    .then((result) => {
      formulairesPerception.value = result.data.data;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des formulaires de perception.");
    });
};
const getOrganisations = async () => {
  await OngService.get()
    .then((result) => {
      organisations.value = result.data.data;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des organisations.");
    });
};

const updateData = async () => {
  isLoading.value = true;
  payload.formulaires_de_gouvernance = [idFormFactuel.value, idFormPerception.value];
  await EvaluationService.update(idSelect.value, payload)
    .then(() => {
      getDatas();
      resetForm();
      toast.success("Évaluation modifiée.");
    })
    .catch((e) => {
      if (e.response && e.response.status === 422) {
        errors.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }
      console.error(e);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await EvaluationService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Évaluation  supprimée");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};
const getStatusText = (param) => {
  switch (param) {
    case 1:
      return { label: "Terminé", class: "bg-success" };
    case 0:
      return { label: "En cours", class: "bg-pending" };
    case -1:
      return { label: "Non demarré", class: "bg-primary" };
    default:
      return { label: "A déterminer", class: "bg-primary" };
  }
};

function gotoSoumissions(enquete) {
  router.push({ name: "SoumissionsEnqueteDeCollecte", params: { id: enquete.id } });
}

function gotoAppreciations(enquete) {
  router.push({ name: "EnqueteAppreciations", query: { enqueteId: enquete.id } });
}

async function changeOrganisationScore() {
  await getEvolutionByScore(ongSelectedScore.value);
  yearSelectedOng.value = yearsCurrentScore.value[0];
}

function fetchOrganisationsAndFormulaires() {
  getFormsFactuel();
  getFormsPerception();
  // getOrganisations();
}

const handleEdit = (params) => {
  fetchOrganisationsAndFormulaires();
  isCreate.value = false;
  idSelect.value = params.id;
  payload.intitule = params.intitule;
  payload.description = params.description ?? "";
  payload.annee_exercice = params.annee_exercice;
  payload.objectif_attendu = params.objectif_attendu;
  payload.debut = params.debut;
  payload.fin = params.fin;
  idFormFactuel.value = params.formulaire_factuel_de_gouvernance;
  idFormPerception.value = params.formulaire_perception_de_gouvernance;
  payload.organisations = params.organisations.map((ong) => ong.id);
  showModalCreate.value = true;
};
const handleDelete = (params) => {
  idSelect.value = params.id;
  deleteModalPreview.value = true;
};
const cancelSelect = () => {
  deleteModalPreview.value = false;
  idSelect.value = "";
};
const resetForm = () => {
  payload.intitule = "";
  payload.annee_exercice = new Date().getFullYear();
  payload.objectif_attendu = 0;
  payload.debut = "";
  payload.description = "";
  payload.fin = "";
  idFormFactuel.value = formulairesFactuel.value[0].id;
  idFormPerception.value = formulairesPerception.value[0].id;
  payload.organisations = [];
  showModalCreate.value = false;
  errors.value = {};
};
const openCreateModal = () => {
  fetchOrganisationsAndFormulaires();
  showModalCreate.value = isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

const yearsCurrentScore = computed(() => Object.keys(currentScore.value));

onMounted(async () => {
  authUser.value = JSON.parse(localStorage.getItem("authenticateUser"));
  await getDatas();
  //await getOrganisations();
  ongSelectedScore.value = authUser.value.profil.id;
  changeOrganisationScore();
  // getFormsFactuel();
  // getFormsPerception();
});
</script>

<template>
  <h2 class="my-10 text-lg font-medium intro-y">Évaluation de gouvernance</h2>
  <div class="grid grid-cols-12 gap-6 mb-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
    </div>
  </div>
  <TabGroup>
    <TabList class="space-x-4 font-bold uppercase nav-boxed-tabs">
      <Tab class="w-full py-2 bg-white" tag="button">LISTE DES ÉVALUATIONS</Tab>
      <Tab class="w-full py-2 bg-white" tag="button">ANALYSES DES DONNÉES</Tab>
    </TabList>
    <TabPanels class="mt-5">
      <TabPanel>
        <div class="p-5 mt-5 intro-y">
          
          <div v-if="!isLoadingData"  class="grid grid-cols-12 gap-6 mt-5">
            <div v-for="(item, index) in datas" :key="index" class="col-span-12 p-4 md:col-span-12 lg:col-span-4">
              <div class="p-5 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
                

                <div @click="gotoSoumissions(item)" class="_flex _flex-col _items-start w-full gap-2 mt-2 cursor-pointer">
                  <!-- Item details -->
                  <div class="text-center lg:text-left lg:mt-0">
                    <span class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary line-clamp-1 hover:line-clamp-none transition-all break-words"> {{ item.intitule }}</span>
                  </div>
                </div>

                <!-- Description section with distinct styling -->
                <div @click="gotoSoumissions(item)" class="w-full mt-5 text-center cursor-pointer lg:text-left">
                  

                  <!-- Other details with iconized section headers -->
                  <div class="mt-5 space-y-4 text-gray-600">
                    <div class="flex items-center text-sm font-medium text-gray-700">
                      <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Statut: <span :class="getStatusText(item.statut).class" class="px-3 py-2 ml-3 text-xs text-white rounded-full">{{ getStatusText(item.statut).label }}</span>
                    </div>
                    <div class="flex items-start text-sm font-medium text-gray-700 flex-wrap">
                      <div class="mb-2 flex items-center"><CalendarIcon class="w-4 h-4 mr-2 text-primary" /> Période:</div>
                      <span class="ml-2 font-semibold text-gray-900">{{ item.debut }} <span class="font-normal">au</span> {{ item.fin }}</span>
                    </div>
                    
                    <div class="flex items-center text-sm font-medium text-gray-700">
                      <BarChart2Icon class="w-4 h-4 mr-2 text-primary" /> Total soumissions:
                      <span class="ml-2 font-semibold text-gray-900">{{ item.total_soumissions_de_perception + item.total_soumissions_factuel }}</span>
                    </div>
                    <div class="flex items-center text-sm font-medium text-gray-700">
                      <ProgressBar :percent="item.pourcentage_evolution_organisations" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div v-else class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <div v-if="!isLoadingData && datas.length === 0" class="flex items-center justify-center py-8">
              <p class="text-xl font-medium text-slate-600">La liste des évaluations est vide.</p>
            </div>

          <!-- <LoaderSnipper  /> -->
        </div>
      </TabPanel>
      <TabPanel>
        <div class="">
          <div class="flex flex-col items-center w-full gap-8">
            <div class="flex justify-center w-full p-3 bg-white">
              <div class="w-full max-w-screen-lg">
                <p class="p-3 text-lg font-medium">Résultats synthetique par année</p>
                
                <ChartProgressionByTime :chartData="currentScore" v-if="ongSelectedScore && !isLoadingDataScore" />
                <div class="h-[600px] flex justify-center items-center" v-if="!ongSelectedScore && !isLoadingDataScore">
                  <p class="text-xl font-medium text-slate-600">Veuillez choisir une organisation pour afficher le graphique</p>
                </div>
                <div class="h-[600px] flex justify-center items-center" v-if="isLoadingDataScore">
                     <div  class="flex items-center justify-center py-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                </div>
              </div>
            </div>
            <div class="flex justify-center w-full p-3 bg-white">
              <div class="w-full max-w-screen-lg">
                <p class="p-3 text-lg font-medium">Score des indices par principe</p>
                <div class="!w-[250px] p-3">
                  <label for="years" class="form-label">Année</label>
                  <TomSelect name="years" v-model="yearSelectedOng" :options="{ placeholder: 'Selectionez une organisation' }">
                    <option value=""></option>
                    <option v-for="year in yearsCurrentScore" :key="year" :value="year">{{ year }}</option>
                  </TomSelect>
                </div>
                <ChartScroreByPrincipe v-if="currentScore[yearSelectedOng]?.length > 0" :datas="currentScore[yearSelectedOng]" />
                <div v-else class="h-[600px] flex justify-center items-center">
                  <p class="text-xl font-medium text-slate-600">Aucune données disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} une évaluation</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="payload.intitule" :control="getFieldErrors(errors.intitule)" />
          <InputForm label="Description" :control="getFieldErrors(errors.description)" v-model="payload.description" :required="false" />
          <div class="flex items-center justify-between w-full gap-4">
            <div class="">
              <label for="objectif" class="form-label">Objectif</label>
              <input id="objectif" type="number" min="0.05" step="0.05" max="1" required v-model.number="payload.objectif_attendu" class="form-control" placeholder="Objectif" />
              <div v-if="errors.objectif_attendu" class="mt-2 text-danger">{{ getFieldErrors(errors.objectif_attendu) }}</div>
            </div>
            <div class="">
              <label for="annee" class="form-label">Année</label>
              <input id="annee" type="number" required v-model.number="payload.annee_exercice" class="form-control" placeholder="Année exercice" />
              <div v-if="errors.annee_exercice" class="mt-2 text-danger">{{ getFieldErrors(errors.annee_exercice) }}</div>
            </div>
          </div>
          <div class="flex w-full gap-4">
            <InputForm label="Début de l'enquete " v-model="payload.debut" type="date" :control="getFieldErrors(errors.debut)" />
            <InputForm label="Fin de l'enquete " v-model="payload.fin" type="date" :control="getFieldErrors(errors.fin)" />
          </div>
          <div class="">
            <label class="form-label">Formulaires Factuel</label>
            <TomSelect v-model="idFormFactuel" :options="{ placeholder: 'Selectionez un formulaire' }" class="w-full">
              <option v-for="(form, index) in formulairesFactuel" :key="index" :value="form.id">{{ form.libelle }}</option>
            </TomSelect>
            <div v-if="errors.formulaires_de_gouvernance" class="mt-2 text-danger">{{ getFieldErrors(errors.formulaires_de_gouvernance) }}</div>
          </div>
          <div class="">
            <label class="form-label">Formulaires de perception</label>
            <TomSelect v-model="idFormPerception" :options="{ placeholder: 'Selectionez un formulaire' }" class="w-full">
              <option v-for="(form, index) in formulairesPerception" :key="index" :value="form.id">{{ form.libelle }}</option>
            </TomSelect>
            <div v-if="errors.formulaires_de_gouvernance" class="mt-2 text-danger">{{ getFieldErrors(errors.formulaires_de_gouvernance) }}</div>
          </div>
          <div class="">
            <label class="form-label">Organisations</label>
            <TomSelect v-model="payload.organisations" multiple :options="{ placeholder: 'Selectionez les organisations' }" class="w-full">
              <option v-for="(organisation, index) in organisations" :key="index" :value="organisation.id">{{ organisation.nom }}</option>
            </TomSelect>
            <div v-if="errors.organisations" class="mt-2 text-danger">{{ getFieldErrors(errors.organisations) }}</div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="mode" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->

  <!-- Modal Delete -->
  <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Suppression</div>
        <div class="mt-2 text-slate-500">Supprimer une évaluation?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
