<template>

</template>

<script>

import { mapGetters, mapActions } from "vuex";
import { getStringValueOfStatutCode } from "@/utils/index";
import Composante from "@/store/modules/composantes/composante";

import Activite from "@/store/modules/activites/activite";
import ProgrammeService from "@/services/modules/programme.service.js";

export default {
  components: {
  
  },
  props:['version'],
  data() {
    return {
      dates: { debut: "", fin: "" },
      suivis: [],
      chargement: false,
      showProlonger: false,
      showModalSuivi: false,
      valueFiltre: null,
      composanteId: null,
      projetFiltre: null,
      composanteFiltre: null,
      sousComposanteFiltre: null,
      pending: false,
      success: true,
      inProgress: false,
      retard: false,
      rangeValue: 0,
      programmeId: this.currentUser?.programme.id,
      sendRequest: false,
      submitText: "Enregistrer",
      showFiltre: false,
      line: false,
      mosaique: true,
      isStateChange: false,
      seeSuivi: false,
      seeTache: true,
      options:[
        {name:'activite 1'},
        {name:'activite 2'},
        {name:'activite 3'},
        {name:'activite 4'},
        {name:'activite 5'},
      ],
      tacheId:'',
      tacheAttributs : ['nom', 'description', 'debut', 'fin', 'tepPrevu', 'poids'],

      champs:[

        {name: 'Nom de la tâche', key: "nom", type: 'text', placeholdere: "Nom de la tâche", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Taux d\'execution physique', key: "tepPrevu", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Date de debut', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Date de fin', key: "fin", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Description', type: '', key: "description", placeholdere: 'Description de la tâche', isSelect: false, isTextArea: true, data:'', required: false, errors : []},
        
      ],
      champsSuiviTache:[
        {name: 'Tache ', key: "statut", type: '', placeholdere: 'Selectionnez une tache ', isSelect: true, isTextArea: false, data:'', required: true, options: [{nom:'tache 1'},{nom:'tache 2'}], cle: 'etat', value: 'nom',  errors : []},
        {name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        
      ],
      tacheVisible:false,
      tacheAdd:false,
      tacheDelete:false,
      tacheUpdate:false,
      tacheSuivi:false,
      actions: [
       
      ],
      
      tacheId: "",

      projets: [],
      composantes: [],
      sousComposantes: [],
      activites: [],
      taches: [],
      suivis: [],
      results: [],
      search:'',
      programmeId:'',
      isSearch:false,
    };
  },

  computed: {
    ...mapGetters({
      currentUser: "auths/GET_AUTHENTICATE_USER",
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
      if(this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if(element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },

    enAttente() {
      if(this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if(element.statut == -1 || element.statut == -2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enCours() {
      if(this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if(element.statut == 0) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    retardData() {
      if(this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if(element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },
  
  },

  methods: {
    ...mapActions({
      getPtabReviser: "revisionPtab/GET_PTAB_REVISER",
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
          if(element.slug ==='voir-une-tache') {
            this.tacheVisible = true
          }
          if(element.slug === 'creer-une-tache') {
            this.tacheAdd = true
          }
            if(element.slug === 'modifier-une-tache') {
              this.tacheUpdate = true
            }
            if(element.slug ==='supprimer-une-tache') {
              this.tacheDelete = true
            }
            if(element.slug ==='voir-revision-ptab') {
              this.tacheSuivi = true
            } 
      });
    },
    customLabel({ codePta, nom }) {
      return `${codePta} – ${nom}`;
    },

    filtreRange(value) {
      this.rangeValue = value;
    },

    selectActivite({ name }) {
      return `${name}`;
    },

    getNom(nom, prenom) {
      let name = "";

      if (nom !== undefined && nom !== null) name += nom;

      if (prenom !== undefined && prenom !== null) name += prenom;

      return name;
    },

    gotoNext() {
      this.$router.push(
        "/dashboard/projets/composantes/sous-composantes/activites/taches"
      );
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

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },

    gotoSuivi() {
      this.seeSuivi = true;
      this.seeTache = false;
    },

    gotoTache() {
      this.seeSuivi = false;
      this.seeTache = true;
    },
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


  watch: {
    version: function (version) {
      const params = {
        "version": version,
        "composantes": null,
        "sous-composantes": null,
        "activites": null,
        "taches": null,
      };

      this.getPtabReviser(params).then((value) => {
        this.results = value.data.data;
      });
    },

    results: function (results) {
      this.projets = results["projets"];

      if (results["projets"].length > 0) {
        this.projetFiltre = results[0];
      }
    },

    projets: function (projets) {
      if (projets.length > 0) {
        this.projetFiltre = projets[0];
      }
    },

    projetFiltre: function (valeur) {
      if (valeur instanceof Composante || valeur instanceof Object) {
        this.composantes = this.results["composantes"].filter((value) => {
          if (value.projetId === valeur.id) return value;
        });
      } else if (
        valeur !== null &&
        typeof valeur !== "undefined" &&
        valeur.length !== 0
      ) {
        this.composantes = this.results["composantes"].filter((value) => {
          if (value.projetId === valeur) return value;
        });
      } else {
        this.composantes = [];
      }
    },

    composantes: function (composantes) {
      if (composantes.length > 0) {
        this.composanteFiltre = composantes[0];
      } else {
        this.composanteFiltre = null;
      }
    },

    composanteFiltre: function (valeur) {
      if (valeur instanceof Composante || valeur instanceof Object) {
        this.sousComposantes = this.results["sous-composantes"].filter(
          (value) => {
            if (value.composanteId === valeur.id) return value;
          }
        );
      } else if (
        valeur !== null &&
        typeof valeur !== "undefined" &&
        valeur.length !== 0
      ) {
        this.sousComposantes = this.results["sous-composantes"].filter(
          (value) => {
            if (value.composanteId === valeur) return value;
          }
        );
      } else {
        this.setSousComposantes = [];
      }
    },

    sousComposantes: function (sousComposantes) {
      if (sousComposantes.length > 0) {
        this.sousComposanteFiltre = sousComposantes[0];
      } else if (
        this.composanteFiltre !== null &&
        typeof this.composanteFiltre !== "undefined" &&
        this.composanteFiltre.length !== 0
      ) {
        this.activites = this.results["activites"].filter((value) => {
          if (value.composanteId === this.composanteFiltre.id) return value;
        });

        this.composanteId = this.composanteFiltre.id;
        this.sousComposanteFiltre = null;
        this.valueFiltre = null;
      } else {
        this.sousComposanteFiltre = null;
      }
    },

    sousComposanteFiltre: function (valeur) {
      if (valeur instanceof Composante || valeur instanceof Object) {
        this.activites = this.results["activites"].filter((value) => {
          if (value.composanteId === valeur.id) return value;
        });

        this.composanteId = valeur.id;
      } else if (
        valeur !== null &&
        typeof valeur !== "undefined" &&
        valeur.length !== 0
      ) {
        this.activites = this.results["activites"].filter((value) => {
          if (value.composanteId === valeur) return value;
        });

        this.composanteId = valeur;
      } else {
        this.activites = [];
      }
      
    },

    activites: function (activites) {
      if (activites.length > 0) {
        this.valueFiltre = activites[0];
      } else {
        this.valueFiltre = null;
      }
    },

    valueFiltre: function (valeur) {
      if (valeur instanceof Activite || valeur instanceof Object) {
        this.taches = this.results["taches"].filter((value) => {
          if (value.activiteId === valeur.id) return value;
        });
      } else if (
        valeur !== null &&
        typeof valeur !== "undefined" &&
        valeur.length !== 0
      ) {
        this.taches = this.results["taches"].filter((value) => {
          if (value.activiteId === valeur) return value;
        });
      }
    },
  },

  created() {
    this.getPermission()
    const params = {
      "version": this.version,
      "composantes": null,
      "sous-composantes": null,
      "activites": null,
      "taches": null,
    };
    this.programmeId = this.currentUser.programme.id
    this.getPtabReviser(params).then((value) => {
      this.results = value.data.data;
      if(this.programmeId){
        this.fetchProjets(this.programmeId)
      } 
    });
  },
};
</script>

<style></style>
