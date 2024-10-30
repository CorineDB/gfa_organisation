<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import EnqueteDeColleteService from "@/services/modules/enqueteDeCollecte.service";
import FormulaireFactuel from "@/services/modules/formFactuel.service";
import { useRouter } from "vue-router";
import OngService from "@/services/modules/ong.service";
import { getAllErrorMessages } from "@/utils/gestion-error";

const router = useRouter();

const idFormFactuel = ref("");
const idFormPerception = ref("");

const payload = reactive({
  intitule: "",
  description: "",
  objectif_attendu: 0,
  annee_exercice: new Date().getFullYear(),
  debut: "",
  fin: "",
  formulaires_de_gouvernance: [],
  organisations: [],
});

const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const datas = ref([]);
const organisations = ref([]);
const formulairesFactuel = ref([]);
const formulairesPerception = ref([]);

const createData = async () => {
  isLoading.value = true;
  payload.formulaires_de_gouvernance = [idFormFactuel.value, idFormPerception.value];
  await EnqueteDeColleteService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Enquête créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error(getAllErrorMessages(e));
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await EnqueteDeColleteService.get()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des enquêtes.");
    });
  // initTabulator();
};
const getFormsFactuel = async () => {
  await FormulaireFactuel.get()
    .then((result) => {
      formulairesFactuel.value = result.data.data;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des formulaires factuel.");
    });
};
const getFormsPerception = async () => {
  await FormulaireFactuel.get("perception")
    .then((result) => {
      formulairesPerception.value = result.data.data;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des formulaires de perception.");
    });
};
const getOrganisations = async () => {
  await OngService.get()
    .then((result) => {
      organisations.value = result.data.data;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des organisations.");
    });
};

const updateData = async () => {
  isLoading.value = true;
  await EnqueteDeColleteService.update(idSelect.value, payload)
    .then(() => {
      getDatas();
      resetForm();
      toast.success("Enquête modifiée.");
    })
    .catch((e) => {
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    })
    .finally(() => {
      isLoading.value = false;
    });
};
const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await EnqueteDeColleteService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Enquête de gouvernance supprimé");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};
// const initTabulator = () => {
//   tabulator.value = new Tabulator("#tabulator", {
//     data: datas.value,
//     placeholder: "Aucune donnée disponible.",
//     layout: "fitColumns",
//     columns: [
//       {
//         title: "Nom",
//         field: "nom",
//       },
//       {
//         title: "Description",
//         field: "description",
//       },
//       {
//         title: "Objectif",
//         field: "objectif",
//       },
//       {
//         title: "Date Debut",
//         field: "debut",
//       },
//       {
//         title: "Date Fin",
//         field: "fin",
//       },
//       {
//         title: "Statut",
//         field: "Statut",
//         formatter: (cell) => {
//           return getStatusText(cell.getData().statut);
//         },
//       },
//       {
//         title: "Actions",
//         field: "actions",
//         formatter: (cell) => {
//           const container = document.createElement("div");
//           container.className = "flex items-center justify-center gap-3";

//           const createButton = (label, className, onClick) => {
//             const button = document.createElement("button");
//             button.className = className;
//             button.innerText = label;
//             button.addEventListener("click", onClick);
//             return button;
//           };

//           const voirApprecationsButton = createButton("Voir", "btn btn-primary", () => {
//             gotoSoumissions(cell.getData());
//           });

//           const modifyButton = createButton("Modifier", "btn btn-primary", () => {
//             handleEdit(cell.getData());
//           });

//           container.append(voirApprecationsButton, modifyButton);

//           return container;
//         },
//       },
//     ],
//   });
// };

const getStatusText = (param) => {
  switch (param) {
    case 2:
      return { label: "Terminé", class: "bg-success" };
    case 1:
      return { label: "En cours", class: "bg-warning" };
    case 0:
      return { label: "Non demarré", class: "bg-primary" };
    default:
      return { label: "A déterminer", class: "bg-primary" };
  }
};

function gotoSoumissions(enquete) {
  router.push({ name: "SoumissionsEnqueteDeCollecte", params: { id: enquete.id } });
}

function gotoAppreciations(enquete) {
  router.push({ name: "EnqueteAppreciations", query: { enqueteId: enquete.id } });
}

