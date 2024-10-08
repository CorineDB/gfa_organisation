<template>
 

</template>

<script>
import Vtable from "@/components/Vtable";

import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { extractFormData, getStringValueOfStatutCode } from "@/utils/index";
import ComposanteService from "@/services/modules/composante.service.js";

import ProgrammeService from "@/services/modules/programme.service.js";
import ActiviteService from "@/services/modules/activite.service.js";

export default {
  components:{
  },
  data() {
    return {
      savedInput: [],
      suivis: [],
      valueFiltre: null,
      activiteFiltre: null,
      composanteId: null,
      sousComposanteId: null,
      projetFiltre: null,
      composanteFiltre: null,
      pending: false,
      success: true,
      inProgress: false,
      retard: false,
      activiteId: '',
      programmeId: '',
      cols: 1,
      sendRequest: false,
      submitText: "Enregistrer",
      rangeValue: 0,
      showFiltre: false,
      showProlonger: false,
      chargement: false,
      activiteAttributs: ['nom', 'description', 'debut', 'fin', 'budgetNational', 'structureResponsableId', 'structureAssocieId', 'types', 'pret', 'poids'],
      dates: { debut: '', fin: '' },
      planDeDecaissementAttributs: ['annee', 'trimestre', 'pret', 'budgetNational'],
      champs: [
        { name: 'Nom de l\'activité', key: "nom", type: 'text', placeholdere: "Nom de l\'activité", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Type', key: "types", type: '', placeholdere: 'Selectionnez le type d\'activite', isSelect: true, isTextArea: false, data: '', required: true, options: this.$store.state.types, cle: 'type', value: 'nom', errors: [] },
        { name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Prêt', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Date de début', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Date de fin', key: "fin", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Structure Responsable', key: "structureResponsableId", type: '', placeholdere: 'Veuillez selectionnez la structure responsable', isSelect: true, isTextArea: false, data: '', required: true, options: this.structures, cle: 'id', value: 'nom', errors: [] },
        { name: 'Structure associée', key: "structureAssocieId", type: '', placeholdere: 'Veuillez selectionnez la structure associée', isSelect: true, isTextArea: false, data: '', required: true, options: this.structures, cle: 'id', value: 'nom', errors: [] },
        { name: 'Description', type: '', key: "description", placeholdere: 'Description ede l\'activité', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },
      ],
      champs2: [
        { name: 'Année de base', key: "annee", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Trimestre', key: "trimestre", type: '', placeholdere: 'Selectionnez le trimestre du plan', isSelect: true, isTextArea: false, data: '', required: true, options: this.$store.state.trimestres, cle: 'valeur', value: 'trimestre', errors: [] },
        { name: 'Prêt', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
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
      option: [{ name: "supprimer" }, { name: "modifier" }],

      optionActivite: [
        { name: "supprimer" },
        { name: "modifier" }
      ],
      optionActiviteUpdate: [
        { name: "modifier" }
      ],
      optionActiviteD: [

        { name: "modifier" }
      ],

      dates: {
        debut: '', fin: ''
      },

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
        { name: "Activité", cle: "activite" },
        { name: "code pta", cle: "codePta" },
        { name: "poids initial", cle: 'poidsInitial' },
        { name: "poids actuel", cle: 'poidsActuel' },
        { name: "date de création", cle: 'created_at' },

      ],
      dataTable: [],
      activiteVisible: false,
      activiteAdd: false,
      activiteDelete: false,
      activiteUpdate: false,
      planDecaissementVisible: false,
      planDecaissementAdd: false,
      planDecaissementUpdate: false,
      planDecaissementDelete: false,
      StatistiqueVisible: false,
      idProjet: '',
      idComposante: '',
      idSC: '',
      newProjet: null,
      newComponent: null,
      newSC: null,
      isClick: false,
      isShow: true,
      sous_composantes: [],
      search: '',
      isSearch: false,
      projets: [],
      deleteData: {},
      deleteModal: false,
    };
  },

  computed: {
    //importation des variables du module activites
    ...mapState({
      activite: (state) => state.activites.activite,
      loading: (state) => state.loading,
      errors: (state) => state.errors,
    }),
    allData() {
      if (this.terminer != undefined || this.enAttente != undefined || this.enCours != undefined || this.retardData != undefined) {
        return [].concat(this.terminer, this.enAttente, this.enCours, this.retardData)
      }
    },
    filtere: function () {
      var self = this;
      return this.allData.filter(function (data) {
        return data.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      });
    },
    terminer() {
      if (this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if (element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enAttente() {
      if (this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if (element.statut == -1 || element.statut == -2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enCours() {
      if (this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if (element.statut == 0) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    retardData() {
      if (this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if (element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    ...mapGetters({
      structures: "structures/getStructures",

      composantes: "composantes/getComposantes",
      sousComposantes: "sousComposantes/getSousComposantes",
      activites: "activites/getActivites",
      activite: "activites/getActivite",
      planDeDecaissements: "planDeDecaissements/getPlanDeDecaissements",
      planDeDecaissement: "planDeDecaissements/getPlanDeDecaissement",
      currentUser: 'auths/GET_AUTHENTICATE_USER'
    }),
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })
  },

  methods: {
    getSearchValue(data) {
      if (data != '') {
        this.isSearch = true
        this.search = data
      }
      else {
        this.isSearch = false
        this.search = data
      }

    },
    changeProjet(projet) {

      if (this.isClick) {
        this.projetFiltre = this.newProjet
        this.fetchComposantes(this.idProjet);
        this.isClick = false
        localStorage.removeItem('profondeurSC');
      } else {
        this.fetchComposantes(projet.id);
        let indexProjet = 0
        for (let index = 0; index < this.projets.length; index++) {
          const element = this.projets[index];
          if (projet.id == element.id) {
            indexProjet = index
          }
        }
        let composantes = this.projets[indexProjet].composantes
        
        if (composantes[0] != null) {

          let code = composantes[0].codePta
          let nom = composantes[0].nom
          this.composanteFiltre = { codePta: code, nom: nom }
          let indexComposante = composantes[0].id
          ComposanteService.sousComposantes(indexComposante).then((data) => {
            const sous_composantes = data.data.data
            if (sous_composantes[0] != null) {
              let code = sous_composantes[0].codePta
              let nom = sous_composantes[0].nom
              this.valueFiltre = { codePta: code, nom: nom }
              /* id sous composante */
              let indexSC = sous_composantes[0].id
              this.composanteId = indexSC
              this.fetchActivites(indexSC);
              this.isShow = true
            }
            else {

              this.composanteId = indexComposante
              this.fetchActivites(indexComposante);
              this.isShow = true
              this.valueFiltre = null
            }

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

        }
        else {
          this.isShow = false
          this.composanteFiltre = null
          this.valueFiltre = null
        }

        //this.fetchActivites(Scomposante.id);
      }
    },
    changeComposante(composante) {
      if (this.isClick) {
        this.composanteFiltre = this.newComponent
        this.fetchSousComposantes(this.idComposante);
        this.isClick = false
        localStorage.removeItem('profondeurSC');
      } else {
        ComposanteService.sousComposantes(composante.id).then((data) => {
          const sous_composantes = data.data.data
          if (sous_composantes[0] != null) {
            let code = sous_composantes[0].codePta
            let nom = sous_composantes[0].nom
            this.valueFiltre = { codePta: code, nom: nom }
            /* id sous composante */
            let indexSC = sous_composantes[0].id
            this.composanteId = indexSC
            this.fetchActivites(indexSC);
            this.isShow = true
          }
          else {
            this.composanteId = composante.id
            this.fetchActivites(composante.id);
            this.isShow = true
            this.valueFiltre = null
          }

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
      }


    },

    changeSC(Scomposante) {
     
      this.composanteId = Scomposante.id
      if (this.isClick) {
        this.valueFiltre = this.newSC
        this.fetchActivites(this.idSC);
        this.isClick = false
        localStorage.removeItem('profondeurSC');
        this.isShow = true
      } else {
        this.fetchActivites(Scomposante.id);
        this.isShow = true
      }

    },

    getSComposante(id) {
      ComposanteService.sousComposantes(id).then((data) => {
        const datas = data.data.data
        this.sous_composantes = datas

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
    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setPlanDeDecaissement: "planDeDecaissements/FILL", // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
      setPlanDeDecaissements: "planDeDecaissements/SET_LIST_PLAN_DE_DECAISSEMENT",
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

    ...mapActions("planDeDecaissements", {
      fetchPlanDeDecaissements: "FETCH_LIST_PLAN_DE_DECAISSEMENT_ACTIVITE",
      savePlanDeDecaissement: "STORE_PLAN_DE_DECAISSEMENT",
      updatePlanDeDecaissement: "UPDATE_PLAN_DE_DECAISSEMENT",
      deletePlanDeDecaissement: "DESTROY_PLAN_DE_DECAISSEMENT",
    }),

    ...mapActions({
      fetchComposantes: "composantes/FETCH_LIST_COMPOSANTE_OF_PROJET",
      fetchSousComposantes: "sousComposantes/FETCH_LIST_SOUS_COMPOSANTE_OF_COMPOSANTE",
      fetchProjets: "projets/FETCH_LIST_PROJET_OF_PROGRAMME",
    }),

    gotoNext(activite, index) {
      let idProjet = ''
      let idComposante = ''
      let idSC = activite.composanteId
      let codeP = ''
      let nomP = ''
      let codeC = ''
      let nomC = ''
      let codeSC = ''
      let nomSC = ''
      let codeActivite = activite.codePta
      let nomActivite = activite.nom
      for (let index = 0; index < this.sousComposantes.length; index++) {
        const element = this.sousComposantes[index];
        if (element.id == activite.composanteId) {

          codeSC = element.codePta
          nomSC = element.nom
          idProjet = element.projetId
          idComposante = element.composanteId
        }

      }
      for (let index = 0; index < this.composantes.length; index++) {
        const element = this.composantes[index];
        if (element.id == idComposante) {

          codeC = element.codePta
          nomC = element.nom

        }
      }
      for (let index = 0; index < this.projets.length; index++) {
        const element = this.projets[index];
        if (element.id == idProjet) {

          codeP = element.codePta
          nomP = element.nom
        }
      }


      const profondeurActivite = {
        isClick: true,
        idP: idProjet,
        idC: idComposante,
        idSC: idSC,
        idActivite: activite.id,
        projet: { codePta: codeP, nom: nomP },
        composante: { codePta: codeC, nom: nomC },
        sousComposante: { codePta: codeSC, nom: nomSC },
        activite: { codePta: codeActivite, nom: nomActivite }
      }

      localStorage.setItem('profondeurActivite', JSON.stringify(profondeurActivite));
     
      this.$router.push({ name: 'dashboard_projets_taches_globale' })
    },

    ...mapActions("structures", {
      fetchStructure: "FETCH_LIST_STRUCTURE_OF_PROGRAMME",
    }),

    customLabelP({ bailleur, nom }) {
      return `${bailleur.sigle} – ${nom}`
    },
    customLabel({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },

    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {

        if (element.slug === 'creer-une-activite') {
          this.activiteAdd = true
        }
        if (element.slug === 'voir-une-activite') {
          this.activiteVisible = true
        }
        if (element.slug === 'modifier-une-activite') {
          this.activiteUpdate = true
        }
        if (element.slug === 'supprimer-une-activite') {
          this.activiteDelete = true
        }
        //plan de decaissement

        if (element.slug === 'voir-un-plan-de-decaissement') {
          this.planDecaissementVisible = true
        }
        if (element.slug === 'creer-un-plan-de-decaissement') {
          this.planDecaissementAdd = true
        }
        if (element.slug === 'modifier-un-plan-de-decaissement') {
          this.planDecaissementUpdate = true
        }
        if (element.slug === 'supprimer-un-plan-de-decaissement') {
          this.planDecaissementDelete = true
        }
        if (element.slug === 'voir-une-statistique-activite') {
          this.StatistiqueVisible = true
        }

      });
    },

    getSuivi() {
      ActiviteService.getSuivi().then((data) => {
        const datas = data.data.data
        datas.forEach(element => {
          const activite = element.activite.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({ activite: activite, codePta: codePta, poidsInitial: poidsInitial, poidsActuel: poidsActuel, created_at: created_at })
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
    supprimerT() { },

    saveProlongerDate(id, data) {
      this.chargement = true
      ActiviteService.addDate(id, data).then((data) => {
      
        this.$toast.success('operation éffectué avec succès')
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

      this.chargement = false

    },

    suivreMyActivite(activite) {
      this.$router.push({ name: 'dashboard_projets_activites_globale_suivis', params: { id: activite.id } })
    },

    filtreRange(value) {
      this.rangeValue = value;
    },

    gotoActivite() {
      this.seePlan = false;
      this.seeActivite = true;
      this.seeStatistique = false;
      this.fetchActivites(this.composanteId)
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


    switch1() {
      this.mosaique = true;
      this.line = false;
    },



    switch2() {
      this.mosaique = false;
      this.line = true;
    },

    addPlan() {

      this.title = "Ajouter"

      this.submitText = "Enregistrer"

      this.showModal2 = true;
    },

    modifierPlan(planDeDecaissement) {
      this.title = "Modifier un plan de decaissement";

      this.submitText = "Modifier"

      this.setPlanDeDecaissement(planDeDecaissement)

      this.planDeDecaissementAttributs.forEach((item) => {

        this.champs2.find((value, index) => {

          if (value.key === "trimestre" && item === "trimestre") {

            this.$store.state.trimestres.map((value) => {
              if (value.valeur === planDeDecaissement[item]) {
                this.champs2[index]['data'] = value
              }
            });

          }
          else if (value.key === 'annee') {
           
            this.champs2[index]['data'] = moment(planDeDecaissement.annee + "/" + planDeDecaissement.trimestre + '/01').format("YYYY-MM-DD")
          }
          else if (value.key === item) {
            this.champs2[index]['data'] = planDeDecaissement[item]
          }

        });

      });


      this.showModal2 = true;
    },

    supprimerPlan(plan) {
      if (window.confirm("Voulez-vous supprimer ce plan de décaissement ")) {
        if (this.sendRequest === false) {
          this.sendRequest = true;
          this.deletePlanDeDecaissement(plan.id).finally((value) => {
            if (response.status === 200 || response.status === 201) {
              this.sendRequest = false;
              this.fetchPlanDeDecaissements(this.activiteFiltre.id);
            }
          })
        }
      }
    },

    addActivite() {

      this.title = "Ajouter"

      this.submitText = "Enregistrer",

        this.showCloseModal(true)

    },

    getNom(nom, prenom) {

      let name = ''

      if (nom !== undefined && nom !== null) name += nom

      if (prenom !== undefined && prenom !== null) name += prenom

      return name;
    },

    prolonger(activite) {
      this.activiteId = activite.id
      this.showProlonger = true
    },

    supprimer(activite, index) {
      this.deleteModal = true
      this.deleteData.data = activite
      this.deleteData.index = index
    },

    deleteActivites(data) {
      //this.filteredBailleur.splice(data.index,1)
      this.deleteModal = false
      ActiviteService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.fetchActivites(this.composanteId);

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



    modifier(activite) {
      localStorage.removeItem('formData')

      this.title = 'Modifier une activite'

      this.setActivite(activite)

      this.activiteAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if (value.key === item) {
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

    editerSuivi() {
      this.showInput = false;
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


    savePlanDecaissement() {
      if (this.sendRequest === false) {

        this.sendRequest = true;

        this.champs2 = this.champs2.map((item) => {
          item.errors = [];
          return item;
        });

        let planDeDecaissement = extractFormData(this.champs2, this.planDeDecaissementAttributs);

        planDeDecaissement['activiteId'] = this.activiteFiltre.id;

        planDeDecaissement.annee = moment(planDeDecaissement.annee).format('YYYY')

        planDeDecaissement.trimestre = planDeDecaissement.trimestre.valeur;

        if (this.planDeDecaissement?.id) {
          this.updatePlanDeDecaissement({ planDeDecaissement: planDeDecaissement, id: this.planDeDecaissement?.id })
            .then((response) => {
              if (response.status === 200 || response.status === 201) {
                this.fetchPlanDeDecaissements(this.activiteFiltre.id);
                this.close2();
              }
            })
            .finally((error) => {
              this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
              this.sendRequest = false;
              this.champs2.map(value => value.errors = this.erreurs[value.key])
            });
        } else {
          this.savePlanDeDecaissement(planDeDecaissement)
            .then((response) => {
              if (response.status === 200 || response.status === 201) {
                this.fetchPlanDeDecaissements(this.activiteFiltre.id);
                this.close2();
              }
            })
            .finally((error) => {
              this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
              this.sendRequest = false;
              this.champs2.map(value => value.errors = this.erreurs[value.key])
            });
        }
      }
    },

   
    validation() {
      this.fetchActivites(this.composanteId);
    },

    sendForm() {
      if (this.sendRequest === false) {
        this.sendRequest = true;

        this.champs = this.champs.map((item) => {
          item.errors = [];
          return item;
        });

        let activite = extractFormData(this.champs, this.activiteAttributs);



        activite.structureResponsableId = activite.structureResponsableId.id;

        activite.structureAssocieId = activite.structureAssocieId.id;

        activite.userId = activite.structureAssocieId;

        activite["type"] = activite.types.type;
        if (this.composanteId == undefined || this.composanteId == null) {
          this.$toast.error('Composante indefinit ')
          this.sendRequest = false;
          this.close()
        } else {
          activite.composanteId = this.composanteId;
          if (this.activite?.id) {
            this.updateActivite({ activite: activite, id: this.activite?.id })
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  this.fetchActivites(this.composanteId);
                  this.close();
                }
              })
              .finally((error) => {
                this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
                this.sendRequest = false;
                this.champs.map(value => value.errors = this.erreurs[value.key])
              });
          } else {
            this.saveActivite(activite)
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  this.fetchActivites(this.composanteId);
                  this.close();
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
      }
    },

    close() {
      this.showCloseModal();
      this.sendRequest = false;
      this.resetForm()
    },
    closeA() {
      this.showCloseModal();
      this.sendRequest = false;
      this.savedInput = []
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);
    },
    closeB() {
      this.showCloseModal();
      this.sendRequest = false;
      this.savedInput = []
      for (let i = 0; i < this.champs2.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);
    },

    close2() {

      this.showModal2 = false;

      this.resetForm2();

      this.sendRequest = false;
    },

    resetForm2() {

      this.champs2 = this.champs2.map(item => { item['data'] = ''; item['errors'] = []; return item })

      window.document.getElementById('vform').reset()

      this.setPlanDeDecaissement({})
    },

    resetForm() {

      this.champs = this.champs.map(item => { item['data'] = ''; item['errors'] = []; return item })

      window.document.getElementById('vform').reset()

      this.setActivite({})
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

    showCloseModal(value = false) {
      this.showModal = value;
    }
  },

  watch: {
    loading: function (value) {
      //this.loading = value
    },

    errors: function (errors) {

      if (errors instanceof Object && errors.length === undefined) {
        if (this.seePlan) {
          this.champs2.forEach((value) => {

            if (errors[value.key] instanceof Array || errors[value.key] !== undefined) {
              if (value.key === "types") {

                value.errors = errors["type"];

              }
              else value.errors = errors[value.key];
            }
          });
        }
        else if (this.seeActivite) {
          this.champs.forEach((value) => {
            if (errors[value.key] instanceof Array || errors[value.key] !== undefined) {
              
              if (value.key === "types") {
                value.errors = errors["type"];
              }
              else {
               
                value.errors = errors[value.key];
              }

            }
          });
        }
      }
      else if (errors instanceof Array && errors.length === 0) {
        this.champs = this.champs.map(item => { item['errors'] = []; return item })
      }
    },


    structures: function (structures) {

      this.champs.map((item) => {

        if (item.key === "structureAssocieId") {

          item.options = structures.map((structure) => {

            return {
              id: structure.id,
              nom: structure.nom,
            };

          });

        }

        if (item.key === "structureResponsableId") {

          item.options = structures.map((structure) => {

            return {
              id: structure.id,
              nom: structure.nom,
            };

          });

        }

        return item;

      });
    },


    projets: function (projets) {
      if (projets.length > 0) {
        this.projetFiltre = projets[0]
      }
    },

    projetFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchComposantes(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchComposantes(valeur);
      }
      else {
        this.setComposantes([])
      }
    },

    composantes: function (composantes) {
      if (composantes.length > 0) {
        this.composanteFiltre = composantes[0]
      }
      else {
        this.composanteFiltre = null
      }
    },

    composanteFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchSousComposantes(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchSousComposantes(valeur);
      }
      else {
        this.setSousComposantes([])
      }
    },

    sousComposantes: function (sousComposantes) {
      if (sousComposantes.length > 0) {
        this.valueFiltre = sousComposantes[0];
      }
      else if (this.composanteFiltre !== null && typeof this.composanteFiltre !== 'undefined' && this.composanteFiltre.length !== 0) {
        this.fetchActivites(this.composanteFiltre.id);
        this.composanteId = this.composanteFiltre.id
        this.valueFiltre = null;
      }
      else {
        this.valueFiltre = null;
      }
    },

    valueFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchActivites(valeur.id);
        this.composanteId = valeur.id
      }

      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchActivites(valeur);
        this.composanteId = valeur
      }

    },

    activites: function (activites) {
      if (this.seePlan) {
        if (activites.length > 0) {
          this.activiteFiltre = activites[0]
        }
      }
    },

    activiteFiltre: function (valeur) {
      if (valeur instanceof Activite || valeur instanceof Object) {
        this.fetchPlanDeDecaissements(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchPlanDeDecaissements(valeur);
      }
      else {
        this.setPlanDeDecaissements([])
      }
    },

    seePlan: function (valeur) {
      if (this.activites.length > 0) {
        this.activiteFiltre = this.activites[0]
      }
    }

  },

  created() {
    const profondeurSC = JSON.parse(localStorage.getItem('profondeurSC'))
   
    if (profondeurSC != undefined || profondeurSC != null) {
      this.isClick = profondeurSC.isClick
      if (this.isClick) {

        this.idProjet = profondeurSC.id
        this.idSC = profondeurSC.idSC
        this.idComposante = profondeurSC.idC

        this.newProjet = profondeurSC.projet
        this.newComponent = profondeurSC.composente
        this.newSC = profondeurSC.sousComposante

      }
    }
    this.getPermission()
    this.programmeId = this.currentUser.programme.id

    if (this.programmeId) {
      Promise.all([this.fetchProjets(this.programmeId)]).then((value) => {

        this.fetchStructure(this.programmeId)

      });
    }

  }

};
</script>

<style>

</style>
