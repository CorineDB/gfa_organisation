<script setup>
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
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const idEvaluation = route.params.id;
const isLoading = ref(false);
const isLoadingStats = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const datas = ref([]);
const statistiques = ref({});

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
  showModalCreate.value = false;
};
const openFactuelModal = () => {
  router.push({ name: "ToolsFactuel", params: { id: idEvaluation } });
};
const goToPageSynthese = (Idsoumission) => {
  router.push({ name: "FicheSynthese", params: { e: idEvaluation } });
};
const goToPageMarqueur = (Idsoumission) => {
  router.push({ name: "FicheMarqueur", params: { e: idEvaluation } });
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
onMounted(() => {
  getDatas();
  getEvaluation();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Soumissions par organisations</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <!-- <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div> -->
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openFactuelModal">Remplir formulaire Factuel</button>
        <button class="mr-2 shadow-md btn btn-primary" @click="openPerceptionModal">Remplir formulaire de perception</button>
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
                <div class="flex justify-center">
                  <GlobeIcon class="report-box__icon text-primary" />
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">{{ datas.length }}</div>
                <div class="mt-1 text-base text-slate-500">Nombre d'organisations</div>
              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-center box">
                <div class="flex justify-center">
                  <UsersIcon class="report-box__icon text-pending" />
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">{{ statistiques?.total_participants_evaluation_factuel + statistiques?.total_participants_evaluation_de_perception }}</div>
                <div class="mt-1 text-base text-slate-500">Total Participants</div>
              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-center box">
                <div class="flex justify-center">
                  <BarChartIcon class="report-box__icon text-success" />
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">{{ statistiques?.total_soumissions_de_perception_terminer + statistiques?.total_soumissions_factuel_terminer }}</div>
                <div class="mt-1 text-base text-slate-500">Total soumissions terminé</div>
              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="p-5 text-center box">
                <div class="flex justify-center">
                  <PercentIcon class="report-box__icon text-warning" />
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">{{ statistiques?.pourcentage_evolution }}%</div>
                <div class="mt-1 text-base text-slate-500">Pourcentage de soumissions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoaderSnipper v-else />

      <div class="col-span-12 mt-8">
        <div class="flex items-center h-10 intro-y">
          <h2 class="mr-5 text-lg font-medium truncate">Fiches</h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5 text-lg font-medium">
          <div @click="goToPageSynthese" class="flex items-center justify-center col-span-12 gap-1 transition-all border-l-4 cursor-pointer border-l-primary box hover:shadow-md sm:col-span-3 intro-y"><button class="px-4 py-8">Fiche de Synthèse</button> <ArrowRightIcon class="size-5" /></div>
          <div @click="goToPageMarqueur" class="flex items-center justify-center col-span-12 gap-1 transition-all border-l-4 cursor-pointer border-l-primary box hover:shadow-md sm:col-span-3 intro-y"><button class="px-4 py-8">Fiche de Marqueur</button> <ArrowRightIcon class="size-5" /></div>
        </div>
      </div>
      <!-- END: General Report -->
      <section class="w-full">
        <p class="pb-4 mt-10 text-lg font-medium intro-y">Liste des soumissions par organisations</p>

        <AccordionGroup :selectedIndex="null" class="grid grid-cols-12 gap-3">
          <AccordionItem v-for="(ong, index) in datas" :key="index" class="col-span-12 xl:col-span-6 intro-y">
            <Accordion class="text-lg !p-3 font-semibold bg-primary/90 !text-white flex items-center justify-between">
              <p>{{ ong.nom }}</p>
              <ChevronDownIcon />
            </Accordion>
            <AccordionPanel class="p-2 space-y-2">
              <AccordionGroup :selectedIndex="0" class="space-y-1">
                <AccordionItem v-if="ong.factuel?.length > 0">
                  <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
                    <p>Factuel</p>
                    <ChevronDownIcon />
                  </Accordion>
                  <AccordionPanel class="p-2 space-y-2">
                    <div v-for="(soumission, index) in ong.factuel" :key="index" class="flex items-center justify-between w-full gap-2 px-2 py-3 text-base font-medium text-black truncate transition-all bg-white border-l-2 border-yellow-200 rounded shadow">
                      <p>
                        Soumission n° {{ index + 1 }} ( {{ soumission.submitted_at }}) <span :class="[soumission.statut ? 'bg-green-500' : 'bg-yellow-500']" class="px-2 py-1 mr-1 text-xs text-white rounded-full">{{ soumission.statut ? "Terminé" : "En cours" }}</span>
                      </p>
                      <div class="flex items-center gap-4">
                        <!-- <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button> -->
                        <button v-if="!soumission.statut" class="p-2 text-danger" @click="handleDelete(soumission.id)">
                          <TrashIcon class="size-5" />
                        </button>
                      </div>
                    </div>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem v-if="ong.perception?.length > 0">
                  <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
                    <p>Perception</p>
                    <ChevronDownIcon />
                  </Accordion>
                  <AccordionPanel class="p-2 space-y-2">
                    <div v-for="(soumission, index) in ong.perception" :key="index" class="flex items-center justify-between w-full gap-2 px-2 py-3 text-base font-medium text-black truncate transition-all bg-white border-l-2 border-yellow-200 rounded shadow">
                      <p>
                        Soumission n° {{ index + 1 }} ({{ soumission.submitted_at }}) <span :class="[soumission.statut ? 'bg-green-500' : 'bg-yellow-500']" class="px-2 py-1 mr-1 text-xs text-white rounded-full">{{ soumission.statut ? "Terminé" : "En cours" }}</span>
                      </p>
                      <div class="flex items-center gap-4">
                        <!-- <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button> -->
                        <button v-if="!soumission.statut" class="p-2 text-danger" @click="handleDelete(soumission.id)">
                          <TrashIcon class="size-5" />
                        </button>
                      </div>
                    </div>
                  </AccordionPanel>
                </AccordionItem>
              </AccordionGroup>
            </AccordionPanel>
          </AccordionItem>
        </AccordionGroup>
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
</template>
