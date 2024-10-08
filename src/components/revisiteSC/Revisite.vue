<template>
  
 
</template>

<script>


 import { mapGetters, mapMutations, mapActions,mapState } from "vuex";
import { getStringValueOfStatutCode } from '@/utils/index'
import Composante from '@/store/modules/composantes/composante'
import ProgrammeService from "@/services/modules/programme.service.js";

export default {
  components: {
   
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