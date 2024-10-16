<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import IndicateurGouvernance from "@/services/modules/indicateurGouvernance.service";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import CritereGouvernance from "../../../services/modules/critereGouvernance.service";
import PrincipeGouvernance from "../../../services/modules/principeGouvernance.service";
import OptionReponse from "../../../services/modules/optionReponse.service";
import { useRoute, useRouter } from "vue-router";

const payload = reactive({
  nom: "",
  type: "factuel",
  description: "",
  can_have_multiple_reponse: false,
  options_de_reponse: [],
  principeable_id: "",
});
const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const principes = ref([]);
const criteres = ref([]);
const optionsReponses = ref([]);
const datas = ref([]);

const createData = async () => {
  isLoading.value = true;
  await IndicateurGouvernance.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Indicateur de gouvernace créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await IndicateurGouvernance.get()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des indicateurs de gouvernance.");
    });
  initTabulator();
};
const updateData = async () => {
  isLoading.value = true;
  await IndicateurGouvernance.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Indicateur de gouvernace modifiée.");
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
  await IndicateurGouvernance.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Indicateur de gouvernance supprimé");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};
const getPrincipes = () => {
  PrincipeGouvernance.get()
    .then((result) => {
      principes.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des Principes.");
    });
};
const getCriteres = () => {
  CritereGouvernance.get()
    .then((result) => {
      criteres.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des Criteres.");
    });
};
const getOptions = () => {
  OptionReponse.get()
    .then((result) => {
      optionsReponses.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des Reponses.");
    });
};
const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Nom",
        field: "nom",
      },
      {
        title: "Description",
        field: "description",
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
const handleEdit = (params) => {
  // console.log("Edit:", params);
  isCreate.value = false;
  idSelect.value = params.id;
  payload.nom = params.nom;
  payload.description = params.description;
  payload.type = params.type;
  payload.can_have_multiple_reponse = params.can_have_multiple_reponse;
  payload.options_de_reponse = params.options_de_reponse.map((item) => item.id);
  // console.log(payload.options_de_reponse);
  payload.principeable_id = params.principeable.id;
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
  payload.nom = "";
  payload.description = "";
  payload.type = "";
  payload.can_have_multiple_reponse = false;
  payload.principeable_id = "";
  payload.options_de_reponse = [];
  showModalCreate.value = false;
};
const openCreateModal = () => {
  payload.principeable_id = "";
  showModalCreate.value = isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));
const principeable = computed(() => (payload.type === "factuel" ? criteres.value : principes.value));

// watch(
//   () => payload.can_have_multiple_reponse,
//   (newValue) => {
//     console.log(newValue);

//     payload.can_have_multiple_reponse = Boolean(newValue);
//   }
// );
watch(
  () => payload.type,
  () => {
    payload.principeable_id = "";
  }
);

// watch(
//   () => payload.options_de_reponse,
//   (newValue) => {
//     if (!payload.can_have_multiple_reponse) {
//       payload.options_de_reponse = newValue.split(",").map((option) => option.trim());
//     }
//   }
// );

onMounted(() => {
  getDatas();
  getCriteres();
  getPrincipes();
  getOptions();
});
</script>

