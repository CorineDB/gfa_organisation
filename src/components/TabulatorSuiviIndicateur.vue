<template>
  <div class="overflow-x-auto">
    <table class="w-full max-w-full my-10 border-collapse editor_listing_table border-slate-500" cellpadding="6" cellspacing="0">
      <thead class="text-black">
        <tr>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[500px]">Résultats escomptés</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[80px]">Indice</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[500px]">Indicateurs</th>
          <th :colspan="years.length + 1" class="py-3 border border-slate-900 min-w-[70px]">Cibles</th>
          <th :colspan="years.length + 1" class="py-3 border border-slate-900 min-w-[70px]">Réalisation</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[150px]">Taux de réalisation</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[150px]">Sources de données</th>

          <th rowspan="2" class="py-3 border border-slate-900 min-w-[200px]">Actions</th>
        </tr>
        <tr>
          <th v-for="(year, index) in years" :key="index" class="py-3 border border-slate-900 min-w-[70px]">{{ year }}</th>
          <th class="py-3 border border-slate-900 min-w-[100px]">Total</th>
          <th v-for="(year, index) in years" :key="index" class="py-3 border border-slate-900 min-w-[70px]">{{ year }}</th>
          <th class="py-3 border border-slate-900 min-w-[100px]">Total</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(result, i) in data" :key="result.id">
          <tr class="uppercase" :class="[result.type == 'produit' ? 'text-black' : 'text-white']" :style="{ 'background-color': findColorCadreMesure(result.type) }">
            <td :colspan="8 + years.length * 2" class="font-semibold">{{ result.type }} {{ result.indice }}</td>
          </tr>
          <template v-for="(indicateur, j) in result.indicateurs" :key="indicateur.id">
            <tr>
              <td class="font-semibold" v-if="j === 0" :rowspan="result.indicateurs.length">
                {{ result.nom }}
              </td>
              <td class="font-semibold">Ind {{ indicateur.code }}</td>
              <td>{{ indicateur.nom }}</td>
              <td v-for="(year, index) in years" :key="index">
                <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
              </td>
              <td></td>
              <td v-for="(year, index) in years" :key="index">
                <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
              </td>
              <td></td>
              <td></td>
              <td>{{ indicateur.sources_de_donnee }}</td>
              <td class="space-x-3">
                <button @click="handleEdit(result)" class="btn text-pending"><Edit3Icon class="size-5" /></button>
                <button @click="handleEdit(result)" class="btn text-primary"><EyeIcon class="size-5" /></button>
                <!-- <button @click="handleDelete(result)" class="btn btn-danger"><TrashIcon class="size-5" /></button>  -->
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>

  <!-- Modal for creating/updating -->
  <Modal size="modal-lg" backdrop="static" :show="showModalSuivi" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier un site</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <!-- <InputForm label="Nom" v-model="payload.nom" />
            <InputForm label="Pays" v-model="payload.pays" />
            <InputForm label="Departement" v-model="payload.departement" />
            <InputForm label="Commune" v-model="payload.commune" />
            <InputForm label="Arrondissement" v-model="payload.arrondissement" />
            <InputForm label="Quartier" v-model="payload.quartier" />
            <div class="flex items-center justify-between gap-3">
              <InputForm label="Longitude" class="flex-1" v-model="payload.longitude" type="number" />
              <InputForm label="Latitude" class="flex-1" v-model="payload.latitude" type="number" />
            </div> -->
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="showModalSuivi = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Modifier" />
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
        <div class="mt-2 text-slate-500">Supprimer l'indicateur?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import SiteService from "@/services/modules/site.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { findColorCadreMesure } from "../utils/findColorIndicator";

const props = defineProps({
  data: Array,
  years: Array,
});

const idSelect = ref("");
const nameSelect = ref("");
const showModalSuivi = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = SiteService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Indicateur modifié avec succès.`);
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
    await SiteService.destroy(idSelect.value);
    toast.success("Indicateur supprimé avec succès.");
    // getDatas();
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
  // idSelect.value = data.id;
  // payload.nom = data.nom;
  // payload.pays = data.pays;
  // payload.departement = data.departement;
  // payload.arrondissement = data.arrondissement;
  // payload.quartier = data.quartier;
  // payload.longitude = data.longitude;
  // payload.latitude = data.latitude;
  showModalSuivi.value = true;
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.nom;
  deleteModalPreview.value = true;
};

const cancelDelete = () => {
  idSelect.value = "";
  deleteModalPreview.value = false;
};
const closeModal = () => (showModalSuivi.value = false);
const closeDeleteModal = () => (deleteModalPreview.value = false);

function formatValeurDeBase(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join("<br>");
}

function formatResponsable(responsable) {
  return responsable.map((item) => item.nom).join("<br>");
}

function valeurCibleForYear(year, valeur_cible) {
  return valeur_cible.find((valeur) => valeur.annee === year)?.valeurCible;
}

function formatObject(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join("<br>");
}
</script>

<style scoped>
table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 8px;
}
</style>
