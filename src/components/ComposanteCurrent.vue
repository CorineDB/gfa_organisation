<template>
  
 
</template>

<script>

import { mapGetters, mapActions, mapMutations, mapState} from "vuex";
import  { extractFormData, getStringValueOfStatutCode }  from '@/utils/index'

import ComposanteService from "@/services/modules/composante.service.js";
import ProgrammeService from "@/services/modules/programme.service.js";
export default {
  components: {
   
},
props:['valueProfondeur'],
  data() {
    return {
      savedInput:[],
      valueFiltre: this.valueProfondeur,
      pending:false,
      success:true,
      inProgress:false,
      retard:false,
      rangeValue:0,
      showFiltre:false,
      programmeId: '',
      cols:1,
      sendRequest: false,
      submitText:"Enregistrer",
      showModal:false,
      line:false,
      mosaique:true,
      isStateChange:false,
      seeComposant:true,
      seeSuivi:false,
      search:'',
      isSearch:false,
      showInput:true,
      seeStatistique:false,
      composanteAttributs : ['nom', 'description', 'budgetNational', 'pret', 'poids'],
      champs:[
        {name: 'Nom de la composante', key: "nom", type: 'text', placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Prêt', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Description', type: '', key: "description", placeholdere: 'Description du projet', isSelect: false, isTextArea: true, data:'', required: false, errors : []},
      ],
       headers: [
        { name: "Composante", cle: "composante"},
        { name: "code pta", cle: "codePta"},
        { name: "poids initial", cle:'poidsInitial'},
        { name: "poids actuel", cle:'poidsActuel'},
        { name: "date de création", cle:'created_at'},
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
      position:0,
      isClick:false,
      idProjet:'',
      projets:[],
      deleteData:{},
      deleteModal:false,
      
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

    suivreMyComposant(composante) {
      this.$router.push({name:'dashboard_projets_composantes_globale_suivis',params:{id:composante.id}})
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
        if(element.slug === 'creer-une-composante') {
          this.composanteAdd = true
        }
        if(element.slug === 'modifier-une-composante') {
          this.composanteUpdate = true
        }
        if(element.slug ==='supprimer-une-composante') {
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

    ...mapActions('composantes', {
      fetchComposantes: "FETCH_LIST_COMPOSANTE_OF_PROJET",
      saveComposante: "STORE_COMPOSANTE",
      updateComposante: "UPDATE_COMPOSANTE",
      deleteComposante: "DESTROY_COMPOSANTE"
    }),

   

    customLabelP ({ bailleur, nom }) {
      return `${bailleur.sigle} – ${nom}`
    },
    customLabel({ codePta, nom }) {
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

    addDate() {
      this.dates.push({})
    },

    gotoSuivi() {
      this.seeSuivi = true
      this.seeComposant = false
    },

    gotoComposante() {
      this.seeSuivi = false
      this.seeComposant = true
    },

    gotoNext(composante,index) {
      let indexP = 0
      let codeP = ''
      let nomP =''
      for (let index = 0; index < this.projets.length; index++) {
        const element = this.projets[index];
        if(element.id == composante.projetId ) {
          indexP = index
          codeP = element.codePta
          nomP = element.nom
        }
        
      }
      let codeC = composante.codePta
      let nomC = composante.nom

      const profondeurComposante = {
        isClick:true,
        positionP:indexP,
        idP:composante.projetId,
        positionC:index,
        idC:composante.id,
        projet:{codePta:codeP,nom:nomP},
        composante:{codePta:codeC,nom:nomC}
      }
     
      localStorage.setItem('profondeurComposante',JSON.stringify(profondeurComposante));
      this.$router.push({name:'dashboard_projets_sous_composantes_globale'})
    },

    editerSuivi(index) {
      this.showInput = false
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
    
    addComponent() {
      this.title ="Ajouter"

      this.submitText="Enregistrer",

      this.showCloseModal(true)
    },

    modifier(composante) {
      
      localStorage.removeItem('formData')

      this.title = 'Modifier un composante'

      this.setComposante(composante)

      this.composanteAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if(value.key === item){
            this.champs[index]['data'] = composante[item]
          }

        });

      });

      this.submitText = "Modifier",

      this.showCloseModal(true)
    },

    supprimer(composante,index) {
      this.deleteModal= true
      this.deleteData.data = composante
      this.deleteData.index = index
    },
    deleteComposante(data) {
      //this.filteredBailleur.splice(data.index,1)
      this.deleteModal= false
      ComposanteService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.fetchComposantes(this.valueFiltre.id);
       
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


   
    dupliquer(composante) {

      this.title = "Ajouter un nouveau  composant";

      this.submitText = "Enrégistrer";

      this.composanteAttributs.forEach((item) => {

        this.champs.find((value, index) => {
            this.champs[index]['data'] = composante[item]

        });

      });
      
      this.showCloseModal(true);
      
    },

    resetForm(){

      this.champs = this.champs.map(item => { item['data'] = ''; item['errors'] = []; return item})
      
      window.document.getElementById('vform').reset()

      this.setComposante({})
    },
    

    getStatus(status){
      return getStringValueOfStatutCode(status);
    },
    validation() {
     
      this.fetchComposantes(this.valueFiltre.id);
    },

    sendForm() {

      if( this.sendRequest === false ){

        this.sendRequest = true;

        this.champs = this.champs.map(item => { item.errors = []; return item})

        let composante = extractFormData(this.champs, this.composanteAttributs)

        composante.projetId = this.valueFiltre.id;
                
        if(this.composante?.id)
        {

          this.updateComposante({composante: composante, id : this.composante?.id})
          
            .then(response => {
              
              if(response.status === 200 || response.status === 201){
                //this.fetchComposantes(this.valueFiltre.id);
                this.fetchComposantes(this.valueFiltre.id);
                this.close()
              }

            })
            .finally((error) => {
              this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
              this.champs.map(value => value.errors = this.erreurs[value.key])              
              this.sendRequest = false;
            });

        }
        else
        {
          
          this.saveComposante(composante)
            .then(response => {
              if(response.status === 200 || response.status === 201){
                this.fetchComposantes(this.valueFiltre.id);
                this.close()
                this.resetForm()
              localStorage.removeItem('formData');

              }

            })
            .finally((error) => {              
              this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
              this.sendRequest = false;
              this.champs.map(value => value.errors = this.erreurs[value.key])
            });
          }
      }
    },

    close() {
      this.showCloseModal()
      this.sendRequest = false;
      this.resetForm()
    }, 
    close2() {
      this.showCloseModal();
      this.sendRequest = false;
      this.savedInput = []
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);
    },
    
    showCloseModal(value = false) {
      this.showModal = value
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
    loading: function(value) {
      //this.loading = value
    },

    errors: function(errors) {
      this.champs.forEach((value) => {
        if(errors[value.key] instanceof Array || errors[value.key] !== undefined ){
          value.errors = errors[value.key]
        }
      })
    },

    valueFiltre: function(valeur,old){
      if( valeur instanceof Projet || valeur instanceof Object )
      {
        let demo = valeur
       
       

        /*  */
      
         if(this.isClick ==false) { 
           this.fetchComposantes(valeur.id);
         }
         else {
            this.fetchComposantes(this.idProjet); 
            this.isClick = false
            localStorage.removeItem('profondeurProjet');
         }
       
      }
      else if( valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0 ){

        this.fetchComposantes(valeur);
      }
    },
    
    projets: function(projets){
    
      if(this.isClick ==false) {
        this.valueFiltre = projets[0]
      }else {
        this.valueFiltre = projets[this.position]
      }
   
    }
 
  },

  created(){
   const profondeurProjet = JSON.parse(localStorage.getItem('profondeurProjet'))
   
    if(profondeurProjet != undefined || profondeurProjet != null) {
      this.isClick = profondeurProjet.isClick
      if(this.isClick) {
        this.idProjet = profondeurProjet.id
        this.position = profondeurProjet.position
       
      }else {
       this.position = 0
      }
    } 
    this.getPermission()
    this.programmeId = this.currentUser.programme.id
    if(this.programmeId){
      this.fetchProjets(this.programmeId)
    } 

  }
  
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
             .dark [role=tab].active,
        .dark [role=tab].active:hover,
        [role=tab].active,
        [role=tab].active:hover {
            border-color: #4b4b4b;
            color: #4b4b4b;
            border-bottom: solid .3rem;
        } 

/* .multiselect__tags {
    min-height: 40px;
    display: block;
    padding: 8px 40px 0 8px;
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    background: #fff;
    font-size: 14px;
}
.multiselect * {
    box-sizing: border-box;
} */
</style>