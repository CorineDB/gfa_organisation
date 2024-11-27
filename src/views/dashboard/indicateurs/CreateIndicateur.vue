<template>
  <div class="flex w-full gap-2">
    <Transition name="menu">
      <section :class="[showMenu ? 'translate-x-0 w-[30%] border-r-2' : '-translate-x-full w-0']" class="h-screen pt-5 pr-1 overflow-y-auto transition-transform duration-300 transform menu-crud">
        <div :class="['transition-all', showMenu ? '' : 'hidden']">
          <AccordionGroup :selectedIndex="null" class="space-y-1">
            <AccordionItem class="">
              <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
                <p>Unité de Mesure</p>
                <ChevronDownIcon />
              </Accordion>
              <AccordionPanel class="p-2">
                <UniteMesure />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
                <p>Clé valeur</p>
                <ChevronDownIcon />
              </Accordion>
              <AccordionPanel class="p-2">
                <CleValeur />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
                <p>Catégorie</p>
                <ChevronDownIcon />
              </Accordion>
              <AccordionPanel class="p-2">
                <ManagmentCategorie />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
                <p>Site</p>
                <ChevronDownIcon />
              </Accordion>
              <AccordionPanel class="p-2">
                <ManagmentSite />
              </AccordionPanel>
            </AccordionItem>
          </AccordionGroup>
        </div>
      </section>
    </Transition>

    <section :class="[showMenu ? 'w-[70%]' : 'w-[100%]']" class="pt-5">
      <button class="text-sm btn" @click="displayMenu"><ChevronsLeftIcon class="mr-1 size-3" />{{ showMenu ? "Cacher le menu" : "Afficher le menu" }}</button>

      <h2 class="mt-6 text-lg font-medium intro-y">Liste des indicateurs</h2>
      <div>
        <!-- Button to open modal -->
        <div class="flex items-center justify-end gap-2 mb-2">
          <button class="text-base btn btn-primary" @click="openCreateModal"><PlusIcon class="mr-1 size-4" />Ajouter</button>
        </div>

        <!-- Data List -->
        <!-- <ul v-if="!isLoadingData" class="overflow-y-auto max-h-[80vh]">
          <li v-for="data in filterData" :key="data.id" class="flex items-center justify-between gap-2 px-2 py-2 text-base rounded-md hover:bg-blue-100 list-data">
            <div class="p-2 form-check">
              <span class="form-check-label">{{ data.nom }}</span>
            </div>
            <div class="flex items-center gap-1 space-x-1 text-white transition-all opacity-0 container-buttons">
              <button class="p-2 rounded-md bg-primary" @click="handleEdit(data)">
                <Edit3Icon class="size-6" />
              </button>
              <button class="p-2 rounded-md bg-danger" @click="handleDelete(data)">
                <TrashIcon class="size-5" />
              </button>
            </div>
          </li>
        </ul> -->
        <LoaderSnipper v-if="isLoadingDataCadre" />
        <TabulatorCadreMesure v-else :data="cadreRendement" :years="annees" />
        <!-- <LoaderSnipper v-else /> -->

        <!-- Modal for creating/updating -->
        <Modal size="modal-xl" backdrop="static" :show="showModalCreate" @hidden="closeModal">
          <ModalHeader>
            <h2 class="mr-auto text-base font-medium">{{ modeText }} un indicateur</h2>
          </ModalHeader>
          <form @submit.prevent="submitData">
            <ModalBody>
              <div class="grid grid-cols-1 gap-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <InputForm class="flex-1" label="Nom" v-model="payload.nom" />
                  <div class="flex-1">
                    <label class="form-label" for="description">Description</label>
                    <div class="">
                      <textarea name="description" class="form-control" id="description" v-model="payload.description" cols="30" rows="1"></textarea>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex-1 form-check">
                    <input id="agreer" class="form-check-input" type="checkbox" v-model="payload.agreger" />
                    <label class="form-check-label" for="agreer">Indicateur Agréger</label>
                  </div>
                  <InputForm class="flex-1" label="Année de base" v-model.number="payload.anneeDeBase" type="number" />
                </div>

                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="w-full" v-if="!payload.agreger">
                    <p class="form-label">Année cible</p>
                    <div class="flex gap-1 place-items-end">
                      <input type="number" class="form-control" id="anne_cible" placeholder="Année" v-model="currentAnneeCibleNotAgreger.annee" />
                      <input type="number" class="form-control" id="valeur_cible" placeholder="Valeur cible" v-model="currentAnneeCibleNotAgreger.valeurCible" />
                      <button @click.prevent="addAnneeCibleNotAgreger" class="btn btn-primary h-9"><PlusIcon class="mr-1 size-3" /></button>
                    </div>
                  </div>
                </div>
                <div v-if="!payload.agreger && payloadNotAgreger.anneesCible.length > 0" class="flex flex-wrap items-center w-full gap-3">
                  <p>Années cible:</p>
                  <div class="flex items-center justify-between gap-2 px-2 py-0.5 text-sm font-medium bg-white rounded-full shadow cursor-pointer text-primary" v-for="(annee, index) in payloadNotAgreger.anneesCible" :key="index">
                    <span>{{ annee.annee }} </span>
                    <button @click.prevent="deleteAnneeCibleNotAgreger(index)" class="p-1.5 transition-colors rounded-full hover:bg-red-100"><XIcon class="size-4 text-danger" /></button>
                  </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-3">
                  <InputForm class="flex-1" label="Indice" v-model="payload.indice" type="number" />
                  <div v-if="payload.agreger" class="flex-1">
                    <label class="form-label">Clé valeur</label>
                    <TomSelect v-model="array_value_keys" name="keys" multiple :options="{ placeholder: 'Selectionez les clés valeur' }" class="w-full">
                      <option v-for="(key, index) in keys" :key="index" :value="key.id">{{ key.libelle }}</option>
                    </TomSelect>
                  </div>
                  <InputForm v-else class="flex-1" label="Valeur de base" v-model="payloadNotAgreger.valeurDeBase" type="number" />
                </div>
                <div v-if="array_value_keys.length > 0 && payload.agreger" class="">
                  <label class="form-label">Valeur de base</label>
                  <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
                    <div v-for="(base, index) in filterValueKeys" :key="index" class="input-group">
                      <div class="flex items-center justify-center text-sm input-group-text">{{ base.libelle }}</div>
                      <input type="number" v-model="valeur[base.id]" class="form-control" placeholder="valeur" aria-label="valeur" aria-describedby="input-group-valeur" />
                    </div>
                  </div>
                </div>
                <div v-if="payload.agreger" class="space-y-3">
                  <button v-show="array_value_keys.length > 0" class="text-sm btn btn-primary" @click.prevent="showModalAnnee = true"><PlusIcon class="mr-1 size-3" /> Ajouter une année cible</button>
                </div>
                <div v-if="payload.agreger && anneesCible.length > 0" class="flex flex-wrap items-center w-full gap-3">
                  <p>Années cible:</p>
                  <div class="flex items-center justify-between gap-2 px-2 py-0.5 text-sm font-medium bg-white rounded-full shadow cursor-pointer text-primary" v-for="(annee, index) in anneesCible" :key="index">
                    <span>{{ annee.annee }} </span>
                    <button @click.prevent="deleteAnneeCible(index)" class="p-1.5 transition-colors rounded-full hover:bg-red-100"><XIcon class="size-4 text-danger" /></button>
                  </div>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex-1">
                    <label class="form-label">Catégorie</label>
                    <TomSelect v-model="payload.categorieId" name="category" :options="{ placeholder: 'Selectionez une catégorie' }" class="w-full">
                      <option value=""></option>
                      <option v-for="(categorie, index) in categories" :key="categorie.id" :value="categorie.id">{{ categorie.type }} {{ categorie.indice }} {{ categorie.nom }}</option>
                    </TomSelect>
                  </div>
                  <div class="flex-1">
                    <label class="form-label">Type de variables</label>
                    <TomSelect v-model="payload.type_de_variable" name="type_variable" :options="{ placeholder: 'Selectionez un type de variable' }" class="w-full">
                      <option value=""></option>
                      <option v-for="(variable, index) in payload.agreger ? type_variablees : type_variablees_agreger" :key="index" :value="variable.id">{{ variable.label }}</option>
                    </TomSelect>
                  </div>
                </div>
                <!-- <div class="flex flex-wrap items-center justify-between gap-3">

                </div> -->

                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex-1">
                    <label class="form-label">Méthode de la collecte des données</label>
                    <TomSelect v-model="payload.methode_de_la_collecte" name="method" :options="{ placeholder: 'Selectionez une methode' }" class="w-full">
                      <option value=""></option>
                      <option v-for="(methode, index) in methodeCollecte" :key="index" :value="methode">{{ methode }}</option>
                    </TomSelect>
                  </div>
                  <div class="flex-1">
                    <label class="form-label">Fréquence de la collecte de données</label>
                    <TomSelect v-model="payload.frequence_de_la_collecte" :options="{ placeholder: 'Selectionez une fréquence' }" class="w-full">
                      <option value=""></option>
                      <option v-for="(frequence, index) in frequenceCollecte" :key="index" :value="frequence">{{ frequence }}</option>
                    </TomSelect>
                  </div>
                </div>
                <div class="flex-1">
                  <label class="form-label">UG</label>
                  <TomSelect v-model="responsablesForm.ug" name="ug" :options="{ placeholder: 'Selectionez un UG' }" class="w-full">
                    <option value=""></option>
                    <option v-for="(ug, index) in ugs" :key="index" :value="ug.id">{{ ug.nom }}</option>
                  </TomSelect>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex-1">
                    <label class="form-label">Responsables</label>
                    <TomSelect v-model="responsablesForm.organisations" name="responsable" multiple :options="{ placeholder: 'Selectionez un responsable' }" class="w-full">
                      <option value=""></option>
                      <option v-for="(responsable, index) in responsables" :key="index" :value="responsable.id">{{ responsable.nom }}</option>
                    </TomSelect>
                  </div>
                  <div class="flex-1">
                    <label class="form-label">Unité de mesure</label>
                    <TomSelect v-model="payload.uniteeMesureId" name="unite" :options="{ placeholder: 'Selectionez une unité de mesure' }" class="w-full">
                      <option value=""></option>
                      <option v-for="(unite, index) in unites" :key="index" :value="unite.id">{{ unite.nom }}</option>
                    </TomSelect>
                  </div>
                </div>
                <div class="flex flex-wrap items-center justify-between w-full gap-3">
                  <div class="flex-1">
                    <label class="form-label">Sites</label>
                    <TomSelect v-model="payload.sites" multiple name="site" :options="{ placeholder: 'Selectionez les sites' }" class="w-full">
                      <option value=""></option>
                      <option v-for="(site, index) in sites" :key="index" :value="site.id">{{ site.nom }}</option>
                    </TomSelect>
                  </div>
                  <div class="flex-1">
                    <label class="form-label">Source de données</label>
                    <TomSelect v-model="payload.sources_de_donnee" name="source" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
                      <option value=""></option>
                      <option v-for="(source, index) in sourcesDonnees" :key="index" :value="source">{{ source }}</option>
                    </TomSelect>
                  </div>
                </div>
              </div>
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
                <InputForm label="Année" v-model="currentAnneeCible.annee" type="number" placeholder="Entrez l'année" />

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

        <Modal :show="deleteModalPreview" @hidden="closeDeleteModal">
          <ModalBody class="p-0">
            <div class="p-5 text-center">
              <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
              <div class="mt-5 text-lg">{{ nameSelect }}</div>
              <div class="mt-2 text-slate-500">Supprimer cette catégorie?</div>
            </div>
            <div class="flex justify-center gap-3 py-4">
              <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
              <DeleteButton :loading="isLoading" @click="deleteData" />
            </div>
          </ModalBody>
        </Modal>
      </div>
    </section>
  </div>
