<script setup>
import { computed, onMounted, ref, reactive, watch, nextTick } from "vue";
import InputForm from "@/components/news/InputForm.vue";
import IndicateursService from "@/services/modules/indicateur.service";
import IndicateurSuivisService from "@/services/modules/indicateur.suivi.service";
import Tabulator from "tabulator-tables";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { useRoute, useRouter } from "vue-router";
import VButton from "@/components/news/VButton.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import AuthService from "@/services/modules/auth.service";
import { sourcesDonnees } from "@/utils/constants";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { parse } from "@vue/compiler-sfc";

const route = useRoute();
const router = useRouter();
const isCreate = ref(true);
const tabulator = ref();
const idSelect = ref("");
const nameSelect = ref("");
const showModalValidate = ref(false);
const isLoadingData = ref(true);
const isLoading = ref(false);
const datas = ref([]);
const currentIndicateur = ref(null);
const authUserType = ref("");

const debutProgramme = ref("");
const finProgramme = ref("");



const idIndicateur = computed(() => route.params.id);

function formatObject(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([key, value]) => (key === "moy" ? value : `${key}: ${value}`))
    .join("<br>");
}

function formatArrayToNewLines(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.join("<br>");
}

function formatDateOnly(dateTimeString) {
  // Vérifie si la chaîne est valide
  if (!dateTimeString) return null;

  // Utilise split pour extraire uniquement la date
  const [date] = dateTimeString.split(" ");
  return date;
}

// filter


const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

const getCurrentQuarter = function () {
  const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
  return Math.ceil(month / 3); // Calcul du trimestre actuel
}

const openFilterModal = () => {
  console.log(filterPayload.annee);
  filterPayload.trimestre = `${getCurrentQuarter()}`;
  showModalFiltre.value = true;
};

const showModalFiltre = ref(false);

const filterPayload = reactive({
  trimestre: `${getCurrentQuarter()}`,
  annee: `${new Date().getFullYear()}`,
});

const isLoadingFilter = ref(false);

const annees = computed(() => {
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  const annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    annees.push(annee);
  }
  return annees;
});

const resetFilter = function () {
  filterPayload.trimestre = `${getCurrentQuarter()}`;
  filterPayload.annee = `${new Date().getFullYear()}`;

  filterSuiviIndicateur();
};

const filterSuiviIndicateur = async () => {
  isLoadingFilter.value = true;

  filterPayload.annee = parseInt(filterPayload.annee);
  filterPayload.trimestre = parseInt(filterPayload.trimestre);

  console.log(filterPayload);

  await IndicateurSuivisService.filtre(filterPayload)
    .then((result) => {
      datas.value = result.data.data;
      console.log(datas.value);
      resetFilterModal();
    })
    .catch((e) => {
      console.log(e);
      isLoadingFilter.value = false;
      toast.error("Vérifier les informations et ressayer.");
    });
  initTabulator();
};

const resetFilterModal = () => {
  isLoadingFilter.value = false;
  showModalFiltre.value = false;
  filterPayload.trimestre = `${getCurrentQuarter()}`;
  filterPayload.annee = `${new Date().getFullYear()}`;
};

const getcurrentUser = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

const years = computed(() => {
  let anneeDebut = parseInt(`${debutProgramme.value.split("-")[0]}`);
  let anneeFin = parseInt(`${finProgramme.value.split("-")[0]}`);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    if (annee <= new Date().getFullYear()) {
      annees.push(annee);
    }
  }
  return annees;
});

/** Manage suivi */


const showModalSuivi = ref(false);
const deleteSuiviModalPreview = ref(false);

const valueKeysIndicateurSuivi = ref([]);
const isAgregerCurrentIndicateur = ref(false);

const valeurCible = ref([]);
const valeurRealise = ref([]);

const optionsSuivi = [
  { label: "Par date", id: "date" },
  { label: "Par trimestre", id: "trimestre" },
];
const suiviOption = ref(optionsSuivi[0].id);

const payloadSuivi = reactive({
  annee: `${new Date().getFullYear()}`,
  trimestre: `${getCurrentQuarter()}`,
  valeurCible: "",
  valeurRealise: "",
  commentaire: "",
  dateSuivie: "",
  indicateurId: "",
  sources_de_donnee: ""
});

