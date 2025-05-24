<script setup>
import { onMounted, ref, watch } from "vue";
import { reactive } from "vue";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import AuthService from "@/services/modules/auth.service";
import InputForm from "@/components/news/InputForm.vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { generateUniqueId, generatevalidateKey, getvalidateKey } from "../../utils/helpers";
import { getFieldErrors } from "@/utils/helpers.js";

const TYPE_ORGANISATION = "organisation";

const route = useRoute();
const router = useRouter();

// const idEvaluation = route.params.id;
const token = route.params.id;

const payload = reactive({
  organisationId: "",
  formulaireDeGouvernanceId: "",
  factuel: {
    comite_members: [],
    response_data: [],
  },
});
const responses = reactive({});
const responsesFiles = reactive({});
const formData = reactive({});
const formDataFactuel = ref([]);
const formulaireFactuel = ref({});
const isOrganisation = ref(false);
const isLoading = ref(false);
const showAlertValidate = ref(false);
const showModal = ref(false);
const showModalPreview = ref(false);
const isValidate = ref(false);
const isLoadingDataFactuel = ref(true);
const organisationSelected = ref(false);
const currentPage = ref(0);
const authUser = ref({});
const idEvaluation = ref("");
const currentMember = ref({
  nom: "",
  prenom: "",
  contact: null,
});
const sources = ref([]);
const errors = ref({});

