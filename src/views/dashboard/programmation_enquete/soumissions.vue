<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import EnqueteDeColleteService from "@/services/modules/enqueteDeCollecte.service";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import { getFieldErrors } from "@/utils/helpers.js";
import { useRouter, useRoute } from "vue-router";
import ProgressBar from "../../../components/news/ProgressBar.vue";
import RankingChart from "./RankingChart.vue";
import ActionPlan from "./ActionPlan.vue";

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

const options = [
  { label: "Adresse Email", id: "email" },
  { label: "Numéro de téléphone", id: "contact" },
];
const participant = reactive({
  type_de_contact: options[0].id,
  email: "",
  phone: "",
});
const createData = async () => {
  isLoading.value = true;
  await EnqueteDeColleteService.create(payload)
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
      console.log(statistiques.value);
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
  await EnqueteDeColleteService.update(idSelect.value, payload)
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

const openFactuelModal = () => {
  console.log("formulaireFactuel.value.token", formulaireFactuel.value);

  if (formulaireFactuel.value) {
    router.push({ name: "ToolsFactuel", params: { id: formulaireFactuel.value.token } });
  } else {
    toast.info("Le délail de soumission de l'enquête est passé");
  }
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
  /* 
  invitationPayload.participants = [];
  invitationPayload.nbreParticipants = 0; */

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
    resetInvitationForm();
    errors.value = {};
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
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
// const currentOptionsPerception = computed(() => {
//   return statistiques.value.options_de_reponse_stats.find((item) => item.id == currentOrganisationsOptions.value);
// });

onMounted(async () => {
  /* await getDatas();
  if (route.query.ong) {
    changeCurrentDetailOrganisation(route.query.ong.toString());
  }
  getEvaluation(); */

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
          <!-- <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-center box">
                <div class="flex items-center justify-between">
                  <GlobeIcon class="size-10 text-primary" />

                  <div class="mt-2 text-lg font-medium leading-8">Organisations</div>
                </div>
                <div class="flex items-center justify-around mt-4">
                  <div class="flex gap-2 text-lg text-left">
                    <div class="mt-1 text-primary">
                      Total:
                      <span class="font-semibold">
                        {{ datas.length }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
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

      <div v-if="statistiques.statut == 1 && statistiques?.formulaire_perception_de_gouvernance " class="col-span-12 mt-8">
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
            <h2 class="mb-6 text-lg font-bold">Outils Auto-Evaluation</h2>

            <div v-if="statistiques?.statut" class="flex">
              <!-- <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button> -->
              <button class="mr-2 shadow-md btn btn-primary" @click="goToPageMarqueur">Consulter le resultat de l'evaluation</button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-2">
            <div @click="goToFactuelSoumissionPage(datas.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
              <div class="relative m-5 bg-white">
                <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">Evaluation factuel</div>
              </div>

              <div class="m-5 text-slate-600 dark:text-slate-500">
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Start At:
                  <div class="ml-2 font-bold">{{ datas?.factuel ? datas.factuel.created_at : "Not Defined" }}</div>
                </div>
                <div class="flex items-center">
                  <BarChart2Icon class="w-4 h-4 mr-2" /> Submitted_at At:
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
                <div class="mt-4">
                  <!-- <pre>{{ datas.factuel.pourcentage_evolution }}</pre> -->
                  <p>Évolution soumissions</p>
                  <ProgressBar :percent="datas.factuel ? datas.factuel.pourcentage_evolution : 0" />
                </div>
              </div>

              <!-- <div v-if="(datas.factuel && datas.factuel.statut) || (datas.factuel && datas.factuel.pourcentage_evolution >= 100)" class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400"> -->

              <!-- <div v-if="(datas.factuel && datas.factuel.statut) || (datas.factuel && datas.factuel.pourcentage_evolution >= 100)" class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                <div class="flex items-center justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                  <button v-if="(datas.factuel && datas.factuel.statut) || (datas.factuel && datas.factuel.pourcentage_evolution >= 100)" @click.self="goToDetailSoumission(datas?.factuel?.id)" class="flex items-center justify-center w-full gap-2 py-2.5 flex-1 text-base font-medium bg-outline-primary">
                    Details de la soumission
                    <ExternalLinkIcon class="ml-2 size-5" />
                  </button>

                  <button v-else class="w-full gap-2 py-[22px]"></button>
                  <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium bg-outline-primary">Marqueur de gouvernance <ArrowRightIcon class="ml-2 size-5" /></button>
                </div>
                <button v-if="(datas.factuel && datas.factuel.statut) || (datas.factuel && datas.factuel.pourcentage_evolution >= 100)" @click.self="goToPageSynthese" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                  Fiche de synthèse
                  <ArrowRightIcon class="ml-2 size-5" />
                </button>
              </div> -->

              <div v-if="datas.factuel && datas.factuel.pourcentage_evolution > 0" class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                <div class="flex items-center justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                  <button @click.self="goToDetailSoumission(datas?.factuel?.id)" class="flex items-center justify-center w-full gap-2 py-2.5 flex-1 text-base font-medium bg-outline-primary">
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

              <div v-if="!datas.factuel || (datas.factuel && !datas.factuel.statut) || (datas.factuel && datas.factuel.pourcentage_evolution < 100)" class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                <div class="flex items-center justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                  <!-- <pre>{{ statistiques.statut }}</pre> -->
                  <button v-if="(datas.factuel && !datas.factuel.statut == false) || (datas.factuel && datas.factuel.pourcentage_evolution < 100)" @click.self="openFactuelModal" class="flex items-center justify-center w-full gap-2 py-2.5 flex-1 text-base font-medium bg-outline-primary">
                    Continuer
                    <ArrowRightIcon class="ml-2 size-5" />
                  </button>

                  <button v-else-if="!datas.factuel && statistiques.statut === 0" @click.self="openFactuelModal" class="flex items-center justify-center w-full gap-2 py-2.5 flex-1 text-base font-medium bg-outline-primary">
                    Demarrer
                    <ArrowRightIcon class="ml-2 size-5" />
                  </button>
                  <button v-else class="w-full gap-2 py-[22px]"></button>
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

            <div v-if="statistiques?.formulaire_perception_de_gouvernance " class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
              <div class="relative m-5 bg-white">
                <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">Evaluation de Perception</div>
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
                <div class="flex items-center">
                  <div class="ml-2 font-bold">{{ datas?.perception ? datas.perception?.reponses_de_la_collecte?.length : 0 }}</div>
                </div>

                <div class="mt-4">
                  <p>Évolution soumissions</p>
                  <ProgressBar :percent="datas.perception ? datas.pourcentage_evolution_des_soumissions_de_perception : 0" />
                </div>
              </div>

              <div v-if="datas.perception && datas.pourcentage_evolution_des_soumissions_de_perception >= 100" class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                <button @click.self="goToPageMarqueur" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
                  Voir Fiche de synthese
                  <ArrowRightIcon class="ml-2 size-5" />
                </button>
              </div>

              <div v-else-if="!datas.perception || (datas.perception && datas.pourcentage_evolution_des_soumissions_de_perception < 100)" class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                <div class="flex items-center justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                  <button v-if="(!datas.perception && statistiques.statut === 0) || (datas.perception && datas.pourcentage_evolution_des_soumissions_de_perception < 100 && statistiques.statut === 0)" @click.self="sendInvitationLink" class="flex items-center justify-center w-full gap-2 py-2.5 flex-1 text-base font-medium bg-outline-primary">
                    Envoyer une invitation
                    <ArrowRightIcon class="ml-2 size-5" />
                  </button>

                  <button v-else class="w-full gap-2 py-[22px]"></button>
                </div>
                <button v-if="datas.perception && datas.pourcentage_evolution_des_soumissions_de_perception < 100" @click="sendReminder" class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">
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
          </div>
        </div>

        <!-- Ranking Section -->
        <div v-if="statistiques.pourcentage_evolution < 100" class="col-span-4 p-6 bg-white rounded-md shadow-lg">
          <h2 class="mb-4 text-lg font-bold">Ranking of Submissions</h2>

          <div class="">
            <!-- List rankings dynamically -->
            <RankingChart :rankingData="statistiques.organisations_ranking" />
          </div>
        </div>

        <div v-else class="flex flex-col justify-start col-span-4 p-4 p-6 overflow-x-auto bg-white rounded-md shadow">
          <div class="flex flex-wrap items-center justify-between col-span-12 my-2 intro-y sm:flex-nowrap">
            <div class="flex">
              <h2 class="mr-5 text-lg font-medium truncate">Actions correctionnelle en cours</h2>
            </div>
            <div class="flex">
              <!-- <button @click="goToMesuresAPrendre" class="mr-2 shadow-md btn btn-primary" >Emettre une mesure a prendre</button> -->
              <button @click="goToMesuresAPrendre" class="mr-2 shadow-md btn btn-primary">Voir Feuille de route</button>
            </div>
          </div>
          <!-- <button @click="goToMesuresAPrendre" class="mr-2 shadow-md btn btn-primary" >Emettre une mesure a prendre</button> -->
          <ActionPlan :actions="feuilleDeRoute" />
          <!-- <pre>{{ feuilleDeRoute }}</pre> -->
        </div>
      </div>

      <!-- <ActionsMener v-if="idEvaluation && statistiques.statut == 1" :evaluation="idEvaluation" /> -->
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
                  <InputForm class="" label="Adresse email" v-model="participant.email" type="email" />
                  <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
                </div>
              </form>
              <form v-show="participant.type_de_contact === options[1].id" @submit.prevent="addPhone">
                <div class="flex items-end gap-4">
                  <InputForm class="" type="text" label="Numéro de téléphone" pattern="\d{1,8}" maxlength="10" v-model="participant.phone" />
                  <!-- <div class="">
                    <label for="Numéro de téléphone" class="form-label">Numéro de téléphone</label>
                    <input id="Numéro de téléphone" type="number" pattern="\d{1,8}" maxlength="8" required v-model.number="currentPhone" class="form-control" placeholder="Numéro de téléphone" />
                  </div> -->
                  <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
                </div>
              </form>
              <div v-if="errors.participants" class="mt-2 text-danger">{{ getFieldErrors(errors.participants) }}</div>
              <div class="flex flex-wrap items-center w-full max-w-full gap-3">
                <div class="flex items-center justify-between gap-2 px-2 py-1 text-sm font-medium rounded-sm shadow cursor-pointer bg-blue text-primary" v-for="(participant, index) in invitationPayload.participants" :key="index">
                  <span>{{ participant.type_de_contact === "email" ? participant?.email : participant?.phone }}</span>
                  <button type="button" @click="deleteItem(index)" class="p-1 transition-colors hover:bg-red-100"><XIcon class="w-4 h-4 text-danger" /></button>
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
</template>