const shouldDisableAgregerFields = ref(false);
const shouldDisableNonAgregerFields = ref(false);

const shouldDisableValeurCible = computed(() => {
  if (!currentIndicateur.value || !currentIndicateur.value.valeursCible) return false;
  const year = Number(payloadSuivi.annee);
  return currentIndicateur.value.valeursCible.some((v) => v.annee === year);
});

const updateValuesForYear = (year) => {
  const indicateur = currentIndicateur.value;
  if (!indicateur || !indicateur.valeursCible) return;

  const targetData = indicateur.valeursCible.find((v) => v.annee === year);

  if (targetData) {
    if (isAgregerCurrentIndicateur.value) {
      const rawValues = targetData.valeurCible;
      valeurCible.value = valueKeysIndicateurSuivi.value.map((k) => ({
        keyId: k.id,
        value: rawValues ? rawValues[k.key] : "",
      }));
    } else {
      const rawValues = targetData.valeurCible;
      if (rawValues && typeof rawValues === "object") {
        const keys = Object.keys(rawValues);
        if (keys.length > 0) payloadSuivi.valeurCible = rawValues[keys[0]];
      } else {
        payloadSuivi.valeurCible = rawValues;
      }
    }
  } else {
    if (isAgregerCurrentIndicateur.value) {
      valeurCible.value = valueKeysIndicateurSuivi.value.map((k) => ({
        keyId: k.id,
        value: "",
      }));
    } else {
      payloadSuivi.valeurCible = "";
    }
  }
};

watch(
  () => payloadSuivi.annee,
  (newYear) => {
    if (!newYear) return;
    // Ne mettre à jour que si on est en mode création (pour ne pas écraser lors de l'édition)
    if (isCreate.value) {
      updateValuesForYear(Number(newYear));
    }
  }
);

const handleEditSuivi = (data) => {
  console.log(data);
  isCreate.value = false;
  idSelect.value = data.id;

  const date = new Date(data.dateSuivie);
  payloadSuivi.dateSuivie = date.toISOString().slice(0, 10); // mm/dd/yyyy

  payloadSuivi.sources_de_donnee = data.sources_de_donnee;
  payloadSuivi.commentaire = data.commentaire;
  payloadSuivi.annee = `${new Date(data.dateSuivie).getFullYear()}`; 
  payloadSuivi.trimestre = `${payloadSuivi.trimestre}`;
  valeurCible.value = data.valeurCible.valeurCible;
  valeurRealise.value = data.valeurRealise;
  isAgregerCurrentIndicateur.value = data.valeurCible.indicateur.agreger;
  if(isAgregerCurrentIndicateur.value == false){
    Object.keys(valeurCible.value).forEach((key) => {
      payloadSuivi.valeurCible = valeurCible.value[key];
    });
    Object.keys(valeurCible.value).forEach((key) => {
      payloadSuivi.valeurRealise = valeurRealise.value[key];
    });
  }

  payloadSuivi.indicateurId = data.valeurCible.indicateur.id;
  valueKeysIndicateurSuivi.value = data.valeurCible.indicateur.value_keys;
  resetValues();
  showModalSuivi.value = true;
  console.log(payloadSuivi);
};



const updateValueCible = (keyId, newValue) => {
  const entry = valeurCible.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};

const updateValueRealiser = (keyId, newValue) => {
  const entry = valeurRealise.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};

const resetValues = () => {
  valeurCible.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: valeurCible.value[item.key] ?? "",
  }));
  valeurRealise.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: valeurRealise.value[item.key] ?? "",
  }));
};

const resetFormSuivi = () => {
  if (isAgregerCurrentIndicateur.value) {
    resetValues();
  }
  Object.keys(payloadSuivi).forEach((key) => {
    payloadSuivi[key] = "";
  });

  payloadSuivi['annee'] = `${new Date().getFullYear()}`;
  payloadSuivi['trimestre'] = `${getCurrentQuarter()}`;
  payloadSuivi['valeurCible'] = "";
  payloadSuivi['valeurRealise'] = "";
  payloadSuivi['commentaire'] = "";
  payloadSuivi['dateSuivie'] = "";
  payloadSuivi['indicateurId'] = "";
  payloadSuivi['sources_de_donnee'] = "";

  showModalSuivi.value = false;
  isCreate.value = true;
};
// Submit data (create or update)
const submitData = async () => {
  console.log(isCreate.value);
  isCreate.value ? submitSuivi() : submitUpdateSuivi();
}

