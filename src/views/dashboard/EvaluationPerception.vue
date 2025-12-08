<script setup>
import { onMounted, ref, watch } from "vue";
import { reactive } from "vue";
import axios from "axios";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import AuthService from "@/services/modules/auth.service";
import InputForm from "@/components/news/InputForm.vue";
import { useRoute, useRouter } from "vue-router";
// import { CornerDownLeftIcon } from "lucide-vue-next";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { computed } from "vue";
import { ages, categorieDeParticipant, sexes } from "../../utils/constants";
import { generateUniqueId, generatevalidateKey, getvalidateKey } from "../../utils/helpers";
import { getFieldErrors } from "@/utils/helpers.js";


// Instance axios spécifique pour EvaluationPerception (sans token)
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://dms-redevabilite.com:8443/api/",
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Intercepteur pour gérer les réponses et erreurs
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 500) {
      toast.error("Erreur serveur. Veuillez réessayer plus tard.");
    } else if (error.response?.status === 404) {
      toast.error("Ressource non trouvée.");
    }
    return Promise.reject(error);
  }
);

const TYPE_ORGANISATION = "organisation";

const route = useRoute();
const router = useRouter();
const token = route.params.id;

const payload = reactive({
  identifier_of_participant: "",
  programmeId: "",
  token: token,
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
const showAlertValidate = ref(false);
const showModalPreview = ref(false);
const organisationSelected = ref(false);
const isValidate = ref(false);
const isLoadingDataPerception = ref(true);
const sources = ref([]);
const errors = ref({});

// Etat de la page et items par page
const currentPage = ref(1);
const itemsPerPage = 3;

// Fonctions API utilisant l'instance axios locale
const getPerceptionFormEvaluation = async (participant_identifier, token) => {
  return await axiosInstance.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance-perception/${participant_identifier}/${token}`);
};

const submitPerceptionSoumission = async (id, params) => {
  return await axiosInstance.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance-de-perception/${id}/soumissions`, params);
};

const validatePerceptionSoumission = async (id, params) => {
  return await axiosInstance.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance-de-perception/${id}/validate-soumission`, params);
};

const getDataFormPerception = async () => {
  try {
    const { data } = await getPerceptionFormEvaluation(payload.identifier_of_participant, token);

    console.log(data.data);
    showAlertValidate.value = data.data.terminer;
    if (!showAlertValidate.value) {
      formDataPerception.value = data.data;
      formulairePerception.value = formDataPerception.value.formulaire_de_gouvernance;
      idEvaluation.value = formDataPerception.value.id;
      payload.formulaireDeGouvernanceId = formulairePerception.value.id;
      payload.programmeId = formDataPerception.value.programmeId;
    } else {
      formDataPerception.value = data;
    }
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
  // Debug : afficher le payload avant soumission
  console.log('Payload envoyé :', payload);
  removeObjectWithOptionResponseEmpty();
  // Debug : afficher le payload après filtrage
  console.log('Payload filtré :', payload);

  if (payload.perception.response_data.length > 0) {
    isLoading.value = true;
    const action = isValidate.value ? validatePerceptionSoumission(idEvaluation.value, payload) : submitPerceptionSoumission(idEvaluation.value, payload);

    try {
      const result = await action;

      if (result.statutCode == 206) {
        showAlertValidate.value = result.data.terminer;
      }

      if (result.statutCode == 422) {
        // Erreur métier, afficher les erreurs
        errors.value = result.data.errors;
        toast.error("Erreur de validation");
        return;
      }
       
      if (isValidate.value) {
        toast.success(`${result.data.message}`);
        generatevalidateKey("perception");
        showAlertValidate.value = true;
        showModalPreview.value = false;
      }

      errors.value = {};
    } catch (e) {
      console.error('Erreur soumission :', e);
      if (isValidate.value) {
        if (e.response && e.response.status === 422) {
          // Mapping des erreurs reçues
          errors.value = e.response.data.errors;
          // Debug : afficher toutes les clés d'erreur
          Object.keys(errors.value).forEach(key => {
            console.log('Erreur pour le champ :', key, errors.value[key]);
          });
          if (errors.value["perception.response_data"]) {
            showModalPreview.value = false;
            toast.error(getAllErrorMessages(e));
          }
        } else {
          toast.error(getAllErrorMessages(e));
        }
      }
    } finally {
      isLoading.value = false;
    }
  } else {
    if (isValidate.value) toast.info("Veuillez remplir le formulaire.");
    return;
  }
};

const initializeFormData = () => {
  // Initialisation des réponses
  console.log(formulairePerception.value);
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
  errors.value = {};
};

const openPreview = () => {
  showModalPreview.value = true;
  isValidate.value = true;
};

const changeOrganisation = () => {
  organisationSelected.value ? initializeFormData() : (organisationSelected.value = true);
};

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

onMounted(async () => {
  if (route.query.participantId) {
    alert('ok')
    payload.identifier_of_participant = route.query.participantId;
  } else {
    payload.identifier_of_participant = generateUniqueId();
  }
  await getDataFormPerception();

  if (!showAlertValidate.value) {
    initializeFormData();
  }
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header de la page -->
    <div class="bg-gradient-to-r from-primary/10 to-blue-50 border-b">
      <div class="max-w-screen-2xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"> 📊 </span>
          Évaluation Perception
        </h1>
      </div>
    </div>

    <div v-if="!showAlertValidate" class="bg-white min-h-screen">
      <div v-if="!isLoadingDataPerception" class="mx-auto max-w-screen-2xl px-4 py-6">
        <!-- Titre du formulaire -->
        <div v-if="formDataPerception.id" class="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-xl shadow-lg mb-6">
          <div class="text-center">
            <h2 class="text-xl font-bold uppercase tracking-wide">{{ formDataPerception.intitule }}</h2>
            <p class="text-blue-100 mt-2">Formulaire d'évaluation de perception</p>
          </div>
        </div>

        <!-- Sélection d'organisation -->
        <div v-if="formDataPerception.organisations" class="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-700">Organisation</h3>
            <div class="min-w-[300px]">
              <TomSelect v-model="payload.organisationId" @change="changeOrganisation" :options="{ placeholder: 'Sélectionnez une organisation' }" class="w-full">
                <option value=""></option>
                <option v-for="(ong, index) in formDataPerception.organisations" :key="index" :value="ong.id">{{ ong.nom }}</option>
              </TomSelect>
            </div>
          </div>
        </div>

        <!-- Contenu principal du formulaire -->
        <div v-if="formDataPerception.id" class="bg-white">
          <!-- Erreurs globales du formulaire (questions non répondues) -->
          <div v-if="errors['perception.response_data']" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p v-for="err in errors['perception.response_data']" :key="err" class="text-red-600 text-sm font-medium">
              {{ err }}
            </p>
          </div>
          <div class="space-y-6">
            <AccordionGroup class="space-y-4">
              <AccordionItem v-for="(principe, principeIndex) in paginatedData" :key="principeIndex" class="!px-0 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Accordion class="text-lg !p-5 font-semibold bg-gradient-to-r from-primary/90 to-blue-600 !text-white flex items-center justify-between rounded-t-lg">
                  <h2 class="flex items-center gap-3">
                    <span class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                      {{ principeIndex + 1 }}
                    </span>
                    {{ principe.nom }}
                  </h2>
                  <ChevronDownIcon class="w-5 h-5" />
                </Accordion>
                <!-- Questions -->
                <AccordionPanel class="!border-none bg-gray-50/30">
                  <div class="p-4 space-y-4">
                    <div v-for="(question, questionIndex) in principe.questions_de_gouvernance" :key="questionIndex" class="bg-white rounded-lg border border-gray-200 p-5 hover:border-primary/30 transition-colors">
                      <div class="space-y-4">
                        <!-- Titre de la question -->
                        <div class="flex items-start gap-3">
                          <div class="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 mt-1">
                            {{ questionIndex + 1 }}
                          </div>
                          <h3 class="text-lg font-medium text-gray-800 leading-relaxed">{{ question.nom }}</h3>
                        </div>

                        <!-- Options de réponse -->
                        <div class="ml-11 space-y-3">
                          <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}`" class="form-check-input" type="hidden" :name="`${question.id}`" value="null" v-model="responses[question.id].optionDeReponseId" />
                          <div v-for="(option, optionIndex) in formulairePerception.options_de_reponse" :key="optionIndex" class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                            <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}${optionIndex}`" class="form-check-input w-4 h-4 text-primary" type="radio" :name="`${question.id}-${question.slug}`" :value="option.id" v-model="responses[question.id].optionDeReponseId" />
                            <label class="ml-3 text-base font-medium text-gray-700 cursor-pointer flex-1" :for="`radio${question.id}${optionIndex}`">
                              {{ option.libelle }}
                            </label>
                          </div>

                          <!-- Erreur spécifique à la question manquante -->
                          <div v-if="errors[`perception.response_data.missing.${question.id}.optionDeReponseId`]" class="my-2 text-danger">
                            <span v-for="err in errors[`perception.response_data.missing.${question.id}.optionDeReponseId`]" :key="err">{{ err }}</span>
                          </div>

                          <!-- Erreurs indexées (si besoin) -->
                          <div v-if="errors['perception.response_data.' + questionIndex]" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p class="text-red-600 text-sm font-medium">
                              {{ getFieldErrors(errors["perception.response_data." + questionIndex]) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </AccordionGroup>
          </div>
          <!-- Navigation et pagination -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mt-8 shadow-sm">
            <div class="flex justify-center items-center gap-3 flex-wrap">
              <!-- Bouton Précédent -->
              <button @click="prevPage" :disabled="currentPage === 1" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">← Précédent</button>

              <!-- Pages -->
              <div class="flex gap-2">
                <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'" class="w-12 h-12 rounded-lg font-medium transition-colors">
                  {{ page }}
                </button>
              </div>

              <!-- Bouton Suivant ou Prévisualiser -->
              <button v-if="!isLastPage" @click="nextPage" :disabled="currentPage === totalPages" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Suivant →</button>

              <button v-if="isLastPage" @click="openPreview" class="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"><span>👁️</span> Prévisualiser</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex justify-center items-center min-h-[60vh]">
        <LoaderSnipper />
      </div>
    </div>

    <!-- Message de validation -->
    <div v-else class="min-h-screen bg-white flex justify-center items-center px-4">
      <div class="max-w-md w-full">
        <Alert class="alert-primary border-2 border-primary/20 bg-primary/5">
          <div class="text-center p-4">
            <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">✅</span>
            </div>
            <div class="mt-3 text-lg font-medium text-gray-800" v-if="formDataPerception.message">
              {{ formDataPerception.message }}
            </div>
            <div v-else class="space-y-3">
              <h2 class="text-xl font-semibold text-gray-800">Formulaire de perception</h2>
              <p class="text-gray-600">Formulaire de perception déjà rempli. Merci pour votre participation !</p>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  </div>

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
          <label class="form-label">Catégorie participant <span class="text-danger">*</span> </label>
          <TomSelect v-model="payload.perception.categorieDeParticipant" :options="{ placeholder: 'Selectionez un categorie' }" class="w-full">
            <option value=""></option>
            <option v-for="(categorie, index) in categorieDeParticipant" :key="index" :value="categorie.id">{{ categorie.label }}</option>
          </TomSelect>
          <div v-if="errors['perception.categorieDeParticipant']" class="my-2 text-danger">{{ getFieldErrors(errors["perception.categorieDeParticipant"]) }}</div>
        </div>
        <div class="flex flex-wrap items-center justify-around gap-2">
          <div>
            <label class="form-label">Sexe<span class="text-danger">*</span> </label>
            <div class="flex gap-2">
              <div v-for="(sexe, index) in sexes" :key="index" class="form-check">
                <input v-model="payload.perception.sexe" :id="`sex-${sexe.id}${index}`" class="form-check-input" type="radio" name="sexe" :value="sexe.id" />
                <label class="form-check-label" :for="`sex-${sexe.id}${index}`">{{ sexe.label }}</label>
              </div>
            </div>
            <div v-if="errors['perception.sexe']" class="my-2 text-danger">{{ getFieldErrors(errors["perception.sexe"]) }}</div>
          </div>
          <div>
            <label class="form-label">Âge<span class="text-danger">*</span> </label>
            <div class="flex gap-2">
              <div v-for="(age, index) in ages" :key="index" class="form-check">
                <input v-model="payload.perception.age" :id="`age-${age.id}${index}`" class="form-check-input" type="radio" name="age" :value="age.id" />
                <label class="form-check-label" :for="`age-${age.id}${index}`">{{ age.label }}</label>
              </div>
            </div>
            <div v-if="errors['perception.age']" class="my-2 text-danger">{{ getFieldErrors(errors["perception.age"]) }}</div>
          </div>
        </div>
        <div>
          <label class="form-label">Commentaire</label>
          <div class="">
            <textarea name="commentaire" class="form-control" v-model="payload.perception.commentaire" cols="30" rows="3"></textarea>
          </div>
          <div v-if="errors['perception.commentaire']" class="my-2 text-danger">{{ getFieldErrors(errors["perception.commentaire"]) }}</div>
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
                      <div v-if="errors['perception.response_data.' + questionIndex]" class="my-2 text-danger">
                        {{ getFieldErrors(errors["perception.response_data." + questionIndex]) }}
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
