<script setup>
import { onMounted, ref, watch } from "vue";
import { reactive } from "vue";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import AuthService from "@/services/modules/auth.service";
import InputForm from "@/components/news/InputForm.vue";
import { useRoute } from "vue-router";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { computed } from "vue";
import { ages, categorieDeParticipant, sexes } from "../../utils/constants";
import { generateUniqueId } from "../../utils/helpers";

const TYPE_ORGANISATION = "organisation";

const route = useRoute();
const token = route.params.id;

const payload = reactive({
  identifier_of_participant: "",
  programmeId: "",
  token,
  formulaireDeGouvernanceId: "",
  perception: {
    categorieDeParticipant: "",
    sexe: "",
    age: "",
    commentaire: "Commentaire",
    response_data: [],
  },
});
const idEvaluation = ref("");
const responses = reactive({});
const formData = reactive({});
const formDataPerception = ref([]);
const formulairePerception = ref({});
const isOrganisation = ref(false);
const isLoading = ref(false);
const showModalPreview = ref(false);
const organisationSelected = ref(false);
const isValidate = ref(false);
const isLoadingDataPerception = ref(true);
const sources = ref([]);

// Etat de la page et items par page
const currentPage = ref(1);
const itemsPerPage = 3;

const getDataFormPerception = async () => {
  try {
    const { data } = await EvaluationService.getPerceptionFormEvaluation(payload.identifier_of_participant, token);
    formDataPerception.value = data.data;
    formulairePerception.value = formDataPerception.value.formulaire_de_gouvernance;
    idEvaluation.value = formDataPerception.value.id;
    payload.formulaireDeGouvernanceId = formDataPerception.value.formulaire_de_gouvernance.id;
    payload.programmeId = formDataPerception.value.programmeId;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataPerception.value = false;
  }
};

const getcurrentUserAndFetchOrganization = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      payload.organisationId = result.data.data.id;
      if (result.data.data.type != TYPE_ORGANISATION) {
        isOrganisation.value = true;
      }
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

function removeObjectWithOptionResponseEmpty() {
  payload.perception.response_data = payload.perception.response_data.filter((item) => item.optionDeReponseId !== "null");
}
const submitData = async () => {
  payload.perception.response_data = Object.values(responses);
  removeObjectWithOptionResponseEmpty();

  if (payload.perception.response_data.length > 0) {
    isLoading.value = true;
    const action = isValidate.value ? EvaluationService.validatePerceptionSumission(idEvaluation.value, payload) : EvaluationService.submitPerceptionSumission(idEvaluation.value, payload);

    try {
      const result = await action;
      if (isValidate.value) toast.success(`${result.data.message}`);
    } catch (e) {
      console.error(e);
      if (isValidate.value) toast.error(getAllErrorMessages(e));
    } finally {
      isLoading.value = false;
    }
  } else {
    return;
  }
};
const initializeFormData = () => {
  // Initialisation des réponses
  formulairePerception.value.categories_de_gouvernance.forEach((principe) => {
    principe.questions_de_gouvernance.forEach((question) => {
      responses[question.id] = {
        questionId: question.id,
        optionDeReponseId: question.reponse_de_la_collecte?.optionDeReponseId ?? "null",
      };
    });
  });
};
const initializeFormDataBeforeSoumission = () => {
  // Initialisation des réponses
  formulairePerception.value.categories_de_gouvernance.forEach((principe) => {
    principe.questions_de_gouvernance.forEach((question) => {
      responses[question.id] = {
        questionId: question.id,
        optionDeReponseId: "null",
      };
    });
  });
};
const changePage = (pageNumber) => {
  currentPage.value = pageNumber;
  submitData();
};
// const prevPage = () => {
//   if (currentPage.value >= 1) {
//     currentPage.value--;
//     submitData();
//   }
// };
// const nextPage = () => {
//   if (currentPage.value < totalPages.value - 1) {
//     currentPage.value++;
//     submitData();
//   }
// };
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
function findFormulairePerception() {
  const idPerception = formDataPerception.value.formulaire_perception_de_gouvernance;
  formulairePerception.value = formDataPerception.value.formulaires_de_gouvernance.find((formulaire) => formulaire.id === idPerception);
}
const findOrganisation = (id) => {
  if (formDataPerception.value.organisations) {
    const organisation = formDataPerception.value.organisations.find((organisation) => organisation.id === id);
    return organisation ? organisation.nom : null;
  }

  return "";
};
const findResponse = (id) => {
  if (formulairePerception.value.options_de_reponse) {
    const response = formulairePerception.value.options_de_reponse.find((response) => response.id === id);
    return response ? response.libelle : null;
  }

  return "";
};

