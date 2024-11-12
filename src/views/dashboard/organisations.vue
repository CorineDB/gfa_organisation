<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import OngService from "@/services/modules/ong.service.js";
import DeleteButton from "@/components/news/DeleteButton.vue";
import Tabulator from "tabulator-tables";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import decoupage from "@/decoupage_territorial_benin.json";
import { useRouter } from "vue-router";

const router = useRouter();
// Reactive data structure
const payload = reactive({
  nom: "",
  email: "",
  contact: "",
  nom_point_focal: "",
  prenom_point_focal: "",
  contact_point_focal: "",
  sigle: "",
  code: "",
  longitude: "",
  latitude: "",
  addresse: "",
  quartier: "",
  arrondissement: "",
  commune: "",
  departement: "",
  pays: "",
  secteurActivite: "",
});

const tabulator = ref();
const idSelect = ref("");
const nameSelect = ref("");
const search = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const addPointFocal = ref(false);
const isCreate = ref(true);
const datas = ref([]);
const departements = ref([]);
const selectedDepartementData = ref("");

const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    responsiveLayout: "hide",
    columns: [
      {
        title: "Nom",
        field: "nom",
        hozAlign: "left",
      },
      {
        title: "Sigle",
        field: "sigle",
        maxWidth: 130,
      },
      {
        title: "Projet associé",
        field: "projet",
        minWidth: 150,
        hozAlign: "left",
        hozAlign: "left",
        formatter(cell) {
          if (cell.getData().projet !== null) {
            return `<div> ${cell.getData().projet.nom ?? "a"}</div>`;
          } else {
            return `<div>--</div>`;
          }
        },
      },
      {
        title: "E-mail",
        field: "user",
        minWidth: 150,
        hozAlign: "left",
        hozAlign: "left",
        formatter(cell) {
          if (cell.getData().user.email !== null) {
            return `<div> ${cell.getData().user.nom}</div>`;
          } else {
            return `<div></div>`;
          }
        },
      },
      {
        title: "Contact",
        field: "user",
        minWidth: 150,
        hozAlign: "left",
        hozAlign: "left",
        formatter(cell) {
          if (cell.getData().user.contact !== null) {
            return `<div> ${cell.getData().user.contact}</div>`;
          } else {
            return `<div></div>`;
          }
        },
      },
      {
        title: "Actions",
        minWidth: "400",
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

          const viewPta = createButton("voir pta", "btn btn-pending", () => {
            goToPta(cell.getData());
          });

          const modifyButton = createButton("modifier", "btn btn-primary", () => {
            handleEdit(cell.getData());
          });

          const deleteButton = createButton("supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          container.append(viewPta, modifyButton, deleteButton);

          return container;
        },
      },
    ],
  });
};
// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await OngService.get();
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des Organisations.");
  } finally {
    isLoadingData.value = false;
    initTabulator();
  }
};

