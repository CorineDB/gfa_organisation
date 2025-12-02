<script setup>
import { computed, onMounted, reactive, ref, getCurrentInstance } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
//import EnqueteDeColleteService from "@/services/modules/enqueteDeCollecte.service";
//import EvaluationService from "@/services/modules/evaluation.gouvernance.service";

import EvaluationService from "@/services/modules/enquetes_de_gouvernance/evaluation.gouvernance.service";
import ResultatSyntheseService from "@/services/modules/enquetes_de_gouvernance/synthese.service";

import { getFieldErrors } from "@/utils/helpers.js";
import { useRouter, useRoute } from "vue-router";
import ProgressBar from "../../../components/news/ProgressBar.vue";
import RankingChart from "./RankingChart.vue";
import ActionPlan from "./ActionPlan.vue";

//vérifier numéro de téléphone
const { proxy } = getCurrentInstance();

const isValid = computed(() => {
  return proxy.$isValidPhoneNumber(participant.phone, "BJ");
});

const router = useRouter();

const route = useRoute();

const payload = reactive({
  nom: "",
  objectif: "",
});

const authUser = reactive({});
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const idEvaluation = route.params.id;
const isLoading = ref(false);
const isLoadingStats = ref(false);
const showModalOrganisation = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const loadingOption = ref(true);
const datas = ref([]);
const feuilleDeRoute = ref([]);
const formulaireFactuel = ref({});
const statistiques = ref({});
const idCurrentOng = ref({});
const errors = ref({});
const currentOptionsPerception = ref({});
const currentOrganisationsOptions = ref("");
const invitationPayload = reactive({ participants: [], nbreParticipants: 0 });
const showInvitationModal = ref(false);

const getStatusText2 = (param) => {
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

const formatDate = (dateString, defaultText = 'Non spécifié') => {
  if (!dateString) return defaultText
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return defaultText
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return defaultText
  }
}

const options = [
  { label: "Adresse Email", id: "email" },
  { label: "Numéro de téléphone", id: "contact" },
];
const participant = reactive({
  type_de_contact: options[0].id,
  email: "",
  phone: "",
});

const participantErrors = ref({
  email: "",
  phone: "",
});

const isEditMode = ref(false);
const editingIndex = ref(-1);
const createData = async () => {
  isLoading.value = true;
  await EvaluationGouvernance.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Soumission créée.");
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

     //console.log("getDatas", datas);

      if (datas.value.factuel?.comite_members) {
        localStorage.setItem("member", JSON.stringify(datas.value.factuel.comite_members));
      }

      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des enquêtes.");
    });
};

