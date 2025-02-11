<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import SuiviFinancierService from "@/services/modules/suiviFinancier.service";
import ProgrammeService from "@/services/modules/programme.service";
import TypeGouvernance from "@/services/modules/typeGouvernance.service";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import AuthService from "@/services/modules/auth.service";
import { useRouter } from "vue-router";

const router = useRouter();
const showModalFiltre = ref(false);
const annees = ref("");
const filterPayload = reactive({
  trimestre: 1, // Trimestre actuel
  annee: new Date().getFullYear(), // Set current year as default
});
const isLoadingFilter = ref(false);

const suiviFinancier = ref([]);
const suiviFinancierPayload = reactive({
  activiteId: null,
  trimestre: 1, // Trimestre actuel
  annee: new Date().getFullYear(), // Set current year as default
  consommer: 0,
  type: 0,
});

const resetFilter = function () {
  filterPayload.trimestre = 1;
  filterPayload.annee = new Date().getFullYear();

  filterSuiviFinancierActivite();
};

// const annees = computed(() => {
//   let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
//   let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
//   let annees = [];
//   for (let annee = anneeDebut; annee <= anneeFin; annee++) {
//     annees.push(annee);
//   }
//   return annees;
// });

const showModalSuiviFinancier = ref(false);
const loadingSuiviFinancier = ref(false);
const erreurSuiviFinancier = ref(null);

const payload = reactive({
  consommer: "",
  type: "",
  annee: "",
  activiteId: "",
  trimestre: "",
});

const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const activites = ref([]);
const datas = ref([]);

const debutProgramme = ref("");
const finProgramme = ref("");

// const years = ref([]);

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

const createData = async () => {
  console.log("payload", payload);
  isLoading.value = true;
  await SuiviFinancierService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Suivi Financier créer.");
    })
    .catch((e) => {
      console.log(e);
      isLoading.value = false;
      toast.error("Vérifier les informations et ressayer.");
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await SuiviFinancierService.get()
    .then((result) => {
      datas.value = result.data.data;
      console.log(datas.value);
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des type des options.");
    });
  // initTabulator();
};
const updateData = async () => {
  isLoading.value = true;
  await SuiviFinancierService.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Suivi Financier modifiée.");
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
  await SuiviFinancierService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Suivi Financier supprimée");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};

const handleInput = function (data) {
  console.log(data);
  getactivites(data);
};

const getactivites = (year) => {
  ProgrammeService.filtreActivites({ annee: year })
    .then((result) => {
      activites.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des Programmes.");
    });
};
const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Libelle",
        field: "libelle",
      },
      {
        title: "Description",
        field: "description",
      },
      {
        title: "Clé",
        field: "key",
        hozAlign: "center",
        width: 200,
      },
      {
        title: "Type",
        field: "type",
        hozAlign: "center",
        width: 200,
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

          const voirDetail = createButton("Voir détail", "btn btn-primary", () => {
            console.log("cell.getData().id", cell.getData().id);
            handleDetail(cell.getData().id);
          });

          const deleteButton = createButton("Supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          container.append(voirDetail, deleteButton);

          return container;
        },
      },
    ],
  });
};
const handleDetail = (data) => {
  // console.log("handleDetail id", id);
  router.push({
    name: "detail_suivi",
    params: { id: data.activite.id },
  });
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
  payload.consommer = "";
  payload.type = "";
  payload.annee = "";
  payload.activiteId = "";
  payload.trimestre = "";
  showModalCreate.value = false;
};
const openCreateModal = () => {
  years.value = [];
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0]);
  let anneeFin = parseInt(finProgramme.value.split("-")[0]);

  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    years.value.push(annee);
  }

  console.log("years", years.value);

  showModalCreate.value = true;
  isCreate.value = true;
};

const getCurrentQuarter = () => {
  const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
  return Math.ceil(month / 3); // Calcul du trimestre actuel
};

