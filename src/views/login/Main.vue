<template>
  <div>
    <!-- <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}</div>
        <div class="mt-1 text-slate-500">
          {{ message.message }}
        </div>
      </div>
    </Notification> -->
    <div class="sm:px-10 md:px-0">
      <div class="block grid-cols-2 gap-4 bg-white xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col hidden min-h-screen p-5 bg-primary xl:flex">
          <a href="" class="p-2 pt-5 mx-auto bg-white border shadow-sm -intro-x h-fit w-fit rounded-xl">
            <img alt="Midone Tailwind HTML Admin Template" class="w-48 mx-auto" src="../../assets/images/GFA.png" />
          </a>
          <div class="my-auto text-center bg-primary">
            <img alt="Midone Tailwind HTML Admin Template" class="w-1/2 mx-auto -intro-x" src="@/assets/images/Checklist-rafiki.svg" />
            <div class="mt-10 text-3xl font-medium leading-tight text-white -intro-x">GFA Survey <br /></div>
            <div class="px-4 mt-5 text-xl text-white -intro-x text-opacity-70 dark:text-slate-400">Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.</div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <form @submit.prevent="save" class="flex items-center h-screen py-5 m-10 _bg-white xl:h-auto xl:py-0 sm:mx-auto xl:my-0">
          <div class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Se connecter</h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.</div>
            <div class="mt-8 intro-x">
              <div>
                <input type="text" v-model.trim="login" class="block px-4 py-3 intro-x login__input form-control" placeholder="Email" />
                <!-- <div class="py-2 text-sm font-semibold text-red-500" v-if='!$v.login.required && soumettre'>
                  Ce champ est obligatoire
                      </div> -->
                <!-- <div class="py-2 text-sm font-semibold text-red-500" v-if='!$v.login.email && soumettre'>
                  Email invalide
                </div> -->
              </div>

              <div class="">
                <div class="relative">
                  <input :type="statePassword" class="block px-4 py-3 mt-4 intro-x login__input form-control" v-model.trim="password" placeholder="Mots de passe" />

                  <span @click="invisible" v-if="show" class="absolute z-10 text-blue-500 cursor-pointer right-4 top-2"
                    ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.8em" width="1.6em" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath>
                          <path fill="none" d="M124-288l388-672 388 672H124z" clip-rule="evenodd"></path>
                        </clipPath>
                      </defs>
                      <path d="M508 624a112 112 0 0 0 112-112c0-3.28-.15-6.53-.43-9.74L498.26 623.57c3.21.28 6.45.43 9.74.43zm370.72-458.44L836 122.88a8 8 0 0 0-11.31 0L715.37 232.23Q624.91 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.7 119.43 136.55 191.45L112.56 835a8 8 0 0 0 0 11.31L155.25 889a8 8 0 0 0 11.31 0l712.16-712.12a8 8 0 0 0 0-11.32zM332 512a176 176 0 0 1 258.88-155.28l-48.62 48.62a112.08 112.08 0 0 0-140.92 140.92l-48.62 48.62A175.09 175.09 0 0 1 332 512z"></path>
                      <path d="M942.2 486.2Q889.4 375 816.51 304.85L672.37 449A176.08 176.08 0 0 1 445 676.37L322.74 798.63Q407.82 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5z"></path></svg
                  ></span>
                  <span @click="invisible" v-if="!show" class="absolute z-10 text-blue-500 cursor-pointer right-4 top-2"
                    ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.8em" width="1.6em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path>
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path></svg
                  ></span>
                </div>
                <!-- <div class="py-2 text-sm font-semibold text-red-500 " v-if='!$v.password.required && soumettre'>
              Ce champ est obligatoire
            </div>
            <div class="py-2 text-sm font-semibold text-red-500 " v-if='!$v.password.minLength && soumettre'>
              mot de passe très court
            </div> -->
              </div>
            </div>
            <div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <div class="flex items-center mr-auto">
                <input id="remember-me" type="checkbox" class="mr-2 border form-check-input" />
                <label class="mr-3 cursor-pointer select-none" for="remember-me">Se souvenir de moi</label>
              </div>
              <router-link to="/change-password">Mots de passe oublié?</router-link>
            </div>
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <!-- <button class="w-full px-4 py-3 align-top btn btn-primary bg-primary xl:mr-3">
                <span class="text-sm font-semibold uppercase"> Se connecter </span>
                <span  class="flex items-center justify-center space-x-2">
                  <span class="px-4 font-semibold"> chargement ... </span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </span>
              </button> -->
              <VButton :loading="chargement" label="Se connecter" class="py-3" />
            </div>
            <div class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">Célerité holding tout les droits réservés {{ year }}</div>
          </div>
        </form>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<script>
