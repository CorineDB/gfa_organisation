<template>
  <div class="flex w-full gap-2">
    <!-- Modal for creating/updating -->
    <Modal size="modal-xl" backdrop="static" :show="showModalCreate" @hidden="closeModal">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Ajouter une année cible</h2>
      </ModalHeader>
      <form @submit.prevent="submitData">
        <ModalBody>
          <AlertErrorIndicateur :errors="errors" :countKeys="countValueKeys" />

          <!-- Information 1 -->
          <div class="">
            <div class="grid grid-cols-1 gap-4">
              <!-- <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex-1 form-check">
                  <input id="agreer" class="form-check-input" type="checkbox" v-model="payload.agreger" />
                  <label class="form-check-label" for="agreer">Indicateur Agréger</label>
                </div>
              </div> -->
              <!-- <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex-1">
                      <label class="form-label">Année de base</label>
                      <TomSelect v-model="payload.anneeDeBase" name="annee_suivi" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
                        <option value=""></option>
                        <option v-for="annee in annees" :key="annee" :value="annee">{{ annee }}</option>
                      </TomSelect>
                      <div v-if="errors.anneeDeBase" class="mt-2 text-danger">{{ getFieldErrors(errors.anneeDeBase) }}</div>
                    </div>

                    <InputForm v-if="!payload.agreger" class="flex-1" label="Valeur de base" :required="false" :control="getFieldErrors(errors.valeurDeBase)" v-model="payloadNotAgreger.valeurDeBase" type="number" />
                  </div> -->

              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="w-full" v-if="!payload.agreger">
                  <!-- <p class="form-label">Année cible</p> -->
                  <div class="flex gap-1 place-items-end">
                    <div class="flex-1">
                      <label class="form-label">Année cible<span class="text-danger">*</span> </label>
                      <TomSelect v-model="currentAnneeCibleNotAgreger.annee" name="annee_aggrer" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
                        <option value=""></option>
                        <option v-for="annee in annees" :key="annee" :value="annee">{{ annee }}</option>
                      </TomSelect>
                    </div>

                    <div class="flex flex-1 gap-1">
                      <input type="number" class="form-control" id="valeur_cible" placeholder="Valeur cible" v-model="currentAnneeCibleNotAgreger.valeurCible" />
                      <button @click.prevent="addAnneeCibleNotAgreger" class="text-xs btn btn-primary h-9"><PlusIcon class="mr-1 size-3" />Ajouter</button>
                    </div>
                  </div>
                  <div v-if="errors.valeurDeBase" class="mt-2 text-danger">{{ getFieldErrors(errors.valeurDeBase) }}</div>
                  <div v-if="errors.anneesCible" class="mt-2 text-danger">{{ getFieldErrors(errors.anneesCible) }}</div>
                </div>
              </div>
              <div v-if="!payload.agreger && payloadNotAgreger.anneesCible.length > 0" class="flex flex-wrap items-center w-full gap-3">
                <p>Années cible:</p>
                <div :title="annee.valeurCible" class="flex items-center justify-between gap-1 px-2 py-0.5 text-sm font-normal bg-white rounded-full shadow cursor-pointer text-primary" v-for="(annee, index) in payloadNotAgreger.anneesCible" :key="index">
                  <span class="font-medium"
                    >{{ annee.annee }} : <span class="font-normal text-slate-600">{{ annee.valeurCible }} </span></span
                  >
                  <button @click.prevent="deleteAnneeCibleNotAgreger(index)" class="p-1.5 transition-colors rounded-full hover:bg-red-100"><XIcon class="size-4 text-danger" /></button>
                </div>
                <div v-if="errors.valeurDeBase" class="mt-2 text-danger">{{ getFieldErrors(errors.valeurDeBase) }}</div>
                <div v-if="errors.anneesCible" class="mt-2 text-danger">{{ getFieldErrors(errors.anneesCible) }}</div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3">
                <!-- <div v-if="payload.agreger" class="flex-1">
                  <label class="form-label">Clé valeur <span class="text-danger">*</span> </label>
                  <TomSelect v-model="array_value_keys" name="keys" multiple :options="{ placeholder: 'Selectionez les clés valeur' }" class="w-full">
                    <option v-for="(key, index) in keys" :key="index" :value="key.id">{{ key.libelle }}</option>
                  </TomSelect>
                  <div v-if="errors.value_keys" class="mt-2 text-danger">{{ getFieldErrors(errors.value_keys) }}</div>
                </div> -->
              </div>
              <!-- <div v-if="array_value_keys.length > 0 && payload.agreger" class="">
                <label class="form-label">Valeur de base</label>
                <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
                  <div v-for="(base, index) in filterValueKeys" :key="index" class="input-group">
                    <div class="flex items-center justify-center text-sm input-group-text">{{ base.libelle }}</div>
                    <input type="text" v-model="valeur[base.id]" class="form-control" placeholder="valeur" aria-label="valeur" aria-describedby="input-group-valeur" />
                  </div>
                </div>
              </div> -->
              <div v-if="payload.agreger" class="space-y-3">
                <button v-show="array_value_keys.length > 0" class="text-sm btn btn-primary" @click.prevent="showModalAnnee = true"><PlusIcon class="mr-1 size-3" />Cliquer pour Ajouter une année cible</button>
              </div>
              <div v-if="payload.agreger && anneesCible.length > 0" class="flex flex-wrap items-center w-full gap-3">
                <p>Années cible:</p>
                <div :title="annee.valeurCible.map((item) => item.value).join(',')" class="flex items-center justify-between gap-2 px-2 py-0.5 text-sm font-medium bg-white rounded-full shadow cursor-pointer text-primary" v-for="(annee, index) in anneesCible" :key="index">
                  <span>{{ annee.annee }} </span>
                  <button @click.prevent="deleteAnneeCible(index)" class="p-1.5 transition-colors rounded-full hover:bg-red-100"><XIcon class="size-4 text-danger" /></button>
                </div>
                <div v-if="errors.anneesCible" class="mt-2 text-danger">{{ getFieldErrors(errors.anneesCible) }}</div>
              </div>
            </div>
          </div>
          <!-- END -->
        </ModalBody>
        <ModalFooter>
          <div class="flex gap-2">
            <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
            <VButton :loading="isLoading" :label="modeText" />
          </div>
        </ModalFooter>
      </form>
    </Modal>

    <!-- Modal for Annee -->
    <Modal :show="showModalAnnee" @hidden="showModalAnnee = false">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Ajouter une année cible</h2>
      </ModalHeader>
      <form @submit.prevent="addAnneeCible">
        <ModalBody>
          <div class="grid grid-cols-1 gap-4">
            <!-- Champ pour l'année -->
            <!-- <InputForm label="Année" v-model="currentAnneeCible.annee" type="number" placeholder="Entrez l'année" /> -->
            <div class="flex-1">
              <label class="form-label">Année <span class="text-danger">*</span> </label>
              <TomSelect v-model="currentAnneeCible.annee" name="annee_aggrer" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
                <option value=""></option>
                <option v-for="annee in annees" :key="annee" :value="annee">{{ annee }}</option>
              </TomSelect>
            </div>
            <!-- Champs dynamiques pour les valeurs -->
            <div v-if="array_value_keys.length > 0" class="">
              <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
                <div v-for="(key, index) in filterValueKeys" :key="key.id" class="input-group">
                  <div class="flex items-center justify-center text-sm input-group-text">
                    {{ key.libelle }}
                  </div>
                  <input type="number" v-model="currentAnneeCible.valeurCible[index].value" class="form-control" placeholder="valeur" aria-label="valeur" />
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div class="flex gap-2">
            <button type="button" @click="resetFormAnnee" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
            <VButton label="Ajouter" />
          </div>
        </ModalFooter>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import CategoriesService from "@/services/modules/categorie.service";
