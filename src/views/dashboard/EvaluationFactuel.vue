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
            sourceDeVerificationId: sources.value.length > 0 ? question.reponse_de_la_collecte?.sourceDeVerificationId ?? sources.value[0]?.id : null,
            sourceDeVerification: question.reponse_de_la_collecte?.sourceDeVerification ?? " ",
            // description: findResponse2(question.reponse_de_la_collecte?.optionDeReponseId) == "partiellement" ? "" : undefined,
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
    if (data.optionDeReponseId === "null" || (findResponse2(data.optionDeReponseId) === "oui" && data.preuves.length === 0)) {
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
});

const hasInvalidResponses = (principe) => {
  return principe.categories_de_gouvernance.some((critere) =>
    critere.questions_de_gouvernance.some((question) =>
      invalidResponses.value.some((response) => response.questionId === question.id)
    )
  );
};

const hasInvalidResponsesForCritere = (critere) => {
  return critere.questions_de_gouvernance.some((question) =>
    invalidResponses.value.some((response) => response.questionId === question.id)
  );
};
</script>
<template>
  <!-- <div v-if="findQuestionDetails" class="p-4 bg-white shadow-lg rounded-lg border border-gray-200 my-3">
      <p class="my-3">Il vous reste {{ invalidResponses.length }} question{{ invalidResponses.length > 1 ? "s" : "" }} à compléter pour terminer le formulaire.</p>

      <h2 class="text-lg font-semibold text-gray-800">Détail de la question en attente de réponse</h2>
      <p class="mt-2 text-gray-600"><span class="font-semibold">Type de gouvernance :</span> {{ findQuestionDetails.nom_typeGouvernance }}</p>
      <p class="mt-1 text-gray-600"><span class="font-semibold">Principe de gouvernance :</span> {{ findQuestionDetails.nom_principe }}</p>
      <p class="mt-1 text-gray-600"><span class="font-semibold">Critère :</span> {{ findQuestionDetails.nom_critere }}</p>

      <p class="mt-1 text-gray-600"><span class="font-semibold">Question :</span> {{ findQuestionDetails.nom_question }}</p>
    </div> -->
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
                  <AccordionGroup class="border-primary">
                    <AccordionItem v-for="(principe, principeIndex) in typeGouvernance.categories_de_gouvernance" :key="principeIndex">
                      <Accordion :class="hasInvalidResponses(principe) ? 'bg-danger' : 'bg-primary'" class="text-xl !px-4 font-semibold !text-white flex items-center justify-between">
                        <h2>{{ principe.nom }}</h2>
                        <ChevronDownIcon />
                      </Accordion>
                      <AccordionPanel class="!px-8 !shadow-md !bg-white !py-6">
                        <!-- v-for Critere -->
                        <AccordionGroup class="space-y-2">
                          <AccordionItem v-for="(critere, critereIndex) in principe.categories_de_gouvernance" :key="critereIndex" class="!px-0">
                            <Accordion class="text-xl !p-4 font-semibold !text-white flex items-center justify-between" :class="hasInvalidResponsesForCritere(critere) ? 'bg-danger' : 'bg-primary/90'" >
                              <h2>{{ critere.nom }}</h2>
                              <ChevronDownIcon />
                            </Accordion>
                            <!-- v-for Indicateur -->
                            <AccordionPanel class="!border-none pt-1">
                              <div v-for="(question, questionIndex) in critere.questions_de_gouvernance" :key="questionIndex" class="relative px-4 pt-2 my-3 transition-all">
                                <div class="p-2 py-3 space-y-2 border-l-8 border-yellow-500 rounded shadow box">
                                  <p class="w-full text-lg font-semibold text-center text-primary">{{ questionIndex + 1 }} - {{ question.nom }}</p>
                                  <div class="flex flex-col items-center justify-center w-full gap-3">
                                    <!-- v-for Option -->
                                    <div class="inline-flex flex-wrap items-center gap-3">
                                      <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}`" class="form-check-input" type="hidden" :name="`${question.id}`" value="null" v-model="responses[question.id].optionDeReponseId" />
                                      <div v-for="(option, optionIndex) in formulaireFactuel.options_de_reponse" :key="optionIndex">
                                        <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}${optionIndex}`" class="form-check-input" type="radio" :name="`${question.id}-${question.slug}`" :value="option.id" v-model="responses[question.id].optionDeReponseId" />
                                        <label class="text-base form-check-label" :for="`radio${question.id}${optionIndex}`">
                                          {{ option.libelle }}
                                        </label>
                                      </div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                      <div class="flex items-center gap-3" v-if="responses[question.id]?.sourceDeVerificationId === 'null' && !findResponse2(responses[question.id].optionDeReponseId) == 'partiellement'">
                                        <label class="">Autre source</label>
                                        <input type="text" required class="form-control" v-model="responses[question.id].sourceDeVerification" placeholder="Autre source" />
                                      </div>
                                      <!-- <div class="flex items-center gap-3" v-if="responses[question.id]?.sourceDeVerificationId === null">
                                        <label class="">Autre source</label>
                                        <input type="text" required class="form-control" v-model="responses[question.id].sourceDeVerification" placeholder="Autre source" />
                                      </div> -->
                                      <div v-else-if="responses[question.id]?.sourceDeVerificationId !== null && findResponse2(responses[question.id].optionDeReponseId) == 'oui'" class="flex items-center gap-3">
                                        <label class="">Source</label>
                                        <!-- <pre>{{ responses[question.id] }}</pre> -->
                                        <div class="min-w-[230px]">
                                          <TomSelect v-if="responses[question.id]?.sourceDeVerificationId" :options="{ placeholder: 'Sélectionnez une source' }" class="w-full" v-model="responses[question.id].sourceDeVerificationId">
                                            <option v-for="(source, indexSource) in sources" :key="indexSource" :value="source.id">{{ source.intitule }}</option>
                                            <option value="null">Autre Source</option>
                                          </TomSelect>
                                        </div>
                                      </div>
                                      <div v-if="findResponse2(responses[question.id].optionDeReponseId) == 'oui'">
                                        <input type="file" :id="question.id" multiple :ref="question.id" @change="handleFileUpload($event, question.id)" />
                                      </div>
                                      <div class="flex-1" v-if="findResponse2(responses[question.id].optionDeReponseId) == 'partiellement'">
                                        <label class="form-label" for="description">Description</label>
                                        <div class="">
                                          <textarea name="description" class="form-control" id="description" v-model="payload.description" cols="30" rows="3"></textarea>
                                          <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <!-- Display uploaded files -->
                                  <div v-if="responsesFiles[question.id]?.preuvesFiles.length" class="flex flex-wrap items-center gap-3 mt-2">
                                    <p class="text-sm font-bold">Fichiers:</p>

                                    <span class="flex items-center px-2 py-1 text-blue-500 truncate bg-white rounded-full shadow-md max-w-[200px]" v-for="(file, index) in responsesFiles[question.id]?.preuvesFiles" :key="index">
                                      <a :href="file.url" target="_blank" rel="noopener noreferrer" class="truncate max-w-[200px]">
                                        {{ file.nom }}
                                      </a>
                                    </span>
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
        <!-- <p>Organisation:  {{ findOrganisation(payload.organisationId) }}</p> -->
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
                                  <div class="flex items-center gap-3" v-if="!responses[question.id]?.sourceDeVerificationId === 'oui'">
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
                              <div v-if="responses[question.id]?.sourceDeVerificationId === 'oui'" class="">
                                <ul class="flex justify-center">
                                  Fichiers:
                                  <li class="text-base font-medium text-primary" v-for="(file, index) in responses[question.id]?.preuves" :key="index">{{ file.name }}</li>
                                </ul>
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
