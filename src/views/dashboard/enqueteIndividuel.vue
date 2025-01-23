<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Enquête Individuelle</h2>
    <LoaderSnipper v-if="loading" />
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div v-show="!loading" class="iframe-container">
        <iframe src="https://surveyjs.io/create-free-survey" @load="onIframeLoad"></iframe>
        <div class="overlay"></div>
      </div>
    </div>
    <ManagementEvaluationIndividuel :formulaires="datas" />
    <div v-show="!isLoadingData" class="!z-0 p-5 mt-4 box">
      <p class="mt-2 text-lg font-medium intro-y">Liste des formulaires</p>
      <!-- <div class="grid grid-cols-12 gap-2 mt-5">
        <div v-for="(item, index) in datas" :key="index" class="col-span-12 p-4 md:col-span-12 lg:col-span-4">
          <div class="p-3 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
            <div @click="gotoSoumissions(item)" class="flex flex-col items-start w-full gap-2 mt-2 cursor-pointer">
              <div class="text-center lg:text-left lg:mt-0">
                <span class="text-base font-semibold text-gray-800 transition-colors hover:text-primary">
                  {{ item.libelle ?? "Libelle" }}
                </span>
              </div>
            </div>
            <div @click="gotoSoumissions(item)" class="w-full mt-5 text-center cursor-pointer lg:text-left">
              <div class="mt-5 space-y-3 text-gray-600">
                <div class="flex items-center text-sm font-medium text-gray-700">
                  <UserIcon class="w-4 h-4 mr-2 text-primary" /> Participant:
                  <span class="ml-2 font-semibold text-gray-900">{{ item.nbreParticipants ?? "vide" }}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-1 pt-2 mt-2 border-t lg:justify-end border-slate-200/60">
              <button class="flex items-center mr-auto text-xs btn btn-outline-primary" @click="handlePreview(item)"><EyeIcon class="mr-1 size-4" /> Voir</button>
              <button class="flex items-center mr-3 text-xs btn btn-outline-pending" @click="handleEdit(item)"><CheckSquareIcon class="mr-1 size-4" /> Modifier</button>
              <button class="flex items-center text-xs btn btn-outline-danger" @click="handleDelete(item)"><Trash2Icon class="mr-1 size-4" /> Supprimer</button>
            </div>
          </div>
        </div>
      </div> -->

      <div class="overflow-x-auto scrollbar-hidden">
        <div id="tabulator" ref="tabulator" class="mt-5 table-report table-report--tabulator"></div>
      </div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <button class="fixed !z-30 bottom-2 btn btn-primary right-5" @click="openCreateModal"><PlusIcon class="mr-3 size-5" /> Créer un formulaire</button>

  <!-- Modal for creating/updating -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ modeText }} un formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Libelle" v-model="payload.libelle" :control="getFieldErrors(errors.libelle)" />
          <div class="flex-1">
            <label class="form-label" for="description">Description</label>
            <div class="">
              <textarea name="description" class="form-control" id="description" v-model="payload.description" cols="30" rows="3"></textarea>
              <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
            </div>
          </div>
          <div class="flex-1">
            <label class="form-label" for="description">Strucutre Formulaire <span class="text-danger">*</span> </label>
            <div class="">
              <textarea name="form_data" class="form-control" id="form_data" v-model="payload.form_data" cols="30" rows="3"></textarea>
              <div v-if="errors.form_data" class="mt-2 text-danger">{{ getFieldErrors(errors.form_data) }}</div>
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

  <!-- Modal for deleting -->
  <Modal :show="deleteModalPreview" @hidden="closeDeleteModal">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-lg">{{ nameSelect }}</div>
        <div class="mt-2 text-slate-500">Supprimer le formulaire?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>

  <Modal backdrop="static" size="modal-xl " :show="showModalPreview" @hidden="showModalPreview = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ currentForm.libelle }}</h2>
    </ModalHeader>
    <ModalBody>
      <div class="max-h-[65vh] h-[65vh] overflow-y-auto">
        <SurveyComponent :model="survey" />
      </div>
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModalPreview = false" class="flex-1 w-full px-2 py-2 my-3 btn btn-outline-secondary">Retour</button>
      </div>
    </ModalFooter>
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { computed } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { getFieldErrors } from "../../utils/helpers";
import { toast } from "vue3-toastify";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import EnqueteIndividuelService from "../../services/modules/enquete.individuel.service";
import ManagementEvaluationIndividuel from "./ManagementEvaluationIndividuel.vue";
import "survey-core/defaultV2.min.css";
import { SurveyComponent } from "survey-vue3-ui";
import { Model } from "survey-core";
import { reactive } from "vue";

