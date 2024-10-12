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
  isCreate.value = false;
  idSelect.value = params.id;
  payload.nom = params.nom;
  payload.description = params.description;
  payload.type = params.type;
  payload.can_have_multiple_reponse = params.can_have_multiple_reponse;
  payload.options_de_reponse = params.options_de_reponse.map((item) => item.id);
  console.log(payload.options_de_reponse);

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

watch(
  () => payload.can_have_multiple_reponse,
  () => {
    payload.options_de_reponse = [];
  }
);
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
  <h2 class="mt-10 text-lg font-medium intro-y">Indicateur de gouvernance</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un indicateur de Gouvernace</button>
      </div>
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
            <input v-model="payload.can_have_multiple_reponse" id="is-multiple" class="form-check-input" type="checkbox" value="" />
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
        <div class="mt-2 text-slate-500">Supprimer ce indicateur de gouvernance?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
