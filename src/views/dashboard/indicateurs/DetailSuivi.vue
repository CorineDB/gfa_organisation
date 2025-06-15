<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import IndicateursService from "@/services/modules/indicateur.service";
import Tabulator from "tabulator-tables";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { useRoute } from "vue-router";
import VButton from "@/components/news/VButton.vue";
import AuthService from "@/services/modules/auth.service";
import { getAllErrorMessages } from "@/utils/gestion-error";

const route = useRoute();
const isCreate = ref(true);
const tabulator = ref();
const idSelect = ref("");
const showModalValidate = ref(false);
const isLoadingData = ref(true);
const isLoading = ref(false);
const datas = ref([]);
const authUserType = ref("");

const debutProgramme = ref("");
const finProgramme = ref("");

const getDatas = async () => {
  isLoadingData.value = true;
  await IndicateursService.detailSuivi(idIndicateur.value)
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste de sources.");
    });
  initTabulator();
};

const handleValidate = (params) => {
  idSelect.value = params.id;
  showModalValidate.value = true;
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
            handleEdit(cell.getData());
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

const openFilterModal = () => {
  console.log(filterPayload.annee);
  filterPayload.trimestre = 3; //getCurrentQuarter();
  showModalFiltre.value = true;
};

const getCurrentQuarter = function () {
  const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
  return Math.ceil(month / 3); // Calcul du trimestre actuel
}

const showModalFiltre = ref(false);

const filterPayload = reactive({
  trimestre: getCurrentQuarter(),
  annee: new Date().getFullYear(),
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
  filterPayload.trimestre = getCurrentQuarter();
  filterPayload.annee = new Date().getFullYear();

  filterSuiviIndicateur();
};

const filterSuiviIndicateur = async () => {
  isLoadingFilter.value = true;

  console.log(filterPayload.annee);

  filterPayload.annee = parseInt(filterPayload.annee);
  filterPayload.trimestre = parseInt(filterPayload.trimestre);

  await IndicateursService.filtre(filterPayload)
    .then((result) => {
      datas.value = result.data.data;
      resetFilterModal();
    })
    .catch((e) => {
      console.log(e);
      isLoadingFilter.value = false;
      toast.error("Vérifier les informations et ressayer.");
    });
};

const resetFilterModal = () => {
  isLoadingFilter.value = false;
  showModalFiltre.value = false;
  filterPayload.trimestre = getCurrentQuarter();
  filterPayload.annee = new Date().getFullYear();
};

const getcurrentUser = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      // responsablesForm.value.ug = result.data.data.profil.id;
      // ugs.value.push({ id: result.data.data.profil.id, nom: result.data.data.profil.nom });
      // idProgramme.value = result.data.data.programme.id;
      console.log("debut", result.data.data.programme.debut);
      console.log("fin", result.data.data.programme.debut);
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
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
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap"></div>
  </div>
  <div v-if="datas.length > 0" class="p-4 space-y-3 text-base box">
    <p><span class="font-semibold uppercase">Indicateur : </span>{{ datas[0]?.valeurCible.indicateur.nom }}</p>
    <p><span class="font-semibold uppercase">Catégorie : </span>{{ datas[0]?.valeurCible.indicateur.categorie.nom }}</p>
    <p v-if="datas[0]?.valeurCible.indicateur.description"><span class="font-semibold uppercase">Description : </span>{{ datas[0]?.valeurCible.indicateur.description }}</p>
    <p><span class="font-semibold uppercase">Unité de mesure : </span>{{ datas[0]?.valeurCible.indicateur.unitee_mesure.nom }}</p>
    <!-- <p><span class="font-semibold">Valeur de base : </span>{{ formatValeurDeBase(datas[0]?.valeurCible.indicateur.valeurDeBase) }}</p> -->
  </div>
  <div class="p-5 mt-5 intro-y box">

    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="flex flex-wrap items-center justify-end col-span-12 mt-2 intro-y sm:flex-nowrap">
        <!-- <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
          <div class="relative w-56 text-slate-500">
            <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
            <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div> -->
        <div class="flex">
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

  <!-- Modal Register & Update -->
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
</template>
