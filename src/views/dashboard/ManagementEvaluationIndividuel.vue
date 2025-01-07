<template>
  <div class="mt-8">
    <!-- <h2 class="mt-10 text-lg font-medium intro-y">Liste des évaluations</h2> -->
    <div class="flex justify-end">
      <button class="btn btn-primary" @click="openCreateModal"><PlusIcon class="mr-3 size-5" /> Créer une évaluation</button>
    </div>

    <div v-show="!isLoadingData" class="!z-0 py-2 mt-2">
      <p class="text-lg font-medium intro-y">Liste des évaluations</p>
      <div class="grid grid-cols-12 gap-2 mt-5">
        <div v-for="(item, index) in datas" :key="index" class="col-span-12 p-4 md:col-span-12 lg:col-span-4">
          <div class="p-3 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
            <div @click="gotoSoumissions(item)" class="flex flex-col items-start w-full gap-2 mt-2 cursor-pointer">
              <!-- Item details -->
              <div class="text-center lg:text-left lg:mt-0">
                <span class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary">
                  {{ item.intitule }}
                </span>
              </div>
            </div>
            <!-- Description section with distinct styling -->
            <div @click="gotoSoumissions(item)" class="w-full mt-5 text-center cursor-pointer lg:text-left">
              <!-- Other details with iconized section headers -->
              <div class="mt-5 space-y-3 text-gray-600">
                <!-- <div class="flex items-center text-sm font-medium text-gray-700">
                <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Statut: <span :class="getStatusText(item.statut).class" class="px-3 py-2 ml-3 text-xs text-white rounded-full">{{ getStatusText(item.statut).label }}</span>
              </div> -->
                <div class="flex items-center text-sm font-medium text-gray-700">
                  <CalendarIcon class="w-4 h-4 mr-2 text-primary" /> Période:
                  <span class="ml-2 font-semibold text-gray-900">{{ item.debut }} <span class="font-normal">au</span> {{ item.fin }}</span>
                </div>
                <div class="flex items-center text-sm font-medium text-gray-700">
                  <UserIcon class="w-4 h-4 mr-2 text-primary" /> Participants:
                  <span class="ml-2 font-semibold text-gray-900">{{ item.nbreParticipants }}</span>
                </div>

                <!-- <div class="flex items-center text-sm font-medium text-gray-700">
                      <ProgressBar :percent="item.pourcentage_evolution" />
                    </div> -->
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-1 pt-2 mt-2 border-t lg:justify-end border-slate-200/60">
              <button class="flex items-center mr-auto text-xs btn btn-outline-primary" @click="handleCopy(item)"><CopyIcon class="mr-1 size-4" /> Copier URL</button>
              <button class="flex items-center mr-3 text-xs btn btn-outline-pending" @click="handleEdit(item)"><CheckSquareIcon class="mr-1 size-4" /> Modifier</button>
              <button class="flex items-center text-xs btn btn-outline-danger" @click="handleDelete(item)"><Trash2Icon class="mr-1 size-4" /> Supprimer</button>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="overflow-x-auto scrollbar-hidden">
        <div id="eval" ref="eval" class="mt-5 table-report table-report--tabulator"></div>
      </div> -->
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal for creating/updating -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ modeText }} une évaluation</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Intitule" v-model="payload.intitule" :control="getFieldErrors(errors.intitule)" />
          <div class="flex-1">
            <label class="form-label" for="description">Description</label>
            <div class="">
              <textarea name="description" class="form-control" id="description" v-model="payload.description" cols="30" rows="3"></textarea>
              <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
            </div>
          </div>
          <div class="flex-1 form-check">
            <input id="agreer" class="form-check-input" type="checkbox" v-model="payload.prive" />
            <label class="form-check-label" for="agreer">Privé?</label>
          </div>
          <div class="flex w-full gap-4">
            <div class="flex-1">
              <label class="form-label">Formulaires</label>
              <TomSelect v-model="payload.surveyFormId" name="trimestre_suivi" :options="{ placeholder: 'Selectionez un formulaire' }" class="w-full">
                <option value=""></option>
                <option v-for="form in formulaires" :key="form.id" :value="form.id">{{ form.libelle }}</option>
              </TomSelect>
              <div v-if="errors.surveyFormId" class="mt-2 text-danger">{{ getFieldErrors(errors.surveyFormId) }}</div>
            </div>
            <InputForm label="Nombre participant" class="flex-1" v-model="payload.nbreParticipants" type="number" :control="getFieldErrors(errors.nbreParticipants)" />
          </div>
          <div class="flex w-full gap-4">
            <InputForm label="Début de l'évaluation " v-model="payload.debut" type="date" :control="getFieldErrors(errors.debut)" />
            <InputForm label="Fin de l'évaluation " v-model="payload.fin" type="date" :control="getFieldErrors(errors.fin)" />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetForm()" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
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
        <div class="mt-2 text-slate-500">Supprimer l'évaluation?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
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
import { reactive } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  formulaires: {
    type: Array,
    required: true,
    default: [],
  },
});

const router = useRouter();
const payload = reactive({ intitule: "", description: "", debut: "", fin: "", surveyFormId: "", nbreParticipants: 0, prive: false });
const isLoading = ref(false);
const showModalCreate = ref(false);
const isLoadingData = ref(false);
const isCreate = ref(true);
const datas = ref([]);
const errors = ref({});
const idSelect = ref("");
const nameSelect = ref("");
const deleteModalPreview = ref(false);
const tabulator = ref();

const initTabulator = () => {
  tabulator.value = new Tabulator("#eval", {
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
    const { data } = await EnqueteIndividuelService.getEvaluation();
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
  // initTabulator();
};

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = isCreate.value ? EnqueteIndividuelService.createEvaluation(payload) : EnqueteIndividuelService.updateEvaluation(idSelect.value, payload);
  try {
    await action;
    toast.success(`Évaluation  ${isCreate.value ? "crée" : "modifié"} avec succès.`);
    getDatas();
    resetForm();
  } catch (e) {
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
    await EnqueteIndividuelService.destroyEvaluation(idSelect.value);
    toast.success("Évaluation supprimée avec succès.");
    getDatas();
  } catch (e) {
    console.error(e);
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
    deleteModalPreview.value = false;
  }
};

const getStatusText = (param) => {
  switch (param) {
    case 1:
      return { label: "Terminé", class: "bg-success" };
    case 0:
      return { label: "En cours", class: "bg-pending" };
    case -1:
      return { label: "Non demarré", class: "bg-primary" };
    default:
      return { label: "A déterminer", class: "bg-primary" };
  }
};

function gotoSoumissions(evaluation) {
  router.push({ name: "detail_evaluation_individuel", params: { id: evaluation.id } });
}

function formatDateOnly(dateTimeString) {
  // Vérifie si la chaîne est valide
  if (!dateTimeString) return null;

  // Utilise split pour extraire uniquement la date
  const [date] = dateTimeString.split(" ");
  return date;
}
// Handle edit action
const handleEdit = (data) => {
  isCreate.value = false;
  idSelect.value = data.id;
  payload.intitule = data.intitule ?? "";
  payload.prive = data.prive ?? false;
  payload.nbreParticipants = data.nbreParticipants;
  payload.surveyFormId = data.surveyFormId;
  payload.debut = data.debut;
  payload.fin = data.fin;
  payload.description = data.description ?? "";
  showModalCreate.value = true;
};

const handlePreview = (data) => {};

const handleCopy = (data) => {
  navigator.clipboard.writeText(data.survey_form_link);
  toast.success("URL copié");
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.intitule;
  deleteModalPreview.value = true;
};

// UI related functions
const resetForm = () => {
  payload.debut = "";
  payload.fin = "";
  payload.description = "";
  payload.intitule = "";
  payload.prive = false;
  payload.surveyFormId = "";
  payload.nbreParticipants = 0;
  errors.value = {};
  showModalCreate.value = false;
};
const openCreateModal = () => {
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