const iframeSrc = "https://surveyjs.io/create-free-survey";

const payload = reactive({ libelle: "", description: "", form_data: "" });
const loading = ref(true);
const isLoading = ref(false);
const showModalCreate = ref(false);
const showModalPreview = ref(false);
const isLoadingData = ref(false);
const isCreate = ref(true);
const datas = ref([]);
const errors = ref({});
const currentForm = ref({});
const currentSurvey = ref({});
const idSelect = ref("");
const nameSelect = ref("");
const deleteModalPreview = ref(false);
const tabulator = ref();
const survey = ref(new Model({}));

function onIframeLoad() {
  loading.value = false;
}

const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Libellé",
        field: "libelle",
        vertAlign: "middle",
      },

      // {
      //   title: "Auteur",
      //   field: "auteur",
      //   hozAlign: "center",
      // },
      {
        title: "Actions",
        field: "actions",
        vertAlign: "middle",
        hozAlign: "center",
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

          const previewButton = createButton("voir", "btn btn-primary", () => {
            handlePreview(cell.getData());
          });

          const editButton = createButton("modifier", "btn btn-pending", () => {
            handleEdit(cell.getData());
          });

          const deleteButton = createButton("supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });
          container.append(previewButton, editButton, deleteButton);
          return container;
        },
      },
    ],
  });
};
// Fetch data
const getDatas = async () => {
  isLoadingData.value = true;
  try {
    const { data } = await EnqueteIndividuelService.get();
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
  initTabulator();
};

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  payload.form_data = JSON.parse(payload.form_data);
  const action = isCreate.value ? EnqueteIndividuelService.create(payload) : EnqueteIndividuelService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Formulaire ${isCreate.value ? "crée" : "modifié"} avec succès.`);
    getDatas();
    payload.form_data = JSON.stringify(payload.form_data);
    resetForm();
  } catch (e) {
    payload.form_data = JSON.stringify(payload.form_data);
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
    await EnqueteIndividuelService.destroy(idSelect.value);
    toast.success("Formulaire supprimé avec succès.");
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
  payload.libelle = data.libelle;
  payload.form_data = JSON.stringify(data.form_data);
  payload.description = data.description ?? "";
  showModalCreate.value = true;
};

const handlePreview = (data) => {
  currentForm.value = data;
  currentSurvey.value = data.form_data;
  survey.value = new Model(currentSurvey.value);
  showModalPreview.value = true;
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.nom;
  deleteModalPreview.value = true;
};

// UI related functions
const resetForm = () => {
  Object.keys(payload).forEach((key) => {
    payload[key] = "";
  });
  errors.value = {};
  showModalCreate.value = false;
};
const openCreateModal = () => {
  // resetForm();
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

onMounted(() => {
  getDatas();
});
</script>

<style scoped>
.iframe-container {
  position: relative !important;
  width: 82vw !important;
  display: flex;
  justify-content: center;
  max-width: 82vw !important;
  height: 85vh !important;
  padding-top: 56.25% !important; /* Rapport d'aspect 16:9 */
}
iframe {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  border: none !important;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 82vw !important;
  height: 95px; /* Hauteur du header à masquer */
  background-color: white; /* Ou utilisez une autre couleur selon le contexte */
  z-index: 10;
}
</style>
