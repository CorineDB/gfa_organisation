<script setup>
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { reactive } from "vue";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import OngService from "../../services/modules/ong.service";
import AuthService from "@/services/modules/auth.service";
import InputForm from "@/components/news/InputForm.vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

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
  payload.factuel.response_data = Object.values(responses);
  const formData = new FormData();

  // Function to append data, including handling arrays, objects, and files
  const appendFormData = (data, root = "") => {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        appendFormData(item, `${root}[${index}]`);
      });
    } else if (data instanceof Object && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        appendFormData(data[key], root ? `${root}[${key}]` : key);
      });
    } else {
      formData.append(root, data);
    }
  };

  // Append non-file data from payload to FormData
  appendFormData(payload);

  // Manually add files to FormData from `responses`
  payload.factuel.response_data.forEach((response, questionIndex) => {
    if (response.preuves) {
      response.preuves.forEach((file, fileIndex) => {
        formData.append(`factuel[response_data][${questionIndex}][preuves][${fileIndex}]`, file);
      });
    }
  });

  try {
    const result = await EvaluationService.submitSumission(idEvaluation.value, formData);
    toast.success(`${result.data.message}`);
  } catch (e) {
    console.error(e);
    toast.error("Erreur pour la collecte des données");
  }

  console.log("payload:", payload);
};

// const submitData = async () => {
//   // isLoading.value = true;
//   // filterFormData();
//   // const response = {
//   //   factuel: Object.keys(formData).map((indicateurId) => ({
//   //     indicateurDeGouvernanceId: indicateurId,
//   //     optionDeReponseId: formData[indicateurId].selectedOption,
//   //     source: formData[indicateurId].source,
//   //   })),
//   // };
//   payload.factuel.response_data = Object.values(responses);
//   console.log("response:", payload.factuel.response_data);
//   const formData = new FormData();
//   await EvaluationService.submitSumission(idEvaluation.value, formData.append(payload))
//     .then((result) => {
//       // payload.response_data = [];
//       toast.success(`${result.data.message}`);
//     })
//     .catch((e) => {
//       console.error(e);
//       // payload.response_data = [];
//       toast.error("Erreur pour la collecte des données");
//     })
//     .finally(() => {
//       // isLoading.value = false;
//     });

//   console.log("payload:", payload);
// };
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
            // sourceDeVerification: "",
            preuves: [],
          };
        });
      });
    });
  });
};
const handleFileUpload = (event, questionIndex) => {
  const files = Array.from(event.target.files);
  responses[questionIndex].preuves = files.map((file) => {
    const formData = new FormData();
    formData.append("file", file); // Ajoute le fichier à FormData
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Vous pouvez aussi ajouter d'autres informations si nécessaire
    // formData.append('questionIndex', questionIndex);

    return {
      formData, // Enregistre le FormData pour chaque fichier
    };
  });
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
    if (!formData[key].selectedOption) {
      delete formData[key]; // Supprime l'objet si 'selectedOption' est vide
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

const response_data = computed(() => Object.values(responses));
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
  idEvaluation.value = route.query.evaluation;
  await getDataFormFactuel();
  await getSource();
  // await getcurrentUserAndFetchOrganization();
  findFormulaireFactuel();
  initializeFormData();
});
</script>
<template>
  <div class="w-full p-4 font-bold text-center text-white uppercase rounded bg-primary">{{ formDataFactuel.intitule }}</div>
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
        <option v-for="(ong, index) in formDataFactuel.organisations" :key="index" :value="ong.id">{{ ong.nom }}</option>
      </TomSelect>
    </div>
  </div>
  <div>
    <div v-if="!isLoadingDataFactuel" class="py-5 intro-x">
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
                                <div class="flex items-center gap-3" v-if="responses[question.id].sourceDeVerificationId === 'others'">
                                  <label class="">Autre source</label>
                                  <input type="text" required class="form-control" v-model="responses[question.id].sourceDeVerificationId" placeholder="Autre source" />
                                </div>
                                <div v-else class="flex items-center gap-3">
                                  <label class="">Source</label>
                                  <div class="min-w-[230px]">
                                    <TomSelect v-if="responses[question.id]?.sourceDeVerificationId" :options="{ placeholder: 'Sélectionnez une source' }" class="w-full" v-model="responses[question.id].sourceDeVerificationId">
                                      <option v-for="(source, indexSource) in sources" :key="indexSource" :value="source.id">{{ source.intitule }}</option>
                                      <option value="others">Autre Source</option>
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
        <VButton v-if="isPreview" label="Prévualiser" class="px-8 py-3 w-max" :loading="isLoading" @click="submitData" />
      </div>
      <div class="flex justify-center gap-3 my-8">
        <button @click="prevPage()" class="px-4 py-3 btn btn-outline-primary">Précedent</button>
        <button v-for="(item, index) in totalPages" @click="changePage(index)" :class="index === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn" :key="index">{{ index + 1 }}</button>
        <button @click="nextPage()" class="px-4 py-3 btn btn-outline-primary">Suivant</button>
      </div>
    </div>
    <LoaderSnipper v-else />
  </div>

  <!-- BEGIN: Modal Content -->
  <Modal :show="showModal" @hidden="showModal = false">
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
</template>
