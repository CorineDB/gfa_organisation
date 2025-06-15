<template>

  <div class="overflow-x-auto">
    <table class="w-full max-w-full bg-white border-collapse editor_listing_table border-slate-500" cellpadding="6" cellspacing="0">
      <thead class="text-white border-white bg-primary">
        <tr>
          <th rowspan="2" class="py-3 border border-white min-w-[500px]">Indicateurs</th>
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
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[200px]">Actions</th>
        </tr>
        <tr>
          <th v-for="(year, index) in years" :key="index" class="py-3 border border-white min-w-[70px]">{{ year }}</th>
          <th class="py-3 border border-white min-w-[100px]">Total</th>
          <th v-for="(year, index) in years" :key="index" class="py-3 border border-white min-w-[70px]">{{ year }}</th>
          <th class="py-3 border border-white min-w-[100px]">Total</th>
        </tr>
      </thead>
      <tbody>
        <LoaderSnipper v-if="isDataLoading" />
        <template v-else v-for="(suiviIndicateur, j) in data" :key="suiviIndicateur.id">
          <tr>
            <td class="font-semibold p-2">
              {{ suiviIndicateur.indicateur.nom }}
            </td>
            <td class="text-center">{{ suiviIndicateur.trimestre }}</td>
            <td class="text-center">{{ suiviIndicateur.cumul.join(", ") }}</td>
            <td class="text-center" v-for="(year, index) in years" :key="index">
              <span v-html="formatObject(suiviIndicateur.indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
            </td>
            <td class="text-center" v-html="formatObject(suiviIndicateur.indicateur.valeurCibleTotal)"></td>

            <td class="text-center" v-for="(year, index) in years" :key="index">
              <span v-html="formatObject(suiviIndicateur.indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></span>
            </td>
            <td class="text-center" v-html="formatObject(suiviIndicateur.indicateur.valeurRealiserTotal)"></td>
            <td class="text-center" v-html="formatObject(suiviIndicateur.indicateur.taux_realisation)"></td>
            <!-- <td class="">{{ indicateur.sources_de_donnee }}</td>
            <td class="">{{ indicateur.indicateur.frequence_de_la_collecte }}</td>
            <td class="">{{ indicateur.indicateur.methode_de_la_collecte }}</td> -->
            <td class="text-center">{{ formatDateOnly(suiviIndicateur.dateSuivie) }}</td>

            <td class="space-x-3 p-2 text-center">
              <button title="Suivre" @click="handleSuivi(suiviIndicateur)" class="btn text-primary">Suivi</button>
              <button title="Voir" @click="goToDetailSuivi(suiviIndicateur.indicateur.id)" class="btn text-primary"> Details </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>



  <!-- SUIVIE  -->
  <Modal size="modal-lg" backdrop="static" :show="showModalSuivi" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Enregistrer un suivi</h2>
    </ModalHeader>
    <form @submit.prevent="submitSuivi">
      <ModalBody>
        <div class="grid grid-cols-1 gap-5">
          <div class="flex-1">
            <label class="form-label">Année de suivi</label>
            <TomSelect v-model="payloadSuivi.annee" name="annee_suivi" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="annee in years" :key="annee" :value="annee">{{ annee }}</option>
            </TomSelect>
          </div>
          <!-- <InputForm label="Année de suivi" class="flex-1" v-model="payloadSuivi.annee" type="number" /> -->
          <div v-if="!isAgregerCurrentIndicateur" class="flex flex-wrap items-center justify-between gap-3">
            <InputForm label="Valeur cible" class="flex-1" v-model="payloadSuivi.valeurCible" type="number" />
            <InputForm label="Valeur réalisée" class="flex-1" v-model="payloadSuivi.valeurRealise" type="number" />
          </div>

          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Cible</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input type="number" class="form-control" v-model="valeurCible.find((item) => item.keyId === base.id).value" @input="updateValueCible(base.id, $event.target.value)" placeholder="valeur cible" aria-label="valeur" aria-describedby="input-group-valeur" />
              </div>
            </div>
          </div>
          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Réalisée</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input type="number" class="form-control" v-model="valeurRealise.find((item) => item.keyId === base.id).value" @input="updateValueRealiser(base.id, $event.target.value)" placeholder="valeur réalisée" aria-label="valeur" aria-describedby="input-group-valeur" />
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

  <!-- Modal for creating/updating -->
  <Modal size="modal-lg" backdrop="static" :show="false" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier un site</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
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
import { findColorCadreMesure } from "@/utils/findColorIndicator";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { sourcesDonnees } from "@/utils/constants";
import { useRouter } from "vue-router";
import IndicateursService from "@/services/modules/indicateur.service";

const emit = defineEmits(["refreshData"]);

const router = useRouter();

const props = defineProps({
  data: Array,
  years: Array,
  isDataLoading: Boolean,
});

const idSelect = ref("");
const nameSelect = ref("");
const showModalSuivi = ref(false);
const showModalEdit = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);

const valueKeysIndicateurSuivi = ref([]);
const isAgregerCurrentIndicateur = ref(false);

const valeurCible = ref([]);
const valeurRealise = ref([]);

const getCurrentQuarter = function () {
  const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
  return Math.ceil(month / 3); // Calcul du trimestre actuel
}

const trimestres = [1, 2, 3, 4];
const optionsSuivi = [
  { label: "Par date", id: "date" },
  { label: "Par trimestre", id: "trimestre" },
];
const suiviOption = ref(optionsSuivi[0].id);

const payloadSuivi = reactive({
  annee: new Date().getFullYear(),
  trimestre: getCurrentQuarter(),
  valeurCible: "",
  valeurRealise: "",
  commmentaire: "",
  dateSuivie: "",
  indicateurId: "",
  sources_de_donnee: ""
});

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

  console.log(payloadSuivi);

  isLoading.value = true;
  const action = IndicateursService.createSuivi(payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Ajouté avec succès.`);
    resetFormSuivi();
    //getDatas();
    showModalSuivi.value = false;
    isLoading.value = false;
    emit("refreshData", data);
  } catch (e) {
    console.log(e);
    toast.error(getAllErrorMessages(e));
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


const handleSuivi = (data) => {
  console.log(data);
  valeurCible.value = data.indicateur.valeursCible.filter((valeurCible) => valeurCible.annee === payloadSuivi.annee).map((v) => v.valeurCible);
  isAgregerCurrentIndicateur.value = data.indicateur.agreger;
  if(isAgregerCurrentIndicateur.value == false){
    Object.keys(valeurCible.value[0]).forEach((key) => {
      payloadSuivi.valeurCible = valeurCible.value[0][key];
    });
  }

  payloadSuivi.indicateurId = data.indicateur.id;
  valueKeysIndicateurSuivi.value = data.indicateur.value_keys;
  resetValues();
  showModalSuivi.value = true;
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

  payloadSuivi['annee'] = new Date().getFullYear();
  payloadSuivi['trimestre'] = getCurrentQuarter();
  payloadSuivi['valeurCible'] = "";
  payloadSuivi['valeurRealise'] = "";
  payloadSuivi['commmentaire'] = "";
  payloadSuivi['dateSuivie'] = "";
  payloadSuivi['indicateurId'] = "";
  payloadSuivi['sources_de_donnee'] = "";

  showModalSuivi.value = false;
};

const goToDetailSuivi = (id) => {
  console.log(id)
  router.push({
    name: "detail_indicateur",
    params: { id },
  });
};

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