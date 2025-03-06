<template>
  <div class="container px-6 mx-auto">
    <div
      class="flex flex-col text-center md:text-left md:flex-row h-screen justify-evenly md:items-center w-full lg:w-10/12 mx-auto">
      <div class="flex flex-col w-full">
        <div>
          <img alt="Midone Tailwind HTML Admin Template" class="w-48 p-4 bg-white rounded-xl mx-auto md:float-left "
            src="../../assets/images/GFA.png" />
        </div>
        <h1 class="text-5xl text-white font-bold my-5">GFA Survey</h1>
        <p class="w-full md:w-11/12 mx-auto md:mx-0 text-white mb-5">
          Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.
        </p>
      </div>
      <div class="w-full md:w-full lg:w-9/12 mx-auto md:mx-0">
        <div class="bg-white p-10 flex flex-col w-full shadow-xl rounded-xl">

          <form @submit.prevent="ressetPassword" class="flex items-center ">
            <div class="w-full">
              <div class="px-4">
                <Alert v-if="showAlert && (errors.token || errors.email)"
                  class="flex items-center mb-2 !py-2 alert-danger-soft" v-slot="{ dismiss }">
                  <ul class="font-medium !list-disc">
                    <li v-if="errors.token">
                      {{ getFieldErrors(errors.token) }} <br />
                      <span @click="goPageRequest" class="text-blue-500 underline cursor-pointer">Demander un
                        lien</span>
                    </li>
                    <li v-if="errors.email">{{ getFieldErrors(errors.email) }}</li>

                  </ul>
                  <button type="button" class="text-white btn-close" aria-label="Close" @click="dismiss">
                    <XIcon class="w-4 h-4" />
                  </button>
                </Alert>
              </div>
              <Alert v-if="showFormError && errorMessageForm" class="flex items-center mb-2 alert-danger">
                <AlertOctagonIcon class="w-6 h-6 mr-2" /> {{ errorMessageForm }}
              </Alert>
              <Alert v-if="showFormSuccess" class="flex items-center mb-2 alert-primary">
                <AlertCircleIcon class="w-6 h-6 mr-2" /> Consulter votre mail pour accéder au lien pour definr votre mot
                de passe.
              </Alert>
              <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Définir un nouveau mot de
                passe</h2>
              <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">Responsabilité partagée, Qualité améliorée
                : Unis pour un meilleur service social.</div>
              <div class="mt-8 intro-x">
                <div class="space-y-4">
                  <input type="hidden" v-model.trim="payload.email" id="email"
                    class="block px-4 py-3 intro-x login__input form-control"
                    placeholder="Email pour recevoir le lien" />
                  <div class="">
                    <input type="password" required minlength="8" v-model.trim="payload.new_password" id="password"
                      class="block px-4 py-3 intro-x login__input form-control" placeholder="Nouveau mot de passe" />
                    <PasswordScore :value="payload.new_password" class="mt-2 mb-6" />
                    <div v-if="errors.new_password" class="mt-2 text-danger">{{ getFieldErrors(errors.new_password) }}
                    </div>
                  </div>
                  <div class="">
                    <input type="password" required minlength="8" v-model.trim="payload.new_password_confirmation"
                      id="confirm_password" class="block px-4 py-3 intro-x login__input form-control"
                      placeholder="Confirmer le mot de passe" />
                    <PasswordScore :value="payload.new_password_confirmation" class="mt-2 mb-6" />

                    <div v-if="errors.new_password_confirmation" class="mt-5 text-danger">{{
                      getFieldErrors(errors.new_password_confirmation) }}</div>
                    
                  </div>
                </div>
              </div>
              <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                <VButton :loading="chargement" label="Envoyer" class="py-3" />
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>

  
</template>

<script setup>
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import VButton from "@/components/news/VButton.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { getAllErrorMessages } from "@/utils/gestion-error";
import resetPassword from "../../services/modules/reinitialisationPassword.service";
import { reactive } from "vue";
import { getFieldErrors } from "@/utils/helpers";
import PasswordScore from "@/components/PasswordScore.vue";

// test password fort
const password = ref("");
const isPasswordStrong = ref(false);

const route = useRoute();
const router = useRouter();
const token = route.params.t;
const payload = reactive({
  token,
  email: "",
  new_password_confirmation: "",
  new_password: "",
});


const chargement = ref(false);
const showAlert = ref(false);
const showFormError = ref(false);
const showFormSuccess = ref(false);
const errorMessageForm = ref("");
const errors = ref({});

const ressetPassword = async () => {
  if (payload.new_password == payload.new_password_confirmation) {
    chargement.value = true;
    try {
      const result = await resetPassword.create(payload);
      if (result.data.statut == "success") {
        console.log("Season 1");
        router.push({ name: "login" });
        chargement.value = false;
        toast.success("Mot de passe modifier veuillez vous connecter");
      }
      // showFormSuccess.value = true;
      // } else {
      //   console.log("Season 2");
      //   showFormError.value = true;
      //   chargement.value = false;
      //   errorMessageForm.value = result.data.data?.message || "Une erreur est survenue.";
      // }
    } catch (error) {
      console.log("Season 3");
      chargement.value = false;
      showFormError.value = true;
      if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors;
        showAlert.value = true;
      } else {
        toast.error(getAllErrorMessages(error));
      }
      // errorMessageForm.value = error.response?.data?.message || "Une erreur est survenue.";
      // toast.error("Une erreur est survenue");
    }
  } else {
    toast.error("Les mots de passe ne sont pas identiques");
  }
};

function goPageRequest() {
  router.push({ name: "request_password" });
}

onMounted(async () => {
  payload.email = localStorage.getItem("newmail");
  console.log(payload.email);
  // activeAccount();
});
</script>

<style scoped>
.custom-bg {
  background-color: #0f3460;
}
</style>
