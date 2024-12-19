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

        <form @submit.prevent="requestLink" class="flex items-center h-screen py-5 m-10 _bg-white xl:h-auto xl:py-0 sm:mx-auto xl:my-0">
          <div class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <Alert v-if="showFormError && errorMessageForm" class="flex items-center mb-2 alert-danger"> <AlertOctagonIcon class="w-6 h-6 mr-2" /> {{ errorMessageForm }} </Alert>
            <Alert v-if="showFormSuccess" class="flex items-center mb-2 text-lg alert-primary"> <AlertCircleIcon class="w-6 h-6 mr-2" /> Consulter votre mail pour accéder au lien pour definr votre mot de passe. </Alert>
            <h2 v-if="!showFormSuccess" class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Demander un lien de reinitialisation</h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.</div>
            <div class="mt-8 intro-x" v-if="!showFormSuccess">
              <div class="space-y-4">
                <input v-model.trim="payload.email" required id="email" class="block px-4 py-3 intro-x login__input form-control" placeholder="Email pour recevoir le lien" />
              </div>
            </div>
            <div v-if="!showFormSuccess" class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
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
import { reactive } from "vue";

const route = useRoute();
const router = useRouter();
const token = route.params.t;
const payload = reactive({
  token,
  email: "",
});
const chargement = ref(false);
const showFormError = ref(false);
const showFormSuccess = ref(false);
const errorMessageForm = ref("");
const errors = {};

const requestLink = async () => {
  if (payload.email) {
    chargement.value = true;
    try {
      const result = await resetPassword.get(payload.email);
      if (result.data.statut == "success") {
        console.log("Season 1");
        localStorage.setItem("newmail", JSON.stringify(payload.email));
        chargement.value = false;
        showFormSuccess.value = true;
        // errorMessageForm.value = result.data.message;
      }
    } catch (error) {
      chargement.value = false;
      showFormError.value = true;
      if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(error));
      }
      errorMessageForm.value = error.response?.data?.message || "Une erreur est survenue.";
      // toast.error(getAllErrorMessages(error));
    }
  }
};

onMounted(async () => {});
</script>

<style scoped>
.custom-bg {
  background-color: #0f3460;
}
</style>
