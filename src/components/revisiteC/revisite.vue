<template>
 
 
</template>

<script>


import  { getStringValueOfStatutCode }  from '@/utils/index'

import { mapGetters, mapActions, mapMutations, mapState} from "vuex";
import ProgrammeService from "@/services/modules/programme.service.js";
import Projet from '@/store/modules/projets/projet'
export default {
  components: {
   
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