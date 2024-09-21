<template>
  <div class="w-full p-4">

      <nav
        class="text-xs md:text-sm font-semibold flex justify-between items-center flex-wrap"
        aria-label="Breadcrumb"
      >
        <div>
          <ol class="inline-flex p-0 list-none">
            <li class="flex items-center">
              <router-link to="#" class="text-gray-600"
                >dashboard</router-link
              >
              <svg
                class="w-3 h-3 mx-3 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
                />
              </svg>
            </li>
            <li class="flex items-center">
              <router-link to="/dashboard/projets" class="text-gray-600"
                >projets</router-link
              >
              <svg
                class="w-3 h-3 mx-3 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
                />
              </svg>
            </li>

            <li class="flex items-center text-blue-500">
              <router-link to="" class="">activites</router-link>
            </li>
          </ol>
        </div>
        <div>
          <search-bar @search="getSearchValue"></search-bar>
        </div>
      </nav>

      <div class="flex items-center justify-between my-2" >
        <div class="flex space-x-4">
          <span
            v-if="activiteVisible"
            :class="{ 'border-primary border-b-8 font-bold': seeActivite }"
            @click="gotoActivite()"
            class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase border-primary py-2"
            >Activités</span
          >
          <span
            v-if="planDecaissementVisible"
            :class="{ 'border-primary border-b-8 font-bold': seePlan }"
            @click="gotoPlan()"
            class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase py-2"
            >Plan d'ecaissement
          </span>
         
          <span
          v-if="StatistiqueVisible"
            :class="{ 'border-primary border-b-8 font-bold': seeStatistique }"
            @click="gotoStatistique()"
            class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase py-2"
            >Statistiques
          </span>
        </div>

        <button
          v-if="seeActivite && activiteVisible"
          @click="addActivite"
          title="ajouter une activite"
          class="px-2 py-1  md:px-4 md:py-2 flex overflow-hidden items-center text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: "
            >
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg
          ></span>
          <span class="mx-1 md:mx-2 text-xs font-semibold">ajouter une activité</span>
        </button>
        <button
          v-if="seePlan && planDecaissementVisible"
          @click="addPlan"
          title="ajouter un plan d'ecaissement"
          class="p-2 overflow-hidden flex space-x-2 items-center text-xs font-semibold text-white uppercase  bg-primary focus:outline-none focus:shadow-outline"
        >
        <span
            ><svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1.3em"
              width="1.3em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path
                d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM17 11h-4v4h-2v-4H7V9h4V5h2v4h4v2z"
              ></path></svg
          ></span>
          <span class="mx-2 text-xs  md:text-sm font-semibold"
            >ajouter un plan de décaissement</span
          >
        </button>
      </div>

      <div class="p-2 my-4 rounded-sm shadow-md bg-gray-50">
          <div class="flex items-center justify-between flex-wrap">
            <!--Filtre sur projet -->
            <div class="w-full grid grid-cols-2 items-center gap-4">
              <div>
                <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un projet</label>
                <multiselect v-model="projetFiltre"  :options="projets" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" :preselect-first="true" :custom-label="customLabel" placeholder="selectionnez un projet" label="nom" track-by="id"></multiselect>
              </div>

              <div>
                <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un composant</label>
                <multiselect v-model="composanteFiltre"  :options="composantes" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" :preselect-first="true" :custom-label="customLabel" placeholder="selectionnez une composante" label="nom" track-by="id"></multiselect>
              </div>
              <div>
                
              <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un sous  composant</label>
                <multiselect
                v-model="valueFiltre"
                :options="sousComposantes"
                :preselect-first="true"
                :custom-label="customLabel" 
                placeholder="selectionnez une sous composante"
                :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné"
                label="nom"
                track-by="id"
              ></multiselect>
              </div>
           
              <div></div>
              
            </div>
           
          </div>

      </div>

      <div v-if="seeActivite && activiteVisible">
      
        <div v-if="!isSearch" class="version sans recherche">
          <div class="py-2 px-4 mt-4 rounded-sm shadow-md relative bg-white">
            <div class="flex  w-full justify-between  items-center">
              <!--Filtre sur projet -->
              <span class="uppercase font-bold  mb-2">Liste des activités </span>
              <nav class="flex text-sm space-x-4  ">
                  <span
                    @click="toggle2"
                    :class="{ 'border-yellow-600 text-yellow-600': pending }"
                    class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
                  >
                    Non demarrer
                    <span
                      class="px-2 text-base text-yellow-600 border border-yellow-600 rounded-full undefined "
                    >
                      {{enAttente.length}}
                    </span>
                  </span>
                  <span
                    @click="toggle3"
                    :class="{ 'border-indigo-600 text-indigo-600': inProgress }"
                    class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
                  >
                    en cours
                    <span
                      class="px-2 text-base text-indigo-600 border border-indigo-600 rounded-full undefined"
                    >
                      {{enCours.length}}
                    </span>
                  </span>
                  <span
                    @click="toggle"
                    :class="{ 'border-green-600 text-green-600': success }"
                    class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
                  >
                    terminer
                    <span
                      class="px-2 text-base text-green-600 border border-green-600 rounded-full undefined"
                    >
                      {{terminer.length}}
                    </span>
                  </span>

                  <span
                    @click="toggle4"
                    :class="{ 'border-red-600 text-red-600': retard }"
                    class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
                  >
                    en retard
                    <span
                      class="px-2 text-base text-red-600 border border-red-600 rounded-full undefined"
                    >
                      {{retardData.length}}
                    </span>
                  </span>
                 
              </nav>
            </div>
          </div>

          <div v-if="success">
            <empty v-if="terminer.length === 0">activité vide !!!</empty>
            <div v-else>
              <div class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
                <div  v-for="(activite, index) in terminer" :key="index">
                <card-activite
                  :data="activite"
                  :bailleur="activite.bailleur.sigle"
                  :libelle="activite.nom"
                  :poids="activite.poids"
                  :code="activite.codePta"
                  :montantEPM="activite.pret"
                  :montantNE="activite.budgetNational"
                  :debut="activite.debut"
                  :fin="activite.fin"
                  :statut="getStatus(activite.statut)"
                  :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                  @modifier="modifier(activite)"
                  @supprimer="supprimer(activite)"
                  @suivre="suivreMyActivite(activite)"
                  @gotoNext="gotoNext(activite)"
                  :isDelete="activiteDelete"
                  :isUpdate="activiteUpdate"
                ></card-activite>
                <!-- End cards Activités -->
            </div>
              </div>
            </div>
          </div>

          <div v-if="retard">
            <empty v-if="retardData.length === 0">activité vide !!!</empty>
            <div v-else>
              <div class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
                <div  v-for="(activite, index) in retardData" :key="index">
                <card-activite
                  :data="activite"
                  :bailleur="activite.bailleur.sigle"
                  :libelle="activite.nom"
                  :poids="activite.poids"
                  :code="activite.codePta"
                  :montantEPM="activite.pret"
                  :montantNE="activite.budgetNational"
                  :debut="activite.debut"
                  :fin="activite.fin"
                  :statut="getStatus(activite.statut)"
                  :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                  @modifier="modifier(activite)"
                  @supprimer="supprimer(activite)"
                  @suivre="suivreMyActivite(activite)"
                  @gotoNext="gotoNext(activite)"
                  :isDelete="activiteDelete"
                  :isUpdate="activiteUpdate"
                ></card-activite>
                <!-- End cards Activités -->
            </div>
              </div>
            </div>
          </div>

          <div v-if="pending">
            <empty v-if="enAttente.length === 0">activité vide !!!</empty>
            <div v-else>
              <div class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
                <div  v-for="(activite, index) in enAttente" :key="index">
                <card-activite
                  :data="activite"
                  :bailleur="activite.bailleur.sigle"
                  :libelle="activite.nom"
                  :poids="activite.poids"
                  :code="activite.codePta"
                  :montantEPM="activite.pret"
                  :montantNE="activite.budgetNational"
                  :debut="activite.debut"
                  :fin="activite.fin"
                  :statut="getStatus(activite.statut)"
                  :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                  @modifier="modifier(activite)"
                  @supprimer="supprimer(activite)"
                  @suivre="suivreMyActivite(activite)"
                  @gotoNext="gotoNext(activite)"
                  :isDelete="activiteDelete"
                  :isUpdate="activiteUpdate"
                ></card-activite>
                <!-- End cards Activités -->
            </div>
              </div>
            </div>
          </div>

          <div v-if="inProgress">
            <empty v-if="enCours.length === 0">activité vide !!!</empty>
            <div v-else>
              <div class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
                <div  v-for="(activite, index) in enCours" :key="index">
                <card-activite
                  :data="activite"
                  :bailleur="activite.bailleur.sigle"
                  :libelle="activite.nom"
                  :poids="activite.poids"
                  :code="activite.codePta"
                  :montantEPM="activite.pret"
                  :montantNE="activite.budgetNational"
                  :debut="activite.debut"
                  :fin="activite.fin"
                  :statut="getStatus(activite.statut)"
                  :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                  @modifier="modifier(activite)"
                  @supprimer="supprimer(activite)"
                  @suivre="suivreMyActivite(activite)"
                  @gotoNext="gotoNext(activite)"
                  :isDelete="activiteDelete"
                  :isUpdate="activiteUpdate"
                ></card-activite>
                <!-- End cards Activités -->
            </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <empty v-if="allData.length === 0">activité vide !!!</empty>
          <div v-else>
              <div class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
                <div  v-for="(activite, index) in allData" :key="index">
                <card-activite
                  :data="activite"
                  :bailleur="activite.bailleur.sigle"
                  :libelle="activite.nom"
                  :poids="activite.poids"
                  :code="activite.codePta"
                  :montantEPM="activite.pret"
                  :montantNE="activite.budgetNational"
                  :debut="activite.debut"
                  :fin="activite.fin"
                  :statut="getStatus(activite.statut)"
                  :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                  @modifier="modifier(activite)"
                  @supprimer="supprimer(activite)"
                  @suivre="suivreMyActivite(activite)"
                  @gotoNext="gotoNext(activite)"
                  :isDelete="activiteDelete"
                  :isUpdate="activiteUpdate"
                ></card-activite>
                <!-- End cards Activités -->
            </div>
              </div>
          </div>
        </div>

        
      </div>

      <div v-if="seePlan && planDecaissementVisible">
        <plan :results="results" :isDelete="planDecaissementDelete" :isUpdate="planDecaissementUpdate"></plan>
      </div>

      <div v-if="seeStatistique && statistiqueActiviteVisible ">
        <statistiques ></statistiques>
      </div>
  </div>
