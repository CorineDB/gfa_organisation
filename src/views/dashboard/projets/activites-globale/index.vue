<template>
  <dashboard>
    <div class="p-0">
      <div class="mb-0">
        <titre>Liste des activités</titre>
      </div>
      <div v-if="activiteReVisible" class="select w-52 m-2">
        <select id="choice" v-model="version" @change="choiceVersion(version)"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

          <option value="" selected>Version actuelle</option>

          <option v-for="(scopePtab, index) in scopes" :key="index" :value="scopePtab.id"> {{scopePtab.nom}}</option>
        </select>
      </div>
      <div class="">
        <activite-current :valueComposante="null" :valeurProjet="null" :valueProfondeur="null" v-if="currentPage">
        </activite-current>
        <revisite v-else :version="version"></revisite>
      </div>
    </div>
  </dashboard>
</template>

<script>

import ActiviteCurrent from "@/components/ActiviteCurrent";
import Revisite from "@/components/revisiteActivite/Revisite.vue";
import Dashboard from "@/layouts/Dashboard";
import ComposanteService from "@/services/modules/composante.service.js";
import SearchBar from '@/components/SearchBar.vue'
import ProjetService from "@/services/modules/projet.service.js";
import Titre from '@/components/Titre.vue'
import CardActivite from '@/components/CardActivite.vue'
import Multiselect from 'vue-multiselect'
import { getStringValueOfStatutCode } from '@/utils/index'
import { mapGetters, mapActions } from "vuex";
import ActiviteService from '@/services/modules/activite.service';

export default {
  components: {
    Dashboard,
    ActiviteCurrent,
    Revisite, Multiselect, SearchBar, Titre, CardActivite, Titre
  },
  data() {
    return {
      currentPage: true,
      version: 'current',
      activiteVisible: false,
      activiteReVisible: false,
      planDecaissementVisible: false,
      version: '',
      scopes: [],
      activites: [],
      composantes: [],
      sous_composantes: [],
      idComposante: '',
      value: '',
      valueSC: ''
    }
  },
  computed: {

    ...mapGetters({
      currentUser: 'auths/GET_AUTHENTICATE_USER',
    }),
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })
  },

  methods: {
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-une-activite') {
          this.activiteVisible = true
        }
        if (element.slug === 'voir-un-plan-de-decaissement') {
          this.planDecaissementVisible = true
        }
        if (element.slug === 'voir-revision-ptab') {
          this.activiteReVisible = true
        }
      });
    },
    validation(data) {
      const id = data.id
      const datas = {
        statut: -1,
        composanteId: this.idComposante,

      }
      ActiviteService.update(id, datas).then(() => {
        this.$toast.success('validation effectué')

      }).catch((error) => {
        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const message = error.response.data.message
          this.$toast.error(message)
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
        }

      })
    },
    choiceVersion(version) {

      if (this.scopes.length > 0) {
        if ('' === version) {
          this.currentPage = true
        } else {
          this.currentPage = false
        }
      } else {
        this.currentPage = true
      }
    },

    demoEcoute(value) {
      this.idComposante = value.id
      this.getSComposante(value.id)
    },
    demoEcouteSC(value) {
      this.getActivite(value.id)
    },
    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),

    getNom(nom, prenom) {

      let name = ''

      if (nom !== undefined && nom !== null) name += nom

      if (prenom !== undefined && prenom !== null) name += prenom

      return name;
    },

    customLabel({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },
    customLabelSC({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },
    getComposante(id) {
      ProjetService.composantes(id).then((data) => {
        const datas = data.data.data
        this.composantes = datas
        this.idComposante = datas[0].id
        this.getSComposante(datas[0].id)
      }).catch((error) => {
        if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }
      })
    },
    getSComposante(id) {
      ComposanteService.sousComposantes(id).then((data) => {
        const datas = data.data.data
        this.sous_composantes = datas
        this.getActivite(datas[0].id)

      }).catch((error) => {
        if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }
      })
    },
    getActivite(id) {
      this.active()
      ComposanteService.activites(id).then((data) => {
        const datas = data.data.data
        this.activites = datas
        this.disabled()
      }).catch((error) => {
        if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }
        this.disabled()
      })
    },
  },

  created() {
    if (this.currentUser.programme.id) {
      this.currentRole = this.currentUser.type
      const bailleurInfo = JSON.parse(localStorage.getItem("bailleurInfo"));
      if (bailleurInfo) {
        const idProjet = bailleurInfo.id
        this.getComposante(idProjet)
      } else {
        this.fetchProgrammeScopes(this.currentUser.programme.id).then((response) => {
          this.scopes = response.data.data
        });
      }

    }
  },

  mounted() {
    this.getPermission()

    if (!this.activiteVisible) {
      this.$router.push('/401-non-autorise')
    }
  }






};
</script>

<style>

</style>
