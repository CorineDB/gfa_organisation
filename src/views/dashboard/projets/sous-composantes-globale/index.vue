<template>
  <dashboard>
   <!--  <div v-if="currentRole ==='bailleur'" class="w-full">
      <nav class="text-sm font-semibold flex justify-between items-center " aria-label="Breadcrumb">
        <div>
          <ol class="inline-flex p-0 list-none">
            <li class="flex items-center ">
              <router-link to="#" class="text-gray-600">dashboard</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li class="flex items-center text-blue-500 ">
              <router-link to="/dashboard/projets" class="text-gray-600">projets</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li class="flex items-center text-blue-500 ">
              <router-link to="/dashboard/projets/composantes-globale" class="">composantes</router-link>
            </li>
          </ol>
        </div>
        <div>
          <search-bar ></search-bar>
        </div>
      </nav>
      <div class="mb-0">
       
        <titre>Sous composantes</titre>
      </div>
      <div class="w-1/3">
          <label for="" class="my-2 block">Selectionnez une composante</label>
          <multiselect v-model="value" :options="composantes" @input="demoEcoute(value)" :custom-label="customLabel" :preselect-first="true" placeholder="selectionnez une composantes" label="nom" track-by="id"></multiselect>
      </div>
       <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
        <div v-for="(composante, index) in sous_composantes" :key="index">
          <card-composante
            :libelle="composante.nom"
            :code="composante.code"
            :statut="getStatus(composante.statut)"
            :montantEPM="composante.pret"
            :position="composante.position"
            :poids="composante.poids"
            :bailleur="composante.sigle"
            @validation.once="validation(composante)"
            :isDelete = "false"
            :isUpdate="false"
          ></card-composante>
        </div>
      </div>
    </div> -->
   <div class="w-full">
    <div v-if="composanteReVisible" class="select w-52 
 mb-2" >
        
        <select id="choice" v-model="version" @change="choiceVersion(version)" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg  focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2 ">
          
          <option value="" selected>Version actuelle</option>
  
          <option v-for="(scopePtab, index) in scopes" :key="index" :value="scopePtab.id"> {{scopePtab.nom}}</option>
        </select>
    </div>
    <div class="">
        <sous-composante-current :valeurProjet="null" :valueProfondeur="null" v-if="currentPage"></sous-composante-current>
        <revisite v-else :version="version"></revisite>
    </div>
   </div>
   
  </dashboard>
</template>

<script>

import SousComposanteCurrent from "@/components/SousComposanteCurrent";
import Revisite from "@/components/revisiteSC/Revisite.vue";
import Dashboard from "@/layouts/Dashboard";
import Titre from '@/components/Titre.vue'
import ComposanteService from "@/services/modules/composante.service.js";
import SearchBar from '@/components/SearchBar.vue'
import ProjetService from "@/services/modules/projet.service.js";
import CardComposante from '@/components/CardComposante.vue'
import Multiselect from 'vue-multiselect'
import  { getStringValueOfStatutCode }  from '@/utils/index'
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Dashboard,
    SousComposanteCurrent,
     CardComposante,
    Titre,
    Revisite,
    Multiselect,
    SearchBar
  },
  data() {
    return {
      currentPage:true,
      version:'current',
      composanteVisible:false,
      composanteReVisible:false,
      version: "",
      scopes: [],
      currentRole:'',
      sous_composantes:[],
      idComposante:'',
      composantes:[],
      value:''
    }
  },
  computed: {
    ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})
  },

 
  methods: {
     active() {
        this.$store.dispatch('active')
      },
      disabled() {
        this.$store.dispatch('disabled')
      },
    demoEcoute(value) {
      this.idComposante = value.id
      this.getSComposante(value.id)
    },

    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),
    customLabel ({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if(element.slug ==='voir-une-composante') {
            this.composanteVisible = true
          }
          if(element.slug ==='voir-revision-ptab') {
            this.composanteReVisible = true
          }
        });
    },
    getStatus(status){
      return getStringValueOfStatutCode(status);
    },
    validation(data) {
      const id = data.id
      const datas = {
        statut:-1,
        composanteId:this.idComposante
      }
      ComposanteService.update(id,datas).then(() => {
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
      this.active()
      ComposanteService.sousComposantes(id).then((data) => {
        const datas = data.data.data
        this.sous_composantes = datas
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
  },

  created() {
     if(this.currentUser.programme.id){
      this.currentRole = this.currentUser.type
      const bailleurInfo = JSON.parse(localStorage.getItem("bailleurInfo"));
      if (bailleurInfo) {
        const idProjet = bailleurInfo.id
        this.getComposante(idProjet) 
      }else {
        this.fetchProgrammeScopes(this.currentUser.programme.id).then((response) => {
        this.scopes = response.data.data
        });
      }
      
    }
  },
  mounted() {
    this.getPermission()
    if(!this.composanteVisible) {
      this.$router.push('/401-non-autorise')
    } 
  }


};
</script>

<style></style>