</template>

<script>

import Multiselect from "vue-multiselect";
import Dropdown from "@/components/Dropdown";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import Titre from "@/components/Titre";
import CardActivite from "@/components/CardActivite";
import Vmodal from "@/components/Vmodal";
import Vform from "@/components/Vform";
import ModalTopRight from "@/components/ModalTopRight";
import Plan from "@/components/revisiteActivite/Plan.vue";
import Suivi from "@/components/revisiteActivite/Suivi.vue";
import Empty from '@/components/Empty.vue'
import Statistiques from "@/components/revisiteActivite/Statistiques.vue";
import Dashboard from "@/layouts/Dashboard";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getStringValueOfStatutCode } from "@/utils/index";
import Composante from "@/store/modules/composantes/composante";
import ProgrammeService from "@/services/modules/programme.service.js";
import Activite from '@/store/modules/activites/activite';

export default {
  components: {
    Dashboard,
    Vmodal,
    ModalTopRight,
    Titre,
    SearchBar,
    Card,
    Multiselect,
    Dropdown,
    CardActivite,
    Vform,
    Plan,
    Suivi,
    Empty,
    Statistiques,
  },

  props:['version'],
  data() {
    return {
      suivis:[],
      valueFiltre: null,
      activiteFiltre: null,
      composanteId: null,
      projetFiltre: null,
      composanteFiltre: null,
      pending: false,
      success: true,
      inProgress: false,
      retard:false,
      activiteId:'',
      cols: 1,
      sendRequest: false,
      rangeValue: 0,
      showFiltre: false,
      chargement:false,
      projets: [],
      composantes: [],
      sousComposantes: [],
      activites: [],
      taches: [],
      suivis: [],
      results: [],
      planDeDecaissements: [],
      
      dates:{debut: '', fin: ''},
    
      showModal2: false,
      line: false,
      mosaique: true,
      showInput: true,
      isStateChange: false,
      seeStatistique: false,
      seePlan: false,
      seeActivite: true,
      option: [{ name: "supprimer" }, { name: "modifier" }],
      optionActivite: [
        { name: "supprimer" },
        { name: "modifier" }
      ],

      dates: {
        debut:'',fin:''
      },
      activiteVisible:false,
      activiteAdd:false,
      activiteDelete:false,
      activiteUpdate:false,
      planDecaissementVisible:false,
      planDecaissementAdd:false,
      planDecaissementUpdate:false,
      planDecaissementDelete:false,
      StatistiqueVisible:false,
      search:'',
      programmeId:'',
      isSearch:false,
    };
  },
  computed:{
    allData() {
      if(this.terminer != undefined || this.enAttente != undefined || this.enCours != undefined || this.retardData != undefined) {
        return  [].concat(this.terminer,this.enAttente,this.enCours,this.retardData)
      }
    },
    filtere: function () {
        var self = this;
          return this.allData.filter(function (data) {
          return data.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      });
    },
    terminer() {
      if(this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if(element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enAttente() {
      if(this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if(element.statut == -1 || element.statut == -2 ) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enCours() {
      if(this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if(element.statut == 0) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    retardData() {
      if(this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if(element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})
  },

  methods: {
    //Charger les fonctions de communication avec le serveur

    ...mapActions({
      getPtabReviser: "revisionPtab/GET_PTAB_REVISER"
    }),
    
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
       
          if(element.slug === 'faire-revision-ptab') {
            this.activiteAdd = true
          }
           if(element.slug === 'voir-revision-ptab') {
            this.activiteVisible = true
          }
            if(element.slug === 'faire-revision-ptab') {
              this.activiteUpdate = true
            }
            if(element.slug ==='faire-revision-ptab') {
              this.activiteDelete = true
            }
            //plan de decaissement

            if(element.slug ==='voir-revision-ptab') {
              this.planDecaissementVisible= true
            }
            if(element.slug ==='faire-revision-ptab') {
              this.planDecaissementAdd= true
            }
            if(element.slug ==='faire-revision-ptab') {
              this.planDecaissementUpdate= true
            }
            if(element.slug ==='faire-revision-ptab') {
              this.planDecaissementDelete= true
            }
            if(element.slug ==='voir-revision-ptab') {
              this.StatistiqueVisible= true
            }
           
        });
    },
    getSearchValue(data) {
      if(data != '') {
        this.isSearch = true
        this.search = data
      }
      else {
        this.isSearch = false
        this.search = data
      }
      
    },


    customLabel ({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },

    filtreRange(value) {
      this.rangeValue = value;
    },

    gotoActivite() {
      this.seePlan = false;
      this.seeActivite = true;
      this.seeSuivi = false;
      this.seeStatistique = false;
      this.activites = this.results['activites'].filter((value) => {
        if(value.composanteId === this.composanteId) return value;
      })
    },

    gotoStatistique() {
      this.seePlan = false;
      this.seeActivite = false;
     
      this.seeStatistique = true;
    },

    gotoPlan() {
      this.seePlan = true;
      this.seeActivite = false;
     
      this.seeStatistique = false;
    },

    getNom(nom, prenom) {

      let name = ''

      if(nom !== undefined && nom !== null) name+= nom

      if(prenom !== undefined && prenom !== null ) name+= prenom

      return name;
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },
    toggle() {
      this.pending = false;
      this.inProgress = false;
      this.success = true;
      this.retard = false
    },

    toggle2() {
      this.success = false;
      this.inProgress = false;
      this.pending = true;
      this.retard = false
    },

    toggle3() {
      this.pending = false;
      this.success = false;
      this.inProgress = true;
      this.retard = false
    },
    toggle4() {
      this.pending = false;
      this.success = false;
      this.inProgress = false;
      this.retard = true
    },

    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    fetchProjets(programme) {
      this.active()
      ProgrammeService.projets(programme).then((data) => {
        const datas = data.data.data
        this.projets = datas
        this.disabled()
      }).catch((error) => {
        this.disabled()
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


  },

  watch: {

    version: function (version) {
      const params = {
        "version": version,
        "composantes": null,
        "sous-composantes": null,
        "activites": null
      };

      this.getPtabReviser(params).then((value) => {
        this.results = value.data.data
      })
    },

    errors: function (errors) {

    },

    results: function(results){
      this.projets = results['projets'];

      if(results['projets'].length > 0){
        this.projetFiltre = results[0]
      }
    },

    projets: function(projets){
      if(projets.length > 0){
        this.projetFiltre = projets[0]
      }
    },

    projetFiltre: function(valeur){

      if( valeur instanceof Composante || valeur instanceof Object )
      {
        this.composantes = this.results['composantes'].filter((value) => {
          if(value.projetId === valeur.id) return value;
        })
      }
      else if( valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0 ){

        this.composantes = this.results['composantes'].filter((value) => {
          if(value.projetId === valeur) return value;
        })
      }
      else{
        this.composantes = [];
      }
    },
    
    composantes: function (composantes) {
      if(composantes.length > 0){
        this.composanteFiltre = composantes[0]
      }
      else{
        this.composanteFiltre = null
      }
    },

    composanteFiltre: function(valeur){

      if( valeur instanceof Composante || valeur instanceof Object )
      {
        this.sousComposantes = this.results['sous-composantes'].filter((value) => {
          if(value.composanteId === valeur.id) return value;
        })
      }
      else if( valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0 ){

        this.sousComposantes = this.results['sous-composantes'].filter((value) => {
          if(value.composanteId === valeur) return value;
        })
      }
      else{ 
        this.sousComposantes = [];
      }
    }, 

    sousComposantes: function (sousComposantes) {
      if(sousComposantes.length > 0){
        this.valueFiltre = sousComposantes[0];
      }
      else if(this.composanteFiltre !== null && typeof this.composanteFiltre !== 'undefined' && this.composanteFiltre.length !== 0  ){

        this.activites = this.results['activites'].filter((value) => {
          if(value.composanteId === this.composanteFiltre.id) return value;
        })
        this.composanteId = this.composanteFiltre.id
        this.valueFiltre = null;
      }
      else{
        this.valueFiltre = null;
      }
    },

    valueFiltre: function (valeur) {
      
      if (valeur instanceof Composante || valeur instanceof Object) {

        this.activites = this.results['activites'].filter((value) => {
          if(value.composanteId === valeur.id) return value;
        })
        this.composanteId = valeur.id
      } 

      else if( valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0 ){

        this.activites = this.results['activites'].filter((value) => {
          if(value.composanteId === valeur) return value;
        })
        this.composanteId = valeur
      }

    },
    
    activites: function (activites) {
      if(this.seePlan){
        if(activites.length > 0){
          this.activiteFiltre = activites[0]
        }
      }
    },

    activiteFiltre: function(valeur){
      if( valeur instanceof Activite || valeur instanceof Object )
      {

        this.planDeDecaissements = this.results['planDeDecaissements'].filter((value) => {
          if(value.activiteId === valeur.id) return value;
        })

      }
      else if( valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0 ){

        this.planDeDecaissements = this.results['planDeDecaissements'].filter((value) => {
          if(value.activiteId === valeur) return value;
        })
      }
      else{
        this.planDeDecaissements = [];
      }
    },

    seePlan: function(valeur){
      if(this.activites.length > 0){
        this.activiteFiltre = this.activites[0]
      }
    }

  },

  created() {
    this.getPermission()
    const params = {
      "version": this.version,
      "composantes": null,
      "sous-composantes": null,
      "activites": null
    };
    this.programmeId = this.currentUser.programme.id
    this.getPtabReviser(params).then((value) => {
      this.results = value.data.data
      if(this.programmeId){
        this.fetchProjets(this.programmeId)
      } 
    })
  }

};
</script>

<style></style>
