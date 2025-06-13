<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import SuiviFinancier from "@/services/modules/suiviFinancier.service";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import { getAllErrorMessages } from "@/utils/gestion-error";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import AuthService from "@/services/modules/auth.service";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const showModalFiltre = ref(false);
const debutProgramme = ref("");
const finProgramme = ref("");

const years = computed(() => {
  console.log("debut", `${debutProgramme.value.split("-")}`);
  console.log("fin", `${finProgramme.value.split("-")}`);
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

const payload = reactive({
  activiteId: route.params.id,
  trimestre: 1, // Trimestre actuel
  annee: new Date().getFullYear(), // Set current year as default
  consommer: 0,
  // type: 0,
});

const getCurrentQuarter = () => {
  const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
  return Math.ceil(month / 3); // Calcul du trimestre actuel
};

const openFilterModal = () => {
  filterPayload.trimestre = getCurrentQuarter(); //
  showModalFiltre.value = true;
};

const filterPayload = reactive({
  trimestre: 1, // Trimestre actuel
  annee: new Date().getFullYear(), // Set current year as default
});

const resetFilter = function () {
  filterPayload.trimestre = 1;
  filterPayload.annee = new Date().getFullYear();
  getDatas();
};

const tabulator = ref();
const idSelect = ref("");
const searchValue = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const datas = ref([]);
const erreurSuiviFinancier = ref(null);

const filter = ref({
  annee: new Date().getFullYear(),
  trimestre: 1,
});

const isLoadingFilter = ref(false);

const filterSuiviFinancierActivite = async () => {
  isLoadingFilter.value = true;

  filterPayload.annee = parseInt(filterPayload.annee);
  filterPayload.trimestre = parseInt(filterPayload.trimestre);

  await SuiviFinancier.getSuiviByActivite(route.params.id, filterPayload)
    .then((result) => {
      datas.value = result.data.data;
      initTabulator();
      console.log(datas.value);
      isLoadingFilter.value = false;
      resetFilterModal();
      toast.success("Suivi Financier filtrer.");
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
};

const createData = async () => {
  // payload.type = parseInt(payload.type);
  isLoading.value = true;
  await SuiviFinancier.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Suivi créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error(getAllErrorMessages(e));

      if (e.response && e.response.data && e.response.data.errors) {
        erreurSuiviFinancier.value = error.response.data.errors;
      } else {
        toast.error(e.response.data.errors.message);
      }
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await SuiviFinancier.getSuiviByActivite(route.params.id, filter.value)
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
const updateData = async () => {
  isLoading.value = true;
  await SuiviFinancier.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Suivi modifiée.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error(getAllErrorMessages(e));

      if (e.response && e.response.data && e.response.data.errors) {
        erreurSuiviFinancier.value = error.response.data.errors;
      } else {
        toast.error(e.response.data.errors.message);
      }
    });
};
const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await SuiviFinancier.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Type de gouvernance supprimé");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};
const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    responsiveLayout: "hide",
    pagination: "local",
    paginationSize: 10,
    columns: [
      {
        title: "Code Pta",
        field: "codePta",
      },
      {
        title: "Nom de l'activité",
        field: "nom",
      },
      {
        title: "Montant Consommer",
        field: "consommer",
      },
      {
        title: "Trimestre",
        field: "trimestre",
      },
      {
        title: "Date de suivi",
        field: "dateDeSuivi",
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
const applyFilter = () => {
  if (tabulator.value) {
    const query = searchValue.value.toLowerCase();
    tabulator.value.setFilter((data) => {
      return data.intitule.toLowerCase().includes(query);
    });
  }
};
const handleEdit = (params) => {
  isCreate.value = false;
  idSelect.value = params.id;
  payload.activiteId = params.id;
  payload.trimestre = params.trimestre;
  payload.annee = params.annee;
  payload.consommer = params.consommer;
  // payload.consommer = params.consommer;

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
  payload.activiteId = route.params.id;
  payload.trimestre = 1; // Trimestre actuel
  payload.annee = new Date().getFullYear(); // Set current year as default
  payload.consommer = 0;
  // payload.type = 0;
  showModalCreate.value = false;
};
const openCreateModal = () => {
  showModalCreate.value = isCreate.value = true;
  payload.trimestre = 1; // Trimestre actuel
  payload.annee = new Date().getFullYear(); // Set current year as default
  payload.consommer = 0;
  // payload.type = "";
  payload.activiteId = route.params.id;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(() => {
  initTabulator();
  getcurrentUser();
  getDatas();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Détail suivi financier</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full flex mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500 mr-3">
          <input type="text" @input="applyFilter" v-model="searchValue" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
        <button class="mr-2 shadow-md btn btn-primary" @click="openFilterModal"><FilterIcon class="w-4 h-4 mr-3" />Filtrer</button>

        <button class="btn btn-primary" title="Réinitialiser le filtre" @click="resetFilter()">
          <RefreshCwIcon class="w-5 h-5" />
        </button>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un suivi</button>
        <button class="btn btn-primary" title="Retour" @click="router.back()">
          <CornerDownLeftIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>

  <div class="p-5 mt-5 intro-y box">
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
      <div></div>
      <!-- <div class="flex mt-5 sm:mt-0">
        <button id="tabulator-print" class="w-1/2 mr-2 btn btn-outline-secondary sm:w-auto"><PrinterIcon class="w-4 h-4 mr-2" /> Print</button>
        <Dropdown class="w-1/2 sm:w-auto">
          <DropdownToggle class="w-full btn btn-outline-secondary sm:w-auto">
            <FileTextIcon class="w-4 h-4 mr-2" /> Export
            <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export CSV </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export JSON </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export XLSX </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export HTML </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div> -->
    </div>
    <div class="overflow-x-auto scrollbar-hidden" v-show="!isLoadingData">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un suivi</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="mt-5"></div>
        <div class="grid grid-cols-1 gap-4">
          <div class="col-span-12">
            <InputForm label="Consommé" v-model="payload.consommer" type="number" />
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.consommer">
              {{ erreurSuiviFinancier[index].consommer }}
            </p>
          </div>
          <!-- <div class="col-span-12">
            <label class="form-label">Sources</label>
            <TomSelect v-model="payload.type" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value="fond-propre">Fond propre</option>
              <option value="budget-alloue">Budget Alloue</option>
            </TomSelect>
          </div> -->
          <div class="col-span-12">
            <InputForm v-model="payload.trimestre" :min="1" :max="4" class="col-span-12" type="number" :required="true" :disabled="true" placeHolder="Sélectionnez le trimestre" label="Sélectionnez le trimestre" />
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurSuiviFinancier[index].trimestre }}
            </p>
          </div>

          <div class="col-span-12">
            <pre>{{ payload.annee }}</pre>
            <InputForm v-model="payload.annee" :min="2000" class="col-span-12" type="number" :required="true" :disabled="true" placeHolder="Saisissez l'année" label="Saisissez l'année de décaissement" />
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.annee">
              {{ erreurSuiviFinancier[index].annee }}
            </p>
          </div>

          <!-- <InputForm label="Nom" v-model="payload.intitule" />
          <InputForm label="Description" v-model="payload.description" :required="false" /> -->
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

  <Modal backdrop="static" :show="showModalFiltre" @hidden="showModalFiltre = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Filtrer la liste des suivis</h2>
    </ModalHeader>
    <form @submit.prevent="filterSuiviFinancierActivite">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <!-- <pre>{{years}}</pre> -->
          <div class="">
            <label class="form-label">Année</label>
            <TomSelect v-model="filterPayload.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
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

  <!-- Modal Delete -->
  <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Suppression</div>
        <div class="mt-2 text-slate-500">Supprimer ce suivi?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
