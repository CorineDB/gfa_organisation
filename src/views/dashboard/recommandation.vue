<script setup>
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { onMounted, reactive } from "vue";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { computed , getCurrentInstance} from "vue";

//vérifier numéro de téléphone
const { proxy } = getCurrentInstance();
 

const isValid = computed(() => {
  return proxy.$isValidPhoneNumber(participant.phone, "BJ");
});

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

    if( !isValid.value) {
      toast.error("Numéro de téléphone invalide");
      return;
    }
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
              <InputForm
                    label="Numéro de téléphone"
                    v-model="participant.phone"
                    maxlength="13"
                    placeholder="+229xxxxxxxxxx"
                    type="text"
                  />
              <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>

              
            </div>
            <div class="col-span-12">
                 
                  <!-- Message de validation avec animation -->
                  <div class="mt-4 _min-h-[1.5rem]">
                    <p v-if="isValid" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
                      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      Numéro valide
                    </p>
                    <p v-else-if="participant.phone && participant.phone.length > 0" class="flex items-center text-red-500 font-medium text-sm">
                      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      Numéro invalide
                    </p>
                  </div>
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
