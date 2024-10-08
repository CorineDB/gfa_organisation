<template>
 
</template>

<script>

import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { extractFormData, getStringValueOfStatutCode } from "@/utils/index";
import Composante from "@/store/modules/composantes/composante";

export default {
  components: {
   
  },
  data() {
    return {
      valueFiltre: null,
      composanteId: null,
      projetFiltre: null,
      composanteFiltre: null,
      pending: false,
      success: true,
      rejected: false,
      programmeId: this.currentUser?.programme.id,
      cols: 1,
      sendRequest: false,
      submitText: "Enregistrer",
      rangeValue: 0,
      showFiltre: false,
      
      activiteAttributs : ['nom', 'description', 'debut', 'fin', 'budgetNational', 'structureResponsableId', 'structureAssocieId', 'types', 'pret', 'tepPrevu', 'statut', 'poids'],

      champs:[

        {name: 'Nom de l\'activite', key: "nom", type: 'text', placeholdere: "Nom de l\'activité", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Type', key: "types", type: '', placeholdere: 'Selectionnez le type d\'activite', isSelect: true, isTextArea: false, data:'', required: true, options: this.$store.state.types, cle: 'type', value: 'nom',  errors : []},
        {name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Taux d\'execution physique', key: "tepPrevu", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Pret', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Date de debut', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Date de fin', key: "fin", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Structure Responsable', key: "structureResponsableId", type: '', placeholdere: 'Veuillez selectionnez la structure responsable', isSelect: true, isTextArea: false, data:'', required: true, options: this.entreprisesExecutante, cle: 'id', value: 'nom',  errors : []},
        {name: 'Structure associée', key: "structureAssocieId", type: '', placeholdere: 'Veuillez selectionnez la structure associée', isSelect: true, isTextArea: false, data:'', required: true, options: this.mods, cle: 'id', value: 'nom',  errors : []},
        {name: 'Statut', key: "statut", type: '', placeholdere: 'Selectionnez le statut', isSelect: true, isTextArea: false, data:'', required: true, options: this.$store.state.statuts, cle: 'etat', value: 'nom',  errors : []},
        {name: 'Description', type: '', key: "description", placeholdere: 'Description de l\'activité', isSelect: false, isTextArea: true, data:'', required: false, errors : []},
        
      ],

      showModal: false,
      showModal2: false,
      line: false,
      mosaique: true,
      showInput: true,
      isStateChange: false,
      seeStatistique: false,
      seePlan: false,
      seeActivite: true,
      seeSuivi: false,
      option: [{ name: "supprimer" }, { name: "modifier" }],

      optionActivite: [
        { name: "Voir plan decaissement" },
        { name: "supprimer" },
        { name: "modifier" },
      ],

      dates: [{}],

      series: [
        {
          name: "Inflation",
          data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
        },
      ],

      chartOptionsExBar: {
        chart: {
          height: 350,
          type: "bar",
        },

        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },

        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },

          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },

        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          position: "top",
          axisBorder: {
            show: false,
          },

          axisTicks: {
            show: false,
          },

          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },

        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%";
            },
          },
        },

        title: {
          text: "Taux execution du projet",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        }
      },

      chartOptionsFiBar: {
        chart: {
          height: 350,
          type: "bar",
        },

        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },

        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },

        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          position: "top",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        title: {
          text: "Taux financier",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        },
      },

      chartOptions: {
        series: [44, 55],
        chart: {
          width: 380,
          type: "pie",
        },

        labels: ["Executé", "Non éxecute"],
        title: {
          text: "STATISTIQUE TAUX FINANCIER",
          align: "left",
          style: {
            fontSize: "18px",
          },
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ]
      },

      chartOptionsFi: {
        series: [44, 55],
        chart: {
          width: 380,
          type: "pie",
        },

        labels: ["Utilisé", "Non utilise"],
        title: {
          text: "STATISTIQUE TAUX FINANCIER",
          align: "left",
          style: {
            fontSize: "18px",
          },
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ]
      },

      headers: [
        { name: "activite", cle: "activite" },
        { name: "Budget Nationnal", cle: "bn" },
        { name: "Pret", cle: "pret" },
        { name: "Poids", cle: "poids" },
        { name: "Structure responsable", cle: "struct_resp" },
        { name: "Structure associé", cle: "struct_assoc" },
        { name: "Status", cle: "status" },
      ],

      dataTable: [
        {
          activite: "activite 1",
          bn: "200000000",
          pret: "9540000000",
          poids: "5",
          struct_resp: "agetur",
          struct_assoc: "",
          status: "en cours",
        },
      ],
      actions: [{ name: "supprimer", iconne: "" }],
    };
  },

  computed: {
    //importation des variables du module activites
    ...mapState({
      activite: (state) => state.activites.activite,
      loading: (state) => state.loading,
      errors: (state) => state.errors,
    }),

    ...mapGetters({
      mods: "mods/getMods",
      projets: "projets/getProjets",
      composantes: "composantes/getComposantes",
      sousComposantes: "sousComposantes/getSousComposantes",
      entreprisesExecutante: "entreprisesExecutante/getEntreprisesExecutante",
      activites: "activites/getActivites",
      activite: "activites/getActivite",
      currentUser : 'auths/GET_AUTHENTICATE_USER'
    }),
  },

  methods: {
    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setActivite: "activites/FILL", // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
      setActivites: "activites/SET_LIST_ACTIVITES",
      setComposantes: 'composantes/SET_LIST_COMPOSANTES',
      setSousComposantes: 'sousComposantes/SET_LIST_SOUSCOMPOSANTE'
    }),

    ...mapActions("activites", {
      fetchActivites: "FETCH_LIST_ACTIVITE_OF_COMPOSANTE",
      saveActivite: "STORE_ACTIVITE",
      updateActivite: "UPDATE_ACTIVITE",
      deleteActivite: "DESTROY_ACTIVITE",
    }),

    ...mapActions({
      fetchMods: "mods/FETCH_LIST_MOD_OF_PROGRAMME",
      fetchEntreprisesExecutante: "entreprisesExecutante/FETCH_LIST_ENTREPRISE_EXECUTANTE_OF_PROGRAMME",
      fetchComposantes: "composantes/FETCH_LIST_COMPOSANTE_OF_PROJET",
      fetchSousComposantes: "sousComposantes/FETCH_LIST_SOUS_COMPOSANTE_OF_COMPOSANTE",
      fetchProjets: "projets/FETCH_LIST_PROJET_OF_PROGRAMME",
    }),

    supprimerT() {},

    filtreRange(value) {
      this.rangeValue = value;
    },

    gotoActivite() {
      this.seePlan = false;
      this.seeActivite = true;
      this.seeSuivi = false;
      this.seeStatistique = false;
    },

    gotoStatistique() {
      this.seePlan = false;
      this.seeActivite = false;
      this.seeSuivi = false;
      this.seeStatistique = true;
    },

    gotoPlan() {
      this.seePlan = true;
      this.seeActivite = false;
      this.seeSuivi = false;
      this.seeStatistique = false;
    },

    gotoSuivi() {
      this.seeSuivi = true;
      this.seePlan = false;
      this.seeActivite = false;
      this.seeStatistique = false;
    },

    addDate() {
      this.dates.push({});
    },

    switch1() {
      this.mosaique = true;
      this.line = false;
    },

    switch2() {
      this.mosaique = false;
      this.line = true;
    },

    close2() {
      this.showModal2 = false;
    },

    addPlan() {
      this.title = "Ajouter un plan decaissement";
      this.showModal2 = true;
    },

    modifierPlan() {
      this.title = "Modifier un plan de decaissement";
      this.showModal2 = true;
    },

    dupliquerPlan() {
      this.title = "Dupliquer un plan decaissement";
      this.showModal2 = true;
    },

    addActivite() {

      this.title ="Ajouter une activité"

      this.submitText="Enregistrer",

      this.showCloseModal(true)

    },

    getNom(nom, prenom) {

      let name = ''

      if(nom !== undefined && nom !== null) name+= nom

      if(prenom !== undefined && prenom !== null ) name+= prenom

      return name;
    },

    supprimer(activite) {
      if(window.confirm("Voulez-vous supprimer l'activite " + activite.nom)){
        if(this.sendRequest === false){
          this.sendRequest = true;
          this.deleteActivite(activite.id)
          this.sendRequest = false;
        }
      }
    },

    modifier(activite) {

      this.title = 'Modifier une activite'

      this.setActivite(activite)

      this.activiteAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if( value.key === "statut" && item === "statut"){

            this.$store.state.statuts.map((value) => {
              if(value.etat === activite[item]){
                this.champs[index]['data'] = value
              }
            });

          }
          else if(value.key === item){
            this.champs[index]['data'] = activite[item]
          }

        });

      });

      this.submitText = "Modifier",

      this.showCloseModal(true)
    },

    dupliquer() {
      this.title = "Dupliquer une activité";
      this.showModal = true;
    },
    gotoNext() {
      this.$router.push("/dashboard/projets/taches-globale");
    },
    editerSuivi() {
      this.showInput = false;
    },

    toggle() {
      this.pending = false;
      this.rejected = false;
      this.success = true;
    },

    toggle2() {
      this.success = false;
      this.rejected = false;
      this.pending = true;
    },

    toggle3() {
      this.pending = false;
      this.success = false;
      this.rejected = true;
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },

    validation(activite) {
      if (this.sendRequest === false) {
        this.sendRequest = true;

        this.updateActivite({
          activite: { statut: -1, composanteId: this.composanteId },
          id: activite.id,
        })
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.close();

              this.sendRequest = false;
            }
          })
          .catch((error) => {
            this.setErrors({
              message: error?.response?.data?.message,
              errors: error.response.data.errors,
            });

            this.champs.map(
              (value) => (value.errors = this.erreurs[value.key])
            );

            this.sendRequest = false;
          });
      }
    },

    sendForm() {
      if (this.sendRequest === false) {
        this.sendRequest = true;

        this.champs = this.champs.map((item) => {
          item.errors = [];
          return item;
        });

        let activite = extractFormData(this.champs, this.activiteAttributs);

        activite.composanteId = this.composanteId;

        activite.structureResponsableId = activite.structureResponsableId.id;

        activite.structureAssocieId = activite.structureAssocieId.id;

        activite.userId = activite.structureAssocieId;

        activite["type"] = activite.types.type;

        activite.statut = activite.statut.etat;

        if (this.activite?.id) {
          this.updateActivite({ activite: activite, id: this.activite?.id })
            .then((response) => {
              if (response.status == 200 || response.status == 201) {
                this.close();
              }
            })
            .catch((error) => {
              this.setErrors({
                message: error?.response?.data?.message,
                errors: error.response.data.errors,
              });

              this.champs.map(
                (value) => (value.errors = this.erreurs[value.key])
              );
            });
        } else {
          this.saveActivite(activite).then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.close();
            }
          });
        }

        this.sendRequest = false;
      }
    },

    close() {
      this.showCloseModal();

      this.resetForm();

      this.sendRequest = false;
    },

    resetForm(){

      this.champs = this.champs.map(item => { item['data'] = ''; return item})
      
      window.document.getElementById('vform').reset()

      this.setActivite({})
    },
    
    showCloseModal(value = false) {
      this.showModal = value;
    }
  },

  watch: {
    loading: function (value) {
      //this.loading = value
    },

    errors: function (errors) {
      this.champs.forEach((value) => {
        if(value.key === "types"){
        
          value.errors = errors["type"];

        }
        else value.errors = errors[value.key];
      });
  
    },/* 
    
    */

    entreprisesExecutante: function (entreprisesExecutante) {

      this.champs.map((item) => {

        if (item.key === "structureResponsableId") {

          item.options = entreprisesExecutante.map((entrepriseExecutante) => {

            return {
              id: entrepriseExecutante.user.id,
              nom: entrepriseExecutante.user.nom,
            };

          });

        }

        return item;

      });

    },

    mods: function (mods) {

      this.champs.map((item) => {

        if (item.key === "structureAssocieId") {

          item.options = mods.map((mod) => {

            return {
              id: mod.user.id,
              nom: mod.user.nom,
            };

          });

        }

        return item;
        
      });
    },


    projets: function(projets){
      if(projets.length > 0){
        this.projetFiltre = projets[0]
      }
    },

    projetFiltre: function(valeur){

      if( valeur instanceof Composante || valeur instanceof Object )
      {
        this.fetchComposantes(valeur.id);
      }
      else if( valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0 ){
        this.fetchComposantes(valeur);
      }
      else{ 
        this.setComposantes([])
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
        this.fetchSousComposantes(valeur.id);
      }
      else if( valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0 ){
        this.fetchSousComposantes(valeur);
      }
      else{ 
        this.setSousComposantes([])
      }
    }, 

    sousComposantes: function (sousComposantes) {
      if(sousComposantes.length > 0){ 
        this.valueFiltre = sousComposantes[0];
      }
      else if(this.composanteFiltre !== null && typeof this.composanteFiltre !== 'undefined' && this.composanteFiltre.length !== 0  ){
        this.fetchActivites(this.composanteFiltre.id);
        this.composanteId = this.composanteFiltre.id
        this.valueFiltre = null;
      }
      else{
        this.valueFiltre = null;
      }
    },

    valueFiltre: function (valeur) {
      
      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchActivites(valeur.id);
        this.composanteId = valeur.id
      } 

      else if( valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0 ){
        this.fetchActivites(valeur);
        this.composanteId = valeur
      }

    },

  },

  created() {

    this.programmeId = this.currentUser.programme.id

    if(this.programmeId){
      Promise.all([this.fetchProjets(this.programmeId) ]).then((value) => {
  
          this.fetchMods(this.programmeId)

          this.fetchEntreprisesExecutante(this.programmeId)
      });
    }

  }

};
</script>

<style></style>
