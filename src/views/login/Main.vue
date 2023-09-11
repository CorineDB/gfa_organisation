<template>
  <div>
    <DarkModeSwitcher />
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
    <div class=" sm:px-10 md:px-0 ">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden  bg-primary xl:flex flex-col min-h-screen px-20">
          <a href="" class="-intro-x pt-5">
            <img alt="Midone Tailwind HTML Admin Template" class="w-48 mx-auto"
              src="../../assets/images/logo-BSD_white.webp" />

          </a>
          <div class=" text-center my-auto bg-primary">
            <img alt="Midone Tailwind HTML Admin Template" class="-intro-x w-1/2 -mt-16 mx-auto"
              src="@/assets/images/illustration.svg" />
            <div class="-intro-x text-white font-medium text-3xl leading-tight mt-10">
              BSD (Boîte à Solution Digitale) <br />
            </div>
            <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
              Collecter le feedback de vos clients ? Un levier de développement, d’amélioration de vos services et
              produit.
              Désormais, fédérez vos clients à perpétuité.
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <form @submit.prevent="login" class="h-screen xl:h-auto  flex items-center py-5 xl:py-0  m-10 sm:mx-auto xl:my-0">
          <div
            class="my-auto mx-auto  bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
              Se connecter
            </h2>
            <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">
              A few more clicks to sign in to your account. Manage all your
              e-commerce accounts in one place
            </div>
            <div class="intro-x mt-8">
              <div>
                <input type="text" v-model="state.email" class="intro-x login__input form-control py-3 px-4 block"
                  placeholder="Email" />
                <div class="text-red-500 text-sm   py-2 font-semibold" v-if="v$.email.$error">
                  <div v-for="error in v$.email.$errors" :key="error.$uid">
                    <span v-if="error.$validator == 'required'"> Ce champs est obligatoire </span>
                    <span v-if="error.$validator == 'email'"> Email invalide </span>
                  </div>
                </div>
              </div>

              <div class="">
                <div class="relative">
                  <input :type="statePassword" class="intro-x login__input form-control py-3 px-4 block mt-4"
                    v-model.trim='state.password' placeholder="Mots de passe" />

                  <span @click="invisible" v-if="show"
                    class="text-blue-500  absolute cursor-pointer  right-4 z-10 top-2"><svg stroke="currentColor"
                      fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.8em" width="1.6em"
                      xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath>
                          <path fill="none" d="M124-288l388-672 388 672H124z" clip-rule="evenodd"></path>
                        </clipPath>
                      </defs>
                      <path
                        d="M508 624a112 112 0 0 0 112-112c0-3.28-.15-6.53-.43-9.74L498.26 623.57c3.21.28 6.45.43 9.74.43zm370.72-458.44L836 122.88a8 8 0 0 0-11.31 0L715.37 232.23Q624.91 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.7 119.43 136.55 191.45L112.56 835a8 8 0 0 0 0 11.31L155.25 889a8 8 0 0 0 11.31 0l712.16-712.12a8 8 0 0 0 0-11.32zM332 512a176 176 0 0 1 258.88-155.28l-48.62 48.62a112.08 112.08 0 0 0-140.92 140.92l-48.62 48.62A175.09 175.09 0 0 1 332 512z">
                      </path>
                      <path
                        d="M942.2 486.2Q889.4 375 816.51 304.85L672.37 449A176.08 176.08 0 0 1 445 676.37L322.74 798.63Q407.82 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5z">
                      </path>
                    </svg></span>
                  <span @click="invisible" v-if="!show"
                    class="text-blue-500 absolute cursor-pointer  right-4 z-10 top-2"><svg stroke="currentColor"
                      fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.8em" width="1.6em"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path>
                      <path
                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z">
                      </path>
                    </svg></span>
                </div>
                <div class="text-red-500 text-sm   py-2 font-semibold" v-if="v$.password.$error">
                  <div v-for="error in v$.password.$errors" :key="error.$uid">
                    <span v-if="error.$validator == 'required'"> Ce champs est obligatoire </span>
                    <span v-if="error.$validator == 'minLength'"> Mot de passe très court (6 caracteres) </span>
                  </div>
                </div>


              </div>

            </div>
            <div class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
              <div class="flex items-center mr-auto">
                <input id="remember-me" type="checkbox" class="form-check-input border mr-2" />
                <label class="cursor-pointer select-none" for="remember-me">Se souvenir de moi</label>
              </div>
              <router-link to="/change-password" >Mots de passe oublié?</router-link>
            </div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button class="btn btn-primary py-3 px-4 w-full bg-primary  xl:mr-3 align-top">
                <span class="text-sm font-semibold uppercase" v-if="!store.getLoading">
                  Se connecter
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
            <div class="intro-x mt-10 xl:mt-24 text-slate-600 dark:text-slate-500 text-center xl:text-left">
              Célerité holding tout les droits réservés {{ year }}

            </div>
          </div>
        </form>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/modules/authentification'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, numeric, email, sameAs, } from '@vuelidate/validators'
import { computed, reactive, ref, onMounted, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import dom from "@left4code/tw-starter/dist/js/dom";

//props
const store = useAuthStore()
const router = useRouter()
const route = useRoute()
//emits

//datas
const statePassword = ref('password')
const show = ref(false)
const successNotification = ref();
const state = reactive({
  email: '',
  password: '',
})
const message = reactive({
  type: 'success',
  message: '',
})

//computed
const year = computed(() => {
  const date = new Date
  return date.getFullYear()
})

//hook life cycle

//methods
const login = () => {
  console.log(state)
  v$.value.$validate() // checks all inputs
  if (!v$.value.$error) {
    store.login(state).then(payload => {
      message.type = 'success'
      message.message = 'Vous etes connectées'
      successNotificationToggle()
      router.push('/dashboard/bsd')
      
    }).catch(err => {
      message.type = 'erreur'
      message.message = err
      successNotificationToggle()

    })
  }
}

const invisible = () => {
  statePassword.value = !show.value ? 'text' : 'password'
  show.value = !show.value
}


provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};

//validations
const rules = {
  password: { required, minLength: minLength(6) },
  email: { required, email },
}

const v$ = useVuelidate(rules, state)
onMounted(() => {
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});




</script>
<style scoped>
.custom-bg {
  background-color: #0f3460;
}
</style>