//import { required, minLength, numeric, email, sameAs } from 'vuelidate/lib/validators';
//import gRecaptcha from '@finpo/vue2-recaptcha-invisible';
import { required, minLength, numeric, email, sameAs } from "@vuelidate/validators";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

//import Vmodal from '@/components/Vmodal'
import axios from "axios";
import VButton from "@/components/news/VButton.vue";
import { API_BASE_URL } from "@/services/configs/environment.js";

export default {
  name: "IndexPage",
  components: { VButton },
  data() {
    return {
      base_url: API_BASE_URL,
      statePassword: "password",
      show: false,
      state: {
        email: "",
        password: "",
      },
      year: new Date().getFullYear(),
      login: "",
      password: "",
      isRobot: true,
      chargement: false,
      soumettre: false,
      isValidate: false,
      showSend: false,
      isLoading: false,
    };
  },
  computed: {
    //importation des variables du module auths
    ...mapState({
      identifiant: (state) => state.auths.identifiant,
      accountValidate: (state) => state.accountValidate,
      loading: (state) => state.loading,
    }),
  },

  methods: {
    //Charger les fonctions de connexion au serveur
    ...mapActions({
      authentification: "auths/LOGIN",
    }),

    gotoValidate() {
      this.showSend = true;
    },
    resentLink() {
      this.soumettre = true;
      if (!this.$v.login.$invalid) {
        this.$router.push({ name: "resendLink", params: { identifiant: this.login } });
        this.showSend = false;
      }
    },
    async save() {
      this.soumettre = true;
      this.chargement = true;
      if (this.chargement === true) {
        const identifiant = {};
        identifiant.email = this.login;
        identifiant.password = this.password;
        const datas = await axios.get(`${this.base_url}/sanctum/csrf-cookie`);
        if (datas.status == 204) {
          await this.authentification(identifiant)
            .then((response, status) => {
              if (response.statut === "success" || response.status === 200) {
                this.chargement = false;
                if (response.data.utilisateur.type == "administrateur") {
                  // this.$toast.success("Connexion réussie")
                  this.$router.push("/dashboard/programme");
                } else {
                  // this.$toast.success("Connexion réussie")
                  this.$router.push("/dashboard/projets");
                }
              }
            })
            .catch((error) => {
              console.log(error);
              this.chargement = false;
            });
        } else {
          this.$toast.error("Connexion impossible reesayer !!!");
        }
      }

      //  if (!this.$v.login.$invalid && !this.$v.password.$invalid) {

      //  }
    },

    validate() {
      // validate your form , if you don't have validate prop , default validate pass .
      return true;
    },
    callback(token) {
      // google recaptcha token , then you can pass to backend with your form data .
      if (token) {
        //alert(token);
        this.$toast.success("Confirmer");
        this.isRobot = false;
      } else {
        // if you use data-size show reCAPTCHA , maybe you will get empty token.
        //alert('please check you are not robot');
        this.$toast.error("Verifier que vous n'est pas un robot  !!!");
      }
    },
    invisible() {
      this.statePassword = !this.show ? "text" : "password";
      this.show = !this.show;
      //this.$toast.success('Profile saved',)
    },
  },
  mounted() {
    this.isValidate = localStorage.getItem("activeCompte");
  },

  validations: {
    login: {
      required,
      email,
    },

    password: {
      required,
      minLength: minLength(6),
    },
  },

  watch: {
    loading: function (params) {
      //this.loading = params
    },
  },
};
</script>

<style scoped>
.custom-bg {
  background-color: #0f3460;
}
</style>
