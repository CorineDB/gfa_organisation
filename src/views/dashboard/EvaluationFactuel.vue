<script setup>
import { onMounted, ref, watch , getCurrentInstance } from "vue";
import { reactive } from "vue";
//import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import EvaluationService from "@/services/modules/enquetes_de_gouvernance/evaluation.gouvernance.service";
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

//vérifier numéro de téléphone
const { proxy } = getCurrentInstance();

const isValid = computed(() => {
  // Convertir en chaîne et supprimer les espaces
  const contactValue = currentMember.value.contact ? String(currentMember.value.contact).trim() : "";
  
  // Vérifier que le contact n'est pas vide
  if (!contactValue) {
    return false;
  }
  
  // Vérifier que le contact contient entre 8 et 13 chiffres
  if (!/^\d{8,13}$/.test(contactValue)) {
    return false;
  }
  
  // Vérifier avec libphonenumber-js pour le format du pays (BJ = Bénin)
  return proxy.$isValidPhoneNumber(contactValue, "BJ");
});


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
const isEdit = ref(false);
const currentIndex = ref(null);

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
  contact: "",
});
const tempMembers = ref([]);
const sources = ref([]);
const errors = ref({});
const memberFormErrors = ref({});

// Computed pour l'erreur des membres - réactif
const membersError = computed(() => {
  if (!payload.factuel.comite_members || payload.factuel.comite_members.length === 0) {
    return ["Veuillez ajouter au moins un membre au comité avant de valider."];
  }
  return null;
});

const getDataFormFactuel = async () => {
  try {
    const { data } = await EvaluationService.getFactuelFormEvaluation(token);

    showAlertValidate.value = data.data.terminer;
    if (!showAlertValidate.value) {
      formDataFactuel.value = data.data;

      formulaireFactuel.value = formDataFactuel.value.formulaire_de_gouvernance;
      //payload.formulaireDeGouvernanceId = formDataFactuel.value.formulaire_de_gouvernance.soumissionId;
      payload.formulaireDeGouvernanceId = formulaireFactuel.value.id;
      payload.soumissionId = formDataFactuel.value.formulaire_de_gouvernance.soumissionId;
      idEvaluation.value = formDataFactuel.value.id;
      initializeFormData();
      getFilesFormData();
    } else {
      if (data.statutCode == 206) {
        router.push({ name: "DetailSoumission", params: { e: data.data.idEvaluation, s: data.data.idSoumission }, query: { type: "factuel" } });
      }
    }
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataFactuel.value = false;
  }
};

const getSource = async () => {
  try {
    const { data } = await EvaluationService.getEnqueteSource();
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

const finalSubmit = () => {
  // Vérifier qu'il y a au moins un membre avant la soumission
  if (!payload.factuel.comite_members || payload.factuel.comite_members.length === 0) {
    toast.error("Veuillez ajouter au moins un membre au comité avant de valider.");
    openMemberModal(); // Ouvrir le modal d'ajout de membre avec réinitialisation des erreurs
    return;
  }

  isValidate.value = true;
  submitAnsweredQuestionsOnly();
  //submitData();
};

const submitData = async () => {
  // Ne réinitialiser les erreurs que lors de la validation finale
  if (isValidate.value) {
    errors.value = {}; // Réinitialiser complètement lors de la validation finale
  }
  // Pour les soumissions partielles, les erreurs seront mergées dans le catch

  if (payload.factuel.response_data.length > 0) {
    const formData = new FormData();

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

    const action = isValidate.value ? EvaluationService.validateFactuelSoumission(idEvaluation.value, formData) : EvaluationService.submitFactuelSoumission(idEvaluation.value, formData);

    try {
      const result = await action;

      if (result.statutCode == 206) {
        router.push({ name: "DetailSoumission", params: { e: idEvaluation.value, s: result.data.soumission.id }, query: { type: "factuel" } });
      }

      // payload.soumissionId = result.data.data.id;

      if (isValidate.value) {
        toast.success(`${result.data.message}`);
        generatevalidateKey("factuel");
        showAlertValidate.value = true;
        showModalPreview.value = false;

        localStorage.removeItem("member");
        payload.factuel.comite_members = [];
      }
    } catch (e) {
      console.error(e);

      // Gestion des erreurs avec la structure d'objet erreur
      if (e.response && e.response.data) {
        const errorData = e.response.data;

        // Afficher le message d'erreur principal
        if (errorData.message) {
          toast.error(errorData.message);
        }

        // Afficher les erreurs supplémentaires si elles existent dans le tableau
        if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorData.errors.forEach((error) => {
            toast.error(error);
          });
        }

        // Gérer les erreurs de validation (422) avec objet d'erreurs
        if (e.response.status === 422 && typeof errorData.errors === 'object' && !Array.isArray(errorData.errors)) {
          // VERSION ORIGINALE : errors.value = errorData.errors;
          // NOUVELLE LOGIQUE : Merger les erreurs pour les soumissions partielles
          if (isValidate.value) {
            // Validation finale : remplacer toutes les erreurs
            errors.value = errorData.errors;
          } else {
            // Soumission partielle : merger les nouvelles erreurs avec les anciennes
            errors.value = { ...errors.value, ...errorData.errors };
          }

          // Cacher le preview si les erreurs concernent response_data
          if (isValidate.value) {
            const hasFormErrors = Object.keys(errors.value).some(key => key.startsWith('factuel.response_data'));
            if (hasFormErrors) {
              showModalPreview.value = false;
            }
          }
        }
      } else {
        // Erreur générique si pas de structure de réponse
        toast.error("Une erreur est survenue lors de la soumission.");
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
  // Initialisation des réponses avec préservation des données existantes
  formulaireFactuel.value.categories_de_gouvernance.forEach((typeGouvernance) => {
    typeGouvernance.categories_de_gouvernance.forEach((principe) => {
      principe.categories_de_gouvernance.forEach((critere) => {
        critere.questions_de_gouvernance.forEach((question) => {
          const existingResponse = question.reponse_de_la_collecte;

          // Normaliser les données de source selon les règles métier
          const normalizedSources = normalizeSourceData(existingResponse);

          responses[question.id] = {
            questionId: question.id,
            optionDeReponseId: existingResponse?.optionDeReponseId ?? null,
            sourceDeVerificationId: normalizedSources.sourceDeVerificationId,
            sourceDeVerification: normalizedSources.sourceDeVerification,
            description: existingResponse?.description ?? (findResponse2(existingResponse?.optionDeReponseId) === "partiellement" ? "" : ""),
            preuves: [], // Nouvelles preuves ajoutées par l'utilisateur
            existingProofs: existingResponse?.preuves ?? [], // Preuves existantes du chargement
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
          const existingProofs = question.reponse_de_la_collecte?.preuves ?? [];

          responsesFiles[question.id] = {
            preuvesFiles: existingProofs,
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
};
const changePage = (pageNumber) => {
  isValidate.value = false;
  submitAnsweredQuestionsOnly();
  //submitData();
  currentPage.value = pageNumber;
};
const prevPage = () => {
  if (currentPage.value >= 1) {
    isValidate.value = false;
    currentPage.value--;
    submitAnsweredQuestionsOnly();
    // submitData();
  }
};

const getSourceName = (sourceId, sources) => {
  const source = sources.find((source) => source.id === sourceId);
  return source ? source.intitule : null;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    // Utiliser la nouvelle fonction de sauvegarde sélective
    submitAnsweredQuestionsOnly();
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

function validateMemberForm() {
  memberFormErrors.value = {};

  if (!currentMember.value.nom || currentMember.value.nom.trim() === "") {
    memberFormErrors.value.nom = ["Le nom est requis."];
  }

  if (!currentMember.value.prenom || currentMember.value.prenom.trim() === "") {
    memberFormErrors.value.prenom = ["Le prénom est requis."];
  }

  // Ensure contact is treated as a string for validation
  const contactValue = currentMember.value.contact ? String(currentMember.value.contact).trim() : "";

  if (!contactValue) {
    memberFormErrors.value.contact = ["Le contact est requis."];
  } else if (!/^\d{8,13}$/.test(contactValue)) {
    memberFormErrors.value.contact = ["Le contact doit contenir entre 8 et 13 chiffres."];
  }

  return Object.keys(memberFormErrors.value).length === 0;
}

function addMembers() {
  if (!validateMemberForm()) {
    toast.error("Veuillez corriger les erreurs dans le formulaire.");
    return;
  }

  tempMembers.value.push({ ...currentMember.value });
  currentMember.value = { nom: "", prenom: "", contact: "" };
  memberFormErrors.value = {}; // Réinitialiser les erreurs après ajout réussi
  toast.success("Membre ajouté avec succès !");
  // Ne pas fermer le modal pour permettre l'ajout de plusieurs membres
}

function addMemberAndClose() {
  if (!validateMemberForm()) {
    toast.error("Veuillez corriger les erreurs dans le formulaire.");
    return;
  }

  tempMembers.value.push({ ...currentMember.value });
  saveAllMembers();
  showModal.value = false;
  currentMember.value = { nom: "", prenom: "", contact: "" };
  memberFormErrors.value = {}; // Réinitialiser les erreurs
  toast.success("Membres ajoutés avec succès !");
}

function saveAllMembers() {
  if (tempMembers.value.length > 0) {
    payload.factuel.comite_members.push(...tempMembers.value);
    tempMembers.value = [];
  }
}

function removeTempMember(index) {
  tempMembers.value.splice(index, 1);
  toast.info("Membre retiré de la liste temporaire.");
}

function saveMembers() {
  if (isEdit.value) {
    updateMember();
  } else {
    // Si des membres ont déjà été ajoutés à tempMembers, on peut enregistrer directement
    if (tempMembers.value.length > 0) {
      // Vérifier si le formulaire actuel est rempli
      const currentFormFilled = currentMember.value.nom || currentMember.value.prenom || currentMember.value.contact;
      
      if (currentFormFilled) {
        // Si le formulaire actuel est partiellement rempli, valider avant d'ajouter
        if (!validateMemberForm()) {
          toast.error("Veuillez corriger les erreurs dans le formulaire ou le vider avant d'enregistrer.");
          return;
        }
        // Ajouter le membre actuel à la liste temporaire
        tempMembers.value.push({ ...currentMember.value });
      }
      
      // Enregistrer tous les membres temporaires
      saveAllMembers();
      showModal.value = false;
      currentMember.value = { nom: "", prenom: "", contact: "" };
      memberFormErrors.value = {};
      toast.success("Membres ajoutés avec succès !");
    } else {
      // Aucun membre dans tempMembers, on doit valider le formulaire actuel
      addMemberAndClose();
    }
  }
}

function openMemberModal() {
  memberFormErrors.value = {}; // Réinitialiser les erreurs
  isEdit.value = false;
  currentMember.value = { nom: "", prenom: "", contact: "" };
  tempMembers.value = [];
  showModal.value = true;
}

function closeModalWithoutSaving() {
  showModal.value = false;
  tempMembers.value = [];
  currentMember.value = { nom: "", prenom: "", contact: "" };
  memberFormErrors.value = {};
}

function editMember(member, index) {
  memberFormErrors.value = {}; // Réinitialiser les erreurs
  isEdit.value = true;
  currentIndex.value = index;
  showModal.value = true;
  currentMember.value = {
    nom: member.nom,
    prenom: member.prenom,
    contact: member.contact,
  };
}

// Fonction pour supprimer un membre
const deleteMember = (index) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
    payload.factuel.comite_members.splice(index, 1)
  }
}

function updateMember() {
  payload.factuel.comite_members[currentIndex.value] = { ...currentMember.value };
  showModal.value = false;
  isEdit.value = false;
  currentIndex.value = null;
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
  if (!invalidResponses.value.length) {
    return null;
  }

  const questionId = invalidResponses.value[0].index;

  for (const type_gouvernance of formulaireFactuel.value.categories_de_gouvernance || []) {
    for (const principe of type_gouvernance.categories_de_gouvernance || []) {
      for (const critere of principe.categories_de_gouvernance || []) {
        for (const question of critere.questions_de_gouvernance || []) {
          if (question.id === questionId) {
            const result = {
              nom_typeGouvernance: type_gouvernance.nom,
              nom_principe: principe.nom,
              nom_critere: critere.nom,
              nom_question: question.nom,
            };
            return result;
          }
        }
      }
    }
  }

  return null;
});

const findResponse2 = (id) => {
  if (formulaireFactuel.value.options_de_reponse) {
    const response = formulaireFactuel.value.options_de_reponse.find((response) => response.id === id);
    return response ? response.slug : null;
  }

  return "";
};

const handleResponseChange = (questionId, optionId) => {
  const responseSlug = findResponse2(optionId);

  if (responseSlug === "partiellement" || responseSlug === "non") {
    // Vider les fichiers quand la réponse est "Partiellement" ou "Non"
    if (responses[questionId]) {
      responses[questionId].preuves = [];
      responses[questionId].sourceDeVerificationId = "";
      responses[questionId].sourceDeVerification = "";
    }
  } else if (responseSlug === "oui") {
    // Pour "oui", préserver les preuves existantes si elles existent
    const question = findQuestionById(questionId);
    if (question?.reponse_de_la_collecte?.preuves && responses[questionId].preuves.length === 0) {
      responses[questionId].preuves = question.reponse_de_la_collecte.preuves;
    }
  }
};

// Fonction pour normaliser les données de source selon les règles métier
const normalizeSourceData = (existingResponse) => {
  // Si sourceDeVerification contient du texte → sourceDeVerificationId = "autre"
  if (existingResponse?.sourceDeVerification && existingResponse.sourceDeVerification.trim() !== "") {
    return {
      sourceDeVerificationId: "autre",
      sourceDeVerification: existingResponse.sourceDeVerification,
    };
  }

  // Sinon, utiliser les valeurs existantes
  return {
    sourceDeVerificationId: existingResponse?.sourceDeVerificationId ?? "",
    sourceDeVerification: existingResponse?.sourceDeVerification ?? "",
  };
};

// Fonction helper pour trouver une question par ID
const findQuestionById = (questionId) => {
  for (const typeGouvernance of formulaireFactuel.value.categories_de_gouvernance || []) {
    for (const principe of typeGouvernance.categories_de_gouvernance || []) {
      for (const critere of principe.categories_de_gouvernance || []) {
        for (const question of critere.questions_de_gouvernance || []) {
          if (question.id === questionId) {
            return question;
          }
        }
      }
    }
  }
  return null;
};

// Fonction helper pour valider les sources selon les règles métier
const hasValidSource = (data) => {
  if (data.sourceDeVerificationId === "autre") {
    return data.sourceDeVerification && data.sourceDeVerification.trim() !== "";
  } else {
    return data.sourceDeVerificationId && data.sourceDeVerificationId !== "" && data.sourceDeVerificationId !== "autre";
  }
};

const submitAnsweredQuestionsOnly = async () => {
  // VERSION ORIGINALE : errors.value = {}; // Réinitialiser les erreurs avant chaque soumission
  // NOUVELLE LOGIQUE : Ne réinitialiser les erreurs que lors de la validation finale
  if (isValidate.value) {
    errors.value = {}; // Réinitialiser complètement lors de la validation finale
  }
  // Pour les soumissions partielles, les erreurs seront mergées dans le catch

  // Étape 1 : Filtrage initial des réponses (réponses non-null et non-vides)

  // Si c'est une validation finale, soumettre toutes les questions
  const allQuestions = Object.values(responses);

  const answeredQuestions = isValidate.value
    ? allQuestions
    : allQuestions.filter((response) => {
        const hasAnswer = response.optionDeReponseId !== null && response.optionDeReponseId !== "" && response.optionDeReponseId !== "null" && response.optionDeReponseId !== undefined;
        return hasAnswer;
      });

  // Étape 2 : Prendre toutes les réponses sans validation des règles métier
  const completeAnswers = answeredQuestions;

  // Étape 3 : Préparation du payload - exclure existingProofs
  payload.factuel.response_data = completeAnswers.map((answer) => {
    const { existingProofs, ...cleanedAnswer } = answer;
    return cleanedAnswer;
  });

  // Étape 4 : Sauvegarde conditionnelle
  if (payload.factuel.response_data.length > 0) {
    // Application de l'algorithme de validation des sources avant soumission
    const validatedResponseData = payload.factuel.response_data.map((response) => {
      const responseSlug = findResponse2(response.optionDeReponseId);

      if (responseSlug === "oui") {
        const validatedResponse = { ...response };

        if (response.sourceDeVerificationId === "autre") {
          if (response.sourceDeVerification && response.sourceDeVerification.trim() !== "" && response.sourceDeVerification !== " ") {
            validatedResponse.sourceDeVerificationId = null;
          }
        } else if (response.sourceDeVerificationId && response.sourceDeVerificationId !== "" && response.sourceDeVerificationId !== "autre") {
          validatedResponse.sourceDeVerification = null;
        } /* else if (!response.sourceDeVerificationId || response.sourceDeVerificationId === "") {
          validatedResponse.sourceDeVerificationId = null;
        } */

        return validatedResponse;
      }

      return response;
    });

    // Utiliser les données validées pour la soumission
    const originalResponseData = payload.factuel.response_data;
    payload.factuel.response_data = validatedResponseData;

    await submitData();

    // Restaurer les données originales après soumission pour ne pas impacter l'état
    payload.factuel.response_data = originalResponseData;
  } else {
  }
};

const invalidResponses = computed(() => {
  return Object.entries(responses).reduce((acc, [index, data]) => {
    // Utiliser le slug pour une détection robuste
    const responseSlug = findResponse2(data.optionDeReponseId);

    const isNullResponse = data.optionDeReponseId === "null" || data.optionDeReponseId === null;

    const hasValidProofs = (Array.isArray(data.preuves) && data.preuves.length > 0) || (Array.isArray(data.existingProofs) && data.existingProofs.length > 0);

    const hasValidSourceValidation = hasValidSource(data);

    const isOuiAndMissingProofOrSource = responseSlug === "oui" && (!hasValidProofs || !hasValidSourceValidation);

    const isPartiellementAndNoDescription = responseSlug === "partiellement" && (!data.description || data.description.trim() === "");

    const isInvalid = isNullResponse || isOuiAndMissingProofOrSource || isPartiellementAndNoDescription;

    if (isInvalid) {
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
  // submitAnsweredQuestionsOnly()
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

  if (localStorage.getItem("member")) {
    payload.factuel.comite_members = JSON.parse(localStorage.getItem("member"));
  } else {
    payload.factuel.comite_members = [];
  }

  // payload.factuel.comite_members = JSON.parse(localStorage.getItem("member"));

  await getDataFormFactuel();

  if (!showAlertValidate.value) {
    await getSource();

    initializeFormData();
  }

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

// Fonction pour trouver l'index réel d'une question dans response_data soumis
const getQuestionErrorIndex = (questionId) => {
  return payload.factuel.response_data.findIndex(response => response.questionId === questionId);
};

// Computed pour filtrer les erreurs générales (sans factuel.response_data)
const generalErrors = computed(() => {
  const filtered = {};
  Object.keys(errors.value).forEach(key => {
    if (!key.startsWith('factuel.response_data')) {
      filtered[key] = errors.value[key];
    }
  });
  return filtered;
});

// Fonction pour modifier une preuve existante
const editExistingProof = (questionId, index) => {
  // Créer un input file temporaire pour sélectionner le nouveau fichier
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Ajouter le nouveau fichier aux preuves à uploader
      if (!responses[questionId].preuves) {
        responses[questionId].preuves = [];
      }
      responses[questionId].preuves.push(file);

      // Supprimer l'ancienne preuve de la liste existante
      responses[questionId].existingProofs.splice(index, 1);

      toast.success('Fichier remplacé avec succès');
    }
  };

  input.click();
};

// Fonction pour supprimer une preuve existante
const deleteExistingProof = async (questionId, index) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette preuve ?')) {
    const file = responses[questionId].existingProofs[index];

    // Vérifier si le fichier a un ID pour la suppression côté serveur
    if (file.id) {
      try {
        isLoading.value = true;
        // Appel API pour supprimer le fichier côté serveur
        await EvaluationService.deleteProof(payload.soumissionId, file.id);

        // Supprimer de la liste locale après succès
        responses[questionId].existingProofs.splice(index, 1);
        toast.success('Preuve supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression de la preuve:', error);
        toast.error('Erreur lors de la suppression de la preuve');
      } finally {
        isLoading.value = false;
      }
    } else {
      // Si pas d'ID, suppression locale uniquement
      responses[questionId].existingProofs.splice(index, 1);
      toast.info('Preuve supprimée');
    }
  }
};

// Fonction pour modifier un nouveau fichier uploadé
const editNewProof = (questionId, index) => {
  // Créer un input file temporaire pour sélectionner le nouveau fichier
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Remplacer le fichier à l'index spécifié
      responses[questionId].preuves[index] = file;
      toast.success('Fichier remplacé avec succès');
    }
  };

  input.click();
};

// Fonction pour supprimer un nouveau fichier uploadé
const deleteNewProof = (questionId, index) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
    responses[questionId].preuves.splice(index, 1);
    toast.info('Fichier supprimé');
  }
};

// Fonction pour visualiser un nouveau fichier uploadé
const viewNewProof = (file) => {
  // Créer une URL temporaire pour le fichier
  const fileURL = URL.createObjectURL(file);
  // Ouvrir dans un nouvel onglet
  window.open(fileURL, '_blank');
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

  <!-- Section d'affichage des erreurs -->
  <div v-if="Object.keys(generalErrors).length > 0" class="p-4 bg-red-50 border border-red-200 rounded-lg my-3">
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
        <i class="fas fa-exclamation-triangle text-red-600 text-sm"></i>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-red-800 mb-2">Erreurs de validation</h3>
        <div class="space-y-2">
          <div v-for="(errorList, field) in generalErrors" :key="field" class="bg-white border border-red-100 rounded-lg p-3">
            <!-- <h4 class="font-medium text-red-700 mb-1">{{ field }}</h4> -->
            <ul class="space-y-1">
              <li v-for="(error, index) in errorList" :key="index" class="text-sm text-red-600 flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1.5"></i>
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!showModalPreview">
    <div class="flex justify-between my-4 items-center">
      <h2 class="text-lg font-medium intro-y">Evaluation factuel</h2>
      <button class="btn btn-primary" @click="router.go(-1)">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
    </div>

    <div v-if="!showAlertValidate" class="">
      <div v-if="!isLoadingDataFactuel" class="">
        <div v-if="formDataFactuel.id" class="w-full p-4 font-bold text-center text-white uppercase rounded bg-primary">{{ formDataFactuel.intitule }}</div>

        <div>
          <div class="py-5 intro-x overflow-y-scroll" v-if="formDataFactuel.id">
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
                                    <div class="space-y-4">
                                      <h4 class="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2 justify-center">
                                        <i class="fas fa-question-circle text-blue-500"></i>
                                        Sélectionnez votre réponse :
                                      </h4>

                                      <div class="space-y-3 text-center">
                                        <div v-for="(option, optionIndex) in formulaireFactuel.options_de_reponse" :key="optionIndex" class="inline-block ml-3">
                                          <input :id="`radio${question.id}${optionIndex}`" class="hidden" type="radio" :name="`question-${question.id}`" :value="option.id" v-model="responses[question.id].optionDeReponseId" @change="handleResponseChange(question.id, option.id)" />
                                          <label
                                            class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-md"
                                            :for="`radio${question.id}${optionIndex}`"
                                            :class="{
                                              'border-blue-600 bg-blue-50 shadow-md': responses[question.id]?.optionDeReponseId === option.id,
                                              'border-gray-200 hover:border-blue-300 hover:bg-blue-50': responses[question.id]?.optionDeReponseId !== option.id,
                                            }"
                                          >
                                            <div
                                              class="w-5 h-5 mr-4 border-2 rounded-full flex items-center justify-center transition-all duration-200"
                                              :class="{
                                                'border-blue-600 bg-blue-600': responses[question.id]?.optionDeReponseId === option.id,
                                                'border-gray-300': responses[question.id]?.optionDeReponseId !== option.id,
                                              }"
                                            >
                                              <div v-if="responses[question.id]?.optionDeReponseId === option.id" class="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
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

                                      <div v-if="errors['factuel.response_data.' + getQuestionErrorIndex(question.id) + '.optionDeReponseId']" class="my-2 text-danger text-center">
                                        {{ getFieldErrors(errors["factuel.response_data." + getQuestionErrorIndex(question.id) + ".optionDeReponseId"]) }}
                                      </div>
                                    </div>

                                    <!-- Section conditionnelle pour "Oui" -->
                                    <div v-if="findResponse2(responses[question.id].optionDeReponseId) === 'oui'" class="bg-green-50 border border-green-200 rounded-lg p-6 space-y-6">
                                      <div class="flex items-center gap-2 mb-4">
                                        <i class="fas fa-check-circle text-green-600"></i>
                                        <h5 class="text-lg font-semibold text-green-800">Informations complémentaires</h5>
                                      </div>

                                      <!-- Section Source -->
                                      <div class="space-y-3">
                                        <label class="block text-sm font-semibold text-gray-700"> <i class="fas fa-link mr-2 text-blue-500"></i>Source de vérification </label>
                                        <div class="relative">
                                          <TomSelect :options="{ placeholder: 'Sélectionnez une source' }" class="w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" v-model="responses[question.id].sourceDeVerificationId">
                                            <option value="">Sélectionner une source</option>
                                            <option v-for="(source, indexSource) in sources" :key="indexSource" :value="source.id">
                                              {{ source.intitule }}
                                            </option>
                                            <option value="autre">Autres sources</option>
                                          </TomSelect>
                                        </div>

                                        <!-- <div v-if="errors['factuel.response_data.' + getQuestionErrorIndex(question.id) + '.sourceDeVerificationId']" class="my-2 text-danger">
                                          {{ getFieldErrors(errors["factuel.response_data." + getQuestionErrorIndex(question.id) + ".sourceDeVerificationId"]) }}
                                        </div> -->
                                        <div v-if="errors['factuel.response_data.' + getQuestionErrorIndex(question.id) + '.sourceDeVerificationId']" class="flex items-center gap-2 mt-2 text-red-600">
                                          <i class="fas fa-exclamation-circle"></i>
                                          <span class="text-sm">{{ getFieldErrors(errors["factuel.response_data." + getQuestionErrorIndex(question.id) + ".sourceDeVerificationId"]) }}</span>
                                        </div>
                                      </div>

                                      <!-- Champ autre source (conditionnel) -->
                                      <div v-if="responses[question.id]?.sourceDeVerificationId == 'autre'" class="space-y-3">
                                        <label class="block text-sm font-semibold text-gray-700"> <i class="fas fa-edit mr-2 text-orange-500"></i>Précisez la source </label>
                                        <input type="text" required class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" v-model="responses[question.id].sourceDeVerification" placeholder="Saisissez votre source personnalisée..." />

                                        <div v-if="errors['factuel.response_data.' + getQuestionErrorIndex(question.id) + '.sourceDeVerification']" class="flex items-center gap-2 mt-2 text-red-600">
                                          <i class="fas fa-exclamation-circle"></i>
                                          <span class="text-sm">{{ getFieldErrors(errors["factuel.response_data." + getQuestionErrorIndex(question.id) + ".sourceDeVerification"]) }}</span>
                                        </div>
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
                                        <div v-if="errors['factuel.response_data.' + getQuestionErrorIndex(question.id) + '.preuves']" class="my-2 text-danger">
                                          {{ getFieldErrors(errors["factuel.response_data." + getQuestionErrorIndex(question.id) + ".preuves"]) }}
                                        </div>
                                      </div>

                                      <!-- Section des preuves existantes -->
                                      <div v-if="responses[question.id]?.existingProofs.length" class="bg-gray-50 rounded-lg p-4 mb-4">
                                        <h6 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                          <i class="fas fa-folder text-green-500"></i>
                                          Preuves existantes ({{ responses[question.id]?.existingProofs.length }})
                                        </h6>

                                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                          <div v-for="(file, index) in responses[question.id]?.existingProofs" :key="`existing-${index}`" class="bg-white border border-green-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                                            <div class="flex items-center gap-3 mb-3">
                                              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <i class="fas fa-file text-green-600"></i>
                                              </div>
                                              <div class="flex-1 min-w-0">
                                                <p class="text-sm font-medium text-gray-900 truncate">{{ file.nom }}</p>
                                                <p class="text-xs text-gray-500">Fichier existant</p>
                                              </div>
                                            </div>
                                            <div class="flex items-center gap-2 flex-wrap">
                                              <a v-if="file.url" :href="file.url" target="_blank" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm">
                                                <i class="fas fa-eye"></i> Voir
                                              </a>
                                              <a v-if="file.url" :href="file.url" :download="file.nom" class="text-green-600 hover:text-green-800 transition-colors duration-200 text-sm">
                                                <i class="fas fa-download"></i> Télécharger
                                              </a>
                                              <button @click="editExistingProof(question.id, index)" class="text-orange-600 hover:text-orange-800 transition-colors duration-200 text-sm">
                                                <i class="fas fa-edit"></i> Modifier
                                              </button>
                                              <button @click="deleteExistingProof(question.id, index)" class="text-red-600 hover:text-red-800 transition-colors duration-200 text-sm">
                                                <i class="fas fa-trash"></i> Supprimer
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- Section des nouveaux fichiers uploadés -->
                                      <div v-if="responses[question.id]?.preuves.length" class="bg-gray-50 rounded-lg p-4">
                                        <h6 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                          <i class="fas fa-file-alt text-blue-500"></i>
                                          Nouveaux fichiers ({{ responses[question.id]?.preuves.length }})
                                        </h6>

                                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                          <div v-for="(file, index) in responses[question.id]?.preuves" :key="`new-${index}`" class="bg-white border border-blue-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                                            <div class="flex items-center gap-3 mb-3">
                                              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <i class="fas fa-file text-blue-600"></i>
                                              </div>
                                              <div class="flex-1 min-w-0">
                                                <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                                                <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                                              </div>
                                            </div>
                                            <div class="flex items-center gap-2 flex-wrap">
                                              <button @click="viewNewProof(file)" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm">
                                                <i class="fas fa-eye"></i> Voir
                                              </button>
                                              <button @click="editNewProof(question.id, index)" class="text-orange-600 hover:text-orange-800 transition-colors duration-200 text-sm">
                                                <i class="fas fa-edit"></i> Modifier
                                              </button>
                                              <button @click="deleteNewProof(question.id, index)" class="text-red-600 hover:text-red-800 transition-colors duration-200 text-sm">
                                                <i class="fas fa-trash"></i> Supprimer
                                              </button>
                                            </div>
                                            <div v-if="errors['factuel.response_data.' + getQuestionErrorIndex(question.id) + '.preuves.' + index]" class="mt-2 text-danger text-xs">
                                              {{ getFieldErrors(errors["factuel.response_data." + getQuestionErrorIndex(question.id) + ".preuves." + index]) }}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <!-- Section conditionnelle pour "Partiellement" -->
                                    <div v-else-if="findResponse2(responses[question.id].optionDeReponseId) === 'partiellement'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 space-y-4">
                                      <div class="flex items-center gap-2 mb-4">
                                        <i class="fas fa-exclamation-triangle text-yellow-600"></i>
                                        <h5 class="text-lg font-semibold text-yellow-800">Précisions nécessaires</h5>
                                      </div>

                                      <div class="space-y-3">
                                        <label class="block text-sm font-semibold text-gray-700" for="description"> <i class="fas fa-comment-alt mr-2 text-blue-500"></i>Description détaillée </label>
                                        <textarea name="description" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none" id="description" v-model="responses[question.id].description" cols="30" rows="4" placeholder="Veuillez préciser les détails de votre réponse..."></textarea>
                                        <div v-if="errors['factuel.response_data.' + getQuestionErrorIndex(question.id) + '.description']" class="flex items-center gap-2 mt-2 text-red-600">
                                          <i class="fas fa-exclamation-circle"></i>
                                          <span class="text-sm">{{ getFieldErrors(errors["factuel.response_data." + getQuestionErrorIndex(question.id) + ".description"]) }}</span>
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

            <div class="flex justify-center gap-3 my-8">
                              <button 
                  @click="prevPage()" 
                  :disabled="currentPage === 0 || isLoading" 
                  class="px-4 py-3 btn btn-outline-primary transition-all duration-200"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 0 || isLoading }"
                >
                  <span v-if="isLoading" class="animate-spin mr-2">⟳</span>
                  Précédent
                </button>

                <button 
                  v-for="(item, index) in totalPages" 
                  @click="changePage(index)" 
                  :class="[
                    index === currentPage ? 'btn-primary' : 'btn-outline-primary',
                    { 'opacity-50 cursor-not-allowed': isLoading }
                  ]" 
                  :disabled="isLoading"
                  class="px-4 py-3 btn transition-all duration-200" 
                  :key="index"
                >
                  {{ index + 1 }}
                </button>

                <button 
                  v-if="!isPreview" 
                  @click="nextPage()" 
                  class="px-4 py-3 btn btn-outline-primary transition-all duration-200"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages - 1 || isLoading }"
                  :disabled="currentPage === totalPages - 1 || isLoading"
                >
                  Suivant
                  <span v-if="isLoading" class="animate-spin ml-2">⟳</span>
                </button>

                <button 
                  :disabled="isLoading" 
                  v-if="isPreview" 
                  @click="openPreview" 
                  class="px-4 py-3 btn btn-outline-primary transition-all duration-200"
                  :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
                >
                  <span v-if="isLoading" class="animate-spin mr-2">⟳</span>
                  Prévisualiser
                </button>
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

      <div class="flex items-center justify-between mt-5">
        <div class="min-w-[250px]">
          <button class="btn btn-primary" @click="openMemberModal">Ajouter membres</button>
          <div v-if="payload.factuel.comite_members?.length > 0" class="mt-3 space-y-1">
            <label class="text-lg form-label">Membres</label>
            <ul class="space-y-3">
              <li 
                class="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg"
                v-for="(member, index) in payload.factuel?.comite_members" 
                :key="index"
              >
                <!-- Informations du membre -->
                <div class="flex-1 min-w-[200px]">
                  <span class="font-medium text-gray-800">{{ member.nom }} {{ member.prenom }}</span>
                  <span class="text-gray-600 ml-2">- {{ member.contact }}</span>
                </div>
                
                <!-- Boutons d'action -->
                <div class="flex gap-2">
                  <button class="btn btn-primary btn-sm" @click="editMember(member, index)">Modifier</button>
                  <button class="btn btn-danger btn-sm" @click="deleteMember(index)">Supprimer</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <div v-if="errors.factuel" class="my-2 text-danger">{{ getFieldErrors(errors.factuel) }}</div>
        <div v-if="membersError" class="my-2 text-danger">{{ getFieldErrors(membersError) }}</div>
        <div v-if="errors['factuel.response_data']" class="my-2 text-danger">{{ getFieldErrors(errors["factuel.response_data"]) }}</div>

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
                                <div v-if="findResponse(responses[question.id]?.optionDeReponseId)" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
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

                                <!-- Section Question non répondue -->
                                <div v-else class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                                  <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                                      <i class="fas fa-question text-white text-sm"></i>
                                    </div>
                                    <div>
                                      <p class="text-sm font-medium text-gray-600">Statut</p>
                                      <p class="text-lg font-semibold text-gray-700">
                                        Question non répondue
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <!-- Section pour réponse "Oui" -->
                                <div v-if="findResponse2(responses[question.id]?.optionDeReponseId) === 'oui'" class="space-y-4">
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
                                        <span class="text-green-700 font-semibold ml-2">{{ responses[question.id].sourceDeVerification || "Source de vérification non renseignée" }}</span>
                                      </p>

                                      <p v-else class="text-base text-gray-700">
                                        <span class="font-medium">Source officielle :</span>
                                        <span class="text-green-700 font-semibold ml-2">{{ findSource(responses[question.id]?.sourceDeVerificationId) || "Aucune source spécifiée" }}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <!-- Section Preuves existantes -->
                                  <div v-if="responses[question.id]?.existingProofs?.length" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <div class="flex items-center gap-3 mb-3">
                                      <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                        <i class="fas fa-folder text-white text-sm"></i>
                                      </div>
                                      <h4 class="text-lg font-semibold text-green-800">Preuves existantes ({{ responses[question.id]?.existingProofs?.length }})</h4>
                                    </div>

                                    <div v-for="(file, index) in responses[question.id]?.existingProofs" :key="`existing-preview-${index}`" class="flex items-center gap-3 p-3 bg-white border border-green-100 rounded-lg hover:shadow-sm transition-shadow duration-200">
                                      <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-file text-green-600 text-sm"></i>
                                      </div>
                                      <div class="flex-1">
                                        <p class="text-sm font-medium text-gray-900">{{ file.nom }}</p>
                                        <p class="text-xs text-gray-500">Fichier existant</p>
                                      </div>
                                      <div v-if="file.url" class="flex items-center gap-2">
                                        <a :href="file.url" target="_blank" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm">
                                          <i class="fas fa-eye"></i> Voir
                                        </a>
                                        <a :href="file.url" :download="file.nom" class="text-green-600 hover:text-green-800 transition-colors duration-200 text-sm">
                                          <i class="fas fa-download"></i> Télécharger
                                        </a>
                                      </div>
                                    </div>
                                  </div>

                                  <!-- Section Nouveaux fichiers -->
                                  <div v-if="responses[question.id]?.preuves?.length" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <div class="flex items-center gap-3 mb-3">
                                      <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                        <i class="fas fa-paperclip text-white text-sm"></i>
                                      </div>
                                      <h4 class="text-lg font-semibold text-purple-800">Nouveaux fichiers ({{ responses[question.id]?.preuves?.length }})</h4>
                                    </div>

                                    <div v-for="(file, index) in responses[question.id]?.preuves" :key="`new-preview-${index}`" class="flex items-center gap-3 p-3 bg-white border border-purple-100 rounded-lg hover:shadow-sm transition-shadow duration-200">
                                      <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-file text-purple-600 text-sm"></i>
                                      </div>
                                      <div class="flex-1">
                                        <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                                        <p class="text-xs text-gray-500">{{ file.size ? formatFileSize(file.size) : "Taille inconnue" }}</p>
                                      </div>
                                      <div class="flex items-center gap-2">
                                        <button @click="viewNewProof(file)" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm">
                                          <i class="fas fa-eye"></i> Voir
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <!-- Section pour réponse "Partiellement" -->
                                <div v-else-if="findResponse2(responses[question.id]?.optionDeReponseId) === 'partiellement'" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
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
   <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 p-4 shadow-lg z-50 rounded-lg">
      <div class="flex gap-2" style="width: fit-content;">
        <button type="button" @click="resetValidation" class="px-2 py-2 my-3 align-top btn">Annuler</button>
        <VButton label="Valider" class="px-6 py-2" :loading="isLoading" @click="finalSubmit()" />
      </div>
    </div>
  </div>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="showModal" @hidden="closeModalWithoutSaving">
    <div class="mb-5">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ isEdit ? 'Modifier un membre' : 'Ajouter des membres' }}</h2>
      </ModalHeader>

      <ModalBody class="space-y-5">
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="currentMember.nom" :control="memberFormErrors.nom && memberFormErrors.nom.join(', ')" />
          <InputForm label="Prénom" v-model="currentMember.prenom" :control="memberFormErrors.prenom && memberFormErrors.prenom.join(', ')" />
        </div>
        <div class="w-full">
          <!-- <InputForm
            label="Contact"
            type="text"
            pattern="\d*"
            placeholder="Contact"
            v-model="currentMember.contact"
            :control="memberFormErrors.contact && memberFormErrors.contact.join(', ')"
            required
          /> -->
           <InputForm class="" type="text" label="Numéro de téléphone" maxlength="13" v-model="currentMember.contact" :control="memberFormErrors.contact && memberFormErrors.contact.join(', ')" />
          <p class="text-xs text-primary mt-3">Ecrivez le numéro directement sans espace ni de signe + (Ex : 22977887787)</p>
        </div>
        <div class="col-span-12">
          <!-- Message de validation avec animation -->
          <div class="mt-4 _min-h-[1.5rem]">
            <p v-if="isValid" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Numéro valide
            </p>
            <p v-else-if="currentMember.contact && currentMember.contact.length > 0" class="flex items-center text-red-500 font-medium text-sm">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Numéro invalide
            </p>
          </div>
        </div>

        <!-- Liste des membres ajoutés temporairement -->
        <div v-if="!isEdit && tempMembers.length > 0" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Membres à ajouter ({{ tempMembers.length }})</h3>
          <ul class="space-y-2">
            <li v-for="(member, index) in tempMembers" :key="index" class="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
              <span class="text-sm text-gray-700">{{ member.nom }} {{ member.prenom }} - {{ member.contact }}</span>
              <button @click="removeTempMember(index)" class="text-red-600 hover:text-red-800 transition-colors">
                <i class="fas fa-times"></i>
              </button>
            </li>
          </ul>
        </div>
      </ModalBody>
    </div>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="closeModalWithoutSaving" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
        <button v-if="!isEdit" type="button" @click="addMembers" class="w-full px-2 py-2 my-3 btn btn-outline-primary">Ajouter un autre membre</button>
        <button type="button" @click="saveMembers" class="w-full px-2 py-2 my-3 btn btn-primary">{{ isEdit ? 'Modifier' : 'Enregistrer' }}</button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->
</template>