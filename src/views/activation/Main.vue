<template>
  <div>
    <div class="sm:px-10 md:px-0">
      <div class="block grid-cols-2 gap-4 bg-white xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col hidden min-h-screen p-5 bg-primary xl:flex">
          <div class="my-auto text-center bg-primary">
            <img alt="Midone Tailwind HTML Admin Template" class="w-1/2 mx-auto -intro-x" src="@/assets/images/Checklist-rafiki.svg" />
            <div class="mt-10 text-3xl font-medium leading-tight text-white -intro-x">GFA Survey <br /></div>
            <div class="px-4 mt-5 text-xl text-white -intro-x text-opacity-70 dark:text-slate-400">Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.</div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div v-if="!showActivate" class="flex flex-col items-center justify-center gap-4 bg-white">
          <div v-if="errorMessage" class="">
            <Alert class="flex items-center mb-2 alert-danger" v-slot="{ dismiss }">
              <AlertOctagonIcon class="w-6 h-6 mr-2" />
              <p class="text-lg">{{ errorMessage }}. <br /></p>
              <button type="button" class="btn-close" aria-label="Close" @click="dismiss">
                <XIcon class="w-4 h-4" />
              </button>
            </Alert>
            <form @submit.prevent="sendMailExp" class="flex items-center h-screen py-5 m-10 _bg-white xl:h-auto xl:py-0 sm:mx-auto xl:my-0">
              <div class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <Alert v-if="showFormErrorExp" class="flex items-center mb-2 alert-pending" v-slot="{ dismiss }">
                  <p>{{ errorMessageFormExp }}</p>
                  <button type="button" class="btn-close" aria-label="Close" @click="dismiss">
                    <XIcon class="w-4 h-4" />
                  </button>
                </Alert>
                <Alert v-if="showFormSuccessExp" class="flex items-center mb-2 text-white alert-success"> <AlertCircleIcon class="w-6 h-6 mr-2" /> Consulter votre mail pour accéder au lien pour activer votre compte. </Alert>
                <h2 v-if="!showFormSuccessExp" class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Demande du lien d'activation</h2>
                <div v-if="!showFormSuccessExp" class="mt-2 text-center intro-x text-slate-400 xl:hidden">Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.</div>
                <div v-if="!showFormSuccessExp" class="mt-8 intro-x">
                  <div>
                    <label for="email" class="form-label">Email</label>
                    <input type="email" v-model.trim="emailExp" id="email" class="block px-4 py-3 intro-x login__input form-control" placeholder="Email pour activation" />
                  </div>
                </div>
                <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                  <VButton v-if="!showFormSuccessExp" :loading="chargement" label="Soumettre" class="py-3" />
                </div>
              </div>
            </form>
          </div>

          <LoaderSnipper v-if="isLoading" />
        </div>

        <form v-else @submit.prevent="sendMail" class="flex items-center h-screen py-5 m-10 _bg-white xl:h-auto xl:py-0 sm:mx-auto xl:my-0">
          <div class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <Alert v-if="showFormError && errorMessageForm" class="flex items-center mb-2 alert-danger" v-slot="{ dismiss }">
              <AlertOctagonIcon class="w-6 h-6 mr-2" /> {{ errorMessageForm }}
              <button type="button" class="btn-close" aria-label="Close" @click="dismiss">
                <XIcon class="w-4 h-4" />
              </button>
            </Alert>
            <Alert v-if="showFormSuccess" class="flex items-center mb-2 alert-primary"> <AlertCircleIcon class="w-6 h-6 mr-2" /> Consulter votre mail pour accéder au lien pour definr votre mot de passe. </Alert>
            <h2 v-if="!emailSend" class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Demande du lien de réinitialisation</h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.</div>
            <div v-if="!emailSend" class="mt-8 intro-x">
              <div>
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model.trim="email" id="email" class="block px-4 py-3 intro-x login__input form-control" placeholder="Email pour recevoir le lien" />
              </div>
            </div>
            <div v-if="!emailSend" class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <VButton :loading="chargement" label="Envoyer" class="py-3" />
            </div>
          </div>
        </form>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<script setup>
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import VButton from "@/components/news/VButton.vue";
import { useRoute, useRouter } from "vue-router";
import ActivationAccount from "../../services/modules/accountActivation.service";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { getAllErrorMessages } from "@/utils/gestion-error";
import resetPassword from "../../services/modules/reinitialisationPassword.service";

const route = useRoute();
const router = useRouter();
const chargement = ref(false);
const isLoading = ref(true);
const showActivate = ref(false);
const showFormError = ref(false);
const showFormErrorExp = ref(false);
const showFormSuccess = ref(false);
const showFormSuccessExp = ref(false);
const emailSend = ref(false);
const email = ref("");
const emailExp = ref("");
const errorMessage = ref("");
const errorMessageForm = ref("");
const errorMessageFormExp = ref("");
const token = route.params.t;

const sendMail = async () => {
  if (email.value) {
    localStorage.setItem("newmail", JSON.stringify(email.value));
    chargement.value = true;
    try {
      const result = await resetPassword.get(email.value);
      if (result.data.statut === "success") {
        console.log("Success");
        chargement.value = false;
        emailSend.value = true;
        showFormSuccess.value = true;
      } else {
        console.log("No Success");
        showFormError.value = true;
        errorMessageForm.value = result.data.data?.message || "Une erreur est survenue.";
      }
    } catch (error) {
      console.log("Error");
      chargement.value = false;
      showFormError.value = true;
      errorMessageForm.value = error.response?.data?.message || "Une erreur est survenue.";
    }
  }
};
const sendMailExp = async () => {
  if (emailExp.value) {
    chargement.value = true;
    try {
      const result = await ActivationAccount.confirmationCompte(emailExp.value);
      if (result.data.data.statut == "success") {
        chargement.value = false;
        showFormSuccessExp.value = true;
      } else {
        showFormErrorExp.value = true;
        chargement.value = false;

        errorMessageFormExp.value = result.data?.message || "Une erreur est survenue.";
      }
    } catch (error) {
      console.log("Response", error);
      chargement.value = false;
      showFormErrorExp.value = true;
      errorMessageFormExp.value = error.response?.data?.message || "Une erreur est survenue.";
    }
  }
};

const activeAccount = async () => {
  chargement.value = true;

  try {
    const result = await ActivationAccount.activerCompte(token);
    if (result.data.statut == "success") {
      isLoading.value = false;
      showActivate.value = true;
      chargement.value = false;

      // toast.success(result.message || "Compte activé avec succès !");
    } else {
      chargement.value = false;

      // toast.error(result.message || "Une erreur inattendue est survenue.");
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Une erreur est survenue.";
    isLoading.value = false;
    chargement.value = false;

    // toast.error(errorMessage.value);
  }
};

onMounted(async () => {
  activeAccount();
});
</script>

<style scoped>
.custom-bg {
  background-color: #0f3460;
}
</style>