import { computed, onMounted, reactive, ref, watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import IndicateursService from "@/services/modules/indicateur.service";
import { toast } from "vue3-toastify";
import { getAllErrorMessages } from "@/utils/gestion-error";
import OngService from "@/services/modules/ong.service";
import SiteService from "@/services/modules/site.service";
import UniteeDeMesureService from "@/services/modules/unitee.mesure.service";
import IndicateurValueKeys from "@/services/modules/key.value.service";
import AuthService from "@/services/modules/auth.service";
import ResultatCadreRendementService from "@/services/modules/resultat.cadre.rendement.service";
import { getFieldErrors } from "@/utils/helpers";
import verifyPermission from "@/utils/verifyPermission";
import AlertErrorIndicateur from "@/components/news/AlertErrorIndicateur.vue";

const props = defineProps({
  currentIndicateur: {
    type: Object,
    required: true,
    default: {},
  },
});
const steps = [
  { label: "Informations 1", id: 1 },
  { label: "Informations 2", id: 2 },
];
// Reactive data structure
const cadreRendement = ref([]);
const isLoadingDataCadre = ref(false);
const idProgramme = ref("");
const debutProgramme = ref("");
const finProgramme = ref("");
const idSelect = ref("");
const nameSelect = ref("");
const search = ref("");
const showModalCreate = defineModel("showModalCreate");
const showModalAnnee = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(false);
const isCreate = ref(true);
const datas = ref([]);
const categories = ref([]);
const responsables = ref([]);
const ugs = ref([]);
const sites = ref([]);
const unites = ref([]);
const keys = ref([]);
const errors = ref({});
const array_value_keys = ref([]);
const responsablesForm = ref({ organisations: [], ug: "" });
const currentStep = ref(1);

// Etat de la page et items par page
const currentPage = ref(1);
const itemsPerPage = 2;

// Année cible en cours de création
const currentAnneeCible = ref({
  annee: "",
  valeurCible: [],
});
const anneesCible = ref([]);
// Objet réactif pour stocker les valeurs des champs saisis
const valeur = ref({});

const payload = reactive({
  responsables: responsablesForm.value,
  nom: "",
  description: "",
  indice: "",
  sources_de_donnee: "",
  methode_de_la_collecte: "",
  frequence_de_la_collecte: "",
  anneeDeBase: "",
  type_de_variable: "",
  agreger: false,
  value_keys: [],
  valeurDeBase: [],
  anneesCible: [],
  categorieId: "",
  uniteeMesureId: "",
  sites: [],
});

const countValueKeys = ref(0);
const value_keys = ref([]);

const payloadNotAgreger = reactive({
  valeurDeBase: "",
  anneesCible: [],
});

const currentAnneeCibleNotAgreger = ref({
  annee: "",
  valeurCible: "",
});

// Fetch data
const getDatasCadre = async () => {
  isLoadingDataCadre.value = true;
  try {
    const { data } = await ResultatCadreRendementService.getCadreRendement(idProgramme.value);
    cadreRendement.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataCadre.value = false;
  }
};

const annees = computed(() => {
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    annees.push(annee);
  }
  return annees;
});