const getActionsAMenerData = async () => {
  isLoading.value = true;
  await EvaluationService.getActionsAMenerEvaluation(idEvaluation)
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

const getFormulaireFactuel = async () => {
  isLoadingData.value = true;
  await EvaluationService.getFormulaireFactuelEvaluation(idEvaluation)
    .then((result) => {
      formulaireFactuel.value = result.data.data;
      console.log("formulaireFactuel.value", result.data.data);
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
      console.log("statistiques : ", statistiques.value);
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
  await EvaluationGouvernance.update(idSelect.value, payload)
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
const deleteData = async () => {
  isLoading.value = true;
  await EvaluationService.deleteOneSoumission(idEvaluation, idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Soumission supprimée");
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

const openFactuelModal = () => {
  console.log("formulaireFactuel.value.token", formulaireFactuel.value);

  if (formulaireFactuel.value) {
    router.push({ name: "ToolsFactuel", params: { id: formulaireFactuel.value.token } });
  } else {
    toast.info("Le délail de soumission de l'enquête est passé");
  }
};

const goToDetailSoumission = (idSoumission, type = "factuel") => {
  router.push({ name: "DetailSoumission", params: { e: idEvaluation, s: idSoumission }, query: { type: type } });
};

const goToPageSynthese = (table = null) => {
  const route = { name: "FicheSynthese", params: { e: idEvaluation } };
  if (table) {
    route.query = { table };
  }
  router.push(route);
};

const goToPageMarqueur = () => {
  router.push({ name: "FicheMarqueur", params: { e: idEvaluation } });
};

const goToMesuresAPrendre = (org = null) => {
  router.push({ name: "MesuresAPrendre", params: { e: idEvaluation, s: org ?? authUser.value?.profil?.id } });
};

const goToFactuelSoumissionPage = (Idsoumission, status = false) => {
  if (status == true) {
    router.push({ name: "FicheSynthese", params: { e: idEvaluation } });
  }
};

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

const editParticipant = (participantData, index) => {
  isEditMode.value = true;
  editingIndex.value = index;
  participant.type_de_contact = participantData.type_de_contact;
  participant.email = participantData.email || "";
  participant.phone = participantData.phone || "";
  participantErrors.value.email = "";
  participantErrors.value.phone = "";
};

const addEmail = () => {
  // Réinitialiser l'erreur
  participantErrors.value.email = "";

  // Validation de l'email
  if (!participant.email || participant.email.trim() === "") {
    participantErrors.value.email = "L'adresse email est requise";
    return;
  }

  // Validation format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(participant.email)) {
    participantErrors.value.email = "Format d'email invalide";
    return;
  }

  if (isEditMode.value) {
    // Mode édition - nettoyer les propriétés non utilisées
    const cleanParticipant = {
      type_de_contact: participant.type_de_contact,
      email: participant.email,
    };
    invitationPayload.participants[editingIndex.value] = cleanParticipant;
    toast.success("Email modifié avec succès");
    resetEditMode();
  } else {
    // Mode ajout
    // Check if an email already exists in the payload
    const isEmailAdded = invitationPayload.participants.some((item) => item.email === participant.email);

    if (!isEmailAdded) {
      // Add the participant to the payload - retirer la clé phone
      const cleanParticipant = {
        type_de_contact: participant.type_de_contact,
        email: participant.email,
      };
      invitationPayload.participants.unshift(cleanParticipant);

      console.log(invitationPayload.participants);
      toast.success("Email ajouté avec succès");
    } else {
      participantErrors.value.email = "Adresse email déjà ajoutée";
      return;
    }
  }

  participant.email = ""; // Clear the email field after adding/editing
};

const addPhone = () => {
  // Réinitialiser l'erreur
  participantErrors.value.phone = "";

  // Validation du téléphone
  if (!participant.phone || participant.phone.trim() === "") {
    participantErrors.value.phone = "Le numéro de téléphone est requis";
    return;
  }

  // Check if the phone number is valid
  if (!isValid.value) {
    participantErrors.value.phone = "Numéro de téléphone invalide";
    return;
  }

  if (isEditMode.value) {
    // Mode édition - nettoyer les propriétés non utilisées
    const cleanParticipant = {
      type_de_contact: participant.type_de_contact,
      phone: participant.phone,
    };
    invitationPayload.participants[editingIndex.value] = cleanParticipant;
    toast.success("Téléphone modifié avec succès");
    resetEditMode();
  } else {
    // Mode ajout
    // Check if an phone already exists in the payload
    const isPhoneAdded = invitationPayload.participants.some((item) => item.phone === participant.phone);

    if (!isPhoneAdded) {
      // Add the participant to the payload - retirer la clé email
      const cleanParticipant = {
        type_de_contact: participant.type_de_contact,
        phone: participant.phone,
      };
      invitationPayload.participants.unshift(cleanParticipant);

      console.log(invitationPayload.participants);

      toast.success("Téléphone ajouté avec succès");
    } else {
      participantErrors.value.phone = "Numéro de téléphone déjà ajouté";
      return;
    }
  }

  participant.phone = ""; // Clear the phone field after adding/editing
};

const resetEditMode = () => {
  isEditMode.value = false;
  editingIndex.value = -1;
  participant.email = "";
  participant.phone = "";
  participant.type_de_contact = options[0].id;
};

const resetInvitationForm = () => {
  resetEditMode(); // Reset edit mode when form is reset

  // Vider les champs du formulaire
  participant.email = "";
  participant.phone = "";
  participant.type_de_contact = options[0].id;

  // Réinitialiser le nombre de participants
  invitationPayload.nbreParticipants = 0;

  // Réinitialiser les erreurs des champs
  participantErrors.value.email = "";
  participantErrors.value.phone = "";

  getEvaluation();
  showInvitationModal.value = false;
  errors.value = {};
};

const sendInvitationLink = () => {
  invitationPayload.nbreParticipants = statistiques.value.nbreDeParticipants;
  showInvitationModal.value = true;
};

const sendInvitation = async () => {
  isLoading.value = true;
  try {
    await EvaluationService.addParticipantPerception(idEvaluation, invitationPayload);
    toast.success(`Invitation envoye.`);

    // Vider le tableau après envoi réussi
    invitationPayload.participants = [];
    invitationPayload.nbreParticipants = 0;

    resetInvitationForm();
    errors.value = {};
  } catch (e) {
    console.log("e", e);
    console.log("e.response && e.response.status === 422", e.response && e.response.status === 422);
    if (e.response && e.response.status === 422) {
      // Récupérer les erreurs depuis la response
      errors.value = e.response.data.errors || e.response.data || {};
      console.log("errors.value", errors.value);
    } else {
      toast.error(getAllErrorMessages(e));
    }
  } finally {
    isLoading.value = false;
  }
};

const goToPerceptionSynthesePage = (Idsoumission, status = false) => {
  if (status == true) {
    router.push({ name: "FicheSynthese", params: { e: idEvaluation } });
  }
};

function gotoAppreciations(enquete) {
  router.push({ name: "EnqueteAppreciations", query: { enqueteId: enquete.id } });
}

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
  showModalCreate.value = false;
};

const goToPageSyntheseWithOng = (ong) => {
  router.push({ name: "FicheSynthese", params: { e: idEvaluation }, query: { ong } });
};
const goToPageSoumission = (Idsoumission) => {
  showModalOrganisation.value = false;
  router.push({ name: "soumission", params: { e: idEvaluation, s: Idsoumission } });
};

const opendAddParticipant = () => {
  router.push({ name: "add_participant", query: { e: idEvaluation } });
};

const openPerceptionModal = () => {
  router.push({ name: "ToolsPerception", params: { id: idEvaluation } });
};

const copyPerceptionLink = async () => {
  try {
    //const link = `${window.location.origin}/tools-perception/${statistiques.value.formulaire_de_perception_de_gouvernance?.token || idEvaluation}`;

    const link = `${window.location.origin}/tools-perception/${datas.value.lien_perception_token}`;

    console.log("Data : ", datas);

    await navigator.clipboard.writeText(link);
    toast.success("Lien de soumission copié !");
  } catch (error) {
    console.error("Erreur lors de la copie:", error);
    toast.error("Impossible de copier le lien");
  }
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

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
function getPercentEvolutionOng(id) {
  const ong = statistiques.value.organisations_ranking?.find((item) => item.id == id);
  return ong?.pourcentage_evolution ?? 0;
}

function deleteItem(index) {
  invitationPayload.participants.splice(index, 1);
}

const changeOrganisationOptions = () => {
  loadingOption.value = false;
  setTimeout(() => {
    currentOptionsPerception.value = statistiques.value.options_de_reponse_stats.find((item) => item.id == currentOrganisationsOptions.value);
    loadingOption.value = true;
  }, 100);
};

const currentOrganisation = computed(() => datas.value.find((item) => item.id == idCurrentOng.value));
const statsOptions = computed(() => statistiques.value.options_de_reponse_stats);
const organisations = computed(() => datas.value.map((item) => ({ nom: item.nom, id: item.id })));
const organisationsOptions = computed(() => datas.value.options_de_reponse_stats.map((item) => ({ nom: item.nom, id: item.id })));

onMounted(async () => {
  authUser.value = JSON.parse(localStorage.getItem("authenticateUser"));
  getDatas();
  getEvaluation();
  getFormulaireFactuel();
  getActionsAMenerData();
});
</script>

<template>
  <div class="flex justify-between mt-4 items-center">
    <h2 class="text-lg font-medium intro-y">Soumissions par organisations</h2>
    <button class="btn btn-primary" @click="router.push({ name: 'Programmation_enquete' })">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
  </div>

  <div class="p-5 mt-0 intro-y">
    <div class="" v-if="!isLoadingData">
      <!-- BEGIN: General Report -->
      <div v-if="!isLoadingStats" class="col-span-12 mt-8">
        <div class="flex items-center h-10 intro-y">
          <h2 class="mr-5 text-lg font-medium truncate">Statistiques</h2>
        </div>

        <div class="grid grid-cols-12 gap-6 mt-5">
          <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-center box">
                <div class="flex items-center justify-between">
                  <UsersIcon class="size-10 text-pending" />

                  <div class="mt-2 text-lg font-medium leading-8">Participant</div>
                </div>
                <div class="flex items-center justify-around mt-4">
                  <div class="flex gap-2 text-lg text-left">
                    <div class="mt-1 text-primary">
                      Factuel:
                      <span class="font-semibold">
                        {{ statistiques?.total_participants_evaluation_factuel ?? 0 }}
                      </span>
                    </div>
                    <div class="w-px h-8 bg-slate-400"></div>
                    <div class="mt-1 text-primary">
                      Perception:
                      <span class="font-semibold">
                        {{ statistiques?.total_participants_evaluation_de_perception ?? 0 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-center box">
                <div class="flex items-center justify-between">
                  <BarChart2Icon class="size-10 text-success" />
                  <div class="mt-2 text-lg font-medium leading-8">Soumissions terminées</div>
                </div>
                <div class="flex items-center justify-around mt-4">
                  <div class="flex gap-2 text-lg text-left">
                    <div class="mt-1 text-primary">
                      Factuel:
                      <span class="font-semibold">
                        {{ statistiques?.total_soumissions_factuel_terminer }}
                      </span>
                    </div>
                    <div class="w-px h-8 bg-slate-400"></div>
                    <div class="mt-1 text-primary">
                      Perception:
                      <span class="font-semibold">
                        {{ statistiques?.total_soumissions_de_perception_terminer }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-center box">
                <div class="flex items-center justify-between">
                  <PercentIcon class="size-10 text-warning" />
                  <div class="mt-2 text-lg font-medium leading-8">Pourcentage Évolution</div>
                </div>
                <div class="flex items-center justify-around mt-4">
                  <div class="flex gap-2 text-lg text-left">
                    <div class="mt-1 text-primary">
                      Factuel:
                      <span class="font-semibold"> {{ Math.round(statistiques?.pourcentage_evolution_des_soumissions_factuel) }}% </span>
                    </div>
                    <div class="w-px h-8 bg-slate-400"></div>
                    <div class="mt-1 text-primary">
                      Perception:
                      <span class="font-semibold"> {{ Math.round(statistiques?.pourcentage_evolution_des_soumissions_de_perception) }}% </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoaderSnipper v-else />

      <div v-if="statistiques.statut == 1 && statistiques?.formulaire_perception_de_gouvernance" class="col-span-12 mt-8">
        <div class="flex items-center h-10 intro-y">
          <h2 class="mr-5 text-lg font-medium truncate">Fiches</h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5 text-lg font-medium">
          <div @click="goToPageSynthese" class="flex items-center justify-center col-span-12 gap-1 px-2 transition-all border-l-4 cursor-pointer border-l-primary box hover:shadow-md sm:col-span-4 intro-y">
            <button class="px-4 py-8">Fiches de Synthèse</button>
            <ArrowRightIcon class="size-5" />
          </div>
          <div @click="goToPageMarqueur" class="flex items-center justify-center col-span-12 gap-1 px-2 transition-all border-l-4 cursor-pointer border-l-primary box hover:shadow-md sm:col-span-4 intro-y">
            <button class="px-4 py-8">Marqueur de gouvernance</button>
            <ArrowRightIcon class="size-5" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mt-8">
        <!-- Factuel and Perception Tools Section -->
        <div class="col-span-8 p-6 bg-white rounded-md shadow-lg">
          <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
            <h2 class="mb-6 text-lg font-bold">Outils Auto-Evaluation dsfsdsf</h2>

            <div v-if="statistiques?.statut" class="flex">
              <!-- <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button> -->
              <button class="mr-2 shadow-md btn btn-primary" @click="goToPageMarqueur">Consulter le resultat de l'evaluation</button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-2">
            <div v-if="statistiques?.formulaire_factuel_de_gouvernance" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
              <div class="relative m-5 bg-white">
                <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">Evaluation factuel</div>
              </div>

              <div class="m-5 text-slate-600 dark:text-slate-500">
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Démarré le :
                  <div class="ml-2 font-bold">{{ formatDate(datas.factuel?.created_at, "Pas démarré") }}</div>
                </div>
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Soumis le :
                  <div class="ml-2 font-bold">{{ formatDate(datas.factuel?.submitted_at, "Pas soumis") }}</div>
                </div>
                
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Total membres du comité :
                  <div class="ml-2 font-bold">{{ datas.factuel ? datas.factuel?.comite_members?.length : 0 }}</div>
                </div>
                <div class="mt-4">
                  <!-- <pre>{{ datas.factuel.pourcentage_evolution }}</pre> -->
                  <p>Évolution des soumissions</p>
                  <ProgressBar :percent="datas.factuel ? datas.factuel.pourcentage_evolution : 0" />
                </div>
              </div>

              

              <div v-if="datas.factuel && datas.factuel.pourcentage_evolution > 0" class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                <div class="flex items-center justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                  <button @click.self="goToDetailSoumission(datas.factuel.id, 'factuel')" class="flex items-center justify-center w-full gap-2 py-2.5 flex-1 text-base font-medium bg-outline-primary">
                    Details de la soumission
                    <ExternalLinkIcon class="ml-2 size-5" />
                  </button>

                  <!-- <button class="w-full gap-2 py-[22px]"></button> -->
                  <!-- <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium bg-outline-primary">Marqueur de gouvernance <ArrowRightIcon class="ml-2 size-5" /></button> -->
                </div>
                <button @click.self="goToPageSynthese" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                  Fiche de synthèse
                  <ArrowRightIcon class="ml-2 size-5" />
                </button>
              </div>
             
              <div v-if="!datas.factuel || (datas.factuel && !datas.factuel.statut)" class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                <div class="flex items-center justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                  <!-- <pre>{{ statistiques.statut }}</pre> -->
                  <button v-if="!datas.factuel" @click.self="openFactuelModal" class="flex items-center justify-center w-full gap-2 py-2.5 flex-1 text-base font-medium bg-outline-primary">
                    Demarrer
                    <ArrowRightIcon class="ml-2 size-5" />
                  </button>
                  <button v-else-if="datas.factuel && !datas.factuel.statut" @click.self="openFactuelModal" class="flex items-center justify-center w-full gap-2 py-2.5 flex-1 text-base font-medium bg-outline-primary">
                    Continuer
                    <ArrowRightIcon class="ml-2 size-5" />
                  </button>
                  
                  <!-- <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium bg-outline-primary">Marqueur de gouvernance <ArrowRightIcon class="ml-2 size-5" /></button> -->
                </div>
              </div>

              <div class="absolute top-0 flex w-full">
                <div class="w-1/3 p-1 bg-green-500"></div>
                <div class="flex flex-col w-2/3">
                  <div class="p-0.5 bg-yellow-500"></div>
                  <div class="p-0.5 bg-red-500"></div>
                </div>
              </div>
            </div>

            <div v-if="statistiques.formulaire_de_perception_de_gouvernance" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
              <div class="relative m-5 bg-white">
                <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">Evaluation de Perception</div>
              </div>

              <div class="m-5 text-slate-600 dark:text-slate-500">
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Démarré le :
                  <div class="ml-2 font-bold">{{ datas.perception?.length ? datas.perception.created_at : "Pas démarré" }}</div>
                </div>
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Total participants ayant répondu :

                  <div class="ml-2 font-bold">{{ datas.perception?.length ? datas.perception?.length : 0 }}</div>
                </div>
                <!-- <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Total questions répondues :
                  <div class="ml-2 font-bold">{{ datas.perception?.length ? datas.perception?.reponses_de_la_collecte?.length : 0 }}</div>
                </div> -->

               <div class="mt-4">
                  <!-- <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-semibold text-primary">
                      {{ datas.perception?.length ? statistiques?.pourcentage_evolution_des_soumissions_de_perception : 0 }}%
                    </span>
                  </div> -->
                  <p class="text-sm font-medium text-gray-700">Évolution des soumissions</p>
                  <ProgressBar :percent="datas.perception?.length ? statistiques?.pourcentage_evolution_des_soumissions_de_perception : 0" />
                </div>
              </div>

              <div class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                <!-- Bouton Fiche de synthèse: affiché si pourcentage >= 100 -->
                <button v-if="datas.perception?.length && statistiques.pourcentage_evolution_des_soumissions_de_perception >= 100" @click.self="goToPageSynthese('perception')" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                  Voir Fiche de synthese
                  <ArrowRightIcon class="ml-2 size-5" />
                </button>

                <!-- Boutons d'action: affichés si statut === 0 (en cours) -->
                <div v-if="statistiques.statut === 0" class="flex flex-col items-center w-full">
                  <button @click.self="sendInvitationLink" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium bg-outline-primary border-t border-slate-200/60">
                    Envoyer une invitation
                    <ArrowRightIcon class="ml-2 size-5" />
                  </button>

                  <button v-if="statistiques.formulaire_de_perception_de_gouvernance" @click="copyPerceptionLink" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-success">
                    Copier le lien de soumission
                    <CopyIcon class="ml-2 size-5" />
                  </button>

                  <button v-if="datas.perception?.length" @click="sendReminder" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                    Envoyer un rappel
                    <ExternalLinkIcon class="ml-2 size-5" />
                  </button>
                </div>
              </div>

              <div class="absolute top-0 flex w-full">
                <div class="w-1/3 p-1 bg-green-500"></div>
                <div class="flex flex-col w-2/3">
                  <div class="p-0.5 bg-yellow-500"></div>
                  <div class="p-0.5 bg-red-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ranking Section -->
        <div v-if="statistiques.statut !== 1" class="col-span-4 p-6 bg-white rounded-md shadow-lg">
          <h2 class="mb-4 text-lg font-bold">Classement des soumissions</h2>

          <div class="">
            <!-- List rankings dynamically -->
            <RankingChart :rankingData="statistiques.organisations_ranking" />
          </div>
        </div>

        <div v-else class="flex flex-col justify-start col-span-4 p-6 overflow-x-auto bg-white rounded-md shadow">
          <div class="flex flex-wrap items-center justify-between col-span-12 my-2 intro-y sm:flex-nowrap">
            <div class="flex">
              <h2 class="mr-5 text-lg font-medium truncate">Actions correctionnelle en cours</h2>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between col-span-12 my-2 intro-y sm:flex-nowrap">
            <!-- <button @click="goToMesuresAPrendre" class="mr-2 shadow-md btn btn-primary" >Emettre une mesure a prendre</button> -->
            <button @click="goToMesuresAPrendre" class="mr-2 shadow-md btn btn-primary">Voir Feuille de route</button>
            <button @click="goToMesuresAPrendre" class="mr-2 shadow-md btn btn-primary">Emettre une mesure a prendre</button>
          </div>
          <ActionPlan :actions="feuilleDeRoute" />
        </div>
      </div>
    </div>
    <LoaderSnipper v-if="isLodingData" />
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} une soumission</h2>
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

  <!-- Invitation Modal -->
  <Modal backdrop="static" :show="showInvitationModal" @hidden="showInvitationModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Invitation</h2>
    </ModalHeader>
    <form @submit.prevent="sendInvitation">
      <ModalBody>
        <div class="max-w-screen-lg p-4 mx-auto mt-4 box">
          <InputForm class="" :control="getFieldErrors(errors.nbreParticipants)" label="Nombre de participants" pattern="\d{1,8}" maxlength="8" v-model.number="invitationPayload.nbreParticipants" type="number" />
        </div>
        <hr class="my-5" />
        <div class="max-w-screen-lg p-4 mx-auto mt-6 box">
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
                  <div class="flex-1">
                    <InputForm class="" label="Adresse email" v-model="participant.email" type="email" />
                  </div>
                  <button class="btn btn-primary">
                    <PlusIcon v-if="!isEditMode" class="w-4 h-4 mr-3" />
                    <EditIcon v-else class="w-4 h-4 mr-3" />
                    {{ isEditMode ? "Modifier" : "Ajouter" }}
                  </button>
                  <button v-if="isEditMode" type="button" @click="resetEditMode" class="btn btn-outline-secondary">Annuler</button>
                </div>
              </form>
              <form v-show="participant.type_de_contact === options[1].id" @submit.prevent="addPhone">
                <div class="flex items-end gap-4">
                  <div class="flex-1">
                    <InputForm class="" type="text" label="Numéro de téléphone" maxlength="13" v-model="participant.phone" />
                    <p class="text-xs text-primary mt-3">Ecrivez le numéro directement sans espace ni de signe + (Ex : 229XXZZIIAA)</p>
                  </div>

                  <button class="btn btn-primary">
                    <PlusIcon v-if="!isEditMode" class="w-4 h-4 mr-3" />
                    <EditIcon v-else class="fas fa-save w-4 h-4 mr-3" />
                    {{ isEditMode ? "Modifier" : "Ajouter" }}
                  </button>
                  <button v-if="isEditMode" type="button" @click="resetEditMode" class="btn btn-outline-secondary">Annuler</button>
                </div>
                <div class="col-span-12">
                  <!-- Message de validation avec animation -->
                  <div class="mt-4 _min-h-[1.5rem]">
                    <p v-if="isValid" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
                      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Numéro valide
                    </p>
                    <p v-else-if="participant.phone && participant.phone.length > 0" class="flex items-center text-red-500 font-medium text-sm">
                      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      Numéro invalide
                    </p>
                  </div>
                </div>
              </form>

              <div class="flex flex-wrap items-center w-full max-w-full gap-3">
                <div class="flex items-center justify-between gap-2 px-2 py-1 text-sm font-medium rounded-sm shadow cursor-pointer bg-blue text-primary" v-for="(participant, index) in invitationPayload.participants" :key="index">
                  <span>{{ participant.type_de_contact === "email" ? participant?.email : participant?.phone }}</span>
                  <div class="flex items-center gap-1">
                    <button type="button" @click="editParticipant(participant, index)" class="p-1 transition-colors hover:bg-blue-100" title="Modifier">
                      <PencilIcon class="w-4 h-4 text-blue-600" />
                    </button>
                    <button type="button" @click="deleteItem(index)" class="p-1 transition-colors hover:bg-red-100" title="Supprimer">
                      <TrashIcon class="w-4 h-4 text-danger" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Affichage des erreurs -->
              <div v-if="Object.keys(errors).length > 0" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div v-for="(errorMessages, field) in errors" :key="field" class="mb-2 last:mb-0">
                  <div v-for="(error, index) in errorMessages" :key="index" class="text-sm text-red-600 flex items-start gap-2">
                    <i class="fas fa-exclamation-circle text-red-500 mt-0.5 text-xs"></i>
                    {{ error }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetInvitationForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :disabled="!invitationPayload.participants.length" :loading="isLoading" label="Envoyer l'invitation" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->
</template>
