<template>
  <div class="overflow-x-auto">
    <table class="w-full max-w-full my-2 border-collapse editor_listing_table border-slate-500" cellpadding="6" cellspacing="0">
      <thead class="text-black">
        <tr>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[500px] sticky-column">Résultats escomptés</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[80px] sticky-column-second">Indice</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[500px] sticky-column-third">Indicateurs</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[300px]">Description de l'indicateur</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[100px]">Situation de référence</th>
          <th :colspan="years.length + 1" class="py-3 border border-slate-900 min-w-[70px]">Cibles</th>
          <th :colspan="years.length + 1" class="py-3 border border-slate-900 min-w-[70px]">Réalisation</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[150px]">Taux de réalisation</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[150px]">Sources de données</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[150px]">Méthode de collecte des données</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[150px]">Fréquence de la collecte de données</th>
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[150px]">Responsable</th>
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
            <td :colspan="13 + years.length * 2" class="font-semibold">{{ result.type }} {{ result.indice }}</td>
          </tr>
          <template v-for="(indicateur, j) in result.indicateurs" :key="indicateur.id">
            <tr>
              <!-- Première colonne fixe -->
              <td class="font-semibold sticky-column" v-if="j === 0" :rowspan="result.indicateurs.length" style="left: 0">
                {{ result.nom }}
              </td>

              <!-- Deuxième colonne fixe -->
              <td class="font-semibold sticky-column-second" style="left: 500px">Ind {{ indicateur.code }}</td>

              <!-- Troisième colonne fixe -->
              <td class="sticky-column-third" style="left: 580px">
                {{ indicateur.nom }}
              </td>

              <!-- Colonnes restantes -->
              <td>{{ indicateur.description ?? "" }}</td>
              <td v-html="formatObject(indicateur.valeurDeBase)"></td>
              <td v-for="(year, index) in years" :key="index">
                <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
              </td>
              <td></td>
              <td v-for="(year, index) in years" :key="index">
                <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></span>
              </td>
              <td></td>
              <td></td>
              <td>{{ indicateur.sources_de_donnee }}</td>
              <td>{{ indicateur.methode_de_la_collecte }}</td>
              <td>{{ indicateur.frequence_de_la_collecte }}</td>
              <td>
                {{ indicateur.ug_responsable?.nom ?? "" }} <br />
                {{ formatResponsable(indicateur.organisations_responsable) }}
              </td>
              <td class="space-x-3">
                <button title="Suivre" @click="handleSuivi(indicateur)" class="btn text-primary"><CornerUpLeftIcon class="size-5" /></button>
                <button title="Voir" @click="goToDetailSuivi(indicateur.id)" class="btn text-primary"><EyeIcon class="size-5" /></button>
                <button title="Supprimer" @click="handleDelete(result)" class="btn text-danger"><TrashIcon class="size-5" /></button>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>

  <!-- Modal for creating/updating -->
  <Modal size="modal-lg" backdrop="static" :show="showModalEdit" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier un site</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4"></div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="showModalEdit = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Modifier" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- SUIVIE  -->
  <Modal size="modal-lg" backdrop="static" :show="showModalSuivi" @hidden="showModalSuivi = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Enregistrer un suivi</h2>
    </ModalHeader>
    <form @submit.prevent="submitSuivi">
      <ModalBody>
        <div class="grid grid-cols-1 gap-5">
          <!-- <div class="flex-1">
            <label class="form-label">Année de suivi</label>
            <TomSelect v-model.number="payloadSuivi.annee" name="annee_suivi" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option value=""></option>
              <option v-for="annee in years" :key="annee" :value="annee">{{ annee }}</option>
            </TomSelect>
          </div> -->
          <InputForm label="Année de suivi" class="flex-1" v-model="payloadSuivi.annee" type="number" />
          <div v-if="!isAgregerCurrentIndicateur" class="flex flex-wrap items-center justify-between gap-3">
            <InputForm label="Valeur cible" class="flex-1" v-model="payloadSuivi.valeurCible" type="number" />
            <InputForm label="Valeur réalisée" class="flex-1" v-model="payloadSuivi.valeurRealise" type="number" />
          </div>

          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Cible</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input type="number" class="form-control" v-model.number="valeurCible.find((item) => item.keyId === base.id).value" @input="updateValueCible(base.id, $event.target.value)" placeholder="valeur cible" aria-label="valeur" aria-describedby="input-group-valeur" />
              </div>
            </div>
          </div>
          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Réalisée</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input type="number" class="form-control" v-model.number="valeurRealise.find((item) => item.keyId === base.id).value" @input="updateValueRealiser(base.id, $event.target.value)" placeholder="valeur réalisée" aria-label="valeur" aria-describedby="input-group-valeur" />
              </div>
            </div>
          </div>

          <div class="flex-1">
            <label>Suivi par date ou trimestre?</label>
            <div class="flex flex-col gap-3 mt-2 sm:flex-row">
              <div v-for="(item, index) in optionsSuivi" :key="index" class="mr-2 form-check">
                <input :id="item.id" class="form-check-input" type="radio" name="option_suivi" v-model="suiviOption" :value="item.id" />
                <label class="form-check-label" :for="item.id">{{ item.label }}</label>
              </div>
            </div>
          </div>
          <div v-if="suiviOption == 'trimestre'" class="flex-1">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="payloadSuivi.trimestre" name="trimestre_suivi" :options="{ placeholder: 'Selectionez un trimestre' }" class="w-full">
              <option value=""></option>
              <option v-for="trimestre in trimestres" :key="trimestre" :value="trimestre">Trimestre {{ trimestre }}</option>
            </TomSelect>
          </div>

          <InputForm v-else label="Date de suivi" class="flex-1" v-model="payloadSuivi.dateSuivie" type="date" />
          <div class="flex-1">
            <label class="form-label">Source de données</label>
            <TomSelect v-model="payloadSuivi.sources_de_donnee" name="source" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value=""></option>
              <option v-for="(source, index) in sourcesDonnees" :key="index" :value="source">{{ source }}</option>
            </TomSelect>
          </div>
          <div class="flex-1">
            <label class="form-label" for="description">Commentaire</label>
            <div class="">
              <textarea name="description" class="form-control" id="description" v-model="payloadSuivi.commmentaire" cols="30" rows="2"></textarea>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFormSuivi" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Enrégistrer" />
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
import IndicateursService from "@/services/modules/indicateur.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { findColorCadreMesure } from "../utils/findColorIndicator";
import { sourcesDonnees } from "../utils/constants";
import { useRouter } from "vue-router";