const addAnneeCibleNotAgreger = () => {
  if (!currentAnneeCibleNotAgreger.value.annee || !currentAnneeCibleNotAgreger.value.valeurCible) {
    toast.info("Veuillez entrer une année et sa valeur !");
    return;
  }
  if (payloadNotAgreger.anneesCible.includes(currentAnneeCibleNotAgreger.value.annee)) {
    toast.info("Cette année cible est dejà ajoutée");
  } else {
    payloadNotAgreger.anneesCible.push(currentAnneeCibleNotAgreger.value);
    currentAnneeCibleNotAgreger.value = { annee: "", valeurCible: "" };
  }
};

const deleteAnneeCibleNotAgreger = (item) => {
  payloadNotAgreger.anneesCible.splice(item, 1);
};
const deleteAnneeCible = (item) => {
  anneesCible.value.splice(item, 1);
};
const resetForm = () => {
  showModalCreate.value = false;
  payloadNotAgreger.anneesCible = [];
  payloadNotAgreger.valeurDeBase = "";
  array_value_keys.value = [];
  responsablesForm.value.organisations = [];
  // payload.responsables.organisations = [];
  payload.agreger = false;
  payload.nom = "";
  payload.description = "";
  payload.indice = "";
  payload.sources_de_donnee = "";
  payload.methode_de_la_collecte = "";
  payload.frequence_de_la_collecte = "";
  payload.type_de_variable = "";
  payload.anneeDeBase = "";
  payload.categorieId = "";
  payload.uniteeMesureId = "";
  payload.sites = [];
  payload.value_keys = [];
  payload.valeurDeBase = [];
  payload.anneesCible = [];
  errors.value = {};
};

// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await IndicateursService.get();
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};
// Fetch Categories
const getCategories = async () => {
  try {
    const { data } = await CategoriesService.get();
    categories.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des categories.");
  }
};
const getResponsables = async () => {
  try {
    const { data } = await OngService.get();
    responsables.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des organisations.");
  }
};
const getSites = async () => {
  try {
    const { data } = await SiteService.get();
    sites.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des sites.");
  }
};
const getUnites = async () => {
  try {
    const { data } = await UniteeDeMesureService.get();
    unites.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des sites.");
  }
};
const getKeys = async () => {
  try {
    const { data } = await IndicateurValueKeys.get();
    keys.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des clés.");
  }
};

const getcurrentUser = async () => {
  isLoadingDataCadre.value = true;
  await AuthService.getCurrentUser()
    .then((result) => {
      // responsablesForm.value.ug = result.data.data.profil.id;
      ugs.value.push({ id: result.data.data.profil.id, nom: result.data.data.profil.nom });
      idProgramme.value = result.data.data.programme.id;
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

// Submit data (create or update)
const submitData = async () => {
  const updateData = { anneesCible: [], value_keys: [] };
  if (payload.agreger) {
    payload.anneesCible = anneesCible.value;
    payload.valeurDeBase = valeurDeBase.value;
    payload.value_keys = value_keys.value;
    updateData.anneesCible = payload.anneesCible;
    delete updateData.value_keys;
    // updateData.value_keys = value_keys.value;
    // payload.value_keys = array_value_keys.value.map((item) => {
    //   return { id: item };
    // });
  } else {
    payload.anneesCible = payloadNotAgreger.anneesCible;
    payload.valeurDeBase = payloadNotAgreger.valeurDeBase;
    updateData.anneesCible = payload.anneesCible;
    delete updateData.value_keys;
    delete payload.value_keys;
  }
  isLoading.value = true;
  const action = isCreate.value ? IndicateursService.addYearsCible(idSelect.value, updateData) : IndicateursService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Années cibles  ${isCreate.value ? "ajoutée" : "modifiée"} avec succès.`);
    setTimeout(() => {
      isLoading.value = false;
      showModalCreate.value = false;
    }, 1000);
    // getDatas();
    // getDatasCadre();
    resetForm();
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
// Delete data
const deleteData = async () => {
  try {
    isLoading.value = true;
    await IndicateursService.destroy(idSelect.value);
    toast.success("Indicateur supprimée avec succès.");
    getDatas();
  } catch (e) {
    console.error(e);
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
    deleteModalPreview.value = false;
  }
};
// Handle edit action
const handleEdit = (data) => {
  isCreate.value = false;
  idSelect.value = data.id;
  payload.nom = data.nom;
  payload.categorieId = data.categorieId ?? "";
  showModalCreate.value = true;
};
// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.nom;
  deleteModalPreview.value = true;
};
// UI related functions

const getAllSelectDatas = () => {
  // getCategories();
  // getResponsables();
  // getSites();
  getUnites();
  getKeys();
};

const openCreateModal = () => {
  resetForm();
  getAllSelectDatas();
  isCreate.value = true;
  showModalCreate.value = true;
};
const cancelDelete = () => {
  idSelect.value = "";
  deleteModalPreview.value = false;
};
const closeModal = () => (showModalCreate.value = false);
const closeDeleteModal = () => (deleteModalPreview.value = false);

// Réinitialisation du formulaire
const resetFormAnnee = () => {
  currentAnneeCible.value = {
    annee: "",
    valeurCible: array_value_keys.value.map((keyId) => ({
      keyId,
      value: "",
    })),
  };

  showModalAnnee.value = false;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

const goToStep = (index) => {
  currentStep.value = index;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
  else currentStep.value = 1;
};

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++;
  else currentStep.value = 3;
};

// Fonction pour ajouter une année cible
const addAnneeCible = () => {
  if (!currentAnneeCible.value.annee) {
    toast.info("Veuillez entrer une année !");
    return;
  }

  // Ajouter l'année cible au tableau principal
  anneesCible.value.push({ ...currentAnneeCible.value });

  // Réinitialiser le formulaire
  resetFormAnnee();

  // Fermer le modal
  showModalAnnee.value = false;
};
const modeText = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));
const filterData = computed(() => datas.value.filter((data) => data.nom.toLowerCase().includes(search.value.toLowerCase())));

const filterValueKeys = computed(() => {
  return keys.value
    .filter((key) => array_value_keys.value.includes(key.id)) // Garde les éléments correspondants
    .map(({ id, libelle }) => ({ id, libelle })); // Ne garde que les champs id et libelle
});

const valeurDeBase = computed(() => {
  return Object.entries(valeur.value)
    .filter(([keyId]) => array_value_keys.value.includes(keyId)) // Ne garde que les clés sélectionnées
    .map(([keyId, value]) => ({ keyId, value })); // Transforme en { keyId, value }
});

// Calculer le nombre total de pages
const totalPages = computed(() => Math.ceil(cadreRendement.value ? cadreRendement.value.length / itemsPerPage : 0));

// Obtenir les éléments de la page actuelle
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  if (cadreRendement.value) return cadreRendement.value.slice(start, end);
});

const datasSearch = computed(() => {
  // Retourner les groupes filtrés
  return cadreRendement.value
    .map((group) => {
      const filteredIndicateurs = group.indicateurs.filter((indicateur) => indicateur.nom.toLowerCase().includes(search.value.toLowerCase()));
      return filteredIndicateurs.length > 0 ? { ...group, indicateurs: filteredIndicateurs } : null;
    })
    .filter((group) => group !== null);
});

const dataAvailable = computed(() => {
  if (search.value.length > 0) return datasSearch.value;
  else return paginatedData.value;
});

const truncateText = (text, maxLength = 100) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

watch(
  array_value_keys,
  (newKeys) => {
    // Vérifiez que newKeys est bien un tableau
    if (Array.isArray(newKeys)) {
      currentAnneeCible.value.valeurCible = newKeys.map((keyId) => ({
        keyId,
        value: "",
      }));
    } else {
      console.warn("array_value_keys n'est pas un tableau valide :", newKeys);
      currentAnneeCible.value.valeurCible = [];
    }
  },
  { immediate: true }
);

watch(showModalCreate, (newValue) => {
  idSelect.value = props.currentIndicateur.id;
  payload.agreger = props.currentIndicateur.agreger;
  if (payload.agreger) {
    countValueKeys.value = props.currentIndicateur.value_keys.length;
    array_value_keys.value = props.currentIndicateur.value_keys.map((key) => key.id);
    value_keys.value = props.currentIndicateur.value_keys.map((key) => {
      return { id: key.id, uniteeMesureId: key.uniteeMesureId };
    });
  }
});

// Fetch data on component mount
onMounted(async () => {
  // console.log("currentIndicateur", props.currentIndicateur);
  idSelect.value = props.currentIndicateur.id;
  await getcurrentUser();
  // getDatasCadre();
  // getDatas();
  // getResponsables();
  // getUnites();
  getKeys();
});
</script>

<style scoped>
/* we will explain what these classes do next! */
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.5s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.truncate-option {
  display: inline-block;
  max-width: 150px; /* Ajustez la largeur selon vos besoins */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
