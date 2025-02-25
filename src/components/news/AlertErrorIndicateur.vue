<template>
  <Alert v-if="showAlert" class="flex items-center mb-2 !py-2 alert-danger-soft" v-slot="{ dismiss }">
    <ul class="font-medium !list-disc">
      <li v-for="(error, index) in errorsNom" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsDescription" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsMethode" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsUg" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsOngs" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsSourceDonnee" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsIndice" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsTypeVariable" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsFrequence" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsAnneBase" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsValeurBase" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsValueKeys" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsCategorie" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsUniteMesure" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsSite" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsAnneCible" :key="index">{{ error }}</li>
      <li v-for="(error, index) in countAnneeCible" :key="index" class="">
        <span v-if="errors[`anneesCible.${index}.annee`]"> {{ getFieldErrors(errors[`anneesCible.${index}.annee`]) }}</span>
      </li>

      <div v-if="errors['anneesCible.0.valeurCible.0.keyId']">
        <li v-for="(error, key) in countKeys" :key="key">
          <div v-for="(error, annee) in 10" :key="annee">
            <span v-if="errors[`anneesCible.${key}.valeurCible.${annee}.keyId`]"> {{ getFieldErrors(errors[`anneesCible.${key}.valeurCible.${annee}.keyId`]) }}</span>
          </div>
        </li>
      </div>
      <div v-if="errors['anneesCible.0.valeurCible.0.valeur']">
        <li v-for="(error, key) in countKeys" :key="key">
          <div v-for="(error, annee) in 10" :key="annee">
            <span v-if="errors[`anneesCible.${key}.valeurCible.${annee}.valeur`]"> {{ getFieldErrors(errors[`anneesCible.${key}.valeurCible.${annee}.valeur`]) }}</span>
          </div>
        </li>
      </div>
    </ul>
    <button type="button" class="text-white btn-close" aria-label="Close" @click="dismiss">
      <XIcon class="w-4 h-4" />
    </button>
  </Alert>
</template>

<script setup>
import { computed, watch } from "vue";
import { getFieldErrors } from "../../utils/helpers";

const prop = defineProps({
  errors: Object,
  countAnneeCible: {
    type: Number,
    required: false,
    default: 0,
  },
  countKeys: {
    type: Number,
    required: false,
    default: 0,
  },
});

const showAlert = computed(() => {
  return Object.keys(prop.errors).length > 0;
});

const errorsNom = computed(() => {
  if (prop.errors.nom) return prop.errors.nom;
  return [];
});

const errorsDescription = computed(() => {
  if (prop.errors.description) return prop.errors.description;
  return [];
});

const errorsIndice = computed(() => {
  if (prop.errors.indice) return prop.errors.indice;
  return [];
});

const errorsUg = computed(() => {
  if (prop.errors["responsables.ug"]) return prop.errors["responsables.ug"];
  return [];
});

const errorsOngs = computed(() => {
  if (prop.errors["responsables.organisations"]) return prop.errors["responsables.organisations"];
  return [];
});

const errorsSourceDonnee = computed(() => {
  if (prop.errors.sources_de_donnee) return prop.errors.sources_de_donnee;
  return [];
});

const errorsMethode = computed(() => {
  if (prop.errors.methode_de_la_collecte) return prop.errors.methode_de_la_collecte;
  return [];
});

const errorsFrequence = computed(() => {
  if (prop.errors.frequence_de_la_collecte) return prop.errors.frequence_de_la_collecte;
  return [];
});

const errorsAnneBase = computed(() => {
  if (prop.errors.anneeDeBase) return prop.errors.anneeDeBase;
  return [];
});

const errorsTypeVariable = computed(() => {
  if (prop.errors.type_de_variable) return prop.errors.type_de_variable;
  return [];
});

const errorsSite = computed(() => {
  if (prop.errors.sites) return prop.errors.sites;
  return [];
});

const errorsUniteMesure = computed(() => {
  if (prop.errors.uniteeMesureId) return prop.errors.uniteeMesureId;
  return [];
});

const errorsCategorie = computed(() => {
  if (prop.errors.categorieId) return prop.errors.categorieId;
  return [];
});

const errorsValueKeys = computed(() => {
  if (prop.errors.value_keys) return prop.errors.value_keys;
  return [];
});

const errorsValeurBase = computed(() => {
  if (prop.errors.valeurDeBase) return prop.errors.valeurDeBase;
  return [];
});

const errorsAnneCible = computed(() => {
  if (prop.errors.anneesCible) return prop.errors.anneesCible;
  return [];
});
</script>

<style scoped></style>
