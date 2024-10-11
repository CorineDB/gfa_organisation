<script setup>
import { onMounted, ref } from "vue";
import { reactive } from "vue";
import FormulaireFactuel from "@/services/modules/formFactuel.service";
import { toast } from "vue3-toastify";

``;
const payload = reactive({
  organisationId: "",
  response_data: [],
});
const formDataFactuel = ref([]);
const formDataPerception = ref([]);
const isLoadingDataFormel = ref(true);
const isLoadingDataPerception = ref(true);
const idEnquete = "EaPR3GQnP1z2YvMVZXEL0QorKA7BmkNLzWlnw9egqGOjbxJd3Ra68p4Dql46Yrj7";
const idProgramme = "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w";

const getDataFormFactuel = async () => {
  await FormulaireFactuel.getDataFormFactuel(idProgramme)
    .then((result) => {
      formDataFactuel.value = result.data.data;
      isLoadingDataFormel.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingDataFormel.value = false;
      toast.error("Une erreur est survenue: Liste du formulaire factuel .");
    });
};

const getDataFormPerception = async () => {
  await FormulaireFactuel.getDataFormPerception(idProgramme)
    .then((result) => {
      formDataPerception.value = result.data.data;
      isLoadingDataPerception.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingDataPerception.value = false;
      toast.error("Une erreur est survenue: Liste du formulaire de perception.");
    });
};

const createForm = async () => {
  await FormulaireFactuel.create(idEnquete, payload)
    .then((result) => {
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Création des infos.");
    });
};

onMounted(async () => {
  getDataFormFactuel();
  getDataFormPerception();
});
</script>
<template>
  <div></div>
  <h2 class="mt-10 text-lg font-medium intro-y">Formulaire Factuel</h2>
  <button class="w-full py-4 mt-7 btn btn-primary">Programme 1</button>
  <div>
    <!-- <div v-for="(principe, principeIndex) in formDataFactuel[0].principes_de_gouvernance" :key="principeIndex">
      <div v-for="(critere, critereIndex) in principe.criteres_de_gouvernance" :key="critereIndex">
        <div v-for="(indicateur, indicateurIndex) in critere.indicateurs_de_gouvernance" :key="indicateurIndex">
          <div class="mt-3 space-y-4 ml-7">
            <p class="w-full text-lg font-medium text-primary">{{ indicateur.nom }}</p>
            <div class="flex flex-wrap items-center w-full gap-3">
              <div v-for="(option, optionIndex) in indicateur.options_de_reponse" :key="optionIndex">
                <input :id="'radio-' + indicateurIndex + '-' + optionIndex" class="form-check-input" type="radio" :name="'option-' + indicateurIndex" :value="option.note" />
                <label class="form-check-label" :for="'radio-' + indicateurIndex + '-' + optionIndex">
                  {{ option.libelle }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div>
      <div class="intro-x">
        <div class="relative px-5 py-4 mb-5 box">
          <h1 class="text-xl font-semibold">Gouvernance Politique</h1>
          <ul>
            <li class="mt-4 text-xl font-semibold list-disc ml-7">Redevabilité</li>
          </ul>
          <div class="space-y-5">
            <div class="mt-3 space-y-4 ml-7">
              <p class="w-full text-lg font-medium text-primary">1- Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              <div class="flex flex-wrap items-center w-full gap-3">
                <div>
                  <input id="radio-switch-1" class="form-check-input" type="radio" name="option1" value="1" />
                  <label class="form-check-label" for="radio-switch-1"> Option 1 </label>
                </div>
                <div>
                  <input id="radio-switch-2" class="form-check-input" type="radio" name="option1" value="2" />
                  <label class="form-check-label" for="radio-switch-2"> Option 2 </label>
                </div>
                <div>
                  <input id="radio-switch-2" class="form-check-input" type="radio" name="option1" value="2" />
                  <label class="form-check-label" for="radio-switch-2"> Option 2 </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
