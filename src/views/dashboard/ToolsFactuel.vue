<script setup>
import { onMounted, ref, watch } from "vue";
import { reactive } from "vue";
import FormulaireFactuel from "@/services/modules/toolsFactuel.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import OngService from "../../services/modules/ong.service";
import AuthService from "@/services/modules/auth.service";
import InputForm from "@/components/news/InputForm.vue";
import { useRouter } from "vue-router";

const TYPE_ORGANISATION = "organisation";

const router = useRouter();

const payload = reactive({
  organisationId: "",
  response_data: {},
});
const formData = reactive({});
const organisations = ref([]);
const formDataFactuel = ref([]);
const isOrganisation = ref(false);
const isLoading = ref(false);
const isLoadingDataFactuel = ref(true);
const currentPage = ref(0);
const nomProgram = ref("");
const idEnquete = "RmLpz4vVan0mOqYvjBE8bVZ3DX7or9yB45RxA6Jp4MGkwlPedKL1z2gQe32BXnE1";

const getDataFormFactuel = async () => {
  await FormulaireFactuel.getDataFormFactuel()
    .then((result) => {
      formDataFactuel.value = result.data.data;
      isLoadingDataFactuel.value = false;
      initializeFormData();
      // const savedData = localStorage.getItem("formData");
      // if (savedData) {
      //   formData.value = JSON.parse(savedData);
      // } else {
      //   initializeFormData();
      // }
    })
    .catch((e) => {
      console.error(e);
      isLoadingDataFactuel.value = false;
      toast.error("Une erreur est survenue: Liste du formulaire Factuel .");
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
      payload.organisationId = result.data.data.id;
      if (result.data.data.type != TYPE_ORGANISATION) {
        getOrganizations();
        isOrganisation.value = true;
      }
      nomProgram.value = result.data.data.programme.nom;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};
const submitData = async () => {
  isLoading.value = true;
  filterFormData();
  const response = {
    factuel: Object.keys(formData).map((indicateurId) => ({
      indicateurDeGouvernanceId: indicateurId,
      optionDeReponseId: formData[indicateurId].selectedOption,
      source: formData[indicateurId].source,
    })),
  };
  payload.response_data = response;
  console.log("response:", response);
  await FormulaireFactuel.create(idEnquete, payload)
    .then((result) => {
      isLoading.value = false;
      // payload.response_data = [];
      toast.success(`${result.data.message}`);
    })
    .catch((e) => {
      console.error(e);
      isLoading.value = false;
      // payload.response_data = [];
      toast.error("Erreur pour la collecte des données");
    });

  console.log("payload:", payload);
};
const initializeFormData = () => {
  formDataFactuel.value.flatMap((type_gouvernance) => {
    type_gouvernance.principes_de_gouvernance.flatMap((principe) =>
      principe.criteres_de_gouvernance.flatMap((critere) =>
        critere.indicateurs_de_gouvernance.map((indicateur) => {
          formData[indicateur.id] = {
            selectedOption: null,
            source: " ",
          };
        })
      )
    );
  });
};
const changePage = (pageNumber) => {
  currentPage.value = pageNumber;
};
const saveFormData = () => {
  localStorage.setItem("formData", JSON.stringify(formData));
};
const filterFormData = () => {
  Object.keys(formData).forEach((key) => {
    if (!formData[key].selectedOption) {
      delete formData[key]; // Supprime l'objet si 'selectedOption' est vide
    }
  });
};

// watch(
//   formData,
//   (newValue) => {
//     localStorage.setItem("formData", JSON.stringify(newValue));
//   },
//   { deep: true }
// );

onMounted(async () => {
  await getcurrentUserAndFetchOrganization();
  await getDataFormFactuel();
});
</script>
<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Outil Factuel</h2>
  <div v-if="nomProgram" class="w-full p-4 font-bold text-center text-white uppercase rounded bg-primary">{{ nomProgram }}</div>
  <div v-if="organisations.length > 0 && isOrganisation" class="flex justify-end mt-5">
    <div class="min-w-[250px]">
      <label class="form-label">Organisations</label>
      <TomSelect v-model="payload.organisationId" :options="{ placeholder: 'Selectionez une organisation' }" class="w-full">
        <option v-for="(ong, index) in organisations" :key="index" :value="ong.id">{{ ong.nom }}</option>
      </TomSelect>
    </div>
  </div>
  <div>
    <div v-if="!isLoadingDataFactuel" class="py-5 intro-x">
      <div class="space-y-8">
        <!-- vfor type_gouvernace -->
        <div v-show="typeGouvernanceIndex === currentPage" v-for="(typeGouvernance, typeGouvernanceIndex) in formDataFactuel" :key="typeGouvernanceIndex" class="transition-all">
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
                  <!-- vfor Critere -->
                  <AccordionGroup class="space-y-2">
                    <AccordionItem class="!px-0" v-for="(critere, critereIndex) in principe.criteres_de_gouvernance" :key="critereIndex">
                      <Accordion class="text-xl !p-4 font-semibold bg-primary/90 !text-white flex items-center justify-between">
                        <h2>{{ critere.nom }}</h2>
                        <ChevronDownIcon />
                      </Accordion>
                      <!-- vfor Indicateur -->
                      <AccordionPanel class="!border-none pt-1">
                        <div v-for="(indicateur, indicateurIndex) in critere.indicateurs_de_gouvernance" :key="indicateurIndex" class="relative px-4 pt-2 my-3 transition-all">
                          <div class="p-2 py-3 space-y-2 border-l-8 border-yellow-500 rounded shadow box">
                            <p class="w-full text-lg font-semibold text-center text-primary">{{ indicateurIndex + 1 }} - {{ indicateur.nom }}</p>
                            <div class="flex flex-col items-center justify-center w-full gap-3">
                              <!-- vfor Option -->
                              <div class="inline-flex flex-wrap items-center gap-3">
                                <div v-if="formData[indicateur.id]" v-for="(option, optionIndex) in indicateur.options_de_reponse" :key="optionIndex">
                                  <input v-model="formData[indicateur.id].selectedOption" :id="`radio-${indicateur.id}${optionIndex}`" class="form-check-input" type="radio" :name="'option-' + indicateur.id" :value="option.id" />
                                  <label class="text-base form-check-label" :for="`radio-${indicateur.id}${optionIndex}`">
                                    {{ option.libelle }}
                                  </label>
                                </div>
                              </div>
                              <div v-if="formData[indicateur.id]">
                                <label :for="`${indicateur.id}`" class="form-label">Source</label>
                                <input :id="`${indicateur.id}`" type="text" required v-model="formData[indicateur.id].source" class="form-control" placeholder="Source" />
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
      <div class="flex justify-center w-full mt-5">
        <VButton label="Soumettre" class="px-8 py-3 w-max" :loading="isLoading" @click="submitData" />
      </div>
    </div>
    <LoaderSnipper v-else />
    <div class="flex justify-center gap-3 my-8">
      <button v-for="(item, index) in formDataFactuel" @click="changePage(index)" :class="index === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn" :key="index">{{ index + 1 }}</button>
    </div>
  </div>
</template>