const submitSuivi = async () => {
  payloadSuivi.annee = Number(payloadSuivi.annee);
  payloadSuivi.trimestre = Number(payloadSuivi.trimestre);
  // S'assurer que l'ID de l'indicateur est bien défini
  payloadSuivi.indicateurId = idIndicateur.value;

  if (optionsSuivi[0].id == suiviOption.value) {
    delete payloadSuivi.trimestre;
  } else {
    delete payloadSuivi.dateSuivie;
  }
  
  // Inclure les valeurs cibles même si les champs sont désactivés
  if (isAgregerCurrentIndicateur.value) {
    payloadSuivi.valeurCible = valeurCible.value;
    payloadSuivi.valeurRealise = valeurRealise.value;
  } else {
    // Pour les indicateurs non agrégés, si le champ est désactivé, s'assurer que la valeur est bien dans le payload
    // (Elle devrait déjà y être via le v-model ou updateValuesForYear, mais on s'assure)
  }

  console.log(payloadSuivi);

  isLoading.value = true;
  const action = IndicateursService.createSuivi(payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Ajouté avec succès.`);
    resetFormSuivi();
    getDatas();
    showModalSuivi.value = false;
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};

const submitUpdateSuivi = async () => {
  payloadSuivi.annee = Number(payloadSuivi.annee);
  payloadSuivi.trimestre = Number(payloadSuivi.trimestre);
  if (optionsSuivi[0].id == suiviOption.value) {
    delete payloadSuivi.trimestre;
  } else {
    delete payloadSuivi.dateSuivie;
  }

  if (isAgregerCurrentIndicateur.value) {
    payloadSuivi.valeurCible = valeurCible.value;
    payloadSuivi.valeurRealise = valeurRealise.value;
  }

  console.log(payloadSuivi);

  isLoading.value = true;
  const action = IndicateurSuivisService.update(idSelect.value, payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Modifie avec succès.`);
    resetFormSuivi();
    getDatas();
    showModalSuivi.value = false;
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    toast.error(getAllErrorMessages(e));
  }
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.valeurCible.indicateur.nom + "\nValeur realise : " + formatObject(data.valeurRealise);
  deleteSuiviModalPreview.value = true;
};

const cancelDeleteSuivi = () => {
  idSelect.value = "";
  deleteSuiviModalPreview.value = false;
};

// Delete data
const deleteSuivi = async () => {
  try {
    isLoading.value = true;
    await IndicateurSuivisService.destroy(idSelect.value);
    toast.success("Suivi Indicateur supprimé avec succès.");
    getDatas();
    deleteSuiviModalPreview.value = false;
  } catch (e) {
    console.error(e);
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => (showModalSuivi.value = false);
const closeDeleteSuiviModal = () => (deleteSuiviModalPreview.value = false);

/** */

const getDatas = async () => {
  isLoadingData.value = true;
  try {
    // Récupérer les suivis
    const resultSuivis = await IndicateursService.detailSuivi(idIndicateur.value);
    datas.value = resultSuivis.data.data;

    // Récupérer les détails de l'indicateur pour avoir les valeurs cibles prévues
    const resultIndicateur = await IndicateursService.get(idIndicateur.value);
    currentIndicateur.value = resultIndicateur.data.data;
    
    // Initialiser valueKeysIndicateurSuivi si l'indicateur est agrégé
    if (currentIndicateur.value.agreger) {
      valueKeysIndicateurSuivi.value = currentIndicateur.value.value_keys;
      isAgregerCurrentIndicateur.value = true;
      resetValues(); // Initialiser le tableau valeurCible
    } else {
      isAgregerCurrentIndicateur.value = false;
    }

    isLoadingData.value = false;
    await nextTick();
    initTabulator();
  } catch (e) {
    console.error(e);
    isLoadingData.value = false;
    toast.error("Une erreur est survenue lors du chargement des données.");
  }
};

const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Valeur réalisée",
        field: "valeurRealise",
        hozAlign: "left",
        vertAlign: "middle",
        formatter(cell) {
          return `${formatObject(cell.getData().valeurRealise)}`;
        },
      },
      {
        title: "Date de suivie",
        field: "dateSuivie",
        hozAlign: "center",
        vertAlign: "middle",
        formatter(cell) {
          return `${formatDateOnly(cell.getData().dateSuivie)}`;
        },
      },
      {
        title: "Trimestre",
        field: "trimestre",
        hozAlign: "center",
        vertAlign: "middle",
      },
      {
        title: "Valeur cible",
        field: "valeurCible",
        hozAlign: "center",
        vertAlign: "middle",

        formatter(cell) {
          return `${formatObject(cell.getData().valeurCible.valeurCible)} - ${cell.getData().valeurCible.annee}`;
        },
      },
      {
        title: "Actions",
        field: "actions",
        width: 316,
        formatter: (cell) => {
          const container = document.createElement("div");
          container.className = "flex items-center justify-center gap-3";

          const createButton = (label, className, onClick) => {
            const button = document.createElement("button");
            button.className = className;
            button.innerText = label;
            button.addEventListener("click", onClick);
            return button;
          };
          
          const modifyButton = createButton("Modifier", "btn btn-primary", () => {
            handleEditSuivi(cell.getData());
          });

          const deleteButton = createButton("Supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          container.append(modifyButton, deleteButton);
          return container;
        },
      },
    ],
  });
};