</template>

<script setup>
import CleValeur from "../../../components/create-indicateur/CleValeur.vue";
import ManagmentCategorie from "../../../components/create-indicateur/ManagmentCategorie.vue";
import CategoriesService from "@/services/modules/categorie.service";
import ManagmentSite from "../../../components/create-indicateur/ManagmentSite.vue";
import UniteMesure from "../../../components/create-indicateur/UniteMesure.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import IndicateursService from "@/services/modules/indicateur.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { frequenceCollecte, methodeCollecte, sourcesDonnees, type_variablees, type_variablees_agreger } from "../../../utils/constants";
import OngService from "../../../services/modules/ong.service";
import SiteService from "@/services/modules/site.service";
import UniteeDeMesureService from "@/services/modules/unitee.mesure.service";
import IndicateurValueKeys from "@/services/modules/key.value.service";
import AuthService from "@/services/modules/auth.service";
import ResultatCadreRendementService from "@/services/modules/resultat.cadre.rendement.service";
import TabulatorCadreMesure from "@/components/TabulatorCadreMesure.vue";

const props = defineProps({});

// Reactive data structure
const cadreRendement = ref([]);
const isLoadingDataCadre = ref(false);
const idProgramme = ref("");
const debutProgramme = ref("");
const finProgramme = ref("");

const showMenu = ref(false);
const idSelect = ref("");
const nameSelect = ref("");
const search = ref("");
const showModalCreate = ref(false);
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
const array_value_keys = ref([]);
const responsablesForm = ref({ organisations: [], ug: "" });

const displayMenu = () => {
  showMenu.value = !showMenu.value;
};
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
  showModalCreate.value = false;
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
  if (payload.agreger) {
    payload.anneesCible = anneesCible.value;
    payload.valeurDeBase = valeurDeBase.value;
    payload.value_keys = array_value_keys.value.map((item) => {
      return { id: item };
    });
  } else {
    payload.anneesCible = payloadNotAgreger.anneesCible;
    payload.valeurDeBase = payloadNotAgreger.valeurDeBase;
    delete payload.value_keys;
  }
  isLoading.value = true;
  const action = isCreate.value ? IndicateursService.create(payload) : IndicateursService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Indicateur ${isCreate.value ? "créee" : "modifiée"} avec succès.`);
    getDatas();
    getDatasCadre();
    resetForm();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
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
  getCategories();
  getResponsables();
  getSites();
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
// Fetch data on component mount
onMounted(async () => {
  await getcurrentUser();
  getDatasCadre();
  getDatas();
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
</style>
