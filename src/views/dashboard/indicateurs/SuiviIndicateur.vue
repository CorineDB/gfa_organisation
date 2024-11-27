<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Suivi Indicateurs</h2>
    <LoaderSnipper v-if="isLoadingDataCadre" />
    <TabulatorSuiviIndicateur v-else :data="suivis" :years="annees" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { onMounted } from "vue";
import ResultatCadreRendementService from "@/services/modules/resultat.cadre.rendement.service";
import IndicateursService from "@/services/modules/indicateur.service";
import AuthService from "@/services/modules/auth.service";
import { toast } from "vue3-toastify";
import { computed } from "vue";
import TabulatorSuiviIndicateur from "../../../components/TabulatorSuiviIndicateur.vue";

const suivis = ref([]);
const isLoadingDataCadre = ref(false);
const debutProgramme = ref("");
const finProgramme = ref("");
const getcurrentUser = async () => {
  isLoadingDataCadre.value = true;

  await AuthService.getCurrentUser()
    .then((result) => {
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue.");
    });
};

// Fetch data
const getDatasCadre = async () => {
  try {
    const { data } = await IndicateursService.getAllSuivis();
    suivis.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataCadre.value = false;
  }
};

const annees = computed(() => {
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    annees.push(annee);
  }
  return annees;
});

onMounted(async () => {
  await getcurrentUser();
  getDatasCadre();
});
</script>

<style scoped></style>