onMounted(() => {
  authUserType.value = JSON.parse(localStorage.getItem("authenticateUser")).type;
  getcurrentUser();
  getDatas();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Détail du suivi</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-end col-span-12 mt-2 intro-y sm:flex-nowrap"></div>
  </div>
  
  <div v-if="datas.length > 0" class="grid grid-cols-12 gap-5 mt-5">
    <div class="col-span-12 p-5 cursor-pointer sm:col-span-4 2xl:col-span-4 box bg-primary zoom-in">
      <div class="text-base font-medium text-white">Indicateur</div>
      <div class="text-white text-opacity-80">{{ datas[0]?.valeurCible.indicateur?.nom }}</div>
    </div>
    <div class="col-span-12 p-5 cursor-pointer sm:col-span-4 2xl:col-span-4 bg-primary box zoom-in">
      <div class="text-base font-medium text-white">Catégorie</div>
      <div class="text-white dark:text-slate-500 text-opacity-80">{{ datas[0]?.valeurCible.indicateur?.categorie.type ?? datas[0]?.valeurCible.indicateur?.type ?? datas[0]?.valeurCible.indicateur?.categorie?.nom }}</div>
    </div>
    <div class="col-span-12 p-5 cursor-pointer bg-primary sm:col-span-4 2xl:col-span-4 box zoom-in">
      <div class="text-base font-medium text-white">Unité de mesure</div>
      <div class="text-white text-opacity-80">{{ datas[0]?.valeurCible.indicateur?.unitee_mesure?.nom }}</div>
    </div>
  </div>
  <div class="p-5 mt-5 intro-y box">

    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
        <div class="flex w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
          <div class="relative w-56 text-slate-500">
            <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
            <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline-secondary" @click="router.back()">
            Retour
          </button>
          
          <button class="shadow-md btn btn-primary" @click="showModalSuivi = true">
            Ajouter un suivi
          </button>

          <button class="mr-2 shadow-md btn btn-primary" @click="openFilterModal">
            <FilterIcon class="w-4 h-4 mr-3" />Filtre
          </button>

          <button class="btn btn-primary" title="Réinitialiser le filtre" @click="resetFilter()">
            <RefreshCwIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal Filtre des suivis -->
  <Modal backdrop="static" :show="showModalFiltre" @hidden="showModalFiltre = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Filtrer les suivis</h2>
    </ModalHeader>
    <form @submit.prevent="filterSuiviIndicateur">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <div class="">
            <label class="form-label">Année</label>
            <TomSelect v-model="filterPayload.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(annee, index) in annees" :key="index" :value="annee">{{ annee }}</option>
            </TomSelect>
          </div>
          <div class="">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="filterPayload.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full">
              <option v-for="(i, index2) in 4" :key="index2" :value="i">Trimestre {{ i }}</option>
            </TomSelect>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFilterModal" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoadingFilter" label="Filtrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->



  <!-- SUIVIE  -->
  <Modal size="modal-lg" backdrop="static" :show="showModalSuivi" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un suivi</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-5">
          <div class="flex-1">
            <label class="form-label">Année de suivi</label>
            
            <TomSelect v-model="payloadSuivi.annee" name="annee_suivi" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="annee in years" :key="annee" :value="annee">{{ annee }}</option>
            </TomSelect>
          </div>
          
          <div v-if="!isAgregerCurrentIndicateur" class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex-1">
              <InputForm 
                label="Valeur cible" 
                v-model="payloadSuivi.valeurCible" 
                type="number" 
                :disabled="shouldDisableValeurCible || shouldDisableAgregerFields"
                :class="{ 'opacity-60': shouldDisableValeurCible }"
              />
              <p v-if="shouldDisableValeurCible" class="mt-1 text-xs text-blue-600">
                ℹ️ Valeur cible existante pour cette année (non modifiable)
              </p>
              <p v-else class="mt-1 text-xs text-gray-500">
                ✏️ Aucune valeur cible pour cette année, vous pouvez en saisir une
              </p>
            </div>
            <InputForm label="Valeur réalisée" class="flex-1" v-model="payloadSuivi.valeurRealise" type="number" />
          </div>

          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Cible</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input 
                  type="number" 
                  class="form-control" 
                  :disabled="shouldDisableValeurCible || shouldDisableNonAgregerFields" 
                  :class="{ 'opacity-60': shouldDisableValeurCible }"
                  v-model.number="valeurCible.find((item) => item.keyId === base.id).value" 
                  @input="updateValueCible(base.id, $event.target.value)" 
                  placeholder="valeur cible" 
                  aria-label="valeur" 
                  aria-describedby="input-group-valeur" 
                />
              </div>
            </div>
            <p v-if="shouldDisableValeurCible" class="mt-1 text-xs text-blue-600">
              ℹ️ Valeurs cibles existantes pour cette année (non modifiables)
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              ✏️ Aucune valeur cible pour cette année, vous pouvez en saisir
            </p>
          </div>
          
          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Réalisée</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input type="number" class="form-control" v-model="valeurRealise.find((item) => item.keyId === base.id).value" @input="updateValueRealiser(base.id, $event.target.value)" placeholder="valeur réalisée" aria-label="valeur" aria-describedby="input-group-valeur" />
              </div>
            </div>
          </div>

          <div class="flex-1">
            <label>Suivi par date ou trimestre?</label>
            <div class="flex flex-col gap-3 mt-2 sm:flex-row">
              <div v-for="(item, index) in optionsSuivi" :key="index" class="mr-2 form-check">
                <input :id="item.id" class="form-check-input" type="radio" name="option_suivi" v-model="suiviOption" :value="item.id" />
                <label class="form-check-label" :for="item.id">{{ item.label }}</label>
              </div>
            </div>
          </div>
          <div v-if="suiviOption == 'trimestre'" class="flex-1">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="payloadSuivi.trimestre" name="trimestre_suivi" :options="{ placeholder: 'Selectionez un trimestre' }" class="w-full">
              <option value=""></option>
              <option v-for="trimestre in 4" :key="trimestre" :value="trimestre">Trimestre {{ trimestre }}</option>
            </TomSelect>
          </div>

          <InputForm v-else label="Date de suivi" class="flex-1" v-model="payloadSuivi.dateSuivie" type="date" />
          <div class="flex-1">
            <label class="form-label">Source de données</label>
            <TomSelect v-model="payloadSuivi.sources_de_donnee" name="source" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option v-for="(source, index) in sourcesDonnees" :key="index" :value="source">{{ source }}</option>
            </TomSelect>
          </div>
          <div class="flex-1">
            <label class="form-label" for="description">Commentaire</label>
            <div class="">
              <textarea name="description" class="form-control" id="description" v-model="payloadSuivi.commentaire" cols="30" rows="2"></textarea>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFormSuivi" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="isCreate ? 'Enrégistrer' : 'Modifier'" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal for deleting -->
  <Modal :show="deleteSuiviModalPreview" @hidden="closeDeleteSuiviModal">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-lg">{{ nameSelect }}</div>
        <div class="mt-2 text-slate-500">Supprimer le suivi?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDeleteSuivi" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteSuivi" />
      </div>
    </ModalBody>
  </Modal>
</template>