const resetValidation = () => {
  showModalPreview.value = false;
  isValidate.value = false;
};

const openPreview = () => {
  showModalPreview.value = true;
  isValidate.value = true;
};

const changeOrganisation = () => {
  organisationSelected.value ? initializeFormData() : (organisationSelected.value = true);
};
// const totalPages = computed(() => {
//   if (formulairePerception.value.categories_de_gouvernance) {
//     return formulairePerception.value.categories_de_gouvernance.length;
//   } else {
//     return 0;
//   }
// });

// Fonctions pour changer de page
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    submitData();
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    submitData();
  }
};

// Vérifie si un élément est sur la page actuelle
const isOnCurrentPage = (index) => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return index >= start && index < end;
};
const isPreview = computed(() => currentPage.value === totalPages.value - 1);

// Calculer le nombre total de pages
const totalPages = computed(() => Math.ceil(formulairePerception.value.categories_de_gouvernance ? formulairePerception.value.categories_de_gouvernance.length / itemsPerPage : 0));

// Obtenir les éléments de la page actuelle
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  if (formulairePerception.value.categories_de_gouvernance) return formulairePerception.value.categories_de_gouvernance.slice(start, end);
});

const goToPage = (page) => {
  currentPage.value = page;
  submitData();
};

const isLastPage = computed(() => currentPage.value === totalPages.value);

// watch(
//   formData,
//   (newValue) => {
//     localStorage.setItem("formData", JSON.stringify(newValue));
//   },
//   { deep: true }
// );

onMounted(async () => {
  payload.identifier_of_participant = generateUniqueId();
  await getDataFormPerception();
  // await getcurrentUserAndFetchOrganization();
  // findFormulairePerception();
  initializeFormData();
});
</script>
<template>
  <div v-if="!isLoadingDataPerception" class="mx-auto mt-5 max-w-screen-2xl">
    <div v-if="formDataPerception.id" class="w-full p-4 font-bold text-center text-white uppercase rounded bg-primary">{{ formDataPerception.intitule }}</div>
    <div v-if="formDataPerception.organisations" class="flex items-center justify-end mt-5">
      <div class="min-w-[250px] flex items-center gap-3">
        <label class="form-label">Organisations</label>
        <TomSelect v-model="payload.organisationId" @change="changeOrganisation" :options="{ placeholder: 'Selectionez une organisation' }" class="w-full">
          <option value=""></option>
          <option v-for="(ong, index) in formDataPerception.organisations" :key="index" :value="ong.id">{{ ong.nom }}</option>
        </TomSelect>
      </div>
    </div>
    <div>
      <div class="py-5 intro-x" v-if="formDataPerception.id">
        <div class="space-y-8">
          <div class="space-y-6">
            <AccordionGroup class="space-y-2">
              <AccordionItem v-for="(principe, principeIndex) in paginatedData" :key="principeIndex" class="!px-0">
                <Accordion class="text-xl !p-4 font-semibold bg-primary/90 !text-white flex items-center justify-between">
                  <h2>{{ principe.nom }}</h2>
                  <ChevronDownIcon />
                </Accordion>
                <!-- v-for Indicateur -->
                <AccordionPanel class="!border-none pt-1">
                  <div v-for="(question, questionIndex) in principe.questions_de_gouvernance" :key="questionIndex" class="relative px-4 pt-2 my-3 transition-all">
                    <div class="p-2 py-3 space-y-2 border-l-8 border-yellow-500 rounded shadow box">
                      <p class="w-full text-lg font-semibold text-center text-primary">{{ questionIndex + 1 }} - {{ question.nom }}</p>
                      <div class="flex flex-col items-center justify-center w-full gap-3">
                        <!-- v-for Option -->
                        <div class="inline-flex flex-wrap items-center gap-3">
                          <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}`" class="form-check-input" type="hidden" :name="`${question.id}`" value="null" v-model="responses[question.id].optionDeReponseId" />
                          <div v-for="(option, optionIndex) in formulairePerception.options_de_reponse" :key="optionIndex">
                            <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}${optionIndex}`" class="form-check-input" type="radio" :name="`${question.id}-${question.slug}`" :value="option.id" v-model="responses[question.id].optionDeReponseId" />
                            <label class="text-base form-check-label" :for="`radio${question.id}${optionIndex}`">
                              {{ option.libelle }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </AccordionGroup>
          </div>
        </div>
        <div class="flex justify-center w-full mt-5">
          <VButton v-if="isLastPage" label="Prévisualiser" class="px-8 py-3 w-max" @click="openPreview" />
        </div>
        <div class="flex justify-center gap-3 my-8">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-3 btn btn-outline-primary">Précedent</button>
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn">{{ page }}</button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-3 btn btn-outline-primary">Suivant</button>
          <!-- <button @click="prevPage()" class="px-4 py-3 btn btn-outline-primary">Précedent</button>
          <button v-for="(item, index) in totalPages" @click="changePage(index)" :class="index === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn" :key="index">{{ index + 1 }}</button>
          <button @click="nextPage()" class="px-4 py-3 btn btn-outline-primary">Suivant</button> -->
        </div>
      </div>
    </div>
  </div>
  <LoaderSnipper v-else />

  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" size="modal-xl" :show="showModalPreview" @hidden="resetValidation">
    <div class="mb-5">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Validation formulaire</h2>
      </ModalHeader>

      <ModalBody class="space-y-5">
        <p v-if="payload.organisationId">
          Patenaire: <span class="text-primary">{{ findOrganisation(payload.organisationId) }}</span>
        </p>
        <div class="">
          <label class="form-label">Catégorie participant </label>
          <TomSelect v-model="payload.perception.categorieDeParticipant" :options="{ placeholder: 'Selectionez un categorie' }" class="w-full">
            <option value=""></option>
            <option v-for="(categorie, index) in categorieDeParticipant" :key="index" :value="categorie.id">{{ categorie.label }}</option>
          </TomSelect>
        </div>
        <div class="flex flex-wrap items-center justify-around gap-2">
          <div>
            <label class="form-label">Sexe</label>
            <div class="flex gap-2">
              <div v-for="(sexe, index) in sexes" :key="index" class="form-check">
                <input v-model="payload.perception.sexe" :id="`sex-${sexe.id}${index}`" class="form-check-input" type="radio" name="sexe" :value="sexe.id" />
                <label class="form-check-label" :for="`sex-${sexe.id}${index}`">{{ sexe.label }}</label>
              </div>
            </div>
          </div>
          <div>
            <label class="form-label">Âge</label>
            <div class="flex gap-2">
              <div v-for="(age, index) in ages" :key="index" class="form-check">
                <input v-model="payload.perception.age" :id="`age-${age.id}${index}`" class="form-check-input" type="radio" name="age" :value="age.id" />
                <label class="form-check-label" :for="`age-${age.id}${index}`">{{ age.label }}</label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label class="form-label">Commentaire</label>
          <div class="">
            <textarea name="commentaire" class="form-control" v-model="payload.perception.commentaire" cols="30" rows="3"></textarea>
          </div>
        </div>
        <div class="max-h-[40vh] h-[40vh] overflow-y-auto">
          <p class="mb-3">Formulaire</p>
          <AccordionGroup :selectedIndex="null" class="space-y-2">
            <AccordionItem v-for="(principe, principeIndex) in formulairePerception.categories_de_gouvernance" :key="`${principeIndex}-${principe.id}`" class="!px-0">
              <Accordion class="text-xl !p-4 font-semibold bg-primary/90 !text-white flex items-center justify-between">
                <h2>{{ principe.nom }}</h2>
                <ChevronDownIcon />
              </Accordion>
              <!-- v-for Indicateur -->
              <AccordionPanel class="!border-none pt-1">
                <div v-for="(question, questionIndex) in principe.questions_de_gouvernance" :key="questionIndex" class="relative px-4 pt-2 my-3 transition-all">
                  <div class="p-2 py-3 space-y-2 border-l-8 border-yellow-500 rounded shadow box">
                    <p class="w-full text-lg font-semibold text-center text-primary">{{ questionIndex + 1 }} - {{ question.nom }}</p>
                    <div class="flex flex-col items-center justify-center w-full gap-3">
                      <!-- v-for Option -->
                      <div class="inline-flex flex-wrap items-center gap-3">
                        <p class="text-base font-medium">
                          Réponse : <span class="text-primary"> {{ findResponse(responses[question.id]?.optionDeReponseId) }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionPanel>
            </AccordionItem>
          </AccordionGroup>
        </div>
      </ModalBody>
    </div>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="resetValidation" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
        <VButton label="Valider" class="w-full px-2 py-2 my-3" :loading="isLoading" @click="submitData()" />
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->
</template>