const handleEdit = (params) => {
  isCreate.value = false;
  idSelect.value = params.id;
  payload.intitule = params.intitule;
  payload.description = params.description;
  payload.annee_exercice = params.annee_exercice;
  payload.objectif_attendu = params.objectif_attendu;
  payload.debut = params.debut;
  payload.fin = params.fin;
  // idFormFactuel.value = params.formulaire;
  // idFormPerception.value = params.formulaire;
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
  payload.intitule = "";
  payload.annee_exercice = new Date().getFullYear();
  payload.objectif_attendu = 0;
  payload.debut = "";
  payload.description = "";
  payload.fin = "";
  idFormFactuel.value = "";
  idFormPerception.value = "";
  payload.organisations = [];
  showModalCreate.value = false;
};
const openCreateModal = () => {
  showModalCreate.value = isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(() => {
  getDatas();
  getFormsFactuel();
  getFormsPerception();
  getOrganisations();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Évaluation de gouvernace</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une évaluation de gouvernace</button>
      </div>
    </div>
  </div>

  <div class="p-5 mt-5 intro-y">
    <!-- <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div> -->
    <LoaderSnipper v-if="isLoadingData" />
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div v-for="(item, index) in datas" :key="index" class="col-span-12 p-4 md:col-span-6 lg:col-span-4">
        <div class="p-5 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
          <!-- En-tête avec sigle et titre -->
          <div class="relative flex items-start pt-5">
            <!-- Dropdown for actions -->
            <Dropdown class="absolute top-0 right-0 mt-2 mr-2">
              <DropdownToggle tag="a" class="block w-5 h-5 cursor-pointer">
                <MoreVerticalIcon class="w-5 h-5 text-gray-400 transition-colors hover:text-gray-600" />
              </DropdownToggle>
              <DropdownMenu class="w-40 bg-white rounded-md shadow-lg">
                <DropdownContent>
                  <DropdownItem @click="handleEdit(item)"> <Edit2Icon class="w-4 h-4 mr-2 text-gray-600" /> Modifier </DropdownItem>
                  <DropdownItem @click="handleDelete(item)"> <TrashIcon class="w-4 h-4 mr-2 text-red-500" /> Supprimer </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div @click="gotoSoumissions(item)" class="flex flex-col items-start w-full gap-2 mt-2 cursor-pointer">
            <!-- Item details -->
            <div class="text-center lg:text-left lg:mt-0">
              <span class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary">
                {{ item.intitule }}
              </span>
            </div>

            <span :class="getStatusText(item.statut).class" class="px-2 py-1 mr-1 text-xs text-white rounded-full">{{ getStatusText(item.statut).label }}</span>
          </div>

          <!-- Description section with distinct styling -->
          <div class="mt-5 text-center lg:text-left">
            <!-- <div class="" v-if="item.description">
              <p class="mb-3 text-base font-semibold text-primary">Description</p>
              <p class="p-3 text-gray-600 rounded-lg shadow-sm bg-gray-50">{{ item.description }}</p>
            </div> -->

            <!-- Other details with iconized section headers -->
            <div @click="gotoSoumissions(item)" class="mt-5 space-y-3 text-gray-600">
              <div class="flex items-center text-sm font-medium text-gray-700">
                <CalendarIcon class="w-4 h-4 mr-2 text-primary" /> Date de début:
                <span class="ml-2 font-semibold text-gray-900">{{ item.debut }}</span>
              </div>
              <div class="flex items-center text-sm font-medium text-gray-700">
                <CalendarIcon class="w-4 h-4 mr-2 text-primary" /> Date de fin:
                <span class="ml-2 font-semibold text-gray-900">{{ item.fin }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} une évaluation</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="payload.intitule" />
          <InputForm label="Description" v-model="payload.description" />
          <div class="flex w-full gap-4">
            <div class="">
              <label for="objectif" class="form-label">Objectif</label>
              <input id="objectif" type="number" min="0.05" step="0.05" max="1" required v-model.number="payload.objectif_attendu" class="form-control" placeholder="Objectif" />
            </div>
            <div class="">
              <label for="annee" class="form-label">Année</label>
              <input id="annee" type="number" required v-model.number="payload.annee_exercice" class="form-control" placeholder="Année exercice" />
            </div>
          </div>
          <div class="flex w-full gap-4">
            <InputForm label="Début de l'enquete " v-model="payload.debut" type="date" />
            <InputForm label="Fin de l'enquete " v-model="payload.fin" type="date" />
          </div>
          <div class="">
            <label class="form-label">Formulaires Factuel</label>
            <TomSelect v-model="idFormFactuel" :options="{ placeholder: 'Selectionez un formulaire' }" class="w-full">
              <option v-for="(form, index) in formulairesFactuel" :key="index" :value="form.id">{{ form.libelle }}</option>
            </TomSelect>
          </div>
          <div class="">
            <label class="form-label">Formulaires de perception</label>
            <TomSelect v-model="idFormPerception" :options="{ placeholder: 'Selectionez un formulaire' }" class="w-full">
              <option v-for="(form, index) in formulairesPerception" :key="index" :value="form.id">{{ form.libelle }}</option>
            </TomSelect>
          </div>
          <div class="">
            <label class="form-label">Organisations</label>
            <TomSelect v-model="payload.organisations" multiple :options="{ placeholder: 'Selectionez les organisations' }" class="w-full">
              <option v-for="(organisation, index) in organisations" :key="index" :value="organisation.id">{{ organisation.nom }}</option>
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
        <div class="mt-2 text-slate-500">Supprimer une évaluation?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