const getOne = async (id) => {
  try {
    // isLoadingData.value = true;
    const { data } = await OngService.find(id);
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des détails.");
  } finally {
    // isLoadingData.value = false;
  }
};

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = isCreate.value ? OngService.create(payload) : OngService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Organisation ${isCreate.value ? "créee" : "modifiée"} avec succès.`);
    getDatas();
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
    await OngService.destroy(idSelect.value);
    toast.success("Organisation supprimé avec succès.");
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
  payload.departement = data.departement;
  payload.commune = data.commune;
  payload.arrondissement = data.arrondissement;
  payload.arrondissement = data.quartier;
  payload.addresse = data.addresse ?? "";
  payload.latitude = data.latitude;
  payload.longitude = data.longitude;
  payload.secteurActivite = data.secteurActivite;
  payload.pays = data.pays;
  payload.email = data.user.email;
  payload.code = data.code;
  payload.sigle = data.sigle;
  payload.contact = Number(data.user.contact);
  payload.contact_point_focal = Number(data.contact_point_focal);
  payload.nom_point_focal = data.nom_point_focal;
  payload.prenom_point_focal = data.prenom_point_focal;
  showModalCreate.value = true;
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.nom;
  deleteModalPreview.value = true;
};

const goToPta = (data) => {
  router.push({ name: "pta", params: { ongId: data.id } });
};

function resetPayload() {
  Object.keys(payload).forEach((key) => {
    payload[key] = "";
  });
}

// UI related functions
const resetForm = () => {
  resetPayload();
  showModalCreate.value = false;
};
const openCreateModal = () => {
  resetForm();
  isCreate.value = true;
  showModalCreate.value = true;
};
const cancelDelete = () => {
  idSelect.value = "";
  deleteModalPreview.value = false;
};
const closeModal = () => (showModalCreate.value = false);
const closeDeleteModal = () => (deleteModalPreview.value = false);

const modeText = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

// Propriétés calculées pour filtrer les options
const filteredCommunes = computed(() => {
  if (!payload.departement > 0) return [];
  selectedDepartementData.value = departements.value.find((dep) => dep.lib_dep == payload.departement);
  return selectedDepartementData.value ? selectedDepartementData.value.communes : [];
});

const filteredArrondissements = computed(() => {
  if (!payload.commune) return [];
  const communeData = selectedDepartementData.value.communes.find((com) => com.lib_com === payload.commune);
  return communeData ? communeData.arrondissements : [];
});

const filteredQuartiers = computed(() => {
  if (!payload.arrondissement) return [];
  const arrondissementData = filteredArrondissements.value.find((arrond) => arrond.lib_arrond === payload.arrondissement);
  return arrondissementData ? arrondissementData.quartiers : [];
});

// Méthodes pour mettre à jour et réinitialiser les sélections
function updateCommunes() {
  payload.commune = "";
  payload.arrondissement = "";
  payload.quartier = "";
}

function updateArrondissements() {
  payload.arrondissement = "";
  payload.quartier = "";
}

function updateQuartiers() {
  payload.quartier = "";
}

const showCommune = computed(() => !payload.departement);
const showArrondissement = computed(() => !payload.commune);
const showQuatier = computed(() => !payload.arrondissement);

watch(addPointFocal, (newVal) => {
  if (!newVal) {
    payload.contact_point_focal = "";
    payload.nom_point_focal = "";
    payload.prenom_point_focal = "";
  }
});

onBeforeMount(() => {
  departements.value = decoupage;
});

// Fetch data on component mount
onMounted(() => {
  getDatas();
});
</script>

<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Organisations</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
        <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
          <div class="relative w-56 text-slate-500">
            <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
            <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
        <div class="flex">
          <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une organisation</button>
        </div>
      </div>
    </div>

    <div v-show="!isLoadingData" class="p-5 mt-5 intro-y box">
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
              </DropdownContent> </DropdownMenu
            >secteurActivite
          </Dropdown>
        </div>
      </div>
      <div class="overflow-x-auto _scrollbar-hidden">
        <div id="tabulator" ref="tableRef" class="mt-5 overflow-x-auto _table-report _table-report--tabulator"></div>
      </div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />

    <!-- Modal for creating/updating -->
    <Modal size="modal-xl" backdrop="static" :show="showModalCreate" @hidden="closeModal">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ modeText }} une organisation</h2>
      </ModalHeader>
      <form @submit.prevent="submitData">
        <ModalBody class="space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <InputForm label="Nom" v-model="payload.nom" />
            <InputForm label="Email" v-model="payload.email" type="email" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <InputForm label="Sigle" v-model="payload.sigle" />
            <InputForm label="Contact" v-model.number="payload.contact" type="number" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <InputForm label="Code" v-model.number="payload.code" type="number" />
            <InputForm label="Secteur d'activité" v-model="payload.secteurActivite" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <InputForm label="Adresse" v-model="payload.addresse" />
            <InputForm label="Pays" v-model="payload.pays" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Départements</label>
              <TomSelect v-model="payload.departement" @change="updateCommunes" :options="{ placeholder: 'Selectionez un département' }" class="w-full">
                <option value=""></option>
                <option v-for="(dep, index) in departements" :key="index" :value="dep.lib_dep">{{ dep.lib_dep }}</option>
              </TomSelect>
            </div>
            <div :class="[!showCommune ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Communes</label>
              <TomSelect v-model="payload.commune" :options="{ placeholder: 'Sélectionner la commune' }" class="w-full" @change="updateArrondissements">
                <option v-for="commune in filteredCommunes" :key="commune.lib_com" :value="commune.lib_com">
                  {{ commune.lib_com }}
                </option>
              </TomSelect>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div :class="[!showArrondissement ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Arrondissemnt</label>
              <TomSelect v-model="payload.arrondissement" @change="updateQuartiers" :options="{ placeholder: 'Selectionez  arrondissement' }" class="w-full">
                <option v-for="(arrond, index) in filteredArrondissements" :key="index" :value="arrond.lib_arrond">{{ arrond.lib_arrond }}</option>
              </TomSelect>
            </div>
            <div :class="[!showQuatier ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Quatier</label>
              <TomSelect v-model="payload.quartier" :options="{ placeholder: 'Sélectionner le quatier' }" class="w-full">
                <option v-for="quart in filteredQuartiers" :key="quart.lib_quart" :value="quart.lib_quart">
                  {{ quart.lib_quart }}
                </option>
              </TomSelect>
            </div>
          </div>
          <!-- <div class="grid grid-cols-2 gap-4">
            <InputForm label="Département" v-model="payload.departement" />
            <InputForm label="Commune" v-model="payload.commune" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <InputForm label="Arrondissement" v-model="payload.arrondissement" />
            <InputForm label="Quatier" v-model="payload.quartier" />
          </div> -->
          <div class="grid grid-cols-2 gap-4">
            <InputForm label="Longitude" v-model.number="payload.longitude" type="number" />
            <InputForm label="Latitude" v-model.number="payload.latitude" type="number" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <InputForm label="Nom point focal" v-model="payload.nom_point_focal" />
            <InputForm label="Prénom point focal" v-model="payload.prenom_point_focal" />
          </div>
          <InputForm label="Contact point focal" v-model="payload.contact_point_focal" type="number" />
        </ModalBody>
        <ModalFooter>
          <div class="flex gap-2">
            <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
            <VButton :loading="isLoading" :label="modeText" />
          </div>
        </ModalFooter>
      </form>
    </Modal>

    <!-- Modal for deleting -->
    <Modal :show="deleteModalPreview" @hidden="closeDeleteModal">
      <ModalBody class="p-0">
        <div class="p-5 text-center">
          <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-lg">{{ nameSelect }}</div>
          <div class="mt-2 text-slate-500">Supprimer une organisation?</div>
        </div>
        <div class="flex justify-center gap-3 py-4">
          <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
          <DeleteButton :loading="isLoading" @click="deleteData" />
        </div>
      </ModalBody>
    </Modal>
  </div>
</template>
