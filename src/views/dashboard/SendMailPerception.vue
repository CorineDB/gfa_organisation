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

const payload = reactive({
  emails: [],
  phones: [],
});
const options = [
  { label: "Adresse Email", id: "mail" },
  { label: "Numéro de téléphone", id: "phone" },
];
const idEvaluation = route.query.e;
const currentOption = ref(options[0].id);
const currentEmail = ref("");
const currentPhone = ref("");
const isLoading = ref(false);

const addEmail = () => {
  if (currentEmail.value) {
    if (!payload.emails.includes(currentEmail.value)) {
      payload.emails.unshift(currentEmail.value);
      currentEmail.value = "";
    } else {
      toast.info("Adresse email déja ajouté");
    }
  }
};

const addPhone = () => {
  if (currentPhone.value) {
    if (!payload.phones.includes(currentPhone.value)) {
      payload.phones.unshift(currentPhone.value);
      currentPhone.value = "";
    } else {
      toast.info("Numéro de téléphone déja ajouté");
    }
  }
};
const goBack = () => {
  router.push({ name: "SoumissionsEnqueteDeCollecte", params: { id: idEvaluation } });
};
const resetForm = () => {};

const submitData = async () => {
  // isLoading.value = true;
  // try {
  //   await EvaluationService.addParticipantPerception(idEvaluation,payload) ;
  //   toast.success(`Participants ajoutés.`);
  //   resetForm();
  // } catch (e) {
  //   toast.error(getAllErrorMessages(e));
  // } finally {
  //   isLoading.value = false;
  // }
};

const filterData = computed(() => (currentOption.value === options[0].id ? payload.emails : payload.phones));
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
                <input v-model="currentOption" :id="option.id" class="form-check-input" type="radio" name="option" :value="option.id" />
                <label class="form-check-label" :for="option.id">{{ option.label }}</label>
              </div>
            </div>
          </div>
          <form v-show="currentOption === options[0].id" @submit.prevent="addEmail">
            <div class="flex items-end gap-4">
              <InputForm class="" label="Adresse email" v-model="currentEmail" type="email" />
              <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
            </div>
          </form>
          <form v-show="currentOption === options[1].id" @submit.prevent="addPhone">
            <div class="flex items-end gap-4">
              <InputForm class="" label="Numéro de téléphone" pattern="\d{1,8}" maxlength="8" v-model.number="currentPhone" type="number" />
              <!-- <div class="">
                <label for="Numéro de téléphone" class="form-label">Numéro de téléphone</label>
                <input id="Numéro de téléphone" type="number" pattern="\d{1,8}" maxlength="8" required v-model.number="currentPhone" class="form-control" placeholder="Numéro de téléphone" />
              </div> -->
              <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
            </div>
          </form>

          <div class="flex flex-wrap items-center w-full max-w-full gap-3">
            <div class="flex items-center justify-between gap-2 px-3 py-1 text-sm font-medium bg-white rounded-full shadow cursor-pointer text-primary" v-for="(mail, index) in filterData" :key="index">
              <span>{{ mail }} </span><button class="p-2 transition-colors rounded-full hover:bg-red-100"><PlusIcon class="w-4 h-4 text-danger" /></button>
            </div>
          </div>
        </div>
        <VButton :loading="isLoading" class="py-3" label="Enregistrer" @click="submitData" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
