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
import ProgressBar from "../../../components/news/ProgressBar.vue";
import ChartPerceptionOption from "../../../components/news/ChartPerceptionOption.vue";
import { data } from "jquery";

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
const showModalOrganisation = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const loadingOption = ref(true);
const datas = ref([]);
const statistiques = ref({});
const idCurrentOng = ref({});
const currentOptionsPerception = ref({});
const currentOrganisationsOptions = ref("");

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
      currentOrganisationsOptions.value = statistiques.value.options_de_reponse_stats[0].id;
      changeOrganisationOptions();
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
const goToPageSynthese = () => {
  router.push({ name: "FicheSynthese", params: { e: idEvaluation } });
};
const goToPageSyntheseWithOng = (ong) => {
  router.push({ name: "FicheSynthese", params: { e: idEvaluation }, query: { ong } });
};
const goToPageSoumission = (Idsoumission) => {
  showModalOrganisation.value = false;
  router.push({ name: "soumission", params: { e: idEvaluation, s: Idsoumission } });
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

function changeCurrentDetailOrganisation(id) {
  idCurrentOng.value = id;
  showModalOrganisation.value = true;
}
function getPercentEvolutionOng(id) {
  const ong = statistiques.value.organisations_ranking?.find((item) => item.id == id);
  return ong?.pourcentage_evolution ?? 0;
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
  await getDatas();
  if (route.query.ong) {
    changeCurrentDetailOrganisation(route.query.ong.toString());
  }
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
      <!-- <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openFactuelModal">Remplir formulaire Factuel</button>
        <button class="mr-2 shadow-md btn btn-primary" @click="openPerceptionModal">Remplir formulaire de perception</button>
      </div> -->
      <div class="flex">
        <!-- <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button> -->
        <!-- <button class="mr-2 shadow-md btn btn-primary" @click="opendAddParticipant">Ajouter les participants</button> -->
      </div>
    </div>
  </div>

  <div class="p-5 mt-0 intro-y">
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
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
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

          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
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

          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
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

      <div v-if="statistiques.statut == 1" class="col-span-12 mt-8">
        <div class="flex items-center h-10 intro-y">
          <h2 class="mr-5 text-lg font-medium truncate">Fiches</h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5 text-lg font-medium">
          <div @click="goToPageSynthese" class="flex items-center justify-center col-span-12 gap-1 px-2 transition-all border-l-4 cursor-pointer border-l-primary box hover:shadow-md sm:col-span-4 intro-y"><button class="px-4 py-8">Fiches de Synthèse</button> <ArrowRightIcon class="size-5" /></div>
          <div @click="goToPageMarqueur" class="flex items-center justify-center col-span-12 gap-1 px-2 transition-all border-l-4 cursor-pointer border-l-primary box hover:shadow-md sm:col-span-4 intro-y"><button class="px-4 py-8">Marqueur de gouvernance</button> <ArrowRightIcon class="size-5" /></div>
        </div>
      </div>

      <section>
        <p class="pb-4 mt-10 text-lg font-medium intro-y">Liste des soumissions par organisations</p>
        <div class="grid h-auto grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(ong, index) in datas" :key="index" @click="changeCurrentDetailOrganisation(ong.id)" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary">
            <div class="relative m-5 bg-white">
              <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">{{ ong.nom }}</div>
            </div>

            <div class="m-5 text-slate-600 dark:text-slate-500">
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Total de Soumissions:
                <div class="ml-2 font-bold">{{ (ong?.factuel ? ong.factuel.length : 0) + (ong?.perception ? ong.perception.length : 0) }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions Factuel:
                <div class="ml-2 font-bold">{{ ong?.factuel ? ong.factuel.length : 0 }}</div>
              </div>
              <div class="flex items-center">
                <BarChart2Icon class="w-4 h-4 mr-2" /> Soumissions de Perception:
                <div class="ml-2 font-bold">{{ ong?.perception ? ong.perception.length : 0 }}</div>
              </div>
              <div class="mt-4">
                <p>Évolution soumissions</p>
                <ProgressBar :percent="getPercentEvolutionOng(ong.id)" />
              </div>
            </div>

            <div class="flex flex-col items-end justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
              <div class="flex items-center justify-end w-full border-t border-slate-200/60 dark:border-darkmode-400">
                <button v-if="(ong.factuel && ong.factuel[0].statut) || (ong.factuel && ong.factuel[0].pourcentage_evolution >= 100)" @click.self="goToPageSyntheseWithOng(ong.id)" class="flex items-center justify-center w-full gap-2 py-2.5 flex-1 text-base font-medium bg-outline-primary">Fiche de synthèse <ArrowRightIcon class="ml-2 size-5" /></button>
                <button v-else class="w-full gap-2 py-[22px]"></button>
                <!-- <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium bg-outline-primary">Marqueur de gouvernance <ArrowRightIcon class="ml-2 size-5" /></button> -->
              </div>
              <button class="flex items-center justify-center w-full gap-2 py-2.5 text-base font-medium text-white bg-primary">Afficher les soumissions <ExternalLinkIcon class="ml-2 size-5" /></button>
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
      </section>
      <section v-if="statistiques?.options_de_reponse_stats">
        <p class="pb-4 mt-10 text-lg font-medium intro-y">Évolution des options de réponse de perception</p>
        <div class="py-4 mt-6 box">
          <div class="!w-[250px] p-3">
            <TomSelect name="organisations" v-model="currentOrganisationsOptions" @change="changeOrganisationOptions" :options="{ placeholder: 'Selectionez une organisation' }">
              <option value=""></option>
              <option v-for="organisation in organisations" :key="organisation.id" :value="organisation.id">{{ organisation.nom }}</option>
            </TomSelect>
          </div>
          <ChartPerceptionOption v-if="loadingOption" :datasx="currentOptionsPerception.categories" class="py-4 mt-6" />
          <div v-else class="box h-[500px] flex justify-center items-center">
            <LoaderSnipper />
          </div>
        </div>
      </section>
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

  <!-- Modal Register & Update -->
  <Modal size="modal-xl" :show="showModalOrganisation" @hidden="showModalOrganisation = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ currentOrganisation?.nom }}</h2>
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
              <div class="flex flex-col gap-2" v-if="currentOrganisation?.factuel">
                <div @click="goToPageSoumission(soumission.id)" v-for="(soumission, index) in currentOrganisation.factuel" :key="index" class="flex items-center justify-between w-full gap-2 px-2 py-3 text-base font-medium text-black truncate transition-all bg-white border border-l-4 rounded shadow-md cursor-pointer border-primary">
                  <p>
                    Soumission n° {{ index + 1 }} ( {{ soumission.created_at }}) <span :class="[soumission.statut ? 'bg-green-500' : 'bg-yellow-500']" class="px-2 py-1 mr-1 text-xs text-white rounded-full">{{ soumission.statut ? "Terminé" : "En cours" }}</span>
                  </p>
                  <ProgressBar :percent="soumission.pourcentage_evolution" class="max-w-[200px]" />
                  <!-- <div class="flex items-center gap-4">
                    <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button>
                    <button v-if="!soumission.statut" class="p-2 text-danger" @click="handleDelete(soumission.id)">
                      <TrashIcon class="size-5" />
                    </button>
                  </div> -->
                </div>
              </div>
              <div v-else class="text-lg text-center">
                <p>Liste de soumissions vide.</p>
              </div>
            </TabPanel>
            <TabPanel class="max-h-[80vh] overflow-y-auto">
              <div class="flex flex-col gap-2" v-if="currentOrganisation?.perception">
                <div @click="goToPageSoumission(soumission.id)" v-for="(soumission, index) in currentOrganisation.perception" :key="index" class="flex items-center justify-between w-full gap-2 px-2 py-3 text-base font-medium text-black truncate transition-all bg-white border border-l-4 rounded shadow-md cursor-pointer border-primary">
                  <p>
                    Soumission n° {{ index + 1 }} ( {{ soumission.created_at }}) <span :class="[soumission.statut ? 'bg-green-500' : 'bg-yellow-500']" class="px-2 py-1 mr-1 text-xs text-white rounded-full">{{ soumission.statut ? "Terminé" : "En cours" }}</span>
                  </p>
                  <ProgressBar :percent="soumission.pourcentage_evolution" class="max-w-[200px]" />

                  <!-- <div class="flex items-center gap-4">
                    <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button>
                    <button v-if="!soumission.statut" class="p-2 text-danger" @click="handleDelete(soumission.id)">
                      <TrashIcon class="size-5" />
                    </button>
                  </div> -->
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
  </Modal>
  <!-- End Modal -->
</template>