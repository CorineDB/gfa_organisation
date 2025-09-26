<template>
  <div class="min-h-screen bg-white">
    <!-- Form Content -->
    <div v-if="!isLoadingData && !isFinished" class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ form.survey_form?.libelle || "Formulaire d'enquête" }}</h1>
        <p class="text-gray-600">{{ form.survey_form?.description || "Veuillez remplir ce formulaire" }}</p>
      </div>

      <!-- Form Content -->
      <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg border-l-4 border-primary">
          <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <i class="fas fa-edit text-primary"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ form.survey_form?.libelle || "Formulaire à remplir" }}</h3>
            <p class="text-sm text-gray-600">Veuillez compléter tous les champs requis</p>
          </div>
        </div>

        <form class="form-preview" v-if="parsedFormData && parsedFormData.sections && parsedFormData.sections.length > 0" @submit.prevent="send(payLoadPersonaliser)">
          <div v-for="(section, sectionIndex) in parsedFormData.sections" :key="section.id" class="preview-section mb-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <!-- Section header -->
            <div v-if="section.intitule" class="bg-gradient-to-r from-gray-50 to-blue-50 px-5 py-3 rounded-t-lg border-b border-gray-100">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-primary rounded-full"></div>
                <h4 class="text-base font-semibold text-gray-700">
                  {{ section.intitule }}
                </h4>
                <div class="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Section {{ sectionIndex + 1 }}</div>
              </div>
              <p v-if="section.description" class="text-sm text-gray-600 mt-1">
                {{ section.description }}
              </p>
            </div>

            <!-- Fields -->
            <div class="preview-fields space-y-5 p-5">
              <div v-for="field in section.elements.slice().sort((a, b) => a.ordre_affichage - b.ordre_affichage)" :key="field.id" class="preview-field p-4 rounded-lg border border-gray-100 hover:border-primary/30 transition-all duration-200 hover:shadow-sm">
                <!-- Input / tel / email / etc -->
                <div v-if="['text', 'email', 'password', 'number', 'date', 'time', 'datetime-local', 'tel', 'url'].includes(field.type_champ)">
                  <label class="form-label font-medium text-gray-700 mb-1 block">
                    {{ field.label }}
                    <span v-if="field.is_required" class="text-red-500 ml-1 font-bold">*</span>
                  </label>
                  <input v-model="payLoadPersonaliser.response_data[field.attribut]" :type="field.type_champ" :placeholder="field.placeholder" :required="field.is_required" class="form-control border-gray-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
                </div>

                <!-- Textarea -->
                <div v-else-if="field.type_champ === 'textarea'">
                  <label class="form-label block mb-1">
                    {{ field.label }}
                    <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                  </label>
                  <textarea v-model="payLoadPersonaliser.response_data[field.attribut]" :placeholder="field.placeholder" :required="field.is_required" :rows="field.meta_options?.configs?.rows || 3" class="form-control"></textarea>
                </div>

                <!-- Select -->
                <div v-else-if="field.type_champ === 'select'">
                  <label class="form-label block mb-1">
                    {{ field.label }}
                    <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                  </label>
                  <select v-model="payLoadPersonaliser.response_data[field.attribut]" :required="field.is_required" class="form-control">
                    <option value="">
                      {{ field.placeholder || "Sélectionner..." }}
                    </option>
                    <option v-for="option in field.meta_options?.configs?.options || []" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <!-- Radio & Checkbox -->
                <div v-else-if="['radio', 'checkbox'].includes(field.type_champ)">
                  <label class="form-label block mb-2">
                    {{ field.label }}
                    <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                  </label>
                  <div class="space-y-2">
                    <div v-for="(option, index) in field.meta_options?.configs?.options || []" :key="option.value" class="flex items-center">
                      <input :id="`field_${field.id}_${option.value}`" :type="field.type_champ" :name="`field_${field.id}`" :value="option.value" v-model="payLoadPersonaliser.response_data[field.attribut]" class="mr-2" />
                      <label class="mb-0 cursor-pointer" :for="`field_${field.id}_${option.value}`">
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Unsupported -->
                <div v-else>
                  <label class="form-label">{{ field.label }}</label>
                  <div class="p-2 bg-gray-100 rounded text-sm">Type de champ non pris en charge : {{ field.type_champ }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="flex justify-center mt-8">
            <button type="submit" class="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"><span>📤</span> Soumettre le formulaire</button>
          </div>
        </form>

        <div v-else class="text-center text-gray-500 py-8">
          <p>Aucun contenu de formulaire à afficher</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingData && !isFinished" class="flex justify-center items-center min-h-screen">
      <LoaderSnipper />
    </div>

    <!-- Finished State -->
    <div v-if="isFinished" class="flex w-full justify-center items-center h-[40vh]">
      <Alert class="w-full max-w-screen-md mb-2 alert-primary">
        <div class="flex items-center">
          <div class="text-xl font-medium">Enquete Individuelle</div>
        </div>
        <div class="mt-3 text-lg">Formulaire déjà remplir. Merci</div>
      </Alert>
    </div>
  </div>
</template>

<script setup>
import "survey-core/defaultV2.min.css";
import { SurveyComponent } from "survey-vue3-ui";
import { Model } from "survey-core";
import { useRoute } from "vue-router";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { onMounted, ref, computed, reactive } from "vue";
import EnqueteIndividuelService from "../../services/modules/enquete.individuel.service";
import { generateUniqueIdSurvey } from "../../utils/helpers";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";

const route = useRoute();
const token = route.params.id;
const participantId = ref("");
const form = ref({});
const isLoadingData = ref(true);
const isFinished = ref(false);
const activeTab = ref("survey");

// Computed property pour parser form_data
const parsedFormData = computed(() => {
  try {
    if (form.value.survey_form?.form_data) {
      const formData = form.value.survey_form.form_data;

      // La structure contient 'forms' au lieu de 'sections'
      return {
        sections: formData.forms || [],
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur lors du parsing de form_data:", error);
    return null;
  }
});

const survey = ref(new Model(form.value.form_data));
// survey.value.locale = "fr";
const send = async (results) => {
  try {
    await EnqueteIndividuelService.sendResponse(results);
    toast.success("Soumissions envoyées");
    // generatevalidateKey("formIndividuel");
    isFinished.value = true;
  } catch (error) {
    console.error("Erreur lors de l'envoi des résultats :", error);
    toast.error(getAllErrorMessages(e));
  }
};

survey.value.onComplete.add((sender) => {
  const results = sender.data; // Données soumises par l'utilisateur

  const finalData = {
    idParticipant: participantId.value,
    response_data: results,
    surveyId: form.value.id,
    commentaire: "",
  };

  // Envoi au backend
  send(finalData);
});

function buildpayLoadPersonaliser(forms) {
  const state = {};
  forms.forEach((section) => {
    section.elements.forEach((field) => {
      state[field.attribut] = field.default_value ?? "";
    });
  });
  return state;
}

const payLoadPersonaliser = reactive({
  response_data: {},
  surveyId: "",
  idParticipant: "",
  commentaire: "",
});

// {
//     "statut": "error",
//     "message": "Erreur de validation du formulaire",
//     "errors": {
//         "response_data": [
//             "The response data field is required."
//         ],
//         "surveyId": [
//             "The survey id field is required."
//         ],
//         "idParticipant": [
//             "The id participant field is required."
//         ]
//     },
//     "statutCode": 422
// }

const getDataForm = async () => {
  await EnqueteIndividuelService.getFormEvaluation(token, participantId.value)
    .then((result) => {
      form.value = result.data.data;

     
      if (form.value.survey_response.response_data) {
        isFinished.value = true;
        
        return;
      }

      payLoadPersonaliser.surveyId = form.value.id;
      payLoadPersonaliser.idParticipant = participantId.value;

      Object.assign(payLoadPersonaliser.response_data , buildpayLoadPersonaliser(form.value.survey_form.form_data.forms));

    
      isLoadingData.value = false
      

      
     
    })
    .catch((e) => {
      toast.error(getAllErrorMessages(e));
      isLoadingData.value = false;
    });
};

onMounted(async () => {
  participantId.value = generateUniqueIdSurvey();
  await getDataForm();
});
</script>