const ouvrirModalSuiviFinancierActivite = (item) => {
  suiviFinancierPayload.activiteId = item.activite.id;
  suiviFinancierPayload.trimestre = getCurrentQuarter();
  suiviFinancier.value.push(suiviFinancierPayload);
  showModalSuiviFinancier.value = true;
};

const resetModalSuiviFinancierActivite = (item) => {
  suiviFinancier.value = [];
  showModalSuiviFinancier.value = false;
};

const addPlan = () => {
  suiviFinancier.value.push(suiviFinancierPayload);
};

const removePlan = (index) => {
  suiviFinancier.value.splice(index, 1);
};

const suiviFinancierActivite = () => {
  loadingSuiviFinancier.value = true;

  for (let index = 0; index < suiviFinancier.value.length; index++) {
    SuiviFinancierService.create(suiviFinancier.value[index])
      .then(() => {
        loadingSuiviFinancier.value = false;
        toast.success("Suivi Financier créer.");
        resetModalSuiviFinancierActivite();
        showModalSuiviFinancier.value = false;
        getDatas();
      })
      .catch((error) => {
        console.log(error);
        loadingSuiviFinancier.value = false;

        toast.error("Une erreur s'est produite");

        // Mettre à jour les messages d'erreurs dynamiquement
        if (error.response && error.response.data && error.response.data.errors) {
          erreurSuiviFinancier = error.response.data.errors;
        } else {
          toast.error(error.response.data.errors.message);
        }
      });
  }
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

const openFilterModal = () => {
  console.log(filterPayload.annee);
  filterPayload.trimestre = 3; //getCurrentQuarter();
  showModalFiltre.value = true;
};

const filterSuiviFinancierActivite = async () => {
  isLoadingFilter.value = true;

  console.log(filterPayload.annee);

  filterPayload.annee = parseInt(filterPayload.annee);
  filterPayload.trimestre = parseInt(filterPayload.trimestre);

  await SuiviFinancierService.filtre(filterPayload)
    .then((result) => {
      datas.value = result.data.data;
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
  annees.value = "";
  showModalFiltre.value = false;
};

onMounted(() => {
  // var anneeActuelle = new Date().getFullYear() + 5;
  // let i = 0;
  // for (var annee = 2016; annee <= anneeActuelle; annee++) {
  //   i++;
  //   years.value.push({ nom: `${annee}` });
  // }

  getDatas();
  getactivites(new Date().getFullYear());
  getcurrentUser();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Suivi Financier</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openFilterModal"><FilterIcon class="w-4 h-4 mr-3" />Filtrer le PA</button>

        <button class="btn btn-primary" title="Réinitialiser le filtre" @click="resetFilter()">
          <RefreshCwIcon class="w-5 h-5" />
        </button>
      </div>
      <!-- <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal">
          <PlusIcon class="w-4 h-4 mr-3" />Ajouter un Suivi Financier
        </button>
      </div> -->
    </div>
  </div>

  <div class="p-5 mt-5 intro-y box">
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
      <div></div>
      <div class="flex mt-5 sm:mt-0">
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
      </div>
    </div>
    <!-- <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div> -->
    <div>
      <div class="border my-4 rounded-lg border-gray-300 shadow-md" v-if="!isLoadingData">
        <!-- suivi budgetaire  current -->
        <div class="current">
          <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-blue-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Activités</th>
                  <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Année</th>
                  <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Trimestre</th>
                  <th scope="col" colspan="4" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Période</th>
                  <th scope="col" colspan="4" class="py-3 px-6 text-center border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Exercice</th>
                  <th scope="col" colspan="4" class="py-3 px-6 text-center border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Cumul</th>
                  <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap text-center">Actions</th>
                </tr>
                <tr>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
                  <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(suivi, index) in datas.suiviFinanciers" :key="index" class="bg-white border-b hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ suivi?.activite?.codePta }}-{{ suivi?.activite?.nom }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ suivi.annee }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ suivi.trimestre }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ $h.formatCurrency(suivi.periode.budjet) }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ $h.formatCurrency(suivi.periode.consommer) }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ $h.formatCurrency(suivi.periode.disponible) }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ suivi.periode.pourcentage }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ $h.formatCurrency(suivi.exercice.budjet) }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ $h.formatCurrency(suivi.exercice.consommer) }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ $h.formatCurrency(suivi.exercice.disponible) }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ suivi.exercice.pourcentage }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ $h.formatCurrency(suivi.cumul.budjet) }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ $h.formatCurrency(suivi.cumul.consommer) }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ $h.formatCurrency(suivi.cumul.disponible) }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold">{{ suivi.cumul.pourcentage }}</span>
                  </td>
                  <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700 text-center">
                    <button @click="ouvrirModalSuiviFinancierActivite(suivi)" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Suivre</button>

                    <button @click="handleDetail(suivi)" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Voir détail</button>

                    <button @click="handleDelete(suivi)" class="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-xs px-4 py-2">Supprimer</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un Suivi Financier</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Consommé" v-model="payload.consommer" />
          <div class="">
            <label class="form-label">Sources</label>
            <TomSelect v-model="payload.type" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value="0">Montant financé</option>
              <option value="1">Fond Propre</option>
            </TomSelect>
          </div>
          <!-- <pre>{{years}}</pre> -->
          <div class="">
            <label class="form-label">Année</label>
            <TomSelect v-model="payload.annee" @change="handleInput(payload.annee)" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year.nom">{{ year.nom }}</option>
            </TomSelect>
            <pre></pre>
          </div>

          <div class="">
            <label class="form-label">Activités</label>
            <TomSelect v-model="payload.activiteId" :options="{ placeholder: 'Selectionez une unité de mesure' }" class="w-full">
              <option v-for="(unite, index) in activites" :key="index" :value="unite.id">{{ unite.nom }}</option>
            </TomSelect>
          </div>
          <div class="">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="payload.trimestre" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
              <option value="4">Trimestre 4</option>
            </TomSelect>
          </div>
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
        <div class="mt-2 text-slate-500">Supprimer cette Suivi Financier?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->

  <Modal backdrop="static" :show="showModalSuiviFinancier" @hidden="showModalSuiviFinancier = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un Suivi Financier</h2>
    </ModalHeader>

    <form @submit.prevent="suiviFinancierActivite">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div v-for="(plan, index) in suiviFinancier" :key="index" class="col-span-12 border-b pb-4 mb-4">
          <h3 class="text-sm font-medium mb-3">Plan {{ index + 1 }}</h3>

          <div class="">
            <InputForm label="Consommé" v-model="plan.consommer" type="number" />

            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.consommer">
              {{ erreurSuiviFinancier[index].consommer }}
            </p>
          </div>

          <div class="mt-5">
            <label class="form-label">Sources</label>
            <TomSelect v-model="plan.type" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value="0">Fond propre</option>
              <option value="1">Budget Alloue</option>
            </TomSelect>
          </div>

          <div class="mt-5">
            <InputForm v-model="plan.trimestre" :min="1" :max="4" class="col-span-12" type="number" :required="true" :disabled="true" placeHolder="Sélectionnez le trimestre" label="Sélectionnez le trimestre" />
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurSuiviFinancier[index].trimestre }}
            </p>
          </div>

          <div class="mt-5">
            <InputForm v-model="plan.annee" :min="2000" class="col-span-12" type="number" :required="true" :disabled="true" placeHolder="Saisissez l'année" label="Saisissez l'année de décaissement" />
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.annee">
              {{ erreurSuiviFinancier[index].annee }}
            </p>
          </div>

          <button type="button" @click="removePlan(index)" class="mt-2 text-red-600 text-sm underline">Supprimer ce suivi</button>
        </div>

        <button type="button" @click="addPlan" class="col-span-12 btn btn-outline-primary">Ajouter un autre suivi</button>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="resetModalSuiviFinancierActivite" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Enregistrer" :loading="loadingSuiviFinancier" :type="submit" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalFiltre" @hidden="showModalFiltre = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Filtrer le pta</h2>
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
  <!-- End Modal -->
</template>
