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
import { computed } from "vue";
import { getAllErrorMessages } from "@/utils/gestion-error";

const TYPE_ORGANISATION = "organisation";

const route = useRoute();

const payload = reactive({
  organisationId: "",
  formulaireDeGouvernanceId: "",
  factuel: {
    comite_members: [],
    response_data: [],
  },
});
const responses = reactive({});
const formData = reactive({});
const formDataFactuel = ref([]);
const formulaireFactuel = ref({});
const isOrganisation = ref(false);
const isLoading = ref(false);
const showModal = ref(false);
const showModalPreview = ref(false);
const isValidate = ref(true);
const isLoadingDataFactuel = ref(true);
const currentPage = ref(0);
const currentMember = ref({
  nom: "",
  prenom: "",
  contact: null,
});
const idEvaluation = ref("");
const sources = ref([]);

const getDataFormFactuel = async () => {
  try {
    const { data } = await EvaluationService.findEvaluation(idEvaluation.value);
    formDataFactuel.value = data.data;
    payload.formulaireDeGouvernanceId = formDataFactuel.value.formulaire_factuel_de_gouvernance;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataFactuel.value = false;
  }
};
const getSource = async () => {
  try {
    const { data } = await EvaluationService.getSource();
    sources.value = data.data;
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
const submitData = async () => {
  // Convertir `responses` en tableau et l'affecter à `payload.factuel.response_data`
  payload.factuel.response_data = Object.values(responses);
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
    toast.success(`${result.data.message}`);
  } catch (e) {
    console.error(e);
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};
function removeNullSourceDeVerificationId() {
  payload.factuel.response_data.forEach((item) => {
    if (item.sourceDeVerificationId === "null") {
      delete item.sourceDeVerificationId;
    }
  });
}
const initializeFormData = () => {
  // Initialisation des réponses
  formulaireFactuel.value.categories_de_gouvernance.forEach((typeGouvernance) => {
    typeGouvernance.categories_de_gouvernance.forEach((principe) => {
      principe.categories_de_gouvernance.forEach((critere) => {
        critere.questions_de_gouvernance.forEach((question) => {
          responses[question.id] = {
            questionId: question.id,
            optionDeReponseId: "default",
            sourceDeVerificationId: sources.value[0].id,
            sourceDeVerification: "",
            preuves: [],
          };
        });
      });
    });
  });
};
const handleFileUpload = (event, questionIndex) => {
  const files = Array.from(event.target.files);
  responses[questionIndex].preuves = files; // Store files directly as an array of File objects
};
const changePage = (pageNumber) => {
  currentPage.value = pageNumber;
};
const prevPage = () => {
  if (currentPage.value >= 1) {
    currentPage.value--;
  }
};
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
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
const findSource = (id) => {
  if (sources) {
    const source = sources.value.find((source) => source.id === id);
    return source ? source.intitule : null;
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

const totalPages = computed(() => {
  if (formulaireFactuel.value.categories_de_gouvernance) {
    return formulaireFactuel.value.categories_de_gouvernance.length;
  } else {
    return 0;
  }
});
const isPreview = computed(() => currentPage.value === totalPages.value - 1);

// watch(
//   formData,
//   (newValue) => {
//     localStorage.setItem("formData", JSON.stringify(newValue));
//   },
//   { deep: true }
// );

onMounted(async () => {
  idEvaluation.value = route.query.e;
  await getSource();
  await getDataFormFactuel();
  // await getcurrentUserAndFetchOrganization();
  findFormulaireFactuel();
  initializeFormData();
});
</script>
<template>
  <div v-if="!isLoadingDataFactuel" class="">
    <div v-if="formDataFactuel.id" class="w-full p-4 font-bold text-center text-white uppercase rounded bg-primary">{{ formDataFactuel.intitule }}</div>
    <div v-if="formDataFactuel.organisations" class="flex items-center justify-between mt-5">
      <div class="min-w-[250px]">
        <button class="btn btn-primary" @click="showModal = true">Ajouter membres</button>
        <div v-if="payload.factuel.comite_members.length > 0" class="mt-3 space-y-1">
          <label class="text-lg form-label">Membres</label>
          <ul class="space-y-2">
            <li class="text-base text-primary" v-for="(member, index) in payload.factuel.comite_members" :key="index">{{ member.nom }} {{ member.prenom }} - {{ member.contact }}</li>
          </ul>
        </div>
      </div>
      <div class="min-w-[250px] flex items-center gap-3">
        <label class="form-label">Organisations</label>
        <TomSelect v-model="payload.organisationId" :options="{ placeholder: 'Selectionez une organisation' }" class="w-full">
          <option value=""></option>
          <option v-for="(ong, index) in formDataFactuel.organisations" :key="index" :value="ong.id">{{ ong.nom }}</option>
        </TomSelect>
      </div>
    </div>
    <div>
      <div class="py-5 intro-x" v-if="formDataFactuel.id">
        <div class="space-y-8">
          <!-- v-for type_gouvernance -->
          <div v-show="currentPage === typeGouvernanceIndex" v-for="(typeGouvernance, typeGouvernanceIndex) in formulaireFactuel.categories_de_gouvernance" :key="typeGouvernanceIndex" class="transition-all">
            <h1 class="mb-5 text-2xl font-semibold text-gray-800">{{ typeGouvernance.nom }}</h1>
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
                              <div class="flex flex-col items-center justify-center w-full gap-3">
                                <!-- v-for Option -->
                                <div class="inline-flex flex-wrap items-center gap-3">
                                  <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}`" class="form-check-input" type="hidden" :name="`${question.id}`" value="default" v-model="responses[question.id].optionDeReponseId" />
                                  <div v-for="(option, optionIndex) in formulaireFactuel.options_de_reponse" :key="optionIndex">
                                    <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}${optionIndex}`" class="form-check-input" type="radio" :name="`${question.id}-${question.slug}`" :value="option.id" v-model="responses[question.id].optionDeReponseId" />
                                    <label class="text-base form-check-label" :for="`radio${question.id}${optionIndex}`">
                                      {{ option.libelle }}
                                    </label>
                                  </div>
                                </div>
                                <div class="flex items-center gap-3">
                                  <div class="flex items-center gap-3" v-if="responses[question.id].sourceDeVerificationId === 'null'">
                                    <label class="">Autre source</label>
                                    <input type="text" required class="form-control" v-model="responses[question.id].sourceDeVerification" placeholder="Autre source" />
                                  </div>
                                  <div v-else class="flex items-center gap-3">
                                    <label class="">Source</label>
                                    <div class="min-w-[230px]">
                                      <TomSelect v-if="responses[question.id]?.sourceDeVerificationId" :options="{ placeholder: 'Sélectionnez une source' }" class="w-full" v-model="responses[question.id].sourceDeVerificationId">
                                        <option v-for="(source, indexSource) in sources" :key="indexSource" :value="source.id">{{ source.intitule }}</option>
                                        <option value="null">Autre Source</option>
                                      </TomSelect>
                                    </div>
                                  </div>
                                  <div>
                                    <input type="file" :id="question.id" multiple :ref="question.id" @change="handleFileUpload($event, question.id)" />
                                  </div>
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
          <VButton v-if="isPreview" label="Prévisualiser" class="px-8 py-3 w-max" @click="openPreview" />
        </div>
        <div class="flex justify-center gap-3 my-8">
          <button @click="prevPage()" class="px-4 py-3 btn btn-outline-primary">Précedent</button>
          <button v-for="(item, index) in totalPages" @click="changePage(index)" :class="index === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn" :key="index">{{ index + 1 }}</button>
          <button @click="nextPage()" class="px-4 py-3 btn btn-outline-primary">Suivant</button>
        </div>
      </div>
    </div>
  </div>
  <LoaderSnipper v-else />

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
          <label for="contact" class="form-label">Contact</label>
          <input id="contact" type="number" required v-model.number="currentMember.contact" class="form-control" placeholder="Contact" />
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
  <Modal backdrop="static" size="modal-xl" :show="showModalPreview" @hidden="resetValidation">
    <div class="mb-5">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Validation formulaire</h2>
      </ModalHeader>

      <ModalBody class="space-y-5">
        <p>Organisation: {{ findOrganisation(payload.organisationId) }}</p>
        <div v-if="payload.factuel.comite_members.length > 0" class="mt-3 space-y-1">
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
                                    Réponse : <span class="text-primary"> {{ findResponse(responses[question.id].optionDeReponseId) }}</span>
                                  </p>
                                </div>
                                <div class="flex items-center gap-3">
                                  <div class="flex items-center gap-3" v-if="responses[question.id].sourceDeVerificationId === 'others'">
                                    <p class="text-base font-medium">
                                      Autre source: <span class="text-primary">{{ responses[question.id].sourceDeVerification }}</span>
                                    </p>
                                  </div>
                                  <div v-else class="flex items-center gap-3">
                                    <p class="text-base font-medium">
                                      Source : <span class="text-primary">{{ findSource(responses[question.id].sourceDeVerificationId) }}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div class="">
                                <ul class="flex justify-center">
                                  Fichiers:
                                  <li class="text-base font-medium text-primary" v-for="(file, index) in responses[question.id].preuves" :key="index">{{ file.name }}</li>
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
