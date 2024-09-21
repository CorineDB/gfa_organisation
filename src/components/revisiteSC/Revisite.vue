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
              <router-link to="/dashboard/projets/sous-composantes-globale" class="">sous composantes</router-link>
            </li>
          </ol>
        </div>
        <div>
          <search-bar @search="getSearchValue" ></search-bar>
        </div>
      </nav> 

    
    <div class="flex items-center justify-between my-2" >
      <div class="flex space-x-4">
        <span :class="{'border-primary border-b-8 font-bold':seeSousComposantes}" @click="gotoSousComposante()" class="inline-block cursor-pointer  text-base uppercase    border-primary py-2">Sous composantes </span>
      </div>
     
    </div>
    <div v-if="!isSearch">
      <div class="p-2 my-4 rounded-sm shadow-md bg-gray-50">
        <div class="f ">
        <!--Filtre sur projet -->
        <div  class="w-full grid grid-cols-2  gap-2 items-center  mb-2">
      
          <div>
            <label class="block mb-2 uppercase " for="">Selectionnez un projet</label>
            <multiselect v-model="projetFiltre" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" :options="projets" :custom-label="customLabel"  :preselect-first="true" placeholder="selectionnez un projet" label="nom" track-by="id"></multiselect>
          </div>

          <div>
            <label class="block mb-2 uppercase " for="">Selectionnez un composant</label>
            <multiselect v-model="valueFiltre" :options="composantes" :custom-label="customLabel" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" :preselect-first="true" placeholder="selectionnez une composante" label="nom" track-by="id"></multiselect>
          </div>

         
          
        </div>
      <!--Filtre sur projet -->
          <nav  class="flex justify-end p-2 shadow  text-xs space-x-4  md:text-sm align-middle  ">
            <span  @click="toggle2" :class="{'border-yellow-600 text-yellow-600' : pending}" class="inline-block  py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer  text-xs">
              Non demarrer
              <span class="px-2 text-sm text-yellow-600 border border-yellow-600 rounded-full undefined tex-base">
              {{enAttente.length}}
              </span>
            </span>
            <span  @click="toggle3" :class="{'border-indigo-600 text-indigo-600' : inProgress}" class="inline-block  py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer  text-xs">
              en cours
              <span class="px-2 text-base text-indigo-600 border border-indigo-600 rounded-full undefined">
              {{enCours.length}}
              </span>
            </span>
            <span  @click="toggle" :class="{'border-green-600 text-green-600' : success}" class="inline-block  py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer  text-xs">
              terminer 
              <span class="px-2 text-sm text-green-600 border border-green-600 rounded-full undefined">
              {{terminer.length}}
              </span>
            </span>
            <span  @click="toggle4" :class="{'border-red-600 text-red-600' : retard}" class="inline-block  py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer  text-xs">
              en retard 
              <span class="px-2 text-sm text-red-600 border border-red-600 rounded-full undefined">
              {{retardData.length}}
              </span>
            </span>
            
          </nav>
        </div>
      </div>
        <div v-if="pending">
          <empty v-if="enAttente.length === 0">sous composante vide  !!!</empty>
          <div v-else>
            <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(sousComposante, index) in enAttente" :key="index">
                <card-composante
                  :isComposante="false"
                  :data="sousComposante"
                  :libelle="sousComposante.nom"
                  :code="sousComposante.codePta"
                  composanteName="Sous Composante"
                  :statut="getStatus(sousComposante.statut)"
                  :montantEPM="sousComposante.pret"
                  :position="sousComposante.position"
                  :poids="sousComposante.poids"
                  :bailleur="sousComposante.sigle"
                  @modifier="modifier(sousComposante)"
                  @dupliquer="dupliquer(sousComposante)"
                  @supprimer="supprimer(sousComposante)"
                  @suivre="suivreMyComposant(sousComposante)"
                  @gotoNext="gotoNext(sousComposante)"
                  :isDelete = "composanteDelete"
                  :isUpdate="composanteUpdate"
                ></card-composante>
              </div>
            </div>
          </div>
        </div>

        <div v-if="inProgress">
          <empty v-if="enCours.length === 0">sous composante vide  !!!</empty>
          <div v-else>
            <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(sousComposante, index) in enCours" :key="index">
                <card-composante
                  :isComposante="false"
                  :data="sousComposante"
                  :libelle="sousComposante.nom"
                  :code="sousComposante.codePta"
                  composanteName="Sous Composante"
                  :statut="getStatus(sousComposante.statut)"
                  :montantEPM="sousComposante.pret"
                  :position="sousComposante.position"
                  :poids="sousComposante.poids"
                  :bailleur="sousComposante.sigle"
                  @modifier="modifier(sousComposante)"
                  @dupliquer="dupliquer(sousComposante)"
                  @supprimer="supprimer(sousComposante)"
                  @suivre="suivreMyComposant(sousComposante)"
                  @gotoNext="gotoNext(sousComposante)"
                  :isDelete = "composanteDelete"
                  :isUpdate="composanteUpdate"
                ></card-composante>
              </div>
            </div>
          </div>
        </div>

        <div v-if="success">
          <empty v-if="terminer.length === 0">sous composante vide  !!!</empty>
          <div v-else>
            <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(sousComposante, index) in terminer" :key="index">
                <card-composante
                  :isComposante="false"
                  :data="sousComposante"
                  :libelle="sousComposante.nom"
                  :code="sousComposante.codePta"
                  composanteName="Sous Composante"
                  :statut="getStatus(sousComposante.statut)"
                  :montantEPM="sousComposante.pret"
                  :position="sousComposante.position"
                  :poids="sousComposante.poids"
                  :bailleur="sousComposante.sigle"
                  @modifier="modifier(sousComposante)"
                  @dupliquer="dupliquer(sousComposante)"
                  @supprimer="supprimer(sousComposante)"
                  @suivre="suivreMyComposant(sousComposante)"
                  @gotoNext="gotoNext(sousComposante)"
                  :isDelete = "composanteDelete"
                  :isUpdate="composanteUpdate"
                ></card-composante>
              </div>
            </div>
          </div>
        </div>

        <div v-if="retard">
          <empty v-if="retardData.length === 0">sous composante vide  !!!</empty>
          <div v-else>
            <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(sousComposante, index) in retardData" :key="index">
                <card-composante
                  :isComposante="false"
                  :data="sousComposante"
                  :libelle="sousComposante.nom"
                  :code="sousComposante.codePta"
                  composanteName="Sous Composante"
                  :statut="getStatus(sousComposante.statut)"
                  :montantEPM="sousComposante.pret"
                  :position="sousComposante.position"
                  :poids="sousComposante.poids"
                  :bailleur="sousComposante.sigle"
                  @modifier="modifier(sousComposante)"
                  @dupliquer="dupliquer(sousComposante)"
                  @supprimer="supprimer(sousComposante)"
                  @suivre="suivreMyComposant(sousComposante)"
                  @gotoNext="gotoNext(sousComposante)"
                  :isDelete = "composanteDelete"
                  :isUpdate="composanteUpdate"
                ></card-composante>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div v-else>
      <empty v-if="filtere.length === 0">sous composante vide  !!!</empty>
      <div v-else>
        <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
          <div v-for="(sousComposante, index) in filtere" :key="index">
                <card-composante
                  :isComposante="false"
                  :data="sousComposante"
                  :libelle="sousComposante.nom"
                  :code="sousComposante.codePta"
                  composanteName="Sous Composante"
                  :statut="getStatus(sousComposante.statut)"
                  :montantEPM="sousComposante.pret"
                  :position="sousComposante.position"
                  :poids="sousComposante.poids"
                  :bailleur="sousComposante.sigle"
                  @modifier="modifier(sousComposante)"
                  @dupliquer="dupliquer(sousComposante)"
                  @supprimer="supprimer(sousComposante)"
                  @suivre="suivreMyComposant(sousComposante)"
                  @gotoNext="gotoNext(sousComposante)"
                  :isDelete = "composanteDelete"
                  :isUpdate="composanteUpdate"
                ></card-composante>
          </div>
        </div>
      </div>
    </div>

  </div>
 
