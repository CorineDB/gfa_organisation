<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-primary/5">
    <div class="container max-w-6xl mx-auto">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        
        <!-- Section Information (Gauche/Haut) -->
        <div class="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div class="bg-white p-4 rounded-2xl shadow-sm inline-block">
            <img alt="GFA Logo" class="w-32 sm:w-40 md:w-48 object-contain" src="../../assets/images/GFA.png" />
          </div>
          
          <div class="space-y-4">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-md">
              GFA Survey
            </h1>
            <p class="text-lg sm:text-xl text-white/90 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Responsabilité partagée, Qualité améliorée : <br class="hidden sm:block"/>
              Unis pour un meilleur service social.
            </p>
          </div>
        </div>

        <!-- Section Formulaire (Droite/Bas) -->
        <div class="w-full lg:w-6/12 xl:w-5/12">
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="p-6 sm:p-10">
              
              <!-- Cas 1: Activation (Lien expiré ou invalide) -->
              <div v-if="!showActivate" class="flex flex-col gap-6">
                <!-- Message d'erreur initial -->
                <Alert v-if="errorMessage" class="alert-danger flex items-start gap-3" v-slot="{ dismiss }">
                  <AlertOctagonIcon class="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div class="flex-1">
                    <p class="font-medium">{{ errorMessage }}</p>
                  </div>
                  <button type="button" class="text-current opacity-70 hover:opacity-100" aria-label="Close" @click="dismiss">
                    <XIcon class="w-4 h-4" />
                  </button>
                </Alert>

                <LoaderSnipper v-if="isLoading" class="mx-auto my-8" />

                <!-- Formulaire demande nouveau lien -->
                <form v-else @submit.prevent="sendMailExp" class="space-y-6">
                  <div class="space-y-2 text-center lg:text-left">
                    <h2 v-if="!showFormSuccessExp" class="text-2xl font-bold text-gray-800">Lien d'activation</h2>
                    <p v-if="!showFormSuccessExp" class="text-gray-500">Entrez votre email pour recevoir un nouveau lien.</p>
                  </div>

                  <Alert v-if="showFormErrorExp" class="alert-danger flex items-center gap-3" v-slot="{ dismiss }">
                    <AlertOctagonIcon class="w-5 h-5 flex-shrink-0" />
                    <span class="flex-1">{{ errorMessageFormExp }}</span>
                    <button type="button" @click="dismiss"><XIcon class="w-4 h-4" /></button>
                  </Alert>

                  <Alert v-if="showFormSuccessExp" class="alert-success flex items-start gap-3"> 
                    <AlertCircleIcon class="w-5 h-5 mt-0.5 flex-shrink-0" /> 
                    <span>Consultez votre boîte mail pour activer votre compte via le lien envoyé.</span> 
                  </Alert>

                  <div v-if="!showFormSuccessExp" class="space-y-4">
                    <div>
                      <label for="emailExp" class="form-label font-medium text-gray-700">Email</label>
                      <input 
                        type="email" 
                        v-model.trim="emailExp" 
                        id="emailExp" 
                        class="form-control w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring-primary transition-colors" 
                        placeholder="exemple@domaine.com" 
                        required
                      />
                    </div>
                    <VButton :loading="chargement" label="Envoyer le lien" class="w-full py-3 text-lg font-medium shadow-md hover:shadow-lg transition-shadow" />
                  </div>
                </form>
              </div>

              <!-- Cas 2: Réinitialisation / Activation standard -->
              <form v-else @submit.prevent="sendMail" class="space-y-6">
                <div class="space-y-2 text-center lg:text-left">
                  <h2 v-if="!emailSend" class="text-2xl font-bold text-gray-800">Réinitialisation</h2>
                  <p v-if="!emailSend" class="text-gray-500">Entrez votre email pour définir votre mot de passe.</p>
                </div>

                <Alert v-if="showFormError && errorMessageForm" class="alert-danger flex items-center gap-3" v-slot="{ dismiss }">
                  <AlertOctagonIcon class="w-5 h-5 flex-shrink-0" /> 
                  <span class="flex-1">{{ errorMessageForm }}</span>
                  <button type="button" @click="dismiss"><XIcon class="w-4 h-4" /></button>
                </Alert>

                <Alert v-if="showFormSuccess" class="alert-primary flex items-start gap-3"> 
                  <AlertCircleIcon class="w-5 h-5 mt-0.5 flex-shrink-0" /> 
                  <span>Consultez votre boîte mail pour accéder au lien de définition de mot de passe.</span> 
                </Alert>

                <div v-if="!emailSend" class="space-y-4">
                  <div>
                    <label for="email" class="form-label font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      v-model.trim="email" 
                      id="email" 
                      class="form-control w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring-primary transition-colors" 
                      placeholder="exemple@domaine.com" 
                      required
                    />
                  </div>
                  <VButton :loading="chargement" label="Envoyer" class="w-full py-3 text-lg font-medium shadow-md hover:shadow-lg transition-shadow" />
                </div>
              </form>

            </div>
          </div>
        </div>

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