<template>
  <div class="py-4">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">
          {{ message.type }}
        </div>
        <div class="mt-1 text-slate-500">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->

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
      <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
        <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
      </div>
      <LoaderSnipper v-if="isLoadingData" />
    </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un indicateur de gouvernance</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="payload.nom" />
          <InputForm label="Description" v-model="payload.description" />
          <div class="form-check">
            <input v-model="payload.can_have_multiple_reponse" id="is-multiple" class="form-check-input" type="checkbox" checked />
            <label class="form-check-label" for="is-multiple">Réponses Multiple</label>
          </div>

            <div>
              <label class="form-label">Options de réponse </label>
              <TomSelect
                v-model="payload.options_de_reponse"
                :options="{
                  placeholder: 'Selectionner option de reponse',
                }"
                class="w-full"
                multiple
              >
                <option v-for="(option, index) in optionsReponses" :key="index" :value="option.id">{{ option.libelle }}</option>
              </TomSelect>
            </div>
            <!-- <div>
            <label class="form-label">Options de réponse </label>
            <TomSelect
              v-model="payload.options_de_reponse"
              :options="{
                placeholder: 'Selectionner option de reponse',
              }"
              class="w-full"
            >
              <option v-for="(option, index) in optionsReponses" :key="index" :value="option.id">{{ option.libelle }}</option>
            </TomSelect>
          </div> -->
            <div>
              <label>Type</label>
              <div class="flex flex-col mt-2 sm:flex-row">
                <div class="mr-2 form-check">
                  <input v-model="payload.type" id="factuel" class="form-check-input" type="radio" name="type" value="factuel" />
                  <label class="form-check-label" for="factuel">Factuel</label>
                </div>
                <div class="mt-2 mr-2 form-check sm:mt-0">
                  <input v-model="payload.type" id="perception" class="form-check-input" type="radio" name="type" value="perception" />
                  <label class="form-check-label" for="perception">Perception</label>
                </div>
              </div>
            </div>
            <div class="">
              <label class="form-label">Critères ou Principes </label>
              <TomSelect v-model="payload.principeable_id" :options="{ placeholder: 'Selectionez une option' }" class="w-full">
                <option v-for="(item, index) in principeable" :key="index" :value="item.id">{{ item.nom }}</option>
              </TomSelect>
            </div>
          </div>
        </ModalBody>
      </form>
    </Modal>
    <!-- END: Modal Content -->

    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeIndicateur">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control" placeholder="libellé de l'indicateur" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label"> Description </label>
            <input id="regular-form-1" type="text" required v-model="formData.description" class="form-control" placeholder="Description" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Outils </label>
            <TomSelect v-model="formData.outil" :options="{ placeholder: 'Selectionez un groupe' }" class="w-full">
              <option value="">Veuillez choisir un outil</option>
              <option :value="true">Perception</option>
              <option :value="false">Factuel</option>
            </TomSelect>
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nombres de choix sumultané</label>
            <TomSelect v-model="formData.multipleAns" :options="{ placeholder: 'Selectionez un groupe' }" class="w-full">
              <option value="">Veuillez choisir un type de réponse</option>
              <option :value="true">Plusieurs</option>
              <option :value="false">Unique</option>
            </TomSelect>
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Type dréponse</label>
            <TomSelect v-model="formData.typeAns" :options="{ placeholder: 'Selectionez un groupe' }" class="w-full">
              <option value="">Veuillez choisir un type de réponse</option>
              <option value="boolean">Vrai/Faux</option>
              <option value="checkbox">Réponse multiple</option>
              <option value="feedBack">Commentaire</option>
              <option value="list">List</option>
              <option value="rate">Vote</option>
              <option value="image">Image</option>
              <option value="text">Text</option>
            </TomSelect>
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Choix</label>
            <TomSelect v-model="formData.choises" multiple :options="{ placeholder: 'Selectionez un groupe' }" class="w-full">
              <option v-for="(element, index) in choix" :key="index" :value="element.id">{{ element.nom }}</option>
            </TomSelect>
          </div>
          <button class="w-full px-4 py-3 my-3 align-top btn btn-primary xl:mr-3">
            <span class="text-sm font-semibold uppercase" v-if="!chargement"> Ajouter </span>
            <span v-else class="flex items-center justify-center space-x-2">
              <span class="px-4 font-semibold"> chargement ... </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>

        <form v-else key="modifier" @submit.prevent="updateIndicateur">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control" placeholder="libellé" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Description</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.description" class="form-control" placeholder="description" />
          </div>

          <button class="w-full px-4 py-3 my-3 align-top btn btn-primary xl:mr-3">
            <span class="text-sm font-semibold uppercase" v-if="!chargement"> modifier </span>
            <span v-else class="flex items-center justify-center space-x-2">
              <span class="px-4 font-semibold"> chargement ... </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->
    <!-- BEGIN: Modal Toggle -->
    <div class="flex justify-between">
      <button @click="addIndicateur" class="flex items-center space-x-2 btn btn-primary">
        <PlusSquareIcon />
        <span class="font-semibold uppercase"> ajouter</span>
      </button>
      <div class="hidden search sm:block">
        <input type="text" class="border-transparent search__input form-control" v-model="search" placeholder="Recherche..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
    </div>
    <div class="flex items-center justify-between my-4">
      <span class="text-xl font-bold uppercase">indicateurs {{ groupe }} </span>
      <button @click="toBack" class="flex items-center px-3 py-2 space-x-2 font-semibold text-white bg-indigo-500 rounded-lg outline-none">
        <CornerUpLeftIcon />
        <span class="font-semibold uppercase">Critères</span>
      </button>
    </div>
    <!-- END: Modal Toggle -->
    <div class="mt-5 overflow-x-auto">
      <table class="table mt-5">
        <thead class="table-light">
          <tr>
            <th class="whitespace-nowrap">#</th>
            <th class="whitespace-nowrap">Nom</th>
            <th class="whitespace-nowrap">Description</th>
            <th class="whitespace-nowrap">Outils</th>
            <th class="whitespace-nowrap">Choix multiple</th>
            <th class="whitespace-nowrap">Source de véfification</th>
            <th class="whitespace-nowrap">Type de réponse</th>
            <th class="whitespace-nowrap">Liste des Choix</th>
            <th class="whitespace-nowrap">Date creation</th>
            <th class="whitespace-nowrap">Date mise à jours</th>
            <th class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in resultQuery" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data.nom }}</td>
            <td>{{ data.description }}</td>
            <td>
              <span v-if="data.justifyAns == 0">Perception </span>
              <span v-else> Factuel </span>
            </td>
            <td>
              <span v-if="data.multipleAns == 0">Non </span>
              <span v-else> Oui </span>
            </td>
            <td>
              <span v-if="data.justifyAns == 0">Non </span>
              <span v-else> Oui </span>
            </td>
            <td>{{ data.typeAns }}</td>
            <td>
              <div v-for="e in data.choises" class="inline-block p-1">
                {{ e.nom }}
              </div>
            </td>
            <td>{{ data.updated_at }}</td>
            <td>{{ data.created_at }}</td>

            <td class="flex items-center space-x-2">
              <Tippy tag="a" href="javascript:;" class="w-24 mb-2 mr-1 tooltip btn btn-secondary" content="cliquez pour modifier">
                <span @click="modifier(index, data)" class="text-blue-500 cursor-pointer"> Modifier </span>
              </Tippy>
              <Tippy tag="a" href="javascript:;" class="w-24 mb-2 mr-1 tooltip btn btn-secondary" content="cliquez pour supprimer">
                <span @click="supprimer(index, data)" class="text-red-500 cursor-pointer"> Supprimer </span>
              </Tippy>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4" v-if="totalPages() > 1">
        <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-l-md focus:outline-none" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <template v-if="totalPages() <= 7">
          <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in totalPages()" :key="pageNumber" @click="goToPage(pageNumber)">
            {{ pageNumber }}
          </button>
        </template>
        <template v-else>
          <template v-if="currentPage <= 4">
            <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber" @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
          <template v-else-if="currentPage >= totalPages() - 3">
            <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">1</button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber" @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in [totalPages() - 3, totalPages() - 2, totalPages() - 1, totalPages()]" :key="pageNumber" @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
          </template>
          <template v-else>
            <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">1</button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in [currentPage - 1, currentPage, currentPage + 1]" :key="pageNumber" @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
        </template>
        <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-r-md focus:outline-none" :disabled="currentPage === totalPages()" @click="currentPage++">Next</button>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped></style>
