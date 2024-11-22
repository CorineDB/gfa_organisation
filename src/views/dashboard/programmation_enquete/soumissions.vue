<script setup>
import GouvernanceChart from "./GouvernanceChart.vue";
import RankingChart from "./RankingChart.vue";
import ActionPlan from "./ActionPlan.vue";
import SubmissionsProgressionGraph from "./SubmissionsProgressionGraph.vue";
import AverageOptionResponsePerCategorieOfRepondentPie from "./AverageOptionResponsePerCategorieOfRepondentPie.vue";
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import EnqueteDeColleteService from "@/services/modules/enqueteDeCollecte.service";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const route = useRoute();

const payload = reactive({
  nom: "",
  objectif: "",
});

const idSelect = ref("");
const showInvitationModal = ref(false);
const deleteModalPreview = ref(false);
const idEvaluation = route.params.id;
const isLoading = ref(false);
const isLoadingStats = ref(false);
const showModalOrganisation = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const datas = ref([]);
const formulaireFactuel = ref({});
const statistiques = ref({});
const idCurrentOng = ref({});
const authUser = reactive({});

// Sample data
const labels = ["Transparence", "Équité", "Responsabilité", "Participation", "Redevabilité"];
const orgImg = "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29tcGFueSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D";

// Values for each of the indices
const synthetiqueValues = [0.8, 0.6, 0.7, 0.85, 0.75]; // Example for synthetique indices (between 0 and 1)
const factuelValues = [0.7, 0.65, 0.6, 0.8, 0.72]; // Example for factuel indices (between 0 and 1)
const perceptionValues = [0.65, 0.5, 0.55, 0.75, 0.7]; // Example for perception indices (between 0 and 1)
const rankingData = [
  { id: 1, name: "Care Benin", percent: 0.67, image: orgImg },
  { id: 2, name: "SIRAT", percent: 0.67, image: orgImg },
  { id: 3, name: "Care ", percent: 0.5, image: orgImg },
  { id: 4, name: "Care-Benin", percent: 0.35, image: orgImg },
  { id: 4, name: "Care-Benin", percent: 0.12, image: orgImg },
];

const actions_a_mener = reactive({
  "progressSummary": [
    {
      "progressCategory": "Terminer",
      "progressCurrent": 0,
      "progressTotal": 160
    },
    {
      "progressCategory": "En cours",
      "progressCurrent": 139,
      "progressTotal": 160
    },
    {
      "progressCategory": "En retard",
      "progressCurrent": 0,
      "progressTotal": 160
    }
  ],
  "activities": [
    {
      "activityId": 1,
      "activity": "Recruter la mission de surveillance et contrôle général et suivi de la mise en œuvre du PGES dans les bassins Pa3 et Y",
      "tepActuel": 8.75,
      "status": "En cours"
    },
    {
      "activityId": 2,
      "activity": "Construire les collecteurs d'assainissement pluvial et aménager les voies connexes dans les bassins Pa3 et Y",
      "tepActuel": 21.00,
      "status": "En cours"
    },
    {
      "activityId": 3,
      "activity": "Construire les collecteurs d'assainissement pluvial et aménager les voies connexes dans les bassins Pa3 et Y",
      "tepActuel": 19.00,
      "status": "En cours"
    }
  ]
});

const synthetiqueResultsData = {labels: labels, "years": [
  {
    year: 2020,
    synthetiqueValues: [0.7, 0.8, 0.75, 0.85, 0.7],
    factuelValues: [0.6, 0.65, 0.7, 0.72, 0.7],
    perceptionValues: [0.8, 0.82, 0.78, 0.9, 0.7],
  },
  {
    year: 2021,
    synthetiqueValues: [0.78, 0.68, 0.57, 0.95, 0.7],
    factuelValues: [0.7, 0.85, 0.9, 0.82, 0.7],
    perceptionValues: [0.8, 0.82, 0.78, 0.9, 0.7],
  },
  {
    year: 2022,
    synthetiqueValues: [0.8, 0.75, 0.7, 0.88, 0.75],
    factuelValues: [0.72, 0.75, 0.85, 0.9, 0.72],
    perceptionValues: [0.85, 0.88, 0.8, 0.92, 0.7],
  },
  {
    year: 2023,
    synthetiqueValues: [0.82, 0.7, 0.68, 0.9, 0.7],
    factuelValues: [0.75, 0.78, 0.85, 0.88, 0.7],
    perceptionValues: [0.9, 0.85, 0.8, 0.92, 0.7],
  },
  {
    year: 2024,
    synthetiqueValues: [0.85, 0.72, 0.65, 0.92, 0.7],
    factuelValues: [0.77, 0.80, 0.87, 0.9, 0.7],
    perceptionValues: [0.92, 0.9, 0.85, 0.94, 0.7],
  },
]};


// Factuel Tool
const isFactuelOngoing = true; // Switch between ongoing and ended
const factuelProgress = 55; // Current progress percentage
const factuelResult = 0.75;

