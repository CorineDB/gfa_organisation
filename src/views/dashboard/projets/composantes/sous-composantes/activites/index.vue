<template>
  <dashboard>
   <div v-if="activiteVisible || planDecaissementVisible" class="w-full">
    <div class="select w-52 
 mb-2" >
      <select id="choice" v-model="version" @change="choiceVersion(version)" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg  focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2 ">
        
        <option value="" selected>Version actuelle</option>

        <option v-for="(scopePtab, index) in scopes" :key="index" :value="scopePtab.id"> {{scopePtab.nom}}</option>
      </select>
    </div>
    <div class="">
        <activite-current :valueComposante="{codePta:$route.params.codeC,nom:$route.params.nomC}" :valeurProjet="{codePta:$route.params.codeP,nom:$route.params.nomP}" :valueProfondeur="{codePta:$route.params.code,nom:$route.params.nom}"  v-if="currentPage"></activite-current>
        <revisite v-else :version="version"></revisite>
    </div>
   </div>
    <div v-if="currentRole ==='bailleur'" class="w-full">
      <nav class="mb-2 mt-4 text-sm font-semibold flex justify-between items-center 	" aria-label="Breadcrumb">
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
              <router-link to="/dashboard/projets/composantes-globale" class="">activité</router-link>
            </li>
          </ol>
        </div>
        <div>
          <search-bar ></search-bar>
        </div>
      </nav>
      <div class="mb-0">
       
        <titre>Liste des activités</titre>
      </div>
      <div class="flex bg-white p-2 shadow space-x-4 w-3/4">
       <div class="w-full p-4">
          <label for="" class="my-2 block">Selectionnez une composante</label>
          <multiselect v-model="value" :options="composantes" @input="demoEcoute(value)" :custom-label="customLabel" :preselect-first="true" placeholder="selectionnez une composantes" label="nom" track-by="id"></multiselect>
       </div>
       <div class="w-full p-4">
          <label for="" class="my-2 block">Selectionnez une sous  composante</label>
          <multiselect v-model="valueSC" :options="sous_composantes" @input="demoEcouteSC(valueSC)" :custom-label="customLabelSC" :preselect-first="true" placeholder="selectionnez une composantes" label="nom" track-by="id"></multiselect>
       </div>
      </div>
       <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
        <div v-for="(activite, index) in activites" :key="index">
            <card-activite
              :bailleur="activite.bailleur.sigle"
              :libelle="activite.nom"
              :poids="activite.poids"
              :montantEPM="activite.pret"
              :montantNE="activite.budgetNational"
              :debut="activite.debut"
              :fin="activite.fin"
              :statut="getStatus(activite.statut)"
              @validation="validation(activite)"
              :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
              :isDelete="false"
              :isUpdate="false"
            ></card-activite>
            <!-- End cards Activités -->
          </div>
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
import  { getStringValueOfStatutCode }  from '@/utils/index'
import { mapGetters, mapActions } from "vuex";
import ActiviteService from '@/services/modules/activite.service';

export default {
  components: {
    Dashboard,
    ActiviteCurrent,
    Revisite,Multiselect, SearchBar,Titre,CardActivite,Titre
  },
  data() {
    return {
      currentPage:true,
      version:'current',
      activiteVisible:false,
      planDecaissementVisible:false,
      version: '',
      scopes: [],
      activites:[],
      composantes:[],
      sous_composantes:[],
      idComposante:'',
      value:'',
      valueSC:''
    }
  },
   computed: {
    
    ...mapGetters({
      currentUser : 'auths/GET_AUTHENTICATE_USER',
    }),
     ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})
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
          if(element.slug ==='voir-une-activite') {
            this.activiteVisible = true
          }
          if(element.slug ==='voir-un-plan-de-decaissement') {
            this.planDecaissementVisible= true
          }
        });
    },
    validation(data) {
      const id = data.id
      const datas = {
        statut:-1,
        composanteId:this.idComposante,
      
      }
      ActiviteService.update(id,datas).then(() => {
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

      if(this.scopes.length > 0)
      {
        if('' === version ){
          this.currentPage = true
        }else{
          this.currentPage = false
        }
      }else{
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

      if(nom !== undefined && nom !== null) name+= nom

      if(prenom !== undefined && prenom !== null ) name+= prenom

      return name;
    },

    customLabel ({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },
    customLabelSC ({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },
   
    getStatus(status){
      return getStringValueOfStatutCode(status);
    },
    getComposante(id) {
      ProjetService.composantes(id).then((data) => {
        const datas = data.data.data
        this.composantes = datas
        this.idComposante = datas[0].id
        this.getSComposante(datas[0].id)
      }).catch((e) => {
        console.log(e)
      })
    },
    getSComposante(id) {
      ComposanteService.sousComposantes(id).then((data) => {
        const datas = data.data.data
        this.sous_composantes = datas
        this.getActivite(datas[0].id)
       
      }).catch((e) => {
        console.log(e)
      })
    },
     getActivite(id) {
       this.active()
      ComposanteService.activites(id).then((data) => {
        const datas = data.data.data
        this.activites = datas
       this.disabled()
      }).catch((e) => {
        console.log(e)
        this.disabled()
      })
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
  }

 
    
 


};
</script>

<style></style>
