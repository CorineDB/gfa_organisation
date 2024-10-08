<template>

</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getStringValueOfStatutCode } from "@/utils/index";
import ProgrammeService from "@/services/modules/programme.service.js";


export default {
  components: {
   
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
