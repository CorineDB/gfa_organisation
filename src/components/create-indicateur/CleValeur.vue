<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import IndicateurValueKeys from "@/services/modules/key.value.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import UniteeDeMesureService from "@/services/modules/unitee.mesure.service";
import { toast } from "vue3-toastify";
import LoaderData from "./LoaderData.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";

const props = defineProps({});

// Reactive data structure
const payload = reactive({
  libelle: "",
  description: "",
  key: "",
  uniteeMesureId: "",
});
const idSelect = ref("");
const nameSelect = ref("");
const search = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const datas = ref([]);
const unitesMesure = ref([]);

const getUniteMesure = async () => {
  try {
    const { data } = await UniteeDeMesureService.get();
    unitesMesure.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  }
};

// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await IndicateurValueKeys.get();
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
  const action = isCreate.value ? IndicateurValueKeys.create(payload) : IndicateurValueKeys.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Clé valeur ${isCreate.value ? "créee" : "modifiée"} avec succès.`);
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
    await IndicateurValueKeys.destroy(idSelect.value);
    toast.success("Clé valeur supprimée avec succès.");
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
  getUniteMesure();
  isCreate.value = false;
  idSelect.value = data.id;
  payload.libelle = data.libelle;
  payload.key = data.key;
  payload.description = data.description ?? "";
  payload.uniteeMesureId = data.uniteeMesureId;
  showModalCreate.value = true;
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.libelle;
  deleteModalPreview.value = true;
};

// UI related functions
const resetForm = () => {
  Object.keys(payload).forEach((key) => {
    payload[key] = "";
  });
  showModalCreate.value = false;
};
const openCreateModal = () => {
  resetForm();
  getUniteMesure();
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
const filterData = computed(() => datas.value.filter((data) => data.libelle.toLowerCase().includes(search.value.toLowerCase())));

// Fetch data on component mount
onMounted(getDatas);
</script>

<template>
  <div>
    <!-- Button to open modal -->
    <div class="flex items-center justify-between gap-2 mb-4">
      <input type="text" class="form-control form-control-sm max-w-[300px]" placeholder="Rechercher..." v-model="search" />
      <button class="text-sm btn btn-primary" @click="openCreateModal"><PlusIcon class="mr-1 size-4" />Ajouter</button>
    </div>

    <!-- Data List -->
    <ul v-if="!isLoadingData" class="overflow-y-auto max-h-[40vh]">
      <li v-for="data in filterData" :key="data.id" class="flex items-center justify-between gap-2 px-1 py-1.5 text-base hover:bg-blue-100 list-data">
        <div class="p-2 form-check">
          <span class="form-check-label">{{ data.libelle }}</span>
        </div>
        <div class="flex items-center gap-1 space-x-1 transition-all opacity-0 container-buttons">
          <button class="p-1.5 text-primary" @click="handleEdit(data)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-danger" @click="handleDelete(data)">
            <TrashIcon class="size-5" />
          </button>
        </div>
      </li>
    </ul>
    <LoaderData v-else />

    <!-- Modal for creating/updating -->
    <Modal backdrop="static" :show="showModalCreate" @hidden="closeModal">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ modeText }} une clé valeur</h2>
      </ModalHeader>
      <form @submit.prevent="submitData">
        <ModalBody>
          <div class="grid grid-cols-1 gap-4">
            <InputForm label="Nom" v-model="payload.libelle" />
            <InputForm label="Clé" v-model="payload.key" />
            <InputForm label="Description " v-model="payload.description" :required="false" />
            <div>
              <label class="form-label">Unité de mesure</label>
              <TomSelect v-model="payload.uniteeMesureId" :options="{ placeholder: 'Selectionez une unité' }" class="w-full">
                <option value=""></option>
                <option v-for="(unite, index) in unitesMesure" :key="index" :value="unite.id">{{ unite.nom }}</option>
              </TomSelect>
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
          <div class="mt-2 text-slate-500">Supprimer la clé valeur?</div>
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
