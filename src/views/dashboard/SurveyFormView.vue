<template>
  <div v-if="!isLoadingData && !isFinished">
    <h2 class="my-8 text-lg font-medium intro-y">Remplissez le formulaire</h2>
    <SurveyComponent :model="survey" />
  </div>
  <LoaderSnipper v-if="isLoadingData && !isFinished" />
  <div v-if="isFinished" class="flex w-full justify-center items-center h-[40vh]">
    <Alert class="w-full max-w-screen-md mb-2 alert-primary">
      <div class="flex items-center">
        <div class="text-xl font-medium">Enquete Individuelle</div>
      </div>
      <div class="mt-3 text-lg">Formulaire déjà remplir. Merci</div>
    </Alert>
  </div>
</template>

<script setup>
import "survey-core/defaultV2.min.css";
import { SurveyComponent } from "survey-vue3-ui";
import { Model } from "survey-core";
import { useRoute } from "vue-router";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { onMounted, ref } from "vue";
import EnqueteIndividuelService from "../../services/modules/enquete.individuel.service";
import { generateUniqueIdSurvey, generatevalidateKey, getvalidateKey } from "../../utils/helpers";
import { toast } from "vue3-toastify";
import { localization } from "survey-core";
import LoaderSnipper from "@/components/LoaderSnipper.vue";

const route = useRoute();
const token = route.params.id;
const participantId = ref("");
const form = ref({});
const isLoadingData = ref(true);
const isLoading = ref(false);
const isFinished = ref(false);

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
  // console.log("Résultats capturés :", results);

  // Ajout de métadonnées ou transformation des données si nécessaire
  const finalData = {
    idParticipant: participantId.value,
    response_data: results,
    surveyId: form.value.id,
    commentaire: "",
  };

  // Envoi au backend
  send(finalData);
});

const getDataForm = async () => {
  await EnqueteIndividuelService.getFormEvaluation(token, participantId.value)
    .then((result) => {
      form.value = result.data.data;
      if (form.value.survey_response) {
        isFinished.value = true;
        return;
      }
      survey.value = new Model(form.value.survey_form.form_data);

      // Ajouter onComplete au nouveau modèle
      survey.value.onComplete.add((sender) => {
        const results = sender.data;
        console.log("Résultats capturés :", results);

        const finalData = {
          idParticipant: participantId.value,
          response_data: results,
          surveyId: form.value.id,
          commentaire: "",
        };

        send(finalData);
      });

      isLoadingData.value = false;
    })
    .catch((e) => {
      toast.error(getAllErrorMessages(e));
      isLoadingData.value = false;
    });
};

onMounted(async () => {
  participantId.value = generateUniqueIdSurvey();
  await getDataForm();
  // if (getvalidateKey("formIndividuel")) {
  //   isFinished.value = true;
  // } else {
  //   participantId.value = generateUniqueIdSurvey();
  //   await getDataForm();
  // }
});
</script>
