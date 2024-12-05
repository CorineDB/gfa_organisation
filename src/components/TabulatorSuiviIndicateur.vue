<template>
  <div class="overflow-x-auto">
    <table class="w-full max-w-full my-10 bg-white border-collapse editor_listing_table border-slate-500" cellpadding="6" cellspacing="0">
      <thead class="text-white border-white bg-primary">
        <tr>
          <th rowspan="2" class="py-3 border border-white min-w-[500px]">Indicateurs</th>
          <!-- <th class="py-3 border border-white min-w-[80px]">Indice</th> -->
          <th rowspan="2" class="py-3 border border-white min-w-[280px]">Auteur</th>
          <th rowspan="2" class="py-3 border border-white min-w-[80px]">Trimestre</th>
          <th rowspan="2" class="py-3 border border-white min-w-[80px]">Cumul</th>
          <th :colspan="years.length + 1" class="py-3 border border-white min-w-[70px]">Cibles</th>
          <th :colspan="years.length + 1" class="py-3 border border-white min-w-[70px]">Réalisation</th>
          <th rowspan="2" class="py-3 border border-white min-w-[180px]">Taux de realisation</th>
          <!-- <th class="py-3 border border-white min-w-[280px]">Source de données</th>
          <th class="py-3 border border-white min-w-[180px]">Fréquence de la collecte de données</th>
          <th class="py-3 border border-white min-w-[280px]">Méthode de collecte</th> -->
          <th rowspan="2" class="py-3 border border-white min-w-[120px]">Date de suivie</th>
          <!-- <th class="py-3 border border-white min-w-[120px]">Responsables</th> -->
        </tr>
        <tr>
          <th v-for="(year, index) in years" :key="index" class="py-3 border border-white min-w-[70px]">{{ year }}</th>
          <th class="py-3 border border-white min-w-[100px]">Total</th>
          <th v-for="(year, index) in years" :key="index" class="py-3 border border-white min-w-[70px]">{{ year }}</th>
          <th class="py-3 border border-white min-w-[100px]">Total</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(indicateur, j) in data" :key="indicateur.id">
          <tr>
            <td class="font-semibold">
              {{ indicateur.indicateur.nom }}
            </td>
            <!-- <td class="font-semibold">Ind {{ indicateur.indicateur.code }}</td> -->
            <td class="">{{ indicateur.auteur.nom }}</td>
            <td class="text-center">{{ indicateur.trimestre }}</td>
            <td class="">{{ indicateur.cumul.join(", ") }}</td>
            <td v-for="(year, index) in years" :key="index">
              <span v-html="formatObject(indicateur.indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
            </td>
            <td v-html="formatObject(indicateur.indicateur.valeurCibleTotal)"></td>

            <td v-for="(year, index) in years" :key="index">
              <span v-html="formatObject(indicateur.indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></span>
            </td>
            <td v-html="formatObject(indicateur.indicateur.valeurRealiserTotal)"></td>
            <td v-html="formatObject(indicateur.indicateur.taux_realisation)"></td>
            <!-- <td class="">{{ indicateur.sources_de_donnee }}</td>
            <td class="">{{ indicateur.indicateur.frequence_de_la_collecte }}</td>
            <td class="">{{ indicateur.indicateur.methode_de_la_collecte }}</td> -->
            <td class="text-center">{{ formatDateOnly(indicateur.dateSuivie) }}</td>
            <!-- <td class="">{{ indicateur.indicateur.ug_responsable ? indicateur.indicateur.ug_responsable.nom : "" }}</td> -->
          </tr>
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

function formatDateOnly(dateTimeString) {
  // Vérifie si la chaîne est valide
  if (!dateTimeString) return null;

  // Utilise split pour extraire uniquement la date
  const [date] = dateTimeString.split(" ");
  return date;
}

function formatObject(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([key, value]) => (key === "moy" ? value : `${key}: ${value}`))
    .join("<br>");
}

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
</script>

<style scoped>
table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 8px;
}
</style>