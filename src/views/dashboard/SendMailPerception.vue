<script setup>
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { onMounted, reactive } from "vue";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();

const options = [
  { label: "Adresse Email", id: "email" },
  { label: "Numéro de téléphone", id: "contact" },
];
const participant = reactive({
  type_de_contact: options[0].id,
  email: "",
  phone: "",
});
const idEvaluation = route.query.e;
const currentOption = ref(options[0].id);
const currentPhone = ref("");
const payload = reactive({ participants: [] });
const isLoading = ref(false);

const addEmail = () => {
  if (participant.email) {
    // Check if an email already exists in the payload
    const isEmailAdded = payload.participants.some((item) => item.email === participant.email);

    if (!isEmailAdded) {
      // Add the participant to the payload
      payload.participants.unshift({ ...participant }); // Use spread to avoid reference issues
      participant.email = ""; // Clear the email field after adding
    } else {
      // Show a message if the email is already added
      toast.info("Adresse email déjà ajoutée");
    }
  }
};

const addPhone = () => {
  if (participant.phone) {
    // Check if an phone already exists in the payload
    const isPhoneAdded = payload.participants.some((item) => item.phone === participant.phone);

    if (!isPhoneAdded) {
      // Add the participant to the payload
      payload.participants.unshift({ ...participant }); // Use spread to avoid reference issues
      participant.phone = ""; // Clear the phone field after adding
    } else {
      // Show a message if the phone is already added
      toast.info("Numéro de téléphone déja ajouté");
    }
  }
};

const goBack = () => {
  router.push({ name: "SoumissionsEnqueteDeCollecte", params: { id: idEvaluation } });
};
const resetForm = () => {};

const submitData = async () => {
  isLoading.value = true;
  try {
    await EvaluationService.addParticipantPerception(idEvaluation, payload);
    toast.success(`Participants ajoutés.`);
    resetForm();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};

const deleteItem = (item) => {
  payload.participants.splice(item, 1);
};

onMounted(() => {
  payload.organisationId = route.params.o;
});
</script>
<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Envoyer des mails pour la participation</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
        <div class="flex">
          <button @click="goBack()" class="mr-2 shadow-md btn btn-primary"><ArrowLeftIcon class="w-4 h-4 mr-3" />Retour</button>
        </div>
      </div>
    </div>
    <div class="max-w-screen-lg p-4 mx-auto mt-10 box">
      <p class="text-base font-medium">Ajouter des participants</p>
      <hr class="my-4" />
      <div class="gap-4 m-h-[50vh] flex flex-col justify-between">
        <div class="space-y-6">
          <div>
            <label class="form-label">Type de données</label>
            <div class="flex gap-2">
              <div v-for="(option, index) in options" :key="index" class="form-check">
                <input v-model="participant.type_de_contact" :id="option.id" class="form-check-input" type="radio" name="option" :value="option.id" />
                <label class="form-check-label" :for="option.id">{{ option.label }}</label>
              </div>
            </div>
          </div>
          <form v-show="participant.type_de_contact === options[0].id" @submit.prevent="addEmail">
            <div class="flex items-end gap-4">
              <InputForm class="" label="Adresse email" v-model="participant.email" type="email" />
              <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
            </div>
          </form>
          <form v-show="participant.type_de_contact === options[1].id" @submit.prevent="addPhone">
            <div class="flex items-end gap-4">
              <InputForm class="" label="Numéro de téléphone" pattern="\d{1,8}" maxlength="10" v-model.number="participant.phone" />
              <!-- <div class="">
                <label for="Numéro de téléphone" class="form-label">Numéro de téléphone</label>
                <input id="Numéro de téléphone" type="number" pattern="\d{1,8}" maxlength="8" required v-model.number="currentPhone" class="form-control" placeholder="Numéro de téléphone" />
              </div> -->
              <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
            </div>
          </form>

          <div class="flex flex-wrap items-center w-full max-w-full gap-3">
            <div class="flex items-center justify-between gap-2 px-2 py-1 text-sm font-medium bg-blue rounded-sm shadow cursor-pointer text-primary" v-for="(participant, index) in payload.participants" :key="index">
              <span>{{ participant.type_de_contact === "email" ? participant?.email : participant?.phone }}</span>
              <button @click="deleteItem(index)" class="p-1 transition-colors hover:bg-red-100"><XIcon class="w-4 h-4 text-danger" /></button>
            </div>
          </div>
        </div>
        <VButton :loading="isLoading" class="py-3" label="Enregistrer" @click="submitData" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
