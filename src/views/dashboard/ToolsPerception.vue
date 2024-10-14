<script setup>
import { onMounted, ref } from "vue";
import { reactive } from "vue";
import FormulaireFactuel from "@/services/modules/toolsFactuel.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import OngService from "../../services/modules/ong.service";
import AuthService from "@/services/modules/auth.service";

const TYPE_ORGANISATION = "organisation";

const payload = reactive({
  organisationId: organisationselected,
  response_data: [],
});
const organisations = ref([]);
const organisationselected = ref("");
const formDataFactuel = ref([]);
const isLoadingDataFactuel = ref(true);
const isOrganisation = ref(false);
const isLoading = ref(false);
const idEnquete = "EaPR3GQnP1z2YvMVZXEL0QorKA7BmkNLzWlnw9egqGOjbxJd3Ra68p4Dql46Yrj7";
const idProgramme = "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w";

const getDataFormFactuel = async () => {
  await FormulaireFactuel.getDataFormFactuel(idProgramme)
    .then((result) => {
      formDataFactuel.value = result.data.data;
      isLoadingDataFactuel.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingDataFactuel.value = false;
      toast.error("Une erreur est survenue: Liste du formulaire Perception .");
    });
};

const getOrganizations = async () => {
  await OngService.get()
    .then((result) => {
      organisations.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des organisations .");
    });
};

const getcurrentUserAndFetchOrganization = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      console.log(result.data.data.type);
      organisationselected.value = result.data.data.id;
      if (result.data.data.type != TYPE_ORGANISATION) {
        getOrganizations();
        isOrganisation.value = true;
      }
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

const submitData = async () => {
  isLoading.value = true;
  await FormulaireFactuel.create(idEnquete, payload)
    .then((result) => {
      isLoading.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoading.value = false;
      toast.error("Une erreur est survenue: Création des infos.");
    });
};

onMounted(async () => {
  await getcurrentUserAndFetchOrganization();
  await getDataFormFactuel();
});
</script>
<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Formulaire Factuel</h2>
  <div class="w-full p-4 py-5 font-bold text-center text-white uppercase rounded bg-primary">programme 1</div>
  <div v-if="organisations.length > 0 && !isOrganisation" class="flex justify-end mt-5">
    <div class="">
      <label class="form-label">Organisations</label>
      <TomSelect v-model="organisationselected" :options="{ placeholder: 'Selectionez un programme' }" class="w-full">
        <option v-for="(ong, index) in organisations" :key="index" :value="ong.id">{{ ong.nom }}</option>
      </TomSelect>
    </div>
  </div>
  <div>
    <div v-if="!isLoadingDataFactuel" class="py-5 intro-x">
      <div class="space-y-8">
        <!-- vfor type_gouvernace -->
        <div v-for="(typeGouvernance, typeGouvernanceIndex) in formDataFactuel" :key="typeGouvernanceIndex" class="">
          <h1 class="mb-5 text-2xl font-semibold text-gray-800">{{ typeGouvernance.nom }}</h1>
          <!-- vfor Principe -->
          <div class="space-y-6">
            <AccordionGroup :selectedIndex="null" v-for="(principe, principeIndex) in typeGouvernance.principes_de_gouvernance" :key="principeIndex" class="border-primary">
              <AccordionItem class="">
                <Accordion class="text-xl !px-4 font-semibold bg-primary !text-white flex items-center justify-between">
                  <h2>{{ principe.nom }}</h2>
                  <ChevronDownIcon />
                </Accordion>
                <AccordionPanel class="!px-8 !shadow-md !bg-white !py-6">
                  <AccordionGroup class="space-y-2">
                    <AccordionItem class="!px-0" v-for="(critere, critereIndex) in principe.criteres_de_gouvernance" :key="critereIndex">
                      <Accordion class="text-xl !p-4 font-semibold bg-primary/90 !text-white flex items-center justify-between">
                        <h2>{{ critere.nom }}</h2>
                        <ChevronDownIcon />
                      </Accordion>
                      <AccordionPanel class="!border-none pt-1">
                        <div v-for="(indicateur, indicateurIndex) in critere.indicateurs_de_gouvernance" :key="indicateurIndex" class="relative px-4 pt-2 my-3 transition-all">
                          <div class="p-2 py-3 space-y-2 border-l-8 border-yellow-500 rounded shadow box">
                            <p class="w-full text-lg font-semibold text-center text-primary">{{ indicateurIndex + 1 }} - {{ indicateur.nom }}</p>
                            <div class="flex flex-wrap items-center justify-center w-full gap-3">
                              <!-- vfor Option -->
                              <div v-for="(option, optionIndex) in indicateur.options_de_reponse" :key="optionIndex">
                                <input :id="'radio-' + indicateurIndex + '-' + optionIndex" class="form-check-input" type="radio" :name="'option-' + indicateurIndex" :value="option.id" />
                                <label class="text-base form-check-label" :for="'radio-' + indicateurIndex + '-' + optionIndex">
                                  {{ option.libelle }}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionPanel>
                    </AccordionItem>
                  </AccordionGroup>
                </AccordionPanel>
              </AccordionItem>
            </AccordionGroup>
          </div>
        </div>
      </div>
    </div>
    <LoaderSnipper v-else />
    <div class="flex justify-center w-full mt-8">
      <VButton label="Soumettre" class="px-8 py-3 w-max" :loading="isLoadingDataFactuel" @click="submitData" />
    </div>
  </div>
</template>