const getDataFormFactuel = async () => {
  try {
    const { data } = await EvaluationService.getFactuelFormEvaluation(token);

    showAlertValidate.value = data.data.terminer;
    if (!showAlertValidate.value) {
      formDataFactuel.value = data.data;

      console.log("formDataFactuel.value", formDataFactuel.value);

      formulaireFactuel.value = formDataFactuel.value.formulaire_de_gouvernance;
      payload.formulaireDeGouvernanceId = formulaireFactuel.value.id;
      idEvaluation.value = formDataFactuel.value.id;
      initializeFormData();
      getFilesFormData();
    } else {
      if (data.statutCode == 206) {
        router.push({ name: "DetailSoumission", params: { e: data.data.idEvaluation, s: data.data.idSoumission } });
      }
    }
  } catch (e) {
    console.log(e);
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataFactuel.value = false;
  }
};
const getSource = async () => {
  try {
    const { data } = await EvaluationService.getSource();
    sources.value = data.data;

    console.log("sources.value", sources.value);
  } catch (e) {
    toast.error("Erreur lors de la récupération des sources.");
  } finally {
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

function removeNullSourceDeVerificationId() {
  payload.factuel.response_data.forEach((item) => {
    if (item.sourceDeVerificationId === "null") {
      delete item.sourceDeVerificationId;
    }
  });
}
function removeObjectWithOptionResponseEmpty() {
  payload.factuel.response_data = payload.factuel.response_data.filter((item) => item.optionDeReponseId !== "null");
}
const submitData = async () => {
  // Convertir `responses` en tableau et l'affecter à `payload.factuel.response_data`

  payload.factuel.response_data = Object.values(responses);

  console.log("payload.factuel.response_data.length > 0", payload.factuel.response_data.length > 0);

  removeObjectWithOptionResponseEmpty();
  if (payload.factuel.response_data.length > 0) {
    // alert("ok");
    removeNullSourceDeVerificationId();

    const formData = new FormData();

    // Fonction pour ajouter les données dans FormData de manière récursive
    // En excluant les fichiers de `preuves` qui seront ajoutés manuellement
    const appendFormData = (data, root = "") => {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          appendFormData(item, `${root}[${index}]`);
        });
      } else if (data instanceof Object && !(data instanceof File)) {
        Object.keys(data).forEach((key) => {
          // Ignore le champ `preuves` pour éviter la duplication
          if (key !== "preuves") {
            appendFormData(data[key], root ? `${root}[${key}]` : key);
          }
        });
      } else {
        formData.append(root, data);
      }
    };

    // Ajouter toutes les données dans `payload` à `FormData`, en excluant les fichiers `preuves`
    appendFormData(payload);

    // Manuellement ajouter les fichiers `preuves` à `FormData`
    payload.factuel.response_data.forEach((response, questionIndex) => {
      if (response.preuves) {
        response.preuves.forEach((file, fileIndex) => {
          formData.append(`factuel[response_data][${questionIndex}][preuves][${fileIndex}]`, file);
        });
      }
    });

    isLoading.value = true;
    const action = isValidate.value ? EvaluationService.validateSumission(idEvaluation.value, formData) : EvaluationService.submitSumission(idEvaluation.value, formData);

    try {
      const result = await action;

      if (result.statutCode == 206) {
        router.push({ name: "DetailSoumission", params: { e: idEvaluation.value, s: result.data.soumission.id } });
      }

      payload.soumissionId = result.data.data.id;
      if (isValidate.value) {
        toast.success(`${result.data.message}`);
        generatevalidateKey("factuel");
        showAlertValidate.value = true;
        showModalPreview.value = false;
      }
    } catch (e) {
      console.error(e);
      if (isValidate.value) {
        if (e.response && e.response.status === 422) {
          errors.value = e.response.data.errors;
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
  formulaireFactuel.value.categories_de_gouvernance.forEach((typeGouvernance) => {
    typeGouvernance.categories_de_gouvernance.forEach((principe) => {
      principe.categories_de_gouvernance.forEach((critere) => {
        critere.questions_de_gouvernance.forEach((question) => {
          responses[question.id] = {
            questionId: question.id,
            optionDeReponseId: question.reponse_de_la_collecte?.optionDeReponseId ?? "null",
            sourceDeVerificationId: "",
            sourceDeVerification: question.reponse_de_la_collecte?.sourceDeVerification ?? " ",
            description: findResponse2(question.reponse_de_la_collecte?.optionDeReponseId) == "partiellement" ? "" : undefined,
            preuves: [],
          };
        });
      });
    });
  });
};

const getFilesFormData = () => {
  formulaireFactuel.value.categories_de_gouvernance.forEach((typeGouvernance) => {
    typeGouvernance.categories_de_gouvernance.forEach((principe) => {
      principe.categories_de_gouvernance.forEach((critere) => {
        critere.questions_de_gouvernance.forEach((question) => {
          responsesFiles[question.id] = {
            preuvesFiles: question.reponse_de_la_collecte?.preuves ?? [],
          };
        });
      });
    });
  });
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const handleFileUpload = (event, questionIndex) => {
  const files = Array.from(event.target.files);

  responses[questionIndex].preuves = files; // Store files directly as an array of File objects
  console.log("responses[questionIndex].preuves", responses[questionIndex].preuves);
};
const changePage = (pageNumber) => {
  submitData();
  currentPage.value = pageNumber;
};
const prevPage = () => {
  if (currentPage.value >= 1) {
    currentPage.value--;
    submitData();
  }
};

const getSourceName = (sourceId, sources) => {
  const source = sources.find((source) => source.id === sourceId);
  return source ? source.intitule : null;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    submitData();
  }
};
const saveFormData = () => {
  localStorage.setItem("formData", JSON.stringify(formData));
};
const filterFormData = () => {
  Object.keys(formData).forEach((key) => {
    if (!formData[key].sourceDeVerificationId === "null") {
      delete formData[key].sourceDeVerificationId; // Supprime l'objet si 'selectedOption' est vide
    }
  });
};
function findFormulaireFactuel() {
  const idFactuel = formDataFactuel.value.formulaire_factuel_de_gouvernance;
  formulaireFactuel.value = formDataFactuel.value.formulaires_de_gouvernance.find((formulaire) => formulaire.id === idFactuel);
}

function addMembers() {
  payload.factuel.comite_members.push({ ...currentMember.value });
  showModal.value = false;
  currentMember.value = { nom: "", prenom: "", contact: "" };
}

const findOrganisation = (id) => {
  if (formDataFactuel.value.organisations) {
    const organisation = formDataFactuel.value.organisations.find((organisation) => organisation.id === id);
    return organisation ? organisation.nom : null;
  }

  return "";
};
const findResponse = (id) => {
  if (formulaireFactuel.value.options_de_reponse) {
    const response = formulaireFactuel.value.options_de_reponse.find((response) => response.id === id);
    return response ? response.libelle : null;
  }

  return "";
};

const findQuestionDetails = computed(() => {
  if (!invalidResponses.value.length) return null;

  const questionId = invalidResponses.value[0].index; // ID de la question à rechercher

  for (const type_gouvernance of formulaireFactuel.value.categories_de_gouvernance) {
    for (const principe of type_gouvernance.categories_de_gouvernance) {
      for (const critere of principe.categories_de_gouvernance) {
        for (const question of critere.questions_de_gouvernance) {
          if (question.id === questionId) {
            return {
              nom_typeGouvernance: type_gouvernance.nom,
              nom_principe: principe.nom,
              nom_critere: critere.nom,
              nom_question: question.nom,
            };
          }
        }
      }
    }
  }

  return null; // Si aucune correspondance n'est trouvée
});

const findResponse2 = (id) => {
  if (formulaireFactuel.value.options_de_reponse) {
    const response = formulaireFactuel.value.options_de_reponse.find((response) => response.id === id);
    return response ? response.slug : null;
  }

  return "";
};

const invalidResponses = computed(() => {
  return Object.entries(responses).reduce((acc, [index, data]) => {
    const responseLabel = findResponse2(data.optionDeReponseId);
    const isNullOption = data.optionDeReponseId === "null";
    const isOuiWithoutProof = responseLabel === "oui" && data.preuves.length === 0 && !data.sourceDeVerificationId;
    const isPartiellementWithoutDescription = responseLabel === "partiellement" && (!data.description || data.description.trim() === "");

    if (isNullOption || isOuiWithoutProof || isPartiellementWithoutDescription) {
      acc.push({ index, questionId: data.questionId });
    }

    return acc;
  }, []);
});

const findSource = (id) => {
  if (sources) {
    const source = sources.value.find((source) => source.id === id);
    return source ? source.intitule : null;
  }

  return "";
};

const changeOrganisation = () => {
  organisationSelected.value ? initializeFormData() : (organisationSelected.value = true);
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

const totalPages = computed(() => {
  if (formulaireFactuel.value.categories_de_gouvernance) {
    return formulaireFactuel.value.categories_de_gouvernance.length;
  } else {
    return 0;
  }
});
const isPreview = computed(() => currentPage.value === totalPages.value - 1);

onMounted(async () => {
  authUser.value = JSON.parse(localStorage.getItem("authenticateUser"));
  payload.organisationId = authUser.value.profil.id;

  console.log(JSON.parse(localStorage.getItem("member")));

  if (localStorage.getItem("member")) {
    payload.factuel.comite_members = JSON.parse(localStorage.getItem("member"));
  } else {
    payload.factuel.comite_members = [];
  }

  // payload.factuel.comite_members = JSON.parse(localStorage.getItem("member"));

  console.log("authUser.value.profil.user.nom", authUser.value.nom);

  await getDataFormFactuel();

  if (!showAlertValidate.value) {
    await getSource();

    initializeFormData();
  }

  console.log("formulaireFactuel.categories_de_gouvernance", formulaireFactuel.categories_de_gouvernance);

  formulaireFactuel.value.categories_de_gouvernance.forEach((g) => {
    g.categories_de_gouvernance.forEach((p) => {
      openAccordions[p.id] = true;
      p.categories_de_gouvernance.forEach((c) => {
        openAccordions[c.id] = true;
        c.questions_de_gouvernance.forEach((q) => {
          openAccordions[q.id] = true;
        });
      });
    });
  });
});

const hasInvalidResponses = (principe) => {
  return principe.categories_de_gouvernance.some((critere) => critere.questions_de_gouvernance.some((question) => invalidResponses.value.some((response) => response.questionId === question.id)));
};

const hasInvalidResponsesForCritere = (critere) => {
  return critere.questions_de_gouvernance.some((question) => invalidResponses.value.some((response) => response.questionId === question.id));
};

const openAccordions = reactive({});

const toggle = (id) => {
  openAccordions[id] = !openAccordions[id];
};
</script>
<template>
  <div v-if="findQuestionDetails" class="p-4 bg-white shadow-lg rounded-lg border border-gray-200 my-3">
    <p class="my-3">Il vous reste {{ invalidResponses.length }} question{{ invalidResponses.length > 1 ? "s" : "" }} à compléter pour terminer le formulaire.</p>

    <h2 class="text-lg font-semibold text-gray-800">Détail de la question en attente de réponse</h2>
    <p class="mt-2 text-gray-600"><span class="font-semibold">Type de gouvernance :</span> {{ findQuestionDetails.nom_typeGouvernance }}</p>
    <p class="mt-1 text-gray-600"><span class="font-semibold">Principe de gouvernance :</span> {{ findQuestionDetails.nom_principe }}</p>
    <p class="mt-1 text-gray-600"><span class="font-semibold">Critère :</span> {{ findQuestionDetails.nom_critere }}</p>

    <p class="mt-1 text-gray-600"><span class="font-semibold">Question :</span> {{ findQuestionDetails.nom_question }}</p>
  </div>

  <div v-if="!showModalPreview">
    <div class="flex justify-between my-4 items-center">
      <h2 class="text-lg font-medium intro-y">Evaluation factuel</h2>
      <button class="btn btn-primary" @click="router.go(-1)">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
    </div>

    <div v-if="!showAlertValidate" class="">
      <div v-if="!isLoadingDataFactuel" class="">
        <div v-if="formDataFactuel.id" class="w-full p-4 font-bold text-center text-white uppercase rounded bg-primary">{{ formDataFactuel.intitule }}</div>
        <div class="flex items-center justify-between mt-5">
          <div class="min-w-[250px]">
            <button class="btn btn-primary" @click="showModal = true">Ajouter membres</button>
            <div v-if="payload.factuel.comite_members?.length > 0" class="mt-3 space-y-1">
              <label class="text-lg form-label">Membres</label>
              <ul class="space-y-2">
                <li class="text-base text-primary" v-for="(member, index) in payload.factuel?.comite_members" :key="index">{{ member.nom }} {{ member.prenom }} - {{ member.contact }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div class="py-5 intro-x" v-if="formDataFactuel.id">
            <div class="space-y-0">
              <!-- v-for type_gouvernance -->
              <div v-show="currentPage === typeGouvernanceIndex" v-for="(typeGouvernance, typeGouvernanceIndex) in formulaireFactuel.categories_de_gouvernance" :key="typeGouvernanceIndex" class="transition-all">
                <h1 class="mb-5 text-2xl font-semibold text-gray-800">{{ typeGouvernance.nom }}</h1>
                <!-- v-for Principe -->
                <div class="space-y-6">
                  <div class="p-4 space-y-4">
                    <div v-show="currentPage === typeGouvernanceIndex" v-for="(typeGouvernance, typeGouvernanceIndex) in formulaireFactuel.categories_de_gouvernance" :key="typeGouvernanceIndex" class="space-y-2">
                      <h2 class="font-bold text-lg">{{ typeGouvernance.nom }}</h2>

                      <div v-for="(principe, principeIndex) in typeGouvernance.categories_de_gouvernance" :key="principeIndex">
                        <div @click="toggle(principe.id)" class="_bg-blue-900 text-white px-4 py-2 cursor-pointer rounded-md" :class="hasInvalidResponses(principe) ? 'bg-danger' : 'bg-primary'">
                          {{ principe.nom }}
                        </div>
                        <div v-show="openAccordions[principe.id]" class="pl-4 mt-2 space-y-2">
                          <div v-for="(critere, critereIndex) in principe.categories_de_gouvernance" :key="critereIndex">
                            <div @click="toggle(critere.id)" class="_bg-blue-700 text-white px-4 py-2 cursor-pointer rounded-md" :class="hasInvalidResponsesForCritere(critere) ? 'bg-danger' : 'bg-primary/90'">
                              {{ critere.nom }}
                            </div>
                            <div v-show="openAccordions[critere.id]" class="pl-4 mt-2 space-y-2">
                              <div v-for="(question, questionIndex) in critere.questions_de_gouvernance" :key="questionIndex" class="bg-white p-4 rounded shadow border-l-4 border-yellow-500">
                                <div class="bg-white rounded-xl shadow-lg border-l-6 border-blue-600 overflow-hidden mb-6">
                                  <!-- En-tête de la question -->
                                  <div @click="toggle(question.id)" class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors duration-200">
                                    <div class="flex items-center gap-3">
                                      <span class="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">{{ questionIndex + 1 }}</span>
                                      <h3 class="text-xl font-semibold text-gray-800">{{ question.nom }}</h3>
                                    </div>
                                  </div>

                                  <!-- Contenu principal -->
                                  <div v-show="openAccordions[question.id]" class="p-6 space-y-6">
                                    
                                    <!-- <div class="space-y-4">
                                      <h4 class="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                                        <i class="fas fa-question-circle text-blue-500"></i>
                                        Sélectionnez votre réponse :
                                      </h4>

                                     

                                      <div class="space-y-3">
                                        <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}`" class="hidden" type="hidden" :name="`${question.id}`" value="null" v-model="responses[question.id].optionDeReponseId" />

                                        <div v-for="(option, optionIndex) in formulaireFactuel.options_de_reponse" :key="optionIndex" classs="inline-block">
                                          <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 group" :for="`radio${question.id}${optionIndex}`">
                                            <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}${optionIndex}`" class="w-5 h-5 text-blue-600 accent-blue-900 mr-4" type="radio" :name="`${question.id}-${question.slug}`" :value="option.id" v-model="responses[question.id].optionDeReponseId" />
                                            <span class="text-gray-700 font-medium group-hover:text-blue-700">
                                              {{ option.libelle }}
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    </div> -->

                                    <div class="space-y-4">
                                      <h4 class="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2 justify-center">
                                        <i class="fas fa-question-circle text-blue-500"></i>
                                        Sélectionnez votre réponse :
                                      </h4>

                                      <div class="space-y-3 text-center">
                                        <div v-for="(option, optionIndex) in formulaireFactuel.options_de_reponse" :key="optionIndex" class="inline-block ml-3">
                                          <label
                                            class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 group"
                                            :for="`radio${question.id}${optionIndex}`"
                                            :class="{
                                              'border-blue-600 bg-blue-50': responses[question.id]?.optionDeReponseId === option.id,
                                              'border-gray-200 hover:border-blue-300 hover:bg-blue-50': responses[question.id]?.optionDeReponseId !== option.id,
                                            }"
                                          >
                                            <input :id="`radio${question.id}${optionIndex}`" class="w-5 h-5 text-blue-600 accent-blue-900 mr-4" type="radio" :name="`${question.id}-${question.slug}`" :value="option.id" v-model="responses[question.id].optionDeReponseId" />
                                            <span
                                              class="text-gray-700 font-medium"
                                              :class="{
                                                'text-blue-700': responses[question.id]?.optionDeReponseId === option.id,
                                                'group-hover:text-blue-700': responses[question.id]?.optionDeReponseId !== option.id,
                                              }"
                                            >
                                              {{ option.libelle }}
                                            </span>
                                          </label>
                                        </div>

                                        
                                      </div>
                                    </div>

                                    <!-- Section conditionnelle pour "Oui" -->
                                    <div v-if="findResponse2(responses[question.id].optionDeReponseId) == 'oui'" class="bg-green-50 border border-green-200 rounded-lg p-6 space-y-6">
                                      <div class="flex items-center gap-2 mb-4">
                                        <i class="fas fa-check-circle text-green-600"></i>
                                        <h5 class="text-lg font-semibold text-green-800">Informations complémentaires</h5>
                                      </div>

                                      <!-- Section Source -->
                                      <div class="space-y-3">
                                        <label class="block text-sm font-semibold text-gray-700"> <i class="fas fa-link mr-2 text-blue-500"></i>Source de vérification </label>
                                        <div v-if="sources.length" class="relative">
                                          <TomSelect :options="{ placeholder: 'Sélectionnez une source' }" class="w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" v-model="responses[question.id].sourceDeVerificationId">
                                            <option value="">Sélectionner une source</option>
                                            <option v-for="(source, indexSource) in sources" :key="indexSource" :value="source.id">
                                              {{ source.intitule }}
                                            </option>
                                            <option value="autre">Autres sources</option>
                                          </TomSelect>
                                        </div>
                                      </div>

                                      <!-- Champ autre source (conditionnel) -->
                                      <div v-if="responses[question.id]?.sourceDeVerificationId == 'autre'" class="space-y-3">
                                        <label class="block text-sm font-semibold text-gray-700"> <i class="fas fa-edit mr-2 text-orange-500"></i>Précisez la source </label>
                                        <input type="text" required class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" v-model="responses[question.id].sourceDeVerification" placeholder="Saisissez votre source personnalisée..." />
                                      </div>

                                      <!-- Section Upload de fichiers -->
                                      <div class="space-y-3">
                                        <label class="block text-sm font-semibold text-gray-700"> <i class="fas fa-paperclip mr-2 text-purple-500"></i>Pièces justificatives </label>
                                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200">
                                          <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                                          <p class="text-gray-600 mb-3">Cliquez pour parcourir</p>
                                          <input type="file" :id="question.id" multiple :ref="question.id" @change="handleFileUpload($event, question.id)" class="hidden" />
                                          <label :for="question.id" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg cursor-pointer transition-colors duration-200"> Parcourir les fichiers </label>
                                          <p class="text-xs text-gray-500 mt-2">PDF, DOC, JPG, PNG - Max 10MB par fichier</p>
                                        </div>
                                      </div>

                                      <!-- Section des fichiers uploadés -->
                                      <div v-if="responses[question.id]?.preuves.length" class="bg-gray-50 rounded-lg p-4">
                                        <h6 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                          <i class="fas fa-file-alt text-blue-500"></i>
                                          Fichiers joints ({{ responses[question.id]?.preuves.length }})
                                        </h6>

                                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                          <div v-for="(file, index) in responses[question.id]?.preuves" :key="index" class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                                            <div class="flex items-center gap-3">
                                              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <i class="fas fa-file text-blue-600"></i>
                                              </div>
                                              <div class="flex-1 min-w-0">
                                                <p class="text-sm font-medium text-gray-900 truncate">{{ file.nom }}</p>
                                                <p class="text-xs text-gray-500">{{ file.size ? formatFileSize(file.size) : "Taille inconnue" }}</p>
                                              </div>
                                              <a :href="file.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                                                <i class="fas fa-external-link-alt"></i>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <!-- Section conditionnelle pour "Partiellement" -->
                                    <div v-else-if="findResponse2(responses[question.id].optionDeReponseId) == 'partiellement'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 space-y-4">
                                      <div class="flex items-center gap-2 mb-4">
                                        <i class="fas fa-exclamation-triangle text-yellow-600"></i>
                                        <h5 class="text-lg font-semibold text-yellow-800">Précisions nécessaires</h5>
                                      </div>

                                      <div class="space-y-3">
                                        <label class="block text-sm font-semibold text-gray-700" for="description"> <i class="fas fa-comment-alt mr-2 text-blue-500"></i>Description détaillée </label>
                                        <textarea name="description" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none" id="description" v-model="responses[question.id].description" cols="30" rows="4" placeholder="Veuillez préciser les détails de votre réponse..."></textarea>
                                        <div v-if="errors.description" class="flex items-center gap-2 mt-2 text-red-600">
                                          <i class="fas fa-exclamation-circle"></i>
                                          <span class="text-sm">{{ getFieldErrors(errors.description) }}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="flex justify-center w-full mt-5">
              <VButton v-if="isPreview" label="Prévisualiser" class="px-8 py-3 w-max" @click="openPreview" />
            </div> -->
            <div class="flex justify-center gap-3 my-8">
              <button @click="prevPage()" :disabled="currentPage === 0" class="px-4 py-3 btn btn-outline-primary">Précedent</button>
              <button v-for="(item, index) in totalPages" @click="changePage(index)" :class="index === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn" :key="index">{{ index + 1 }}</button>
              <button v-if="!isPreview" @click="nextPage()" class="px-4 py-3 btn btn-outline-primary" :disabled="currentPage === totalPages - 1">Suivant</button>

              <button v-if="isPreview" @click="openPreview" class="px-4 py-3 btn btn-outline-primary">Prévisualiser</button>
            </div>
          </div>
        </div>
      </div>
      <LoaderSnipper v-else />
    </div>
    <div v-else class="flex w-full justify-center items-center h-[40vh]">
      <Alert class="mb-2 alert-primary">
        <div class="flex items-center">
          <div class="text-lg font-medium">Formulaire factuel</div>
        </div>
        <div class="mt-3">Formulaire factuel déjà remplir. Merci</div>
      </Alert>
    </div>
  </div>

  <div v-else>
    <div class="my-5">
      <div class="flex justify-between">
        <h2 class="mr-auto text-base font-medium">Validation formulaire</h2>
        <p><span class="text-sm font-bold">Organisation:</span> {{ authUser?.nom }}</p>
      </div>

      <div v-if="findQuestionDetails" class="p-4 bg-white shadow-lg rounded-lg border border-gray-200 my-3">
        <p class="my-3">Il vous reste {{ invalidResponses.length }} question{{ invalidResponses.length > 1 ? "s" : "" }} à compléter pour terminer le formulaire.</p>

        <h2 class="text-lg font-semibold text-gray-800">Détail de la question en attente de réponse</h2>
        <p class="mt-2 text-gray-600"><span class="font-semibold">Type de gouvernance :</span> {{ findQuestionDetails.nom_typeGouvernance }}</p>
        <p class="mt-1 text-gray-600"><span class="font-semibold">Principe de gouvernance :</span> {{ findQuestionDetails.nom_principe }}</p>
        <p class="mt-1 text-gray-600"><span class="font-semibold">Critère :</span> {{ findQuestionDetails.nom_critere }}</p>

        <p class="mt-1 text-gray-600"><span class="font-semibold">Question :</span> {{ findQuestionDetails.nom_question }}</p>
      </div>

      <div class="space-y-5">
        <div v-if="errors.factuel" class="my-2 text-danger">{{ getFieldErrors(errors.factuel) }}</div>
        <div v-if="errors['factuel.comite_members']" class="my-2 text-danger">{{ getFieldErrors(errors["factuel.comite_members"]) }}</div>
        <div v-if="errors['factuel.response_data']" class="my-2 text-danger">{{ getFieldErrors(errors["factuel.response_data"]) }}</div>

        <div v-if="payload.factuel.comite_members.length > 0" class="mt-3 space-y-1">
          <label class="form-label">Membres</label>
          <ul class="space-y-2">
            <li class="text-base text-primary" v-for="(member, index) in payload.factuel.comite_members" :key="index">{{ member.nom }} {{ member.prenom }} - {{ member.contact }}</li>
          </ul>
        </div>

        <div class="_max-h-[40vh] _h-[40vh] overflow-y-auto">
          <p class="mb-3">Formulaire</p>

          <div v-for="(typeGouvernance, typeGouvernanceIndex) in formulaireFactuel.categories_de_gouvernance" :key="typeGouvernanceIndex" class="transition-all">
            <h1 class="mt-5 mb-3 text-xl font-semibold text-gray-800">{{ typeGouvernance.nom }}</h1>
            <!-- v-for Principe -->
            <div class="space-y-6">
              <div :selectedIndex="null" v-for="(principe, principeIndex) in typeGouvernance.categories_de_gouvernance" :key="principeIndex" class="border-primary">
                <div>
                  <div class="text-xl !p-4 font-semibold bg-primary !text-white flex items-center justify-between">
                    <h2>{{ principe.nom }}</h2>
                    <ChevronDownIcon />
                  </div>
                  <div class="!px-8 !shadow-md !bg-white !py-6">
                    <!-- v-for Critere -->
                    <div class="space-y-2">
                      <div v-for="(critere, critereIndex) in principe.categories_de_gouvernance" :key="critereIndex" class="!px-0">
                        <div class="text-xl !p-4 font-semibold bg-primary/90 !text-white flex items-center justify-between">
                          <h2>{{ critere.nom }}</h2>
                          <ChevronDownIcon />
                        </div>
                        <!-- v-for Indicateur -->
                        <div class="!border-none pt-1">
                          <div v-for="(question, questionIndex) in critere.questions_de_gouvernance" :key="questionIndex" class="relative px-4 pt-2 my-3 transition-all">
                            <div class="bg-white rounded-xl shadow-lg border-l-6 border-amber-500 overflow-hidden mb-6">
                              <!-- En-tête de la question -->
                              <div class="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-amber-100">
                                <div class="flex items-center gap-3">
                                  <span class="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">{{ questionIndex + 1 }}</span>
                                  <h3 class="text-xl font-semibold text-gray-800">{{ question.nom }}</h3>
                                </div>
                              </div>

                              <!-- Contenu principal -->
                              <div class="p-6 space-y-6">
                                <!-- Section Réponse -->
                                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                      <i class="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <div>
                                      <p class="text-sm font-medium text-gray-600">Réponse sélectionnée</p>
                                      <p class="text-lg font-semibold text-blue-700">
                                        {{ findResponse(responses[question.id]?.optionDeReponseId) }}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <!-- Section pour réponse "Oui" -->
                                <div v-if="findResponse(responses[question.id]?.optionDeReponseId) == 'oui'" class="space-y-4">
                                  <!-- Section Source -->
                                  <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div class="flex items-center gap-3 mb-3">
                                      <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                        <i class="fas fa-link text-white text-sm"></i>
                                      </div>
                                      <h4 class="text-lg font-semibold text-green-800">Source de vérification</h4>
                                    </div>

                                    <div class="ml-11">
                                      <p v-if="responses[question.id].sourceDeVerificationId == 'autre'" class="text-base text-gray-700">
                                        <span class="font-medium">Source personnalisée :</span>
                                        <span class="text-green-700 font-semibold ml-2">{{ responses[question.id].sourceDeVerification }}</span>
                                      </p>

                                      <p v-else class="text-base text-gray-700">
                                        <span class="font-medium">Source officielle :</span>
                                        <span class="text-green-700 font-semibold ml-2">{{ findSource(responses[question.id]?.sourceDeVerificationId) }}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <!-- Section Fichiers -->
                                  <div v-if="responses[question.id]?.preuves?.length" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <div class="flex items-center gap-3 mb-3">
                                      <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                        <i class="fas fa-paperclip text-white text-sm"></i>
                                      </div>
                                      <h4 class="text-lg font-semibold text-purple-800">Pièces justificatives ({{ responses[question.id]?.preuves?.length }})</h4>
                                    </div>

                                    <div v-for="(file, index) in responses[question.id]?.preuves" :key="index" class="flex items-center gap-3 p-3 bg-white border border-purple-100 rounded-lg hover:shadow-sm transition-shadow duration-200">
                                      <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-file text-purple-600 text-sm"></i>
                                      </div>
                                      <div class="flex-1">
                                        <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                                        <p class="text-xs text-gray-500">{{ file.size ? formatFileSize(file.size) : "Taille inconnue" }}</p>
                                      </div>
                                      <a v-if="file.url" :href="file.url" target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:text-purple-800 transition-colors duration-200">
                                        <i class="fas fa-external-link-alt"></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                <!-- Section pour réponse "Partiellement" -->
                                <div v-else-if="findResponse(responses[question.id]?.optionDeReponseId) == 'partiellement'" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                  <div class="flex items-start gap-3">
                                    <div class="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mt-1">
                                      <i class="fas fa-comment-alt text-white text-sm"></i>
                                    </div>
                                    <div class="flex-1">
                                      <h4 class="text-lg font-semibold text-orange-800 mb-2">Description détaillée</h4>
                                      <div class="bg-white border border-orange-100 rounded-lg p-4">
                                        <p class="text-gray-700 leading-relaxed">
                                          {{ responses[question.id].description || "Aucune description fournie" }}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full">
      <div class="flex gap-2">
        <button type="button" @click="resetValidation" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
        <VButton label="Valider" class="w-full px-2 py-2 my-3" :loading="isLoading" @click="submitData()" />
      </div>
    </div>
  </div>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <div class="mb-5">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Ajouter un membre</h2>
      </ModalHeader>

      <ModalBody class="space-y-5">
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="currentMember.nom" />
          <InputForm label="Prénom" v-model="currentMember.prenom" />
        </div>
        <div class="w-full">
          <label for="contact" class="form-label">Contact <span class="text-danger">*</span> </label>
          <input id="contact" pattern="\d*" type="text" required v-model.number="currentMember.contact" class="form-control" placeholder="Contact" />
        </div>
      </ModalBody>
    </div>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModal = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
        <button type="button" @click="addMembers()" class="w-full px-2 py-2 my-3 btn btn-primary">Ajouter</button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->

  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" size="modal-xl" :show="showModalPreview === !showModalPreview" @hidden="resetValidation">
    <div class="mb-5">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Validation formulaire</h2>
      </ModalHeader>

      <ModalBody class="space-y-5">
        <div v-if="errors.factuel" class="my-2 text-danger">{{ getFieldErrors(errors.factuel) }}</div>
        <div v-if="errors['factuel.comite_members']" class="my-2 text-danger">{{ getFieldErrors(errors["factuel.comite_members"]) }}</div>
        <div v-if="errors['factuel.response_data']" class="my-2 text-danger">{{ getFieldErrors(errors["factuel.response_data"]) }}</div>
        <p>Organisation: {{ findOrganisation(payload.organisationId) }}</p>
        <div v-if="payload.factuel.comite_members?.length > 0" class="mt-3 space-y-1">
          <label class="form-label">Membres</label>
          <ul class="space-y-2">
            <li class="text-base text-primary" v-for="(member, index) in payload.factuel.comite_members" :key="index">{{ member.nom }} {{ member.prenom }} - {{ member.contact }}</li>
          </ul>
        </div>
        <div class="max-h-[40vh] h-[40vh] overflow-y-auto">
          <p class="mb-3">Formulaire</p>
          <div v-for="(typeGouvernance, typeGouvernanceIndex) in formulaireFactuel.categories_de_gouvernance" :key="typeGouvernanceIndex" class="transition-all">
            <h1 class="mt-5 mb-3 text-xl font-semibold text-gray-800">{{ typeGouvernance.nom }}</h1>
            <!-- v-for Principe -->
            <div class="space-y-6">
              <AccordionGroup :selectedIndex="null" v-for="(principe, principeIndex) in typeGouvernance.categories_de_gouvernance" :key="principeIndex" class="border-primary">
                <AccordionItem>
                  <Accordion class="text-xl !px-4 font-semibold bg-primary !text-white flex items-center justify-between">
                    <h2>{{ principe.nom }}</h2>
                    <ChevronDownIcon />
                  </Accordion>
                  <AccordionPanel class="!px-8 !shadow-md !bg-white !py-6">
                    <!-- v-for Critere -->
                    <AccordionGroup class="space-y-2">
                      <AccordionItem v-for="(critere, critereIndex) in principe.categories_de_gouvernance" :key="critereIndex" class="!px-0">
                        <Accordion class="text-xl !p-4 font-semibold bg-primary/90 !text-white flex items-center justify-between">
                          <h2>{{ critere.nom }}</h2>
                          <ChevronDownIcon />
                        </Accordion>
                        <!-- v-for Indicateur -->
                        <AccordionPanel class="!border-none pt-1">
                          <div v-for="(question, questionIndex) in critere.questions_de_gouvernance" :key="questionIndex" class="relative px-4 pt-2 my-3 transition-all">
                            <div class="p-2 py-3 space-y-2 border-l-8 border-yellow-500 rounded shadow box">
                              <p class="w-full text-lg font-semibold text-center text-primary">{{ questionIndex + 1 }} - {{ question.nom }}</p>
                              <div class="flex items-center justify-center w-full gap-3">
                                <!-- v-for Option -->
                                <div class="inline-flex flex-wrap items-center gap-3">
                                  <p class="text-base font-medium">
                                    Réponse : <span class="text-primary"> {{ findResponse(responses[question.id]?.optionDeReponseId) }}</span>
                                  </p>
                                </div>
                                <div class="flex items-center gap-3">
                                  <div class="flex items-center gap-3" v-if="responses[question.id]?.sourceDeVerificationId === 'others'">
                                    <p class="text-base font-medium">
                                      Autre source: <span class="text-primary">{{ responses[question.id].sourceDeVerification }}</span>
                                    </p>
                                  </div>
                                  <div v-else class="flex items-center gap-3">
                                    <p class="text-base font-medium">
                                      Source : <span class="text-primary">{{ findSource(responses[question.id]?.sourceDeVerificationId) }}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div class="">
                                <ul class="flex justify-center">
                                  Fichiers:
                                  <li class="text-base font-medium text-primary" v-for="(file, index) in responses[question.id]?.preuves" :key="index">{{ file.name }}</li>
                                </ul>
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
