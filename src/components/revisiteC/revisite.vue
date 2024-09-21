<template>
  <div class="w-full p-4">
      
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
              <router-link to="/dashboard/projets/composantes-globale" class="">composantes</router-link>
            </li>
          </ol>
        </div>
        <div>
          <search-bar @search="getSearchValue" ></search-bar>
        </div>
      </nav> 

    
    <div class="flex items-center justify-between my-2" >
      <div class="flex space-x-4">
        <span :class="{'border-primary border-b-8 font-bold':seeComposant}" @click="gotoComposante()" class="inline-block cursor-pointer  text-base uppercase    border-primary py-2">les composantes </span>
      </div>
      
      <button v-if=" composanteAdd" @click="addComponent" title="ajouter un projet"   class="px-4 py-2 flex overflow-hidden items-center text-xs font-semibold text-white uppercase  bg-primary focus:outline-none focus:shadow-outline">
          <span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg></span>
          <span class="mx-1 md:mx-2 text-xs font-semibold">AJOUTER</span>
      </button>
     
    </div>
    
    <div v-if="!isSearch">
      <div class="p-2 my-4 rounded-sm shadow-md bg-gray-50">
        <div class="flex items-center justify-between ">
        <!--Filtre sur projet -->
        <div class="w-2/4  flex justify-between  items-center space-x-2 mb-2">
          <multiselect v-model="valueFiltre" :options="projets" :custom-label="customLabel" :preselect-first="true" placeholder="selectionnez un projet" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" label="nom" track-by="id"></multiselect>
         
        </div>
      <!--Filtre sur projet -->
          <nav class="flex  text-xs  md:text-sm align-middle justify-between ">
          <span  @click="toggle2" :class="{'border-yellow-600 text-yellow-600' : pending}" class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer  text-xs">
            Non demarrer
              <span class="px-2 text-base text-yellow-600 border border-yellow-600 rounded-full undefined ">
              {{enAttente.length}}
              </span>
            </span>
            <span  @click="toggle3" :class="{'border-indigo-600 text-indigo-600' : inProgress}" class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer  text-xs">
              En cours
              <span class="px-2 text-base text-indigo-600 border border-indigo-600 rounded-full undefined">
              {{enCours.length}}
              </span>
            </span>
            <span  @click="toggle" :class="{'border-green-600 text-green-600' : success}" class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer  text-xs">
              terminer 
              <span class="px-2 text-base text-green-600 border border-green-600 rounded-full undefined">
              {{terminer.length}}
              </span>
            </span>
            <span  @click="toggle4" :class="{'border-red-600 text-red-600' : retard}" class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer  text-xs">
              en retard
              <span class="px-2 text-base text-red-600 border border-red-600 rounded-full undefined">
              {{retardData.length}}
              </span>
            </span>
           
          </nav>
        </div>
      </div>
     
      <div v-if="pending" >
        <empty v-if="enAttente.length ==0">Ce composant est vide !!!</empty>
        <div v-else class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
          <div v-for="(composante, index) in enAttente" :key="index">
            <card-composante
              :isComposante = "true"
              :data = "composante"
              :libelle="composante.nom"
              :code="composante.codePta"
              :statut="getStatus(composante.statut)"
              :montantEPM="composante.pret"
              :position="composante.position"
              :poids="composante.poids"
              :bailleur="composante.sigle"
              @modifier="modifier(composante)"
              @supprimer="supprimer(composante)"
              @suivre="suivreMyComposant(composante)"
              @gotoNext="gotoNext(composante,index)"
              :isDelete = "composanteDelete"
              :isUpdate="composanteUpdate"
            ></card-composante>
          </div>
        </div>
       
      </div>
      <div v-if="inProgress" >
        <empty v-if="enCours.length === 0">Ce composant est vide !!!</empty>
        <div v-else class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
          <div v-for="(composante, index) in enCours" :key="index">
            <card-composante
              :isComposante = "true"
              :data = "composante"
              :libelle="composante.nom"
              :code="composante.codePta"
              :statut="getStatus(composante.statut)"
              :montantEPM="composante.pret"
              :position="composante.position"
              :poids="composante.poids"
              :bailleur="composante.sigle"
              @modifier="modifier(composante)"
              @supprimer="supprimer(composante)"
              @suivre="suivreMyComposant(composante)"
              @gotoNext="gotoNext(composante,index)"
              :isDelete = "composanteDelete"
              :isUpdate="composanteUpdate"
            ></card-composante>
          </div>
        </div>
      </div>
      <div v-if="success" >
        <empty v-if="terminer.length === 0">Ce composant est vide !!!</empty>
        <div v-else class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
          <div v-for="(composante, index) in terminer" :key="index">
            <card-composante
              :isComposante = "true"
              :data = "composante"
              :libelle="composante.nom"
              :code="composante.codePta"
              :statut="getStatus(composante.statut)"
              :montantEPM="composante.pret"
              :position="composante.position"
              :poids="composante.poids"
              :bailleur="composante.sigle"
              @modifier="modifier(composante)"
              @supprimer="supprimer(composante)"
              @suivre="suivreMyComposant(composante)"
              @gotoNext="gotoNext(composante,index)"
              :isDelete = "composanteDelete"
              :isUpdate="composanteUpdate"
            ></card-composante>
          </div>
        </div>
       
       
      </div>
      <div v-if="retard" >
        <empty v-if="retardData.length === 0">Ce composant est vide !!!</empty>
        <div v-else class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
          <div v-for="(composante, index) in retardData" :key="index">
            <card-composante
              :isComposante = "true"
              :data = "composante"
              :libelle="composante.nom"
              :code="composante.code"
              :statut="getStatus(composante.statut)"
              :montantEPM="composante.pret"
              :position="composante.position"
              :poids="composante.poids"
              :bailleur="composante.sigle"
              @modifier="modifier(composante)"
              @supprimer="supprimer(composante)"
              @suivre="suivreMyComposant(composante)"
              @gotoNext="gotoNext(composante,index)"
              :isDelete = "composanteDelete"
              :isUpdate="composanteUpdate"
            ></card-composante>
          </div>
        </div>
       
       
      </div>
    </div>
    <div v-else>
      <h1 class="py-2 text-xl text-bold ">Resultat de la  Recherche ...</h1>
      <empty v-if="filtere.length ==0">Ce composant est vide !!!</empty>
      <div v-else class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
          <div v-for="(composante, index) in filtere" :key="index">
            <card-composante
              :isComposante = "true"
              :data = "composante"
              :libelle="composante.nom"
              :code="composante.codePta"
              :statut="getStatus(composante.statut)"
              :montantEPM="composante.pret"
              :position="composante.position"
              :poids="composante.poids"
              :bailleur="composante.sigle"
              @modifier="modifier(composante)"
              @supprimer="supprimer(composante)"
              @suivre="suivreMyComposant(composante)"
              @gotoNext="gotoNext(composante,index)"
              :isDelete = "composanteDelete"
              :isUpdate="composanteUpdate"
            ></card-composante>
          </div>
      </div>
    </div>
    
  </div>
 
