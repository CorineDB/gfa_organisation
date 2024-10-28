<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import IndicateurGouvernance from "@/services/modules/indicateurGouvernance.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderData from "./LoaderData.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";

const props = defineProps({
  isAvailable: Boolean,
  toReset: Boolean,
});

const emit = defineEmits(["selected"]);

// Reactive data structure
const payload = reactive({ nom: "", description: "", type: "factuel" });
const idSelect = ref("");
const idChecked = ref("");
const nameSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const isEditOrDelete = ref(false);
const datas = ref([]);

function choiceOption(data) {
  emit("selected", data);
}

// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await IndicateurGouvernance.get();
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = isCreate.value ? IndicateurGouvernance.create(payload) : IndicateurGouvernance.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Indicateur ${isCreate.value ? "crée" : "modifié"} avec succès.`);
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
    await IndicateurGouvernance.destroy(idSelect.value);
    toast.success("Indicateur supprimé avec succès.");
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
  payload.description = data.description;
  showModalCreate.value = true;
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.nom;
  deleteModalPreview.value = true;
};

// UI related functions
const resetForm = () => {
  payload.nom = "";
  payload.description = "";
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

watch(
  () => props.toReset,
  () => {
    idChecked.value = "";
  }
);

// Fetch data on component mount
onMounted(getDatas);
</script>

<template>
  <div :class="[isAvailable ? '' : 'opacity-50 pointer-events-none']">
    <!-- Button to open modal -->
    <div class="flex items-center justify-between mb-4">
      <div class="form-check form-switch">
        <input id="indicateur" class="form-check-input" type="checkbox" v-model="isEditOrDelete" />
        <label class="form-check-label" for="indicateur">Modifier/Supprimer</label>
      </div>
      <button class="text-sm btn btn-primary" @click="openCreateModal"><PlusIcon class="mr-1 size-4" />Ajouter</button>
    </div>

    <!-- Data List -->
    <ul v-if="!isLoadingData" class="overflow-y-auto max-h-[40vh]">
      <li v-for="data in datas" :key="data.id" class="flex items-center justify-between gap-2 px-1 py-1.5 text-base hover:bg-blue-100 list-data">
        <div class="p-2 form-check">
          <input :id="data.id" @change="choiceOption(data)" class="form-check-input" type="radio" name="indicateur" :value="data.id" v-model="idChecked" />
          <label class="form-check-label" :for="data.id">{{ data.nom }}</label>
        </div>
        <div v-if="data.id !== idChecked && isEditOrDelete" class="flex items-center gap-1 space-x-1 transition-all opacity-0 container-buttons">
          <button class="p-1.5 text-white btn btn-primary" @click="handleEdit(data)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-white btn btn-danger" @click="handleDelete(data)">
            <TrashIcon class="size-5" />
          </button>
        </div>
      </li>
    </ul>
    <LoaderData v-else />

    <!-- Modal for creating/updating -->
    <Modal backdrop="static" :show="showModalCreate" @hidden="closeModal">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ modeText }} un indicateur de gouvernance</h2>
      </ModalHeader>
      <form @submit.prevent="submitData">
        <ModalBody>
          <div class="grid grid-cols-1 gap-4">
            <InputForm label="Nom" v-model="payload.nom" />
            <InputForm label="Description" v-model="payload.description" :required="false" />
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
          <div class="mt-2 text-slate-500">Supprimer l'indicateur de gouvernance?</div>
        </div>
        <div class="flex justify-center gap-3 py-4">
          <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
          <DeleteButton :loading="isLoading" @click="deleteData" />
        </div>
      </ModalBody>
    </Modal>
  </div>
</template>

<style scoped>
.list-data:hover .container-buttons {
  opacity: 1;
}
</style>