const props = defineProps({
  data: Array,
  years: Array,
});

const router = useRouter();
const trimestres = [1, 2, 3, 4];
const optionsSuivi = [
  { label: "Par date", id: "date" },
  { label: "Par trimestre", id: "trimestre" },
];

const idSelect = ref("");
const nameSelect = ref("");
const valueKeysIndicateurSuivi = ref([]);
const isAgregerCurrentIndicateur = ref(false);
const showModalSuivi = ref(false);
const showModalEdit = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const payloadSuivi = reactive({
  annee: "",
  trimestre: "",
  valeurCible: "",
  valeurRealise: "",
  commmentaire: "",
  dateSuivie: "",
  indicateurId: "",
  sources_de_donnee: "",
});
const suiviOption = ref(optionsSuivi[0].id);
// État réactif pour stocker les valeurs des inputs
const valeurCible = ref([]);
const valeurRealise = ref([]);

const goToDetailSuivi = (id) => {
  router.push({
    name: "detail_indicateur",
    params: { id },
  });
};
const updateValueCible = (keyId, newValue) => {
  const entry = valeurCible.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};
const updateValueRealiser = (keyId, newValue) => {
  const entry = valeurRealise.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};

const resetValues = () => {
  valeurCible.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: "",
  }));
  valeurRealise.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: "",
  }));
};

const resetFormSuivi = () => {
  if (isAgregerCurrentIndicateur.value) {
    resetValues();
  }
  Object.keys(payloadSuivi).forEach((key) => {
    payloadSuivi[key] = "";
  });
  showModalSuivi.value = false;
};
// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = IndicateursService.createSuivi(payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Ajouté avec succès.`);
    // getDatas();
    resetFormSuivi();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};
const submitSuivi = async () => {
  payloadSuivi.trimestre = Number(payloadSuivi.trimestre);
  if (optionsSuivi[0].id == suiviOption.value) {
    delete payloadSuivi.trimestre;
  } else {
    delete payloadSuivi.dateSuivie;
  }

  if (isAgregerCurrentIndicateur.value) {
    payloadSuivi.valeurCible = valeurCible.value;
    payloadSuivi.valeurRealise = valeurRealise.value;
  }

  isLoading.value = true;
  const action = IndicateursService.createSuivi(payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Ajouté avec succès.`);
    // getDatas();
    resetFormSuivi();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    showModalSuivi.value = false;
    isLoading.value = false;
  }
};

// Delete data
const deleteData = async () => {
  try {
    isLoading.value = true;
    await IndicateursService.destroy(idSelect.value);
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
  showModalEdit.value = true;
};
const handleSuivi = (data) => {
  isAgregerCurrentIndicateur.value = data.agreger;
  payloadSuivi.indicateurId = data.id;
  valueKeysIndicateurSuivi.value = data.value_keys;
  resetValues();
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
const closeModal = () => (showModalEdit.value = false);
const closeDeleteModal = () => (deleteModalPreview.value = false);

function formatResponsable(responsable) {
  return responsable.map((item) => item.nom).join("<br>");
}

function formatObject(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([key, value]) => (key === "moy" ? value : `${key}: ${value}`))
    .join("<br>");
}
</script>

<style scoped>
table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 8px;
}
.sticky-column {
  position: sticky;
  left: 0;
  background-color: white;
  z-index: 3;
}

.sticky-column-second {
  position: sticky;
  left: 500px; /* Largeur de la première colonne */
  background-color: white;
  z-index: 2;
}

.stick-column-third {
  position: sticky;
  left: 580px; /* Largeur cumulée des deux premières colonnes */
  background-color: white;
  z-index: 1;
}

/* Optionnel : Ajout d'une bordure pour les colonnes fixes */
.sticky-column,
.sticky-column-second,
.stick-column-third {
  border-right: 1px solid #ccc;
}
</style>