// Perception Tool
const isPerceptionOngoing = true; // Switch between ongoing and ended
const perceptionProgress = 33.3; // Current progress percentage
const perceptionResult = 0.45;

const submissionProgression = {
  labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], // Time intervals
  datasets: [
    {
      label: "Factuel Tool",
      data: [1, 1, 1, 1, 1], // Number of submissions
      borderColor: "#4F46E5", // Factuel Tool Color
      backgroundColor: "rgba(79, 70, 229, 0.2)",
      fill: true,
    },
    {
      label: "Perception Tool",
      data: [0, 2, 5, 7, 10], // Number of submissions
      borderColor: "#9333EA", // Perception Tool Color
      backgroundColor: "rgba(147, 51, 234, 0.2)",
      fill: true,
    },
  ],
};

const createData = async () => {
  isLoading.value = true;
  await EvaluationService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Soumission créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};

const getDatas = async () => {
  isLoadingData.value = true;
  await EvaluationService.getSoumissionsEvaluation(idEvaluation)
    .then((result) => {
      datas.value = result.data.data;
      console.log(datas.value);
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des enquêtes.");
    });
};


const getFormulaireFactuel = async () => {
  isLoadingData.value = true;
  await EvaluationService.getFormulaireFactuelEvaluation(idEvaluation)
    .then((result) => {
      formulaireFactuel.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des enquêtes.");
    });
};

const getEvaluation = async () => {
  isLoadingStats.value = true;
  await EvaluationService.findEvaluation(idEvaluation)
    .then((result) => {
      statistiques.value = result.data.data;
      isLoadingStats.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingStats.value = false;
      toast.error("Une erreur est survenue: Statistiques.");
    });
};

const updateData = async () => {
  isLoading.value = true;
  await EvaluationService.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Soumission modifiée.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};

const submitData = () => (isCreate.value ? createData() : updateData());

const sendReminder = async () => {
  isLoading.value = true;
  await EvaluationService.sendReminderToPerceptionParticipants(idEvaluation)
    .then(() => {
      toast.success("Rappel envoyé.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Echec envoi du rappel.");
    });
};


const addEmail = () => {
  if (participant.email) {
    // Check if an email already exists in the payload
    const isEmailAdded = invitationPayload.participants.some((item) => item.email === participant.email);

    if (!isEmailAdded) {
      // Add the participant to the payload
      invitationPayload.participants.unshift({ ...participant }); // Use spread to avoid reference issues
      participant.email = ""; // Clear the email field after adding
    } else {
      // Show a message if the email is already added
      toast.info("Adresse email déjà ajoutée");
    }
  }
};

const addPhone = () => {
  if (participant.phone) {
    // Check if an phone already exists in the payload
    const isPhoneAdded = invitationPayload.participants.some((item) => item.phone === participant.phone);

    if (!isPhoneAdded) {
      // Add the participant to the payload
      invitationPayload.participants.unshift({ ...participant }); // Use spread to avoid reference issues
      participant.phone = ""; // Clear the phone field after adding
    } else {
      // Show a message if the phone is already added
      toast.info("Numéro de téléphone déja ajouté");
    }
  }
};

const resetInvitationForm = () => {

  const invitationPayload = reactive({"participants": []});
  showInvitationModal.value = false
};

const sendInvitationLink = () => {
  showInvitationModal.value = true
};

const sendInvitation = async () => {
  isLoading.value = true;
  try {
    await EvaluationService.addParticipantPerception(idEvaluation, invitationPayload);
    toast.success(`Invitation envoye.`);
    resetInvitationForm();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};

const deleteData = async () => {
  isLoading.value = true;
  await EvaluationService.deleteOneSoumission(idEvaluation, idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Soumission supprimé");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};

const getStatusText = (param) => {
  if (param === 100) {
    return "Soumis";
  } else if (param > 0) {
    return "En cours";
  } else if (param === 0) {
    return "Non demarré";
  }
};

function gotoAppreciations(enquete) {
  router.push({ name: "EnqueteAppreciations", query: { enqueteId: enquete.id } });
}

const handleEdit = (params) => {
  /*console.log(params);

  isCreate.value = false;
  idSelect.value = params.id;
  payload.nom = params.nom;
  payload.description = params.description;
  payload.objectif = params.objectif;
  payload.debut = params.debut;
  payload.fin = params.fin;
  showModalCreate.value = true;*/
  router.push({ name: "ToolsFactuel", query: { enqueteId: route.params.id } });
};

const viewResultats = (organisationId) => {
  router.push({ name: "resultat_collecte", query: { enqueteId: route.params.id, organisationId: organisationId } });
};

const viewSynthese = (organisationId) => {
  router.push({ name: "FicheSynthese", query: { enqueteId: route.params.id, organisationId: organisationId } });
};
const viewMarqueur = (organisationId) => {
  router.push({ name: "marqueur", query: { enqueteId: route.params.id, organisationId } });
};

const handleDelete = (id) => {
  idSelect.value = id;
  deleteModalPreview.value = true;
};
const cancelSelect = () => {
  deleteModalPreview.value = false;
  idSelect.value = "";
};
const resetForm = () => {
  payload.nom = "";
  payload.description = "";
  payload.objectif = "";
  payload.debut = "";
  payload.fin = "";
  showModalCreate.value = false
};



const options = [
  { label: "Adresse Email", id: "email" },
  { label: "Numéro de téléphone", id: "contact" },
];
const participant = reactive({
    type_de_contact: options[0].id,
    email: "",
    phone: "",
  });
  
const currentOption = ref(options[0].id);
const currentPhone = ref("");
const invitationPayload = reactive({"participants": []});

const openFactuelModal = () => {
  router.push({ name: "ToolsFactuel", params: { id: formulaireFactuel.value.token } });
};

const goToDetailSoumission = (idSoumission) => {
  router.push({ name: "DetailSoumission", params: { e: idEvaluation, s: idSoumission } });
};

const goToPageSynthese = () => {
  router.push({ name: "FicheSynthese", params: { e: idEvaluation } });
};

const goToPageMarqueur = () => {
  router.push({ name: "FicheMarqueur", params: { e: idEvaluation } });
};

const goToMesuresAPrendre = (org = null) => {
  router.push({ name: "MesuresAPrendre", params: { e: idEvaluation, s: org ?? authUser.value?.profil?.id } });
};

const goToFactuelSoumissionPage = (Idsoumission, status = false) => {
  if(status == true){
    router.push({ name: "FicheSynthese", params: { e: idEvaluation } });
  }
};

const goToPerceptionSynthesePage = (Idsoumission, status = false) => {
  if(status == true){
    router.push({ name: "FicheSynthese", params: { e: idEvaluation } });
  }
};

const goToPerceptionSoumissionPage = (Idsoumission) => {
  router.push({ name: "FicheSynthese", params: { e: idEvaluation } });
};

const opendAddParticipant = () => {
  router.push({ name: "add_participant", query: { e: idEvaluation } });
};

const recommandation = () => {
  router.push({ name: "Recommandation", query: { e: idEvaluation } });
};

const openPerceptionModal = () => {
  router.push({ name: "ToolsPerception", params: { id: idEvaluation } });
};

// Fonction pour trouver les soumissions de type "factuel"
function getFactuelSubmissions(soumissions) {
  return soumissions.filter((sub) => sub.type === "factuel");
}

// Fonction pour trouver les soumissions de type "perception"
function getPerceptionSubmissions(soumissions) {
  return soumissions.filter((sub) => sub.type === "perception");
}

function changeCurrentDetailOrganisation(id) {
  idCurrentOng.value = id;
  showModalOrganisation.value = true;
}

onMounted(() => {
  authUser.value = JSON.parse(localStorage.getItem("authenticateUser"));
  getDatas();
  getFormulaireFactuel();
  getEvaluation();
});
</script>
<style>
.circular-progress {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#4caf50 calc(var(--percentage) * 100%), #ddd 0%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: #4caf50;
}
</style>
<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <!-- <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div> -->
      <div class="flex">
        <!-- <button class="mr-2 shadow-md btn btn-primary" @click="openFactuelModal">Remplir formulaire Factuel</button>
        <button class="mr-2 shadow-md btn btn-primary" @click="openPerceptionModal">Remplir formulaire de perception</button> -->
      </div>
      <div class="flex">
        <!-- <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button> -->
        <button class="mr-2 shadow-md btn btn-primary" @click="opendAddParticipant">Ajouter les participants</button>       
      </div>
    </div>
  </div>

  <div class="p-5 mt-5 intro-y">
    <div class="" v-if="!isLoadingData">
      <!-- BEGIN: General Report -->
      <div v-if="!isLoadingStats" class="col-span-12 mt-8">
        <div class="flex items-center h-10 intro-y">
          <h2 class="mr-5 text-lg font-medium truncate">Statistiques</h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-center box">
                <div class="flex justify-center space-x-4">
                  <!-- Icon and Text -->
                  <div class="text-left">
                    <div class="mt-2 text-3xl font-medium leading-8">{{ statistiques?.total_soumissions_de_perception_terminer + statistiques?.total_soumissions_factuel_terminer }} / {{ statistiques?.total_participants_evaluation_factuel + statistiques?.total_participants_evaluation_de_perception }}</div>
                    <div class="mt-1 text-base text-slate-500" style="color: black">Nombre des participants</div>
                  </div>

                  <!-- Circular Progress Bar -->
                  <div class="relative flex items-center mt-8 size-20 justify-right">
                    <div class="circular-progress" :style="{ '--percentage': statistiques?.pourcentage_evolution }">{{ Math.round(statistiques?.pourcentage_evolution) }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-left box">
                <div class="flex justify-left">
                  <BarChart2Icon class="report-box__icon text-success" />
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">{{ statistiques?.total_soumissions_de_perception_terminer + statistiques?.total_soumissions_factuel_terminer }}</div>
                <div class="mt-1 text-base text-slate-500" style="color: black">Total soumissions en attente</div>
              </div>
            </div>
          </div>

          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-left box">
                <div class="flex justify-left">
                  <BarChart2Icon class="report-box__icon text-success" />
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">{{ statistiques?.total_soumissions_de_perception_terminer + statistiques?.total_soumissions_factuel_terminer }}</div>
                <div class="mt-1 text-base text-slate-500" style="color: black">Total soumissions en cours</div>
              </div>
            </div>
          </div>

          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-left box">
                <div class="flex justify-left">
                  <BarChart2Icon class="report-box__icon text-success" />
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">{{ statistiques?.total_soumissions_de_perception_terminer + statistiques?.total_soumissions_factuel_terminer }}</div>
                <div class="mt-1 text-base text-slate-500" style="color: black">Total soumissions terminé</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoaderSnipper v-else />

      <div class="col-span-12 p-6 mt-8 bg-white rounded-md shadow-lg">
        <div class="grid grid-cols-12">
          <!-- Factuel and Perception Tools Section -->
          <div class="col-span-7 pr-4 border-r">
            <AverageOptionResponsePerCategorieOfRepondentPie />
          </div>

          <!-- Ranking Section -->
          <div class="col-span-5 pl-4 border-l">
            <h2 class="mb-4 text-lg font-bold">Submissions Progression Graph</h2>

            <div class="">
              <SubmissionsProgressionGraph />
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 mt-8">
        <!-- Chart and Ranking Layout -->
        <div class="grid grid-cols-2 gap-6 mt-5">
          <!-- Gouvernance Chart -->
          <div class="p-4 overflow-x-auto bg-white rounded-md shadow justify-left">
            <!-- Section Header -->
            <div class="flex items-center h-10 intro-y">
              <h2 class="mr-5 text-lg font-medium truncate">Resultats synthetique</h2>
            </div>
            <!-- <GouvernanceChart :synthetiqueResultsData="synthetiqueResultsData" class="w-full h-auto max-w-[600px] max-h-[400px]" /> -->

            <GouvernanceChart :labels="labels" :synthetiqueValues="synthetiqueValues" :factuelValues="factuelValues" :perceptionValues="perceptionValues" class="w-full h-auto max-w-[600px] max-h-[400px]" />
          </div>

          <!-- Ranking Chart -->
          <div class="overflow-x-auto flex flex-col justify-start p-4 bg-white shadow rounded-md">
            
            <div class="flex flex-wrap items-center justify-between col-span-12 my-2 intro-y sm:flex-nowrap">
              <div class="flex">
                <h2 class="mr-5 text-lg font-medium truncate">Actions correctionnelle en cours</h2>
              </div>
              <div class="flex">
                <button @click="goToMesuresAPrendre" class="mr-2 shadow-md btn btn-primary" >Emettre une mesure a prendre</button>
                <button class="mr-2 shadow-md btn btn-primary" >Consulter la Feuille de route</button>
              </div>
            </div>
            <ActionPlan />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mt-8">
        <!-- Factuel and Perception Tools Section -->
        <div class="col-span-8 p-6 bg-white rounded-md shadow-lg">

          <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
            <h2 class="mb-6 text-lg font-bold">Outils Auto-Evaluation</h2>

            <div v-if="statistiques?.statut" class="flex">
              <!-- <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button> -->
              <button class="mr-2 shadow-md btn btn-primary" @click="goToPageMarqueur">Consulter le resultat de l'evaluation</button>
            </div>
          </div>

          <!-- <div class="grid grid-cols-2 gap-6">
            <-- Factuel Tool ->
            <div class="p-4 bg-gray-100 rounded-md shadow">
              <div class="flex items-center justify-between">
                <-- Tool Title ->
                <h3 class="font-semibold text-blue-700 text-md">Factuel Tool</h3>
                <-- Circular Progress Bar ->
                <div class="relative">
                  <svg class="w-10 h-10 transform rotate-180" viewBox="0 0 36 36">
                    <circle class="text-gray-300" stroke-width="4" fill="none" cx="18" cy="18" r="16" />
                    <circle class="text-blue-500" stroke-width="4" stroke-dasharray="100" :stroke-dashoffset="100 - factuelProgress" stroke-linecap="round" fill="none" cx="18" cy="18" r="16" />
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-700"> {{ factuelProgress }}% </span>
                </div>
              </div>

              <-- Statistics Points ->
              <ul v-if="isFactuelOngoing" class="mt-4 space-y-2 text-sm text-gray-700">
                <li><span class="font-medium">Completion Rate:</span> {{ factuelProgress }}%</li>
                <li><span class="font-medium">Time Taken:</span> 12m 45s</li>
              </ul>
              <ul v-else class="mt-4 space-y-2 text-sm text-gray-700">
                <li><span class="font-medium">Time Taken:</span> 12m 45s</li>
              </ul>
            </div>

            <-- Perception Tool ->
            <div class="p-4 bg-gray-100 rounded-md shadow">
              <div class="flex items-center justify-between">
                <-- Tool Title ->
                <h3 class="font-semibold text-purple-700 text-md">Perception Tool</h3>
                <-- Circular Progress Bar ->
                <div class="relative">
                  <svg class="w-10 h-10 transform rotate-180" viewBox="0 0 36 36">
                    <circle class="text-gray-300" stroke-width="4" fill="none" cx="18" cy="18" r="16" />
                    <circle class="text-purple-500" stroke-width="4" stroke-dasharray="100" :stroke-dashoffset="100 - perceptionProgress" stroke-linecap="round" fill="none" cx="18" cy="18" r="16" />
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-700"> {{ perceptionProgress }}% </span>
                </div>
              </div>

              <-- Statistics Points ->
              <ul v-if="isPerceptionOngoing" class="mt-4 space-y-2 text-sm text-gray-700">
                <li><span class="font-medium">Total Respondents:</span> 4 / 12</li>
                <li><span class="font-medium">Average Progress:</span> {{ perceptionAverageProgress }}%</li>
                <li><span class="font-medium">Average Time Taken:</span> 48h 45s</li>
                <li><span class="font-medium">Response Rate:</span> {{ perceptionResponseRate }}</li>

                <li><span class="font-medium">Completion Rate:</span> {{ perceptionProgress }}%</li>
              </ul>
              <div v-else>
                <-- Final results ->
                <p class="text-sm font-bold text-green-600">Results: {{ perceptionResult }}</p>
              </div>
            </div>
          </div> -->

          <div class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-2">
            <div @click="goToFactuelSoumissionPage(datas.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
              <!-- Type and Status Badge Row for FACTUELLE -->
              <div class="flex items-center justify-between m-5 bg-white pt-[0.1rem]">
                <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px]">FACTUELLE</div>
                <div :class="[false ? 'bg-green-500' : 'bg-yellow-500', 'px-2 py-1 text-xs font-bold text-white rounded-full']">
                  {{ datas?.factuel ? (datas.factuel.statut ? "Terminer" : "En cours") : "En cours" }}
                </div>
              </div>

              <div class="m-5 text-slate-600 dark:text-slate-500">
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Start At
                  <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel.created_at : "Not Defined" }}</div>
                </div>
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Submitted At
                  <div class="ml-2 font-bold">{{ datas?.factuel ? (datas.factuel.submitted_at != null ? datas.factuel.submitted_at : "Not Defined") : "Not Defined" }}</div>
                </div>
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Total question repondu:
                  <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel.reponses_de_la_collecte.length : 0 }}</div>
                </div>
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Total Membres du comite:
                  <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel?.comite_members?.length : 0 }}</div>
                </div>
              </div>

              <!-- Horizontal Progress Bar -->
              <div class="w-full h-2 mt-2 bg-gray-200">
                <div class="h-full bg-green-500" :style="{ width: (datas.factuel ? datas.factuel.pourcentage_evolution : 30) + '%' }"></div>
              </div>

              <div class="flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                  {{ datas?.factuel ? (datas.factuel.statut ? "Voir Soumission" : "Continuer") : "Continuer" }}
                  <ExternalLinkIcon class="ml-2 size-5" />
                </button>
              </div>

            <div v-if="(datas?.factuel?.statut) && (formulaireFactuel?.terminer)" class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button @click="goToDetailSoumission(datas?.factuel?.id)" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Voir Details de la soumission
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
              <button @click="goToPageSynthese" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Consulter la Fiche de synthese
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div  v-else class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button @click="openFactuelModal" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Continuer
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

              <div class="absolute top-0 flex w-full">
                <div class="w-1/3 p-1 bg-green-500"></div>
                <div class="flex flex-col w-2/3">
                  <div class="p-0.5 bg-yellow-500"></div>
                  <div class="p-0.5 bg-red-500"></div>
                </div>
              </div>
            </div>
            <div @click="goToPerceptionSynthesePage(datas.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
            <!-- Type and Status Badge Row for PERCEPTION -->
            <div class="flex items-center justify-between m-5 bg-white pt-[0.1rem]">
              <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px]">PERCEPTION</div>
              <div :class="[false ? 'bg-green-500' : 'bg-yellow-500', 'px-2 py-1 text-xs font-bold text-white rounded-full']">
                {{ datas?.perception ? (datas.perception.pourcentage_evolution == 100 ? "Terminer" : "En cours") : "En cours" }}
              </div>
            </div>

            <div class="m-5 text-slate-600 dark:text-slate-500">
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Start At
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception.created_at : "Not Defined" }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total participants:
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception?.length : 0 }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total question repondu:
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception?.reponses_de_la_collecte?.length : 0 }}</div>
              </div>
            </div>

            <!-- Horizontal Progress Bar -->
            <div class="w-full h-2 mt-2 bg-gray-200">
              <div class="h-full bg-green-500" :style="{ width: (datas?.perception ? datas.perception.pourcentage_evolution : 6.25) + '%' }"></div>
            </div>

            <div v-if="statistiques?.statut" class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button @click="goToPageMarqueur" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                {{ statistiques ? (statistiques.statut ? "Voir Fiche de synthese" : "") : "" }}
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div  v-else class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button @click="sendInvitationLink" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Envoyer invitation
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
              <button @click="sendReminder" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Envoyer un rappel
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div class="absolute top-0 flex w-full">
              <div class="w-1/3 p-1 bg-green-500"></div>
              <div class="flex flex-col w-2/3">
                <div class="p-0.5 bg-yellow-500"></div>
                <div class="p-0.5 bg-red-500"></div>
              </div>
            </div>
          </div>

          <!-- <div v-if="datas?.factuel" @click="goToFactuelSoumissionPage(datas.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
            <div class="relative m-5 bg-white">
              <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">
                {{ datas.factuel.type }}
              </div>
            </div>
            <div class="m-5 text-slate-600 dark:text-slate-500">
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total de Soumissions:
                <div class="ml-2 font-bold">{{ (datas?.factuel ? datas.factuel.length : 0) + (datas?.perception ? datas.perception.length : 0) }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions Factuel:
                <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel.length : 0 }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions de Perception:
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception.length : 0 }}</div>
              </div>
            </div>

            <div class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Afficher les soumissions
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div class="absolute top-0 flex w-full">
              <div class="w-1/3 p-1 bg-green-500"></div>
              <div class="flex flex-col w-2/3">
                <div class="p-0.5 bg-yellow-500"></div>
                <div class="p-0.5 bg-red-500"></div>
              </div>
            </div>
          </div>
          <div v-if="datas?.perception" v-for="(perception, index) in datas.perception" @click="changeCurrentDetailOrganisation(datas.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
            <div class="relative m-5 bg-white">
              <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">
                {{ datas.nom }}
              </div>
            </div>
            <div class="m-5 text-slate-600 dark:text-slate-500">
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total de Soumissions:
                <div class="ml-2 font-bold">{{ (datas?.factuel ? datas.factuel.length : 0) + (datas?.perception ? datas.perception.length : 0) }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions Factuel:
                <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel.length : 0 }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions de Perception:
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception.length : 0 }}</div>
              </div>
            </div>

            <div class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Afficher les soumissions
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div class="absolute top-0 flex w-full">
              <div class="w-1/3 p-1 bg-green-500"></div>
              <div class="flex flex-col w-2/3">
                <div class="p-0.5 bg-yellow-500"></div>
                <div class="p-0.5 bg-red-500"></div>
              </div>
            </div>
          </div> -->
          <div v-if="!(datas?.factuel && datas?.perception)">Aucune soumission</div>
        </div>
        </div>

        <!-- Ranking Section -->
        <div class="col-span-4 p-6 bg-white rounded-md shadow-lg">
          <h2 class="mb-4 text-lg font-bold">Ranking of Submissions</h2>

          <div class="">
            <!-- List rankings dynamically -->
            <RankingChart :rankingData="rankingData" />
            <!-- <div
              v-for="(org, index) in rankingData"
              :key="index"
              class="flex items-center justify-between pb-2 border-b"
            >
              <div class="flex items-center space-x-2">
                <img :src="org.image" alt="Org Logo" class="w-8 h-8 rounded-full" />
                <span class="font-medium text-gray-700">{{ org.name }}</span>
              </div>
              <span class="text-sm font-bold text-gray-800">{{ org.percent }} %</span>
            </div> -->
          </div>
        </div>
      </div>

      <section>
        <p class="pb-4 mt-10 text-lg font-medium intro-y">Liste des soumissions par organisations</p>
        <div class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <div @click="goToFactuelSoumissionPage(datas.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
            <!-- Type and Status Badge Row for FACTUELLE -->
            <div class="flex items-center justify-between m-5 bg-white pt-[0.1rem]">
              <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px]">FACTUELLE</div>
              <div :class="[false ? 'bg-green-500' : 'bg-yellow-500', 'px-2 py-1 text-xs font-bold text-white rounded-full']">
                {{ datas?.factuel ? (datas.factuel.statut ? "Terminer" : "En cours") : "En cours" }}
              </div>
            </div>

            <div class="m-5 text-slate-600 dark:text-slate-500">
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Start At
                <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel.created_at : "Not Defined" }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Submitted At
                <div class="ml-2 font-bold">{{ datas?.factuel ? (datas.factuel.submitted_at != null ? datas.factuel.submitted_at : "Not Defined") : "Not Defined" }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total question repondu:
                <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel.reponses_de_la_collecte.length : 0 }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total Membres du comite:
                <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel?.comite_members?.length : 0 }}</div>
              </div>
            </div>

            <!-- Horizontal Progress Bar -->
            <div class="w-full h-2 mt-2 bg-gray-200">
              <div class="h-full bg-green-500" :style="{ width: (datas.factuel ? datas.factuel.pourcentage_evolution : 30) + '%' }"></div>
            </div>
            <div class="flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                {{ datas?.factuel ? (datas.factuel.statut ? "Voir Soumission" : "Continuer") : "Continuer" }}
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div class="absolute top-0 flex w-full">
              <div class="w-1/3 p-1 bg-green-500"></div>
              <div class="flex flex-col w-2/3">
                <div class="p-0.5 bg-yellow-500"></div>
                <div class="p-0.5 bg-red-500"></div>
              </div>
            </div>
          </div>
          <div @click="goToPerceptionSynthesePage(datas.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
            <!-- Type and Status Badge Row for PERCEPTION -->
            <div class="flex items-center justify-between m-5 bg-white pt-[0.1rem]">
              <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px]">PERCEPTION</div>
              <div :class="[false ? 'bg-green-500' : 'bg-yellow-500', 'px-2 py-1 text-xs font-bold text-white rounded-full']">
                {{ datas?.perception ? (datas.perception.pourcentage_evolution == 100 ? "Terminer" : "En cours") : "En cours" }}
              </div>
            </div>

            <div class="m-5 text-slate-600 dark:text-slate-500">
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Start At
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception.created_at : "Not Defined" }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total participants:
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception?.length : 0 }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total question repondu:
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception?.reponses_de_la_collecte?.length : 0 }}</div>
              </div>
            </div>

            <!-- Horizontal Progress Bar -->
            <div class="w-full h-2 mt-2 bg-gray-200">
              <div class="h-full bg-green-500" :style="{ width: (datas?.perception ? datas.perception.pourcentage_evolution : 6.25) + '%' }"></div>
            </div>

            <div v-if="statistiques?.statut" class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button @click="opendAddParticipant" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                {{ statistiques ? (statistiques.statut ? "Voir Fiche de synthese" : "") : "" }}
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div  v-else class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button @click="opendAddParticipant" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Envoyer invitation
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
              <button @click="notifyParticipants" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Envoyer un rappel
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div class="absolute top-0 flex w-full">
              <div class="w-1/3 p-1 bg-green-500"></div>
              <div class="flex flex-col w-2/3">
                <div class="p-0.5 bg-yellow-500"></div>
                <div class="p-0.5 bg-red-500"></div>
              </div>
            </div>
          </div>

          <!-- <div v-if="datas?.factuel" @click="goToFactuelSoumissionPage(datas.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
            <div class="relative m-5 bg-white">
              <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">
                {{ datas.factuel.type }}
              </div>
            </div>
            <div class="m-5 text-slate-600 dark:text-slate-500">
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total de Soumissions:
                <div class="ml-2 font-bold">{{ (datas?.factuel ? datas.factuel.length : 0) + (datas?.perception ? datas.perception.length : 0) }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions Factuel:
                <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel.length : 0 }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions de Perception:
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception.length : 0 }}</div>
              </div>
            </div>

            <div class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Afficher les soumissions
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div class="absolute top-0 flex w-full">
              <div class="w-1/3 p-1 bg-green-500"></div>
              <div class="flex flex-col w-2/3">
                <div class="p-0.5 bg-yellow-500"></div>
                <div class="p-0.5 bg-red-500"></div>
              </div>
            </div>
          </div>
          <div v-if="datas?.perception" v-for="(perception, index) in datas.perception" @click="changeCurrentDetailOrganisation(datas.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
            <div class="relative m-5 bg-white">
              <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">
                {{ datas.nom }}
              </div>
            </div>
            <div class="m-5 text-slate-600 dark:text-slate-500">
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total de Soumissions:
                <div class="ml-2 font-bold">{{ (datas?.factuel ? datas.factuel.length : 0) + (datas?.perception ? datas.perception.length : 0) }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions Factuel:
                <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel.length : 0 }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions de Perception:
                <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception.length : 0 }}</div>
              </div>
            </div>

            <div class="absolute bottom-0 flex items-center justify-center w-full border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
              <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                Afficher les soumissions
                <ExternalLinkIcon class="ml-2 size-5" />
              </button>
            </div>

            <div class="absolute top-0 flex w-full">
              <div class="w-1/3 p-1 bg-green-500"></div>
              <div class="flex flex-col w-2/3">
                <div class="p-0.5 bg-yellow-500"></div>
                <div class="p-0.5 bg-red-500"></div>
              </div>
            </div>
          </div> -->
          <div v-if="!(datas?.factuel && datas?.perception)">Aucune soumission</div>
        </div>
      </section>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} une soummission</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="payload.nom" />
          <InputForm label="Objectif" v-model="payload.objectif" />
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

  <!-- Invitation Modal -->
  <Modal backdrop="static" :show="showInvitationModal" @hidden="showInvitationModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Invitation</h2>
    </ModalHeader>
    <form @submit.prevent="sendInvitation">
      <ModalBody>
            
        <div class="max-w-screen-lg p-4 mx-auto mt-10 box">
          <p class="text-base font-medium">Ajouter des participants</p>
          <hr class="my-4" />
          <div class="gap-4 m-h-[50vh] flex flex-col justify-between">
            <div class="space-y-6">
              <div>
                <label class="form-label">Type de données</label>
                <div class="flex gap-2">
                  <div v-for="(option, index) in options" :key="index" class="form-check">
                    <input v-model="participant.type_de_contact" :id="option.id" class="form-check-input" type="radio" name="option" :value="option.id" />
                    <label class="form-check-label" :for="option.id">{{ option.label }}</label>
                  </div>
                </div>
              </div>
              <form v-show="participant.type_de_contact === options[0].id" @submit.prevent="addEmail">
                <div class="flex items-end gap-4">
                  <InputForm class="" label="Adresse email" v-model="participant.email" type="email" />
                  <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
                </div>
              </form>
              <form v-show="participant.type_de_contact === options[1].id" @submit.prevent="addPhone">
                <div class="flex items-end gap-4">
                  <InputForm class="" label="Numéro de téléphone" pattern="\d{1,8}" maxlength="8" v-model.number="participant.phone" type="number" />
                  <!-- <div class="">
                    <label for="Numéro de téléphone" class="form-label">Numéro de téléphone</label>
                    <input id="Numéro de téléphone" type="number" pattern="\d{1,8}" maxlength="8" required v-model.number="currentPhone" class="form-control" placeholder="Numéro de téléphone" />
                  </div> -->
                  <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
                </div>
              </form>

              <div class="flex flex-wrap items-center w-full max-w-full gap-3">
                <div class="flex items-center justify-between gap-2 px-2 py-1 text-sm font-medium bg-blue rounded-sm shadow cursor-pointer text-primary" v-for="(participant, index) in invitationPayload.participants" :key="index">
                  <span>{{ participant.type_de_contact === 'email' ? participant?.email : participant?.phone }}</span>
                  <button @click="deleteItem(index)" class="p-1 transition-colors hover:bg-red-100"><XIcon class="w-4 h-4 text-danger" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetInvitationForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Envoyer l'invitation" />
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
        <div class="mt-2 text-slate-500">Supprimer une soummission?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->

  <!-- Modal Register & Update -->
  <!-- <Modal size="modal-xl" :show="showModalOrganisation" @hidden="showModalOrganisation = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ datas?.nom }}</h2>
    </ModalHeader>
    <ModalBody>
      <div class="grid grid-cols-1 gap-4">
        <TabGroup>
          <TabList class="nav-boxed-tabs">
            <Tab class="w-full py-2" tag="button">Soumissions Factuelles</Tab>
            <Tab class="w-full py-2" tag="button">Soumissions de Perception </Tab>
          </TabList>
          <TabPanels class="mt-5">
            <TabPanel class="max-h-[80vh] overflow-y-auto">
              <div class="flex flex-col gap-2" v-if="datas?.factuel">
                <div v-for="(soumission, index) in datas.factuel" :key="index" class="flex items-center justify-between w-full gap-2 px-2 py-3 text-base font-medium text-black truncate transition-all bg-white border border-l-4 rounded shadow-md border-primary">
                  <p>
                    Soumission n° {{ index + 1 }} ( {{ soumission.submitted_at }}) <span :class="[soumission.statut ? 'bg-green-500' : 'bg-yellow-500']" class="px-2 py-1 mr-1 text-xs text-white rounded-full">{{ soumission.statut ? "Terminé" : "En cours" }}</span>
                  </p>
                  <div class="flex items-center gap-4">
                    <-- <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button> ->
                    <button v-if="!soumission.statut" class="p-2 text-danger" @click="handleDelete(soumission.id)">
                      <TrashIcon class="size-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-lg text-center">
                <p>Liste de soumissions vide.</p>
              </div>
            </TabPanel>
            <TabPanel class="max-h-[80vh] overflow-y-auto">
              <div class="flex flex-col gap-2" v-if="datas?.perception">
                <div v-for="(soumission, index) in datas.perception" :key="index" class="flex items-center justify-between w-full gap-2 px-2 py-3 text-base font-medium text-black truncate transition-all bg-white border border-l-4 rounded shadow-md border-primary">
                  <p>
                    Soumission n° {{ index + 1 }} ( {{ soumission.submitted_at }}) <span :class="[soumission.statut ? 'bg-green-500' : 'bg-yellow-500']" class="px-2 py-1 mr-1 text-xs text-white rounded-full">{{ soumission.statut ? "Terminé" : "En cours" }}</span>
                  </p>
                  <div class="flex items-center gap-4">
                    <-- <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button> ->
                    <button v-if="!soumission.statut" class="p-2 text-danger" @click="handleDelete(soumission.id)">
                      <TrashIcon class="size-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-lg text-center">
                <p>Liste de soumissions vide.</p>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModalOrganisation = false" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Fermer</button>
      </div>
    </ModalFooter>
  </Modal> -->
  <!-- End Modal -->
</template>
<style scoped>
/* Circular Progress */
svg {
  stroke-width: 4;
}

circle.text-gray-300 {
  stroke: #e5e7eb;
  /* Gray background circle */
}

circle.text-blue-500 {
  stroke: #3b82f6;
  /* Blue progress for Factuel */
}

circle.text-purple-500 {
  stroke: #a855f7;
  /* Purple progress for Perception */
}
</style>
