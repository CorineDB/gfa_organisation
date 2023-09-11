<template>
  <Notification refKey="successNotification" :options="{ duration: 3000, }" class="flex">
    <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
    <div class="ml-4 mr-4">
      <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}
      </div>
      <div class="text-slate-500 mt-1">
        {{ message.message }}
      </div>
    </div>
  </Notification>
  <div class="custom-bg w-screen h-screen  flex items-center justify-center">

    <div class="w-1/2 h-full img-side p-10 flex flex-col items-center justify-between ">
      <img class="w-1/3 mx-auto" src="../../../assets/images/logo-BSD_white.webp" alt="">
      <div>
        <img class="w-11/12 mx-auto" src="../../../assets/images/Login-amico.svg" alt="">
        <p class="text-white text-center"><span class="text-xl font-bold">Réinitialiser votre Mot de Passe</span> <br>
          Veuilez remplir les champs de Mot de passe</p>
      </div>
      <div class="text-white text-center my-5">
        Made by Celerite HOLDING
      </div>
    </div>

    <div class="w-1/2 h-full flex items-center justify-center ">
      <div class="w-5/6">
        <div class="intro-y  mx-auto">
          <h2 class="text-2xl font-black mr-auto">Réinitialiser votre mot de passe</h2>
        </div>
        <div class=" mx-auto">
          <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
            <!-- BEGIN: Change Password -->
            <div class="intro-y box lg:mt-5">
              <form @submit.prevent="modifierMotPasse">
                <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
                  <!-- BEGIN: Change Password -->
                  <div class="intro-y box lg:mt-5">
                    <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                      <h2 class="font-medium text-base mr-auto">Changer le Mot de passe</h2>
                    </div>
                    <div class="p-5">
                      <div class="mt-3">
                        <label for="change-password-form-2" class="form-label">Nouveau Mot passe</label>
                        <div class="flex items-center space-x-2">
                          <input id="change-password-form-2" :type="statePassword" class="form-control"
                            v-model="formData.newPassword" placeholder="Entrer le nouveau Mot de passe" />
                          <EyeIcon @click="invisible" v-show="!show" />
                          <EyeOffIcon @click="invisible" v-show="show" />
                        </div>
                      </div>
                      <div class="mt-3">
                        <label for="change-password-form-3" class="form-label">Confirmer nouveau Mot de passe</label>
                        <div class="flex items-center space-x-2">
                          <input id="change-password-form-3" :type="statePassword2" class="form-control"
                            v-model="formData.confirmPassword" placeholder="Confirmer le nouveau mot de passe" />

                          <EyeIcon @click="invisible2" v-show="!show2" />
                          <EyeOffIcon @click="invisible2" v-show="show2" />
                        </div>

                      </div>
                      <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                        <button type="submit" class="btn btn-primary py-3 px-4 w-full   xl:mr-3 align-top">
                          <span class="text-sm font-semibold uppercase" v-if="!chargement">
                           Réinitialiser
                          </span>
                          <span v-else class="flex justify-center items-center space-x-2">
                            <span class=" px-4 font-semibold ">
                              chargement ...
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none"
                              viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </span>
                        </button>

                      </div>
                    </div>
                  </div>
                  <!-- END: Change Password -->
                </div>
              </form>
            </div>
            <!-- END: Change Password -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createDOMCompilerError } from "@vue/compiler-dom";
import AuthentificationService from "@/services/modules/authentification.service";
import { ref, onBeforeMount, reactive, provide } from "vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const token = ref('')
const email = ref('')

onBeforeMount(function () {

  token.value = route.query.token

  console.log(token.value, email.value)

})


const formData = reactive({
  newPassword: "",
  confirmPassword: ""
})

const show = ref(false)

const show2 = ref(false)

const chargement = ref(false)

const successNotification = ref();

const statePassword = ref('password')

const statePassword2 = ref('password')




const message = reactive({
  type: '',
  message: '',
})

const invisible = () => {

  statePassword.value = !show.value ? 'text' : 'password'
  show.value = !show.value


}

const invisible2 = () => {

  statePassword2.value = !show2.value ? 'text' : 'password'
  show2.value = !show2.value


}

const modifierMotPasse = () => {

  if (formData.confirmPassword == formData.newPassword) {

    if (!chargement.value) {
      chargement.value = true

      let form = {
        token: token.value,
        new_password: formData.newPassword
      }

      AuthentificationService.updatePasswordbyMail(form).then(response => {

        chargement.value = false
        message.type = response.data.statut
        message.message = response.data.message
        successNotificationToggle()

      }).catch(err => {
        chargement.value = false
        message.type = err.data.status
        message.message = err.data.message
        successNotificationToggle()

      })


    }

  }


}

provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};




</script>
  
  
<style scoped>
.custom-bg {
  background-color: #F1F5F9;
}

.img-side {
  background-color: #0F3460;
}
</style>
  