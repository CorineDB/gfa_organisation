<template>
  <dashboard>

    <!--  <div v-if="currentRole ==='bailleur'" class="p-0 w-full">
     
      <div class="flex bg-white p-2 shadow space-x-4">
       <div class="w-full p-4">
          <label for="" class="my-2 block">Selectionnez une composante</label>
          <multiselect v-model="value" :options="composantes" @input="demoEcoute(value)" :custom-label="customLabel" :preselect-first="true" placeholder="selectionnez une composantes" label="nom" track-by="id"></multiselect>
       </div>
       <div class="w-full p-4">
          <label for="" class="my-2 block">Selectionnez une sous  composante</label>
          <multiselect v-model="valueSC" :options="sous_composantes" @input="demoEcouteSC(valueSC)" :custom-label="customLabelSC" :preselect-first="true" placeholder="selectionnez une composantes" label="nom" track-by="id"></multiselect>
       </div>
        <div class="w-full p-4">
          <label for="" class="my-2 block">Selectionnez une activité</label>
          <multiselect v-model="valueAC" :options="activites" @input="demoEcouteAC(valueAC)" :custom-label="customLabelSC" :preselect-first="true" placeholder="selectionnez une composantes" label="nom" track-by="id"></multiselect>
       </div>
      </div>
       <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
         <div v-for="(tache, index) in taches" :key="index">
            <card-tache
              :id="tache.id"
              :bailleur="tache.bailleur.sigle"
              :statut="getStatus(tache.statut)"
              :poids="tache.poids"
              :poidsActuel="tache.poidsActuel"
              :libelle="tache.nom"
              :montantNE="tache.montantNE"
              :montantEPM="tache.montantEPM"
              @validation="validation(tache)"
              :isDelete="false"
              :isUpdate="false"
            ></card-tache>
          </div>
      </div>
    </div> -->
    <div class="w-full">
      <div v-if="tacheReVisible" class="select w-52 
 mb-2" >
        <select id="choice" v-model="version" @change="choiceVersion(version)"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="" selected>Version actuelle</option>

          <option v-for="(scopePtab, index) in scopes" :key="index" :value="scopePtab.id">
            {{ scopePtab.nom }}
          </option>
        </select>
      </div>
      <div class="">
        <tache-current v-if="currentPage"></tache-current>
        <revisite v-else :version="version"></revisite>
      </div>
    </div>

  </dashboard>
</template>

<script>
import TacheCurrent from "@/components/TacheCurrent";
import Revisite from "@/components/revisiteTache/Revisite.vue";
import Dashboard from "@/layouts/Dashboard";
import ComposanteService from "@/services/modules/composante.service.js";
import SearchBar from '@/components/SearchBar.vue'
import ProjetService from "@/services/modules/projet.service.js";
import ActiviteService from "@/services/modules/activite.service.js";
import Titre from '@/components/Titre.vue'
import CardTache from '@/components/CardTache.vue'
import Multiselect from 'vue-multiselect'
import { getStringValueOfStatutCode } from '@/utils/index'
import { mapGetters, mapActions } from "vuex";
import TachesService from '@/services/modules/tache.service';

export default {
  components: {
    Dashboard,
    TacheCurrent,
    Revisite, Multiselect, SearchBar, Titre, CardTache, Titre

  },
  data() {
    return {
      currentPage: true,
      version: 'current',
      tacheVisible: false,
      tacheReVisible: false,
      scopes: [],
      activites: [],
      composantes: [],
      sous_composantes: [],
      taches: [],
      value: '',
      valueSC: '',
      valueAc: '',
      activiteId: ''
    }
  },
  computed: {
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })
  },


  computed: {

    ...mapGetters({
      currentUser: 'auths/GET_AUTHENTICATE_USER',
    })
  },

  methods: {
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-une-tache') {
          this.tacheVisible = true
        }
        if (element.slug === 'voir-revision-ptab') {
          this.tacheReVisible = true
        }
      });
    },

    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),

    choiceVersion(version) {
      if (this.scopes.length > 0) {
        if ("" === version) {
          this.currentPage = true;
        } else {
          this.currentPage = false;
        }
      } else {
        this.currentPage = true;
      }
    },
    demoEcoute(value) {
      this.getSComposante(value.id)
    },
    demoEcouteSC(value) {
      this.getActivite(value.id)
    },
    demoEcouteAC(value) {
      this.activiteId = value.id
      this.getTache(value.id)
    },
    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),
    validation(data) {
      const id = data.id
      const datas = {
        statut: -1,
        activiteId: this.activiteId
      }
      TachesService.update(id, datas).then(() => {
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
        this.activiteId = datas[0].id
        this.getTache(datas[0].id)
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
    getTache(id) {
      ActiviteService.taches(id).then((data) => {
        const datas = data.data.data
        this.taches = datas

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

  },

  created() {
    if (this.currentUser.programme.id) {
      this.currentRole = this.currentUser.type
      const bailleurInfo = JSON.parse(localStorage.getItem("bailleurInfo"));
      if (bailleurInfo) {
        const idProjet = bailleurInfo.id
        this.getComposante(idProjet)
      }
      else {
        this.fetchProgrammeScopes(this.currentUser.programme.id).then((response) => {
          this.scopes = response.data.data
        });
      }

    }
  },
  mounted() {
    this.getPermission()
    if (!this.tacheVisible) {
      this.$router.push('/401-non-autorise')
    }
  }
};
</script>

<style>

</style>