</template>

<script>

import ModalTopRight from '@/components/ModalTopRight'
import Multiselect from 'vue-multiselect'
import SearchBar from '@/components/SearchBar'
import Titre from '@/components/Titre'
import Vmodal from '@/components/Vmodal'
import Vform from '@/components/Vform'
import Dropdown from '@/components/Dropdown.vue'
import CardComposante from '@/components/CardComposante.vue'
import  { getStringValueOfStatutCode }  from '@/utils/index'
import Suivi from "@/components/revisiteC/Suivi.vue";
import Empty from '@/components/Empty.vue'
import { mapGetters, mapActions, mapMutations, mapState} from "vuex";
import ProgrammeService from "@/services/modules/programme.service.js";
import Projet from '@/store/modules/projets/projet'
export default {
  components: {
    Vmodal,
    Titre,
    Vform,
    SearchBar,
    Multiselect,
    ModalTopRight,
    Dropdown,
    CardComposante,
    Suivi,
    Empty
},
props: ['version'],
  data() {
    return {
      valueFiltre: null,
      pending:false,
      success:true,
      inProgress:false,
      retard:fale,
      rangeValue:0,
      showFiltre:false,
      seeComposant:true,
      seeSuivi:false,
      seeStatistique:false,
      option:[
        {name:"supprimer"},
        {name:"modifier"},
        {name:"dupliquer"},
        {name:"continuer"},
      ],
      composanteAttributs : ['nom', 'description', 'budgetNational', 'pret', 'tepPrevu', 'poids'],
      champs:[

        {name: 'Nom de la composante', key: "nom", type: 'text', placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Pret', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Taux d\'execution physique', key: "tepPrevu", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Description', type: '', key: "description", placeholdere: 'Description du projet', isSelect: false, isTextArea: true, data:'', required: false, errors : []},
      ],

      composanteAdd:false,
      composanteDelete:false,
      composanteUpdate:false,
      actions: [
        { name: "supprimer", iconne: "" },
      ],
      dates:[
        {}
      ],
      programmeId:'',
      results: [],
      projets: [],
      composantes: [],
      suivis:[],
      search:'',
      isSearch:false,
     
    }
    
  },
  
  computed:{

    //importation des variables du module auths
    ...mapState({
      composante: state => state.composantes.composante,
      loading : state => state.loading,
      errors : state => state.errors
    }),
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
      if(this.composantes != undefined) {
        const datas = []
        this.composantes.forEach(element => {
          if(element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enAttente() {
      if(this.composantes != undefined) {
        const datas = []
        this.composantes.forEach(element => {
          if(element.statut == -1 || element.statut == -2 ) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enCours() {
      if(this.composantes != undefined) {
        const datas = []
        this.composantes.forEach(element => {
          if(element.statut == 0) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    retardData() {
      if(this.composantes != undefined) {
        const datas = []
        this.composantes.forEach(element => {
          if(element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    ...mapGetters({
     
      composantes: "composantes/getComposantes",
      composante: "composantes/getComposante",
      currentUser : 'auths/GET_AUTHENTICATE_USER'
    }),
     ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})

  },

  methods: {


    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: 'SET_ERRORS_MESSAGE', // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setComposante: 'composantes/FILL', // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
      setComposantes: 'composantes/SET_LIST_COMPOSANTES'
    }),
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
     getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        
          if(element.slug === 'faire-revision-ptab') {
            this.composanteAdd = true
          }
            if(element.slug === 'faire-revision-ptab') {
              this.composanteUpdate = true
            }
            if(element.slug ==='faire-revision-ptab') {
              this.composanteDelete = true
            }
           
        });
    },
    suivreMyComposant(composante) {
      this.$router.push({name:'dashboard_projets_composantes_globale_suivis',params:{id:composante.id}})
    },

   
    ...mapActions('composantes', {
      fetchComposantes: "FETCH_LIST_COMPOSANTE_OF_PROJET",
      saveComposante: "STORE_COMPOSANTE",
      updateComposante: "UPDATE_COMPOSANTE",
      deleteComposante: "DESTROY_COMPOSANTE"
    }),

    ...mapActions({
      getPtabReviser: "revisionPtab/GET_PTAB_REVISER"
    }),
    
    customLabel ({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },

    getIntervale(val){
      return val - 25;
    },

    filtreRange(value){

      this.rangeValue = value

      /* let composantes = this.composantes.map((composante) => {
        
        if(composante.tep >= this.getIntervale(value) &&  composante.tep <= value){
            return composante;
        }
      }); */

    },

    selectProjet ({ nom}) {
      return `${nom}`
    },

    gotoSuivi() {
      this.seeSuivi = true
      this.seeComposant = false
    },

    gotoComposante() {
      this.seeSuivi = false
      this.seeComposant = true
    },

    toggle() {
      this.pending = false
      this.inProgress = false
      this.success = true
      this.retard = false

    },

    toggle2() {
      this.success = false
      this.inProgress = false
      this.pending = true
      this.retard = false
    },

    toggle3() {
      this.pending = false
      this.success = false
      this.inProgress = true
      this.retard = false
    },
    toggle4() {
      this.pending = false
      this.success = false
      this.inProgress = false
      this.retard = true
    },

    getStatus(status){
      return getStringValueOfStatutCode(status);
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
        "composantes": null
      };

      this.getPtabReviser(params).then((value) => {
        this.results = value.data.data
      })
    },

    errors: function(errors) {
    },

    valueFiltre: function(valeur){
      if( valeur instanceof Projet || valeur instanceof Object )
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
    },
    
    results: function(results){
      this.projets = results['projets'];

      if(results['projets'].length > 0){
        this.projetFiltre = results[0]
      }
    },

    projets: function(projets){
      if(projets.length > 0){
        this.valueFiltre = projets[0]
      }
    },

  },

  created() {
    this.getPermission()
    const params = {
      "version": this.version,
      "composantes": null
    };
    this.programmeId = this.currentUser.programme.id

    this.getPtabReviser(params).then((value) => {
      this.results = value.data.data
      if(this.programmeId){
        this.fetchProjets(this.programmeId)
      } 
    })
  }
  
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>

</style>