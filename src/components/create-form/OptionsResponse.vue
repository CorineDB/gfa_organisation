<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import OptionReponse from "@/services/modules/optionReponse.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderData from "./LoaderData.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";

// Reactive data structure
const payload = reactive({ libelle: "", description: "" });
const idSelect = ref("");
const idChecked = ref([]);
const nameSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const isEditOrDelete = ref(false);
const globalOptionResponses = defineModel("globalOptionResponses");
const previewOptionResponses = ref({ options_de_reponse: [] });
const datas = ref([]);

// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await OptionReponse.get();
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
  const action = isCreate.value ? OptionReponse.create(payload) : OptionReponse.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Option de réponse ${isCreate.value ? "créée" : "modifiée"} avec succès.`);
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
    await OptionReponse.destroy(idSelect.value);
    toast.success("Option de réponse supprimée avec succès.");
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
  payload.description = data.description;
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
  payload.libelle = "";
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

function updateTemporyOption(id, point) {
  const index = globalOptionResponses.value.options_de_reponse.findIndex((option) => option.id === id);
  if (index !== -1) {
    globalOptionResponses.value.options_de_reponse[index].point = point;
  } else {
    globalOptionResponses.value.options_de_reponse.push({ id, point });
  }
}

function removeTemporyOption(id) {
  globalOptionResponses.value.options_de_reponse = globalOptionResponses.value.options_de_reponse.filter((option) => option.id !== id);
}

watch(idChecked, (newChecked, oldChecked) => {
  oldChecked.forEach((id) => {
    if (!newChecked.includes(id)) {
      removeTemporyOption(id);
    }
  });
});
// Fetch data on component mount
onMounted(getDatas);
</script>

<template>
  <div>
    <!-- Button to open modal -->
    <div class="flex items-center justify-between mb-4">
      <div class="form-check form-switch">
        <input id="response" class="form-check-input" type="checkbox" v-model="isEditOrDelete" />
        <label class="form-check-label" for="response">Modifier/Supprimer</label>
      </div>
      <button class="text-sm btn btn-primary" @click="openCreateModal"><PlusIcon class="mr-1 size-4" />Ajouter</button>
    </div>

    <!-- Data List -->
    <ul v-if="!isLoadingData" class="overflow-y-auto listes max-h-[40vh]">
      <li v-for="(data, index) in datas" :key="data.id" class="flex items-center justify-between gap-2 px-1 py-1.5 text-base hover:bg-blue-100 list-data">
        <div class="flex items-center gap-1">
          <div class="p-2 form-check">
            <input :id="data.id" class="form-check-input" type="checkbox" :value="data.id" v-model="idChecked" />
            <label class="form-check-label" :for="data.id">{{ data.libelle }}</label>
          </div>
          <div v-if="idChecked.includes(data.id)" class="flex items-center gap-1 transition-all">
            <input type="number" name="point" :id="`${data.id}${index}`" :value="globalOptionResponses.options_de_reponse.find((option) => option.id === data.id)?.point || ''" @input="updateTemporyOption(data.id, $event.target.value)" class="w-[75px] form-control" />
          </div>
        </div>
        <div v-if="!idChecked.includes(data.id) && isEditOrDelete" class="flex items-center gap-1 space-x-1 transition-all opacity-0 container-buttons">
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
        <h2 class="mr-auto text-base font-medium">{{ modeText }} une option de réponse</h2>
      </ModalHeader>
      <form @submit.prevent="submitData">
        <ModalBody>
          <div class="grid grid-cols-1 gap-4">
            <InputForm label="Libellé" v-model="payload.libelle" />
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
          <div class="mt-2 text-slate-500">Supprimer l'option de réponse?</div>
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

.listes {
  scrollbar-color: #a8a8a8 transparent;
  scrollbar-arrow-color: transparent;
}
</style>