</template>

<script>
import Vtable from '@/components/Vtable'
import ModalTopRight from '@/components/ModalTopRight'
import Multiselect from 'vue-multiselect'
import SearchBar from '@/components/SearchBar'
import Titre from '@/components/Titre'
import Vmodal from '@/components/Vmodal'
import Vform from '@/components/Vform'
import Dashboard from '@/layouts/Dashboard'
import Dropdown from '@/components/Dropdown.vue'
import Empty from '@/components/Empty.vue'
import CardComposante from '@/components/CardComposante.vue'
 import { mapGetters, mapMutations, mapActions,mapState } from "vuex";
import { getStringValueOfStatutCode } from '@/utils/index'
import Composante from '@/store/modules/composantes/composante'
import ProgrammeService from "@/services/modules/programme.service.js";
import Suivi from "@/components/revisiteSC/Suivi.vue";
export default {
  components: {
    Dashboard,
    Vmodal,
    Titre,
    Vform,
    SearchBar,
    Multiselect,
    ModalTopRight,
    Dropdown,
    CardComposante,
    Suivi,
    Empty,
    Vtable
},
  props: ['version'],

  data() {
    return {
      valueFiltre: null,
      projetFiltre: null,
      pending:false,
      success:true,
      inProgress:false,
      retard:false,
      rangeValue:0,
      showFiltre:false,
      isStateChange:false,
      seeSousComposantes:true,
      seeSuivi:false,
      showInput:true,
      seeStatistique:false,
      option:[
        {name:"supprimer"},
        {name:"modifier"},
        {name:"dupliquer"},
        {name:"continuer"},
      ],

      sousComposanteAttributs : ['nom', 'description', 'budgetNational', 'pret', 'tepPrevu', 'poids'],

      champs:[

        {name: 'Nom du projet', key: "nom", type: 'text', placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Pret', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Taux d\'execution physique', key: "tepPrevu", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Description', type: '', key: "description", placeholdere: 'Description du projet', isSelect: false, isTextArea: true, data:'', required: false, errors : []},
        
      ],
    headers: [
        { name: "Composante", cle: "composante"},
        { name: "code pta", cle: "codePta"},
        { name: "poids initial", cle:'poidsInitial'},
        { name: "poids actuel", cle:'poidsActuel'},
        { name: "date de creation", cle:'created_at'},
      ],
      dataTable:[],
     
      actions: [
        { name: "supprimer", iconne: "" },
      ],
      dates:[
        {}
      ],
      suivis:[],
      composanteAdd:false,
      composanteDelete:false,
      composanteUpdate:false,
      results: [],
      projets: [],
      composantes: [],
      sousComposantes: [],
      suivis:[],
      search:'',
      programmeId:'',
      isSearch:false,
    }
    
  },

  computed:{
    //importation des variables du module auths
    ...mapState({
      sousComposante: state => state.sousComposantes.composante,
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
      if(this.sousComposantes != undefined) {
        const datas = []
        this.sousComposantes.forEach(element => {
          if(element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enAttente() {
      if(this.sousComposantes != undefined) {
        const datas = []
        this.sousComposantes.forEach(element => {
          if(element.statut == -1 || element.statut == -2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enCours() {
      if(this.sousComposantes != undefined) {
        const datas = []
        this.sousComposantes.forEach(element => {
          if(element.statut == 0) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    retardData() {
      if(this.sousComposantes != undefined) {
        const datas = []
        this.sousComposantes.forEach(element => {
          if(element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    ...mapGetters({

      composantes: "composantes/getComposantes",
      sousComposante: "sousComposantes/getSousComposante",
      sousComposantes: "sousComposantes/getSousComposantes",
      currentUser : 'auths/GET_AUTHENTICATE_USER'
    }),
     ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})

  },

  methods: {

    ...mapActions({
      getPtabReviser: "revisionPtab/GET_PTAB_REVISER"
    }),

    suivreMyComposant(sousComposante) {
      this.$router.push({name:'dashboard_projets_sous_composantes_globale_suivis',params:{id:sousComposante.id}})
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

    getSuivi() {
      ComposanteService.getSuivi().then((data) => {
        const datas = data.data.data
        datas.forEach(element => {
          const composante = element.composante.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({composante:composante,codePta:codePta,poidsInitial:poidsInitial,poidsActuel:poidsActuel,created_at:created_at})
        })
        
       
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
  
    customLabel ({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },

    getIntervale(val){
      return val - 25;
    },

    getStatus(status){
      return getStringValueOfStatutCode(status);
    },

    filtreRange(value){

      this.rangeValue = value

    },

    selectProjet ({ nom}) {
      return `${nom}`
    },

     gotoSuivi() {
      this.seeSuivi = true
      this.seeSousComposantes = false
    },

    gotoComposante() {
      this.seeSuivi = false
      this.seeSousComposantes = true
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
        "sous-composantes": null
      };

      this.getPtabReviser(params).then((value) => {
        this.results = value.data.data
      })
    },    

    valueFiltre: function(valeur){
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
    },

    projetFiltre: function(valeur){
      if( valeur instanceof Composante || valeur instanceof Object )
      {
        this.composantes = this.results['composantes'].filter((value) => {
          if(value.projetId === valeur.id) return value;
        });
      }
      else if( valeur !== null ){
        this.composantes = this.results['composantes'].filter((value) => {
          if(value.projetId === valeur) return value;
        });
      }
    },
    
    composantes: function(composantes){
      this.valueFiltre = composantes[0]
    },
    
    projets: function(projets){
      this.projetFiltre = projets[0]
      this.valueFiltre = []
    },
    
    results: function(results){
      this.projets = results['projets'];

      if(results['projets'].length > 0){
        this.projetFiltre = results[0]
      }
    }

  },

  created() {
    this.getSuivi()
    const params = {
      "version": this.version,
      "composantes": null,
      "sous-composantes": null,
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