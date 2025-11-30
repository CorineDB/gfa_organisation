<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Loading State -->
    <div v-if="isLoadingData" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <LoaderSnipper />
        <p class="mt-4 text-gray-600 animate-pulse">Chargement du formulaire...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <!-- Already Submitted Message -->
      <div v-if="!form.survey_form" class="flex w-full justify-center items-center min-h-[60vh]">
        <div class="max-w-2xl w-full">
          <div class="bg-white rounded-2xl shadow-xl border-l-4 border-green-500 p-8 transform hover:scale-105 transition-transform duration-300">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Formulaire déjà soumis</h2>
                <p class="text-gray-600 mt-1">Merci pour votre participation !</p>
              </div>
            </div>
            <div class="mt-6 p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-800">
                <span class="font-semibold">✓</span> Vos réponses ont été enregistrées avec succès.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Survey Form -->
      <div v-else class="max-w-5xl mx-auto">
        <!-- Header with gradient -->
        <div class="mb-8 text-center relative">
          <div class="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl -z-10"></div>
          <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mb-4 shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
              {{ form.survey_form?.libelle || "Formulaire d'enquête" }}
            </h1>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto">
              {{ form.survey_form?.description || "Veuillez remplir ce formulaire avec attention" }}
            </p>
            
            <!-- Progress indicator -->
            <div v-if="parsedFormData?.sections?.length > 1" class="mt-6 max-w-md mx-auto">
              <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progression</span>
                <span class="font-semibold">{{ parsedFormData.sections.length }} sections</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary to-blue-600 rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <form v-if="parsedFormData && parsedFormData.sections && parsedFormData.sections.length > 0" @submit.prevent="send(payLoadPersonaliser)" class="space-y-6">
          <!-- Sections -->
          <div v-for="(section, sectionIndex) in parsedFormData.sections" :key="section.id" class="transform transition-all duration-300 hover:scale-[1.01]">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <!-- Section Header -->
              <div v-if="section.intitule" class="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-md">
                    <span class="text-white font-bold text-lg">{{ sectionIndex + 1 }}</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-xl font-bold text-gray-800">{{ section.intitule }}</h4>
                    <p v-if="section.description" class="text-sm text-gray-600 mt-1">{{ section.description }}</p>
                  </div>
                  <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-200">
                    <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span class="text-xs font-medium text-gray-600">{{ section.elements.length }} champ(s)</span>
                  </div>
                </div>
              </div>

              <!-- Fields -->
              <div class="p-6 space-y-6">
                <div v-for="(field, fieldIndex) in section.elements.slice().sort((a, b) => a.ordre_affichage - b.ordre_affichage)" :key="field.id" class="group">
                  <div class="p-5 rounded-xl border-2 border-gray-100 hover:border-primary/30 bg-gradient-to-br from-white to-gray-50/50 transition-all duration-200 hover:shadow-md">
                    
                    <!-- Text/Email/Number/Date/Tel/URL inputs -->
                    <div v-if="['text', 'email', 'password', 'number', 'date', 'time', 'datetime-local', 'tel', 'url'].includes(field.type_champ)">
                      <div class="flex items-center justify-between mb-3">
                        <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          {{ field.label }}
                          <span v-if="field.is_required" class="text-red-500 font-bold">*</span>
                        </label>
                        <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {{ field.type_champ }}
                        </span>
                      </div>
                      <input 
                        v-model="payLoadPersonaliser.response_data[field.attribut]" 
                        :type="field.type_champ" 
                        :placeholder="field.placeholder || 'Saisir...'" 
                        :required="field.is_required" 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 bg-white"
                      />
                      <small v-if="field.info" class="flex items-center gap-1 mt-2 text-blue-600 text-xs">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        {{ field.info }}
                      </small>
                    </div>

                    <!-- Textarea -->
                    <div v-else-if="field.type_champ === 'textarea'">
                      <div class="flex items-center justify-between mb-3">
                        <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span class="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                          {{ field.label }}
                          <span v-if="field.is_required" class="text-red-500 font-bold">*</span>
                        </label>
                        <span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          📝 Texte long
                        </span>
                      </div>
                      <textarea 
                        v-model="payLoadPersonaliser.response_data[field.attribut]" 
                        :placeholder="field.placeholder || 'Saisir votre texte...'" 
                        :required="field.is_required" 
                        :rows="field.meta_options?.configs?.rows || 4" 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white resize-none"
                      ></textarea>
                      <small v-if="field.info" class="flex items-center gap-1 mt-2 text-purple-600 text-xs">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        {{ field.info }}
                      </small>
                    </div>

                    <!-- Select -->
                    <div v-else-if="field.type_champ === 'select'">
                      <div class="flex items-center justify-between mb-3">
                        <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          {{ field.label }}
                          <span v-if="field.is_required" class="text-red-500 font-bold">*</span>
                        </label>
                        <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          📋 Liste
                        </span>
                      </div>
                      <select 
                        v-model="payLoadPersonaliser.response_data[field.attribut]" 
                        :required="field.is_required" 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 bg-white cursor-pointer"
                      >
                        <option value="">{{ field.placeholder || "Sélectionner une option..." }}</option>
                        <option v-for="option in field.meta_options?.configs?.options || []" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <small v-if="field.info" class="flex items-center gap-1 mt-2 text-green-600 text-xs">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        {{ field.info }}
                      </small>
                    </div>

                    <!-- Radio & Checkbox -->
                    <div v-else-if="['radio', 'checkbox'].includes(field.type_champ)">
                      <div class="flex items-center justify-between mb-4">
                        <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                          {{ field.label }}
                          <span v-if="field.is_required" class="text-red-500 font-bold">*</span>
                        </label>
                        <span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          {{ field.type_champ === 'radio' ? '⚪ Choix unique' : '☑️ Choix multiple' }}
                        </span>
                      </div>
                      <div class="space-y-3">
                        <div v-for="(option, index) in field.meta_options?.configs?.options || []" :key="option.value" class="flex items-center p-3 rounded-lg border-2 border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-150 cursor-pointer">
                          <input 
                            :id="`field_${field.id}_${option.value}`" 
                            :type="field.type_champ" 
                            :name="`field_${field.id}`" 
                            :value="option.value" 
                            v-model="payLoadPersonaliser.response_data[field.attribut]" 
                            class="w-5 h-5 text-orange-600 border-2 border-gray-300 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
                          />
                          <label class="ml-3 flex-1 cursor-pointer select-none font-medium text-gray-700" :for="`field_${field.id}_${option.value}`">
                            {{ option.label }}
                          </label>
                        </div>
                      </div>
                      <small v-if="field.info" class="flex items-center gap-1 mt-3 text-orange-600 text-xs">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        {{ field.info }}
                      </small>
                    </div>

                    <!-- Unsupported field type -->
                    <div v-else>
                      <label class="text-sm font-semibold text-gray-700 block mb-2">{{ field.label }}</label>
                      <div class="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-sm text-yellow-800">
                        ⚠️ Type de champ non pris en charge : <span class="font-mono font-semibold">{{ field.type_champ }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center pt-6 pb-12">
            <button type="submit" class="group relative px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <span class="relative z-10 flex items-center gap-3">
                <svg class="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Soumettre le formulaire
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </form>

        <!-- No content message -->
        <div v-else class="text-center py-16">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-xl text-gray-500 font-medium">Aucun contenu de formulaire à afficher</p>
          <p class="text-gray-400 mt-2">Le formulaire semble être vide ou mal configuré</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
    return null;
  }
});


// survey.value.locale = "fr";
const send = async (results) => {
  try {
    await EnqueteIndividuelService.sendResponse(results);
    toast.success("Soumissions envoyées");
    // generatevalidateKey("formIndividuel");
    await getDataForm(); // Rafraîchir les données pour confirmer le statut
    isFinished.value = true;
  } catch (error) {
    toast.error(getAllErrorMessages(e));
  }
};

 

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

 

const getDataForm = async () => {
  await EnqueteIndividuelService.getFormEvaluation(token, participantId.value)
    .then((result) => {
      form.value = result.data.data;

     
      if (form.value.statut) {
        isFinished.value = true;
        isLoadingData.value = false;
        return;
      }

      payLoadPersonaliser.surveyId = form.value.id;
      payLoadPersonaliser.idParticipant = participantId.value;

      if(form.value.survey_form){
         Object.assign(payLoadPersonaliser.response_data , buildpayLoadPersonaliser(form.value.survey_form.form_data.forms));
      }


    
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
