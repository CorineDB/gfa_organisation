<script>
import { mapGetters, mapActions } from "vuex";
import { toast } from "vue3-toastify";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
import ActiviteService from "@/services/modules/activite.service";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import ActivitiesComponent from "./activities.vue";
import verifyPermission from "@/utils/verifyPermission";
import NoRecordsMessage from "@/components/NoRecordsMessage.vue";
import pagination from "@/components/news/pagination.vue";
import PlanDecaissementComponent from "@/components/PlanDecaissement.vue";
import { helper as $h } from "@/utils/helper";
import ChartJauge from "../../../../components/news/ChartJauge.vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import PlanDeCaissement from "@/services/modules/plan.decaissement.service";
import AuthService from "@/services/modules/auth.service";

export default {
  components: {
    InputForm,
    VButton,
    NoRecordsMessage,
    pagination,
    PlanDecaissementComponent,
    ChartJauge,
    LoaderSnipper,
    // ActivitiesComponent,
  },

  data() {
    return {
      search: "",
      isLoadingActivites: false,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: null,
      currentPage: 1, // Page courante
      allActivite: [],
      messageErreur: {},
      projets: [],
      projetId: "",
      composants: [],
      sousComposants: [],
      activites: [],
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,
      formData: this.getInitialFormData(),
      selectedIds: {
        composantId: "",
        sousComposantId: "",
        activiteId: "",
      },
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,
      activiteTep: 0,
      activiteTef: 0,

      seeStatistique: false,
      seePlan: false,
      seeActivite: true,
      seeActivitiesOfState: 3,
      haveSousComposantes: false,

      planDeDecaissement: [],
      planDeDecaissementPayload: {
        activiteId: null,
        trimestre: this.getCurrentQuarter(), // Trimestre actuel
        annee: new Date().getFullYear(), // Set current year as default
        budgetNational: 0,
        pret: 0,
      },
      showModalPlanDeDecaissement: false,
      loadingPlanDeDecaissement: false,
      erreurPlanDeDecaissement: null,

      dateDebut: "",
      dateDebutOld: "",
      dateFin: "",
      dateFinOld: "",
      showModalProlongement: false,
      loadingProlonger: false,
      erreurProlongation: null,

      showModalCloturerActivite: false,
      cloturerModal: false,
      loadingCloturer: false,
      erreurPlanDeDecaissement: null,
      activiteId: null,
      dureeId: null,
      editDuree: false,
      debutProgramme: "",
      finProgramme: "",
      fondPropreOutcomes: 0,
      SubventionTotalOutcomes: 0,
      fondPropreOutPut: 0,
      SubventionTotalOutPut: 0,
      OutcomeData: [],
      OutputData: [],
      outputActivite: [],
      montantADecaisser: 0,
      sommeDesPlanDeDecaissement: 0,
      montantRestantADecaisser: 0,
      SubventionTotalOutPut : 0 ,
      dureeActivite: {
        debut: null,
        fin: null,
      },
      plageDureeActivite: [],
      trimestres: [],
      trimestreYears: [],
      loaderListePlan: false,
      listePlanDeDecaissement: [],
      openedAccordion : null,
    };
  },

  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    paginatedAndFilteredData() {
      const { paginatedData, totalFilteredItems } = $h.filterData({
        itemsPerPage: this.itemsPerPage,
        search: this.search,
        data: this.activites,
        currentPage: this.currentPage,
        keys: ["nom"],
      });

      // Mettre à jour le total pour recalculer la pagination
      this.totalItems = totalFilteredItems;

      return paginatedData;
    },
    years() {
      let anneeDebut = parseInt(`${this.debutProgramme.split("-")[0]}`);
      let anneeFin = parseInt(`${this.finProgramme.split("-")[0]}`);
      let annees = [];
      for (let annee = anneeDebut; annee <= anneeFin; annee++) {
        if (annee <= new Date().getFullYear()) {
          annees.push(annee);
        }
      }
      return annees;
    },
    getPlageProjet() {
      let obj = null;

      if (this.projetId !== "") {
        obj = this.projets;
      }

      return obj ? obj : null;
      // Retourne le nom ou `null` si non trouvé
    },
    getPlageActivite() {
      let obj = null;

      if (this.selectedIds.activiteId !== "") {
        obj = this.activites.find((item) => item.id === this.selectedIds.activiteId);
      }

      return obj ? obj : null;
      // Retourne le nom ou `null` si non trouvé
    },
  },

  watch: {
    projetId(newId) {
      if (newId) {
        this.loadProjetDetails(newId);
      }
    },

    "selectedIds.composantId": "loadComposantDetails",

    "selectedIds.sousComposantId": "loadSousComposantDetails",

    "formData.composanteId": "loadComposantDetails",

    //"formData.composanteId": "loadComposantDetails",
  },

  methods: {
    toggleAccordion (id) {
      this.openedAccordion = this.openedAccordion === id ? null : id
    },
    fondRestantOutCome() {
      if (this.activites.length === 0 && this.sousComposants.length === 0) {
        return this.fondPropreOutcomes;
      }

      // Initialiser les sommes à 0
      let sommeFondActivite = 0;
      let sommeFondSouscomposant = 0;

      // Somme des budgets nationaux des activités
      if (this.activites.length) {
        sommeFondActivite = this.activites.reduce((total, activite) => {
          return total + (activite.budgetNational || 0);
        }, 0);
      }

      // Somme des budgets nationaux des sous-composants
      if (this.sousComposants.length) {
        sommeFondSouscomposant = this.sousComposants.reduce((total, sousComposant) => {
          return total + (sousComposant.budgetNational || 0);
        }, 0);
      }

      // TODO: ajouter aussi le calcul des subventions si nécessaire

      // Calcul du fond restant
      return this.fondPropreOutcomes - (sommeFondActivite + sommeFondSouscomposant);
    },
    fondRestantOutput() {
      if (this.outputActivite.length === 0) {
        return this.fondPropreOutPut;
      }

      // Initialiser à 0
      let sommeFondUtilise = 0;

      // Somme des budgets nationaux utilisés
      if (this.outputActivite.length) {
        sommeFondUtilise = this.outputActivite.reduce((total, activite) => {
          return total + (activite.budgetNational || 0);
        }, 0);
      }

      // fond restant
      return this.fondPropreOutPut - sommeFondUtilise;
    },

    SubventionRestantOutcome() {
      if (this.activites.length === 0 && this.sousComposants.length === 0) {
        return this.SubventionTotalOutcomes;
      }

      // Initialiser à 0
      let sommeSubventionActivite = 0;
      let sommeSubventionSouscomposant = 0;

      // Subventions utilisées dans les activités
      if (this.activites.length) {
        sommeSubventionActivite = this.activites.reduce((total, activite) => {
          return total + (activite.pret || 0);
        }, 0);
      }

      // Subventions utilisées dans les sous-composants
      if (this.sousComposants.length) {
        sommeSubventionSouscomposant = this.sousComposants.reduce((total, sousComposant) => {
          return total + (sousComposant.pret || 0);
        }, 0);
      }

      // subvention restante
      return this.SubventionTotalOutcomes - (sommeSubventionActivite + sommeSubventionSouscomposant);
    },

    subventionRestantOutput() {
      if (this.outputActivite.length === 0) {
        return this.SubventionTotalOutPut;
      }

      // Initialiser à 0
      let sommeSubventionUtilise = 0;

      // Somme des subventions utilisées
      if (this.outputActivite.length) {
        sommeSubventionUtilise = this.outputActivite.reduce((total, activite) => {
          return total + (activite.pret || 0);
        }, 0);
      }

      // subvention restante
      return this.SubventionTotalOutPut - sommeSubventionUtilise;
    },
    async getcurrentUser() {
      await AuthService.getCurrentUser()
        .then((result) => {
          this.debutProgramme = result.data.data.programme.debut;
          this.finProgramme = result.data.data.programme.fin;
        })
        .catch((e) => {
          console.error(e);
          toast.error("Une erreur est survenue: Utilisateur connecté .");
        });
    },

    getQuartersInDuration(debut, fin) {
      if (!debut || !fin) return [];

      const dateDebut = new Date(debut);
      const dateFin = new Date(fin);
      const quartersMap = new Map();

      const currentDate = new Date(dateDebut);
      while (currentDate <= dateFin) {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const quarter = Math.ceil(month / 3);
        const key = `${year}-${quarter}`;

        if (!quartersMap.has(key)) {
          quartersMap.set(key, {
            trimestre: quarter,
            value: quarter,
            annee: year,
          });
        }

        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return Array.from(quartersMap.values()).sort((a, b) => {
        if (a.annee !== b.annee) return a.annee - b.annee;
        return a.trimestre - b.trimestre;
      });
    },

    getListePlanDeDecaissement(id) {
      this.loaderListePlan = true;

      ActiviteService.plansDeDecaissement(id)
        .then((data) => {
          this.loaderListePlan = false;
          this.listePlanDeDecaissement = data.data.data;

          if (this.listePlanDeDecaissement.length > 0) {
            this.sommeDesPlanDeDecaissement = this.listePlanDeDecaissement.reduce((total, item) => {
              return total + (item.budgetNational || 0) + (item.pret || 0);
            }, 0);
          } else {
            this.sommeDesPlanDeDecaissement = 0;
          }

          this.montantRestantADecaisser = this.montantADecaisser - this.sommeDesPlanDeDecaissement;

          console.log("this.listePlanDeDecaissement", this.listePlanDeDecaissement);
        })
        .catch((error) => {
          this.loaderListePlan = false;
        });
    },

    filteredTrimestresForPlan(annee) {
      if (!annee) {
        return this.trimestres;
      }
      return this.trimestres.filter((trimestre) => trimestre.annee == annee);
    },
    changeActiviteId(id) {
      this.selectedIds.activiteId = id;

      console.log("this.selectedIds.activiteId", this.selectedIds.activiteId);
    },
    getInfoActivite(id) {
      if (id !== null && id !== "") {
        ActiviteService.get(id)
          .then((response) => {
            console.log(response.data.data);
            this.activiteTep = response.data.data.tep;
            this.activiteTef = response.data.data.tef;

            this.dureeActivite = {
              debut: response.data.data.debut,
              fin: response.data.data.fin,
            };

            //recuprer les trimestes de la duree de l'activité
            this.trimestres = this.getQuartersInDuration(response.data.data.debut, response.data.data.fin);

            if (response.data.data.durees && response.data.data.durees.length) {
              this.plageDureeActivite = response.data.data.durees;

              //parcour plageDureeActivite
              this.plageDureeActivite.forEach((duree) => {
                const quartersInDuree = this.getQuartersInDuration(duree.debut, duree.fin);

                quartersInDuree.forEach((quarter) => {
                  // si le trimestre n'existe pas dans this.trimestres on l'ajoute
                  const exists = this.trimestres.some((t) => t.trimestre === quarter.trimestre);
                  if (!exists) {
                    this.trimestres.push(quarter);
                  }
                });
              });

              // Trier les trimestres par ordre croissant
              this.trimestres.sort((a, b) => a.trimestre - b.trimestre);
            }

            //créer etat global : trimestreYears a partie des trimestres
            const anneesUniques = [...new Set(this.trimestres.map((t) => t.annee))];
            this.trimestreYears = anneesUniques.sort((a, b) => a - b);

            //recuperer montantADecaisser
            this.montantADecaisser = response.data.data.pret + response.data.data.budgetNational;

            console.log("this.activiteTep ", this.activiteTep);
            console.log("this.activiteTef ", this.activiteTef);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    ...mapActions({
      // Mapping des actions pour le module activites
      prolongerDureeActivite: "activites/PROLONGER_DATE",

      modifierDuree: "activites/EDIT_DUREE",
      changerStatutActivite: "activites/CHANGER_STATUT",

      // Mapping des actions pour le module planDeDecaissements
      storePlanDecaissement: "planDeDecaissements/STORE_PLAN_DE_DECAISSEMENT",
    }),

    getCurrentQuarter() {
      const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
      return Math.ceil(month / 3); // Calcul du trimestre actuel
    },

    verifyPermission,
    onPageChanged(newPage) {
      this.currentPage = newPage;
      // console.log("Page actuelle :", this.currentPage);
      // // Charger les données pour la page actuelle
      // this.loadDataForPage(newPage);
    },
    onItemsPerPageChanged(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
    },
    seeTypeActivities(state) {
      state = parseInt(state);
      this.seeActivitiesOfState = state;

      // Si allActivite est vide, initialiser avec activites actuel
      if (this.allActivite.length === 0 && this.activites.length > 0) {
        this.allActivite = [...this.activites];
      }

      if (state == 3) {
        this.activites = [...this.allActivite];
      } else {
        this.activites = this.allActivite.filter((item) => item.statut == state);
      }
    },
    // Ajout des méthodes pour recevoir les valeurs du composant PlanDecaissementComponent
    receiveSommeDesPlanDeDecaissement(val) {
      this.sommeDesPlanDeDecaissement = val;
    },
    receiveMontantRestantADecaisser(val) {
      this.montantRestantADecaisser = val;
    },
    getInitialFormData() {
      return {
        nom: "",
        description: "",
        poids: 0,
        debut: "",
        fin: "",
        pret: 0,
        type: "pta",
        composanteId: "",
        budgetNational: 0,
      };
    },

    resetFormData() {
      this.formData = this.getInitialFormData();
    },

    supprimerComposant(data) {
      this.showDeleteModal = true;
      this.selectedIds.activiteId = data.id;
    },

    async deleteComposants() {
      try {
        this.deleteLoader = true;
        await ActiviteService.destroy(this.selectedIds.activiteId);
        toast.success("Suppression effectuée avec succès");
        this.loadComposantDetails();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      } finally {
        this.deleteLoader = false;
        this.showDeleteModal = false;
      }
    },

    modifierActivite(data) {
      this.isUpdate = true;
      this.messageErreur = {};
      this.labels = "Modifier";
      this.showModal = true;

      this.formData = {
        ...data,
        debut: data.durees[0]?.debut || "",
        fin: data.durees[0]?.fin || "",
        composanteId: this.selectedIds.sousComposantId || this.selectedIds.composantId,
      };
      this.formData.description = data.description;
      this.selectedIds.activiteId = data.id;
    },
    async mettreAjoutOutcome(id) {
      if (!id || id == "") return;

      try {
        const response = await ComposantesService.detailComposant(id);
        const composantData = response.data.data;
        this.isLoadingData = false;
        // Mettre à jour les sous-composants et activités du composant
        this.sousComposants = composantData.souscomposantes || [];
        console.log("this.sousComposants", this.sousComposants);
        this.activites = composantData.activites || [];
        this.currentPage = 1;
        this.allActivite = this.activites;

        // Vérifier s'il y a des sous-composants
        if (this.sousComposants.length > 0) {
          this.haveSousComposantes = true;
        } else {
          this.haveSousComposantes = false;
          // Pas de sous-composants, afficher directement les activités du composant
          this.updateActivitesList(this.activites);
        }
      } catch (error) {
        this.isLoadingData = false;
        console.error("Erreur lors du chargement des détails du composant", error);
      } finally {
        this.isLoadingData = false;
      }
      this.selectedIds.composantId = id;
    },
    addActivite() {
      this.resetFormData();
      this.messageErreur = {};
      this.showModal = true;
      this.isUpdate = false;
      this.labels = "Ajouter";
      setTimeout(() => {
        this.formData.composanteId = "";
        this.selectedIds.sousComposantId = "";
        this.sousComposants = [];
        this.haveSousComposantes = false;
        this.text();
      }, 400);
    },
    resetSousComposantsId() {
      // console.log("this.selectedIds.composantId", this.selectedIds.composantId);
      this.selectedIds.sousComposantId = "";
      this.loadComposantDetails();
      // this.text();
    },

    async sendForm() {
      console.log("this.selectedIds.composantId", this.selectedIds.composantId);
      const data = {
        ...this.formData,
        composanteId: this.selectedIds.sousComposantId == "" ? this.formData.composanteId : this.selectedIds.sousComposantId,
        budgetNational: parseInt(this.formData.budgetNational),
        pret: parseInt(this.formData.pret),
      };

      this.isLoading = true;
      try {
        if (this.isUpdate) {
          await ActiviteService.update(this.selectedIds.activiteId, data);
          toast.success("Modification effectuée");
        } else {
          await ActiviteService.create(data);
          if (this.selectedIds.sousComposantId == "") {
            // this.selectedIds.composantId = this.formData.composanteId;
            this.loadComposantDetails();
          } else {
            // alert("ok");
            this.loadSousComposantDetails();
          }

          toast.success("Ajout effectué");
        }

        this.showModal = false;
        // this.loadComposantDetails();
      } catch (error) {
        // alert("ok");
        // this.isLoading = false;
        // this.messageErreur = error.response?.data?.errors || {};
        // Object.keys(this.messageErreur).forEach((key) => {
        //   this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
        // });
        // toast.error("Erreur lors de l'envoi des données");

        this.isLoading = false;
        console.log(error);

        console.log(error.response.data.errors.length > 0);

        if (error.response && error.response.data && Object.keys(error.response.data.errors).length > 0) {
          this.messageErreur = error.response.data.errors;
          toast.error("Une erreur s'est produite dans votre formulaire");
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        this.isLoading = false;
      }
    },

    async loadProjets() {
      this.isLoadingData = true;
      console.log(this.projets);
      try {
        const response = await ProjetService.get();
        this.projets = response.data.data;
        this.projetId = this.projets.id || "";
        this.isLoadingData = false;
      } catch (error) {
        this.isLoadingData = false;
        console.error("Erreur lors du chargement des projets", error);
      } finally {
        if (this.projetId == "") this.isLoadingData = false;
      }
    },

    async loadProjetDetails(projetId) {
      this.composants = [];
      this.sousComposants = [];
      this.activites = [];
      this.isLoadingData = true;
      // console.log("this.selectedIds.composantId1", this.selectedIds.composantId);
      try {
        this.isLoadingData = false;
        const response = await ProjetService.getDetailProjet(projetId);
        this.composants = response.data.data.composantes;
        this.selectedIds.composantId = this.composants[0]?.id || "";

        console.log("this.selectedIds.composantId2", this.selectedIds.composantId);
        // alert("ok");
      } catch (error) {
        this.isLoadingData = false;
        console.error("Erreur lors du chargement des détails du projet", error);
      } finally {
        if (this.selectedIds.composantId == "") this.isLoadingData = false;
      }
    },

    async loadComposantDetails() {
      if (!this.selectedIds.composantId || this.selectedIds.composantId == "") return;

      this.isLoadingData = true;

      try {
        const response = await ComposantesService.detailComposant(this.selectedIds.composantId);
        const composantData = response.data.data;

        this.OutcomeData = response.data.data;

        this.fondPropreOutcomes = this.OutcomeData.budgetNational;
        this.SubventionTotalOutcomes = this.OutcomeData.pret;

        this.isLoadingData = false;
        this.sousComposants = composantData.souscomposantes || [];
        console.log("this.sousComposants", this.sousComposants);
        this.activites = composantData.activites || [];

        if (this.sousComposants.length > 0) {
          this.haveSousComposantes = true;
          // Vider les activités si on a des sous-composants
          this.allActivite = [];
        } else {
          this.haveSousComposantes = false;
          this.updateActivitesList(this.activites);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des détails du composant", error);
      }
    },

    async loadSousComposantDetails() {
      if (!this.selectedIds.sousComposantId || this.selectedIds.sousComposantId == "") return;

      try {
        const response = await ComposantesService.detailComposant(this.selectedIds.sousComposantId);
        const sousComposantData = response.data.data;

        this.outputActivite = sousComposantData.activites;

        this.OutputData = response.data.data;

        this.fondPropreOutPut = this.OutputData.budgetNational;
        this.SubventionTotalOutPut = this.OutputData.pret;

        //recupere fondPropre et subvention de output

        console.log("sousComposantData", sousComposantData);

        // Mettre à jour les activités du sous-composant
        this.updateActivitesList(sousComposantData.activites || []);
      } catch (error) {
        console.log("erreur", error);
        console.error("Erreur lors du chargement des détails du sous-composant", error);
      }
    },

    updateActivitesList(activites) {
      this.activites = activites;
      this.allActivite = [...activites]; // Copie du tableau pour éviter la référence partagée
      this.currentPage = 1;
      console.log(this.activites);
    },

    seeActivities() {
      this.seePlan = false;
      this.seeActivite = true;
      this.seeStatistique = false;
    },

    seeStats() {
      this.seePlan = false;
      this.seeActivite = false;
      this.seeStatistique = true;
    },

    seePlanDecaissement() {
      this.seePlan = true;
      this.seeActivite = false;
      this.seeStatistique = false;
    },
    text() {},

    ouvrirModalProlongerActivite(item) {
      this.dateDebutOld = item.debut;
      this.dateFinOld = item.fin;
      this.activiteId = item.id;
      this.selectedIds.activiteId = item.id;
      this.showModalProlongement = true;
    },

    editModalProlongerActivite(item, duree) {
      this.editDuree = true;
      this.dateDebut = duree.debut;
      this.dateFin = duree.fin;

      this.dateDebutOld = duree.debut;
      this.dateFinOld = duree.fin;
      this.activiteId = item.id;
      this.dureeId = duree.id;
      this.selectedIds.activiteId = this.activiteId;
      this.showModalProlongement = true;
    },

    prolongementActivite() {
      this.loadingProlonger = true;

      let payLoad = {
        debut: this.dateDebut,
        fin: this.dateFin,
      };

      this.prolongerDureeActivite({ dates: payLoad, id: this.activiteId })
        .then((response) => {
           this.loadingProlonger = false;
          if (response.status == 200 || response.status == 201) {
            this.showModalProlongement = false;
             this.loadingProlonger = false;
           

            this.dateDebut = "";
            this.dateDebutOld = "";
            this.dateFin = "";
            this.dateFinOld = "";

            toast.success("Prolongation éffectuée avec succès");

            this.loadSousComposantDetails();
            this.loadComposantDetails();
            //this.fetchProjets(this.programmeId);
          }
        })
        .catch((error) => {
          this.loadingProlonger = false;

          console.log(error);
          toast.error(error.response.data.message);

          // Mettre à jour les messages d'erreurs dynamiquement
          if (error.response && error.response.data && error.response.data.errors) {
            this.erreurProlongation = error.response.data.errors;
            toast.error("Une erreur s'est produite");
          }
        });
    },

    modifierDureeActivite() {
      this.loadingProlonger = true;

      let payLoad = {
        debut: this.dateDebut,
        fin: this.dateFin,
      };

      this.modifierDuree({ dates: payLoad, id: this.activiteId, duree: this.dureeId })
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            this.showModalProlongement = false;
            this.loadingProlonger = false;

            this.dateDebut = "";
            this.dateDebutOld = "";
            this.dateFin = "";
            this.dateFinOld = "";

            toast.success("Duree modifiée avec succès");

            this.loadComposantDetails();

            this.loadSousComposantDetails
            //this.fetchProjets(this.programmeId);
          }
        })
        .catch((error) => {
          this.loadingProlonger = false;

          console.log(error);
          toast.error(error.response.data.message);

          // Mettre à jour les messages d'erreurs dynamiquement
          if (error.response && error.response.data && error.response.data.errors) {
            this.erreurProlongation = error.response.data.errors;
            toast.error("Une erreur s'est produite");
          }
        });
    },

    submitDuree() {
      if (this.editDuree) {
        this.modifierDureeActivite();
      } else {
        this.prolongementActivite();
      }
    },

    changerStatut(item, statut = 2) {
      this.loaderStatut = true;

      const nouveauStatut = statut; //item.statut === 0 ? 2 : 0;

      const payLoad = {
        statut: nouveauStatut,
      };

      this.changerStatutActivite({ statut: payLoad, id: item.id })
        .then((response) => {
          this.loaderStatut = false;
          if (response.status == 200 || response.status == 201) {
            toast.success("Statut changé avec succès");

            // Recharger les activités selon le contexte
            if (this.selectedIds.sousComposantId && this.selectedIds.sousComposantId !== "") {
              this.loadSousComposantDetails();
            } else if (this.selectedIds.composantId && this.selectedIds.composantId !== "") {
              this.loadComposantDetails();
            }
          }
        })
        .catch((error) => {
          this.loaderStatut = false;

          console.log(error);
          toast.error(error.response.data.message);

          // Mettre à jour les messages d'erreurs dynamiquement
          if (error.response && error.response.data && error.response.data.errors) {
            this.erreurProlongation = error.response.data.errors;
            toast.error("Une erreur s'est produite");
          }
        });
    },

    ouvrirModalPlanDeDecaissementActivite(item) {
      this.montantADecaisser = item.pret + item.budgetNational;
      this.planDeDecaissement = [];

      this.dureeActivite = {
        debut: item.debut,
        fin: item.fin,
      };

      this.trimestres = this.getQuartersInDuration(item.debut, item.fin);

      if (item.durees && item.durees.length) {
        this.plageDureeActivite = item.durees;

        this.plageDureeActivite.forEach((duree) => {
          const quartersInDuree = this.getQuartersInDuration(duree.debut, duree.fin);

          quartersInDuree.forEach((quarter) => {
            const exists = this.trimestres.some((t) => t.trimestre === quarter.trimestre && t.annee === quarter.annee);
            if (!exists) {
              this.trimestres.push(quarter);
            }
          });
        });

        this.trimestres.sort((a, b) => {
          if (a.annee !== b.annee) return a.annee - b.annee;
          return a.trimestre - b.trimestre;
        });
      }

      const anneesUniques = [...new Set(this.trimestres.map((t) => t.annee))];
      this.trimestreYears = anneesUniques.sort((a, b) => a - b);

      const newItem = {
        activiteId: item.id,
        trimestre: this.trimestres.length > 0 ? this.trimestres[0].value : 1,
        annee: this.trimestreYears.length > 0 ? this.trimestreYears[0] : new Date().getFullYear(),
        budgetNational: 0,
        pret: 0,
        id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      };

      this.planDeDecaissementPayload.activiteId = item.id;
      this.getListePlanDeDecaissement(this.planDeDecaissementPayload.activiteId);
      this.planDeDecaissement.push(newItem);

      this.showModalPlanDeDecaissement = true;
    },

    addPlan() {
      const newItem = {
        activiteId: this.planDeDecaissementPayload.activiteId,
        trimestre: 1,
        annee: new Date().getFullYear(),
        budgetNational: 0,
        pret: 0,
        id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      };
      this.planDeDecaissement.push(newItem);
    },
    removePlan(index) {
      this.planDeDecaissement.splice(index, 1);
    },

    async planDeDecaissementActivite() {
      this.loadingPlanDeDecaissement = true;

      console.log(this.planDeDecaissement);

      let errorIndex = [];

      for (let index = 0; index < this.planDeDecaissement.length; index++) {
        let plan = this.listePlanDeDecaissement.filter((plan) => plan.annee == this.planDeDecaissement[index].annee && plan.trimestre == this.planDeDecaissement[index].trimestre);

        const action = plan.length > 0 ? PlanDeCaissement.update(plan[0].id, this.planDeDecaissement[index]) : this.storePlanDecaissement(this.planDeDecaissement[index]);

        try {
          await action;

          toast.success(`Plan de décaissement n° ${index + 1} enregistré avec succès`);
          errorIndex.push(index);

          if (index === this.planDeDecaissement.length - 1) {
            this.showModalPlanDeDecaissement = false;

            setTimeout(() => {
              this.planDeDecaissement = [];
            }, 500);
          }

          this.loadSousComposantDetails();
        } catch (error) {
          this.loadingPlanDeDecaissement = false;

          // Mettre à jour les messages d'erreurs dynamiquement
          if (error.response && error.response.data && error.response.data.errors) {
            // Transformer l'objet errors en format compatible avec l'affichage
            const formattedErrors = {};
            Object.keys(error.response.data.errors).forEach(key => {
              formattedErrors[key] = Array.isArray(error.response.data.errors[key])
                ? error.response.data.errors[key][0]
                : error.response.data.errors[key];
            });

            // Assigner les erreurs à l'index correspondant
            if (!this.erreurPlanDeDecaissement) {
              this.erreurPlanDeDecaissement = [];
            }
            this.erreurPlanDeDecaissement[index] = formattedErrors;

            toast.error(`Plan ${index + 1} : ${error.response.data.message}`);
          } else {
            toast.error(`Plan ${index + 1} : ${error.response?.data?.message || "Une erreur s'est produite"}`);
          }
        } finally {
          this.loadingPlanDeDecaissement = false;
        }
      }

      if (this.planDeDecaissement.length > 0) {
        console.log("this.planDeDecaissement", this.planDeDecaissement);

        if (errorIndex.length > 0) {
          console.log("errorIndex", errorIndex);
          errorIndex.forEach((item) => {
            this.removePlan(item);
          });
        }
      }
    },
  },

  async mounted() {
    await this.loadProjets();

    if (this.selectedIds.activiteId !== "" || this.selectedIds.activiteId !== null) {
      this.getInfoActivite(this.selectedIds.activiteId);
    }
    this.getcurrentUser();
  },
};
</script>

<template>
  <div class="flex items-center justify-between my-2 flex-wrap sm:flex-nowrap">
    <div class="flex space-x-2 md:space-x-4 w-full sm:w-4/5">
      <span :class="{ 'border-primary border-b-8 font-bold': seeActivite }" @click="seeActivities()" class="inline-block cursor-pointer text-xs sm:text-sm md:text-base uppercase border-primary py-2 mb-2">Activités</span>
      <span :class="{ 'border-primary border-b-8 font-bold': seePlan }" @click="seePlanDecaissement()" class="inline-block cursor-pointer text-xs sm:text-sm md:text-base uppercase py-2 mb-2">Plan de décaissement </span>
      <span :class="{ 'border-primary border-b-8 font-bold': seeStatistique }" @click="seeStats()" class="inline-block cursor-pointer text-xs sm:text-sm md:text-base uppercase py-2 mb-2">Statistiques </span>
    </div>
    <div>
      <button v-if="seeActivite && activiteAdd" @click="addActivite" title="ajouter une activite" class="px-4 py-2 flex overflow-hidden items-center text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: ">
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg
        ></span>
        <span class="mx-2 text-xs font-semibold">ajouter </span>
      </button>
    </div>
  </div>

  <!-- Filtre -->
  <div class="w-full px-4 mx-auto">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-base font-bold">Filtre</h2>

      <div class="grid grid-cols-2 gap-4">
       
        <!--  v-if="composants.length > 0" -->
        <div class="flex col-span-6">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Outcomes</label>
          <TomSelect
            v-model="selectedIds.composantId"
            :options="{
              placeholder: 'Choisir un Outcome',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.codePta }} - {{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="col-span-6 flex items-center justify-center">
          <div class="flex w-full mr-4">
            <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Output</label>
            <TomSelect
              v-model="selectedIds.sousComposantId"
              :options="{
                placeholder: 'Choisir un Output',
                create: false,
                onOptionAdd: text(),
              }"
              class="w-full"
            >
              <option value="">Choisir un Output</option>

              <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.codePta }} - {{ element.nom }}</option>
            </TomSelect>
          </div>
          <button v-if="sousComposants.length > 0" type="button" class="btn btn-outline-primary" @click="resetSousComposantsId()" title="Rester dans le composant">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="flex col-span-6" v-if="seePlan || seeStatistique">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Activités</label>
          <TomSelect
            v-model="selectedIds.activiteId"
            :options="{
              placeholder: 'Choisir une activité',
              create: false,
              onOptionAdd: text(),
            }"
            @change="getInfoActivite(selectedIds.activiteId)"
            class="w-full"
            title="Veuillez sélectionner une activité pour afficher son plan de décaissement"
          >
            <option value="">Choisir une activité</option>

            <option v-for="(element, index) in activites" :key="index" :value="element.id">{{ element.codePta }} - {{ element.nom }}</option>
          </TomSelect>
        </div>
      </div>
    </div>
  </div>

  <!-- Filtre -->
  <div class="container mx-auto" v-if="seeActivite">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <div class="flex flex-wrap items-center justify-between col-span-12 sm:flex-nowrap">
        <div class="flex">
          <h2 class="text-base font-bold">Activites</h2>
        </div>
        <div class="flex">
          <button class="mr-2 shadow-md btn btn-primary" v-permission="['creer-une-activite']" @click="addActivite()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une Activité</button>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between col-span-12">
        <div class="flex flex-wrap space-x-2 md:space-x-4">
          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 3 }" @click="seeTypeActivities(3)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Tout</span>

          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == -1 }" @click="seeTypeActivities(-1)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Non demarre</span>
          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 0 }" @click="seeTypeActivities(0)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">En cours </span>

          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 1 }" @click="seeTypeActivities(1)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">En retard </span>

          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 2 }" @click="seeTypeActivities(2)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Termine </span>
        </div>
        <div class="flex">
          <div class="relative text-slate-500">
            <input v-model="search" type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
            <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
      </div>
    </div>

    <!-- Results or other components -->
    <div class="mt-6">
      <LoaderSnipper v-if="isLoadingData" />

      <div v-if="!isLoadingData" class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NoRecordsMessage class="col-span-12" v-if="!paginatedAndFilteredData.length" title="Aucune activité trouvée" description="Il semble qu'il n'y ait pas d'activités à afficher. Veuillez en créer un." />
         <!-- Liste des activités -->
         <div
            v-else
            v-for="(item, index) in paginatedAndFilteredData"
            :key="index"
            class="p-4"
          >
            <div
              v-if="verifyPermission('voir-une-activite')"
              class="bg-white border-l-4 border-primary rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transform transition duration-300 cursor-pointer flex flex-col h-full"
            >
              <!-- En-tête -->
              <div class="relative flex items-start justify-between p-4">
                <div class="flex items-center gap-4">
                  <div
                    class="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white font-semibold shadow-md flex-shrink-0"
                  >
                    {{ item.codePta }}
                  </div>
                  <div class="flex flex-col">
                    <h3
                      class="text-lg font-semibold text-gray-800 hover:text-primary truncate max-w-[200px]"
                    >
                      {{ item.nom }}
                    </h3>
                    <button
                      @click.stop="navigateToTasks(item.id, item.nom)"
                      class="mt-2 px-3 py-1.5 bg-primary text-white rounded-md text-xs flex items-center gap-2 hover:bg-primary/90 shadow"
                      title="Voir les tâches de cette activité"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                      Tâches
                    </button>
                  </div>
                </div>

                <!-- Menu -->
                <Dropdown class="absolute top-3 right-3">
                  <DropdownToggle tag="a" href="javascript:;" class="block w-5 h-5">
                    <MoreVerticalIcon class="w-5 h-5 text-slate-500" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent>
                      <DropdownItem
                        v-if="verifyPermission('modifier-une-activite')"
                        @click="modifierActivite(item)"
                      >
                        <Edit2Icon class="w-4 h-4 mr-2" /> Modifier
                      </DropdownItem>

                      <DropdownItem
                        v-if="verifyPermission('prolonger-une-activite')"
                        @click="ouvrirModalProlongerActivite(item)"
                      >
                        <CalendarIcon class="w-4 h-4 mr-2" /> Prolonger
                      </DropdownItem>

                      <DropdownItem
                        v-if="verifyPermission('creer-un-plan-de-decaissement')"
                        @click="ouvrirModalPlanDeDecaissementActivite(item)"
                      >
                        <CalendarIcon class="w-4 h-4 mr-2" /> Plan de décaissement
                      </DropdownItem>

                      <DropdownItem
                        v-if="verifyPermission('supprimer-une-activite')"
                        @click="supprimerComposant(item)"
                      >
                        <TrashIcon class="w-4 h-4 mr-2" /> Supprimer
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>

              <!-- Corps avec scroll interne -->
              <div class="flex flex-col _justify-between flex-grow p-4 border-t">
                <!-- Section avec scroll: Description + Plages horaires -->
                
                  <!-- Description -->
                  <div class="mb-4">
                    <p class="text-primary font-semibold mb-2">Description</p>
                    <p class="text-sm text-gray-600 bg-gray-50 p-2 rounded shadow-sm">
                      {{ item.description || "Aucune description" }}
                    </p>
                  </div>
                   <!-- Section fixe en bas: Budget et dates -->
                <div class="mt-4 pt-4 border-t space-y-2 text-gray-700 text-sm flex-shrink-0">
                  <div class="flex items-center">
                    <LinkIcon class="w-4 h-4 mr-2 text-primary" />
                    Fonds propre :
                    <span class="font-semibold ml-1">{{
                      $h.formatCurrency(item.budgetNational || 0)
                    }}</span>
                    <span class="italic ml-1">Fcfa</span>
                  </div>

                  <div class="flex items-center">
                    <LinkIcon class="w-4 h-4 mr-2 text-primary" />
                    Subvention :
                    <span class="font-semibold ml-1">{{
                      $h.formatCurrency(item.pret || 0)
                    }}</span>
                    <span class="italic ml-1">Fcfa</span>
                  </div>

                  <div class="flex items-center">
                    <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" />
                    Statut :
                    <span class="ml-1 font-semibold">{{
                      item.statut == -2
                        ? "Non validé"
                        : item.statut == -1
                        ? "Pas démarré"
                        : item.statut == 0
                        ? "En cours"
                        : item.statut == 1
                        ? "En retard"
                        : "Terminé"
                    }}</span>
                  </div>

                  <div class="flex items-center">
                    <ClockIcon class="w-4 h-4 mr-2 text-primary" />
                    Date :
                    <span class="ml-1 font-semibold">{{
                      $h.reformatDate(item.debut)
                    }}</span>
                    au
                    <span class="ml-1 font-semibold">{{
                      $h.reformatDate(item.fin)
                    }}</span>
                  </div>
                </div>
                <div class="overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  <!-- Plages horaires -->
                  <div class="space-y-2 text-gray-700 text-sm">
                    <!-- Si une seule plage, on affiche directement -->
                    <div v-if="item.durees.length === 1" class="flex items-center">
                      <ClockIcon class="w-4 h-4 mr-2 text-primary" />
                      <div>
                        Plage 1 :
                        <span class="font-semibold">{{ $h.reformatDate(item.durees[0].debut) }}</span>
                        -
                        <span class="font-semibold">{{ $h.reformatDate(item.durees[0].fin) }}</span>
                      </div>
                      <button
                        class="p-1.5 ml-2 text-primary hover:text-primary/70"
                        @click="editModalProlongerActivite(item, item.durees[0])"
                      >
                        <Edit3Icon class="w-4 h-4" />
                      </button>
                    </div>

                    <div v-else class="border rounded-lg divide-y divide-gray-200">
                      <button
                        class="w-full flex items-center justify-between px-3 py-2 text-left font-medium text-primary hover:bg-gray-50"
                        @click="toggleAccordion(item.id)"
                      >
                        <span>Plages horaires ({{ item.durees.length }})</span>
                        <ChevronDownIcon
                          class="w-4 h-4 transform transition-transform duration-300"
                          :class="{ 'rotate-180': openedAccordion === item.id }"
                        />
                      </button>

                      <transition name="accordion">
                        <div v-if="openedAccordion === item.id" class="p-2 space-y-1">
                          <div
                            v-for="(plage, t) in item.durees"
                            :key="t"
                            class="flex items-center text-sm"
                          >
                            <ClockIcon class="w-4 h-4 mr-2 text-primary" />
                            <div>
                              Plage {{ t + 1 }} :
                              <span class="font-semibold">{{ $h.reformatDate(plage.debut) }}</span>
                              -
                              <span class="font-semibold">{{ $h.reformatDate(plage.fin) }}</span>
                            </div>
                            <button
                              class="p-1.5 ml-2 text-primary hover:text-primary/70"
                              @click="editModalProlongerActivite(item, plage)"
                            >
                              <Edit3Icon class="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>

               
              </div>
            </div>
          </div>
      </div>
    </div>
    <pagination class="col-span-12" :total-items="totalItems" :items-per-page="itemsPerPage" :is-loading="isLoadingProjets" @page-changed="onPageChanged" @items-per-page-changed="onItemsPerPageChanged">
      <!-- Slots personnalisés (facultatif) -->
      <template #prev-icon>
        <span>&laquo; Précédent</span>
      </template>
      <template #next-icon>
        <span>Suivant &raquo;</span>
      </template>
    </pagination>
  </div>

  <PlanDecaissementComponent
    v-if="seePlan"
    :activiteId="selectedIds.activiteId"
    :activites="activites"
    @send-activiteId="changeActiviteId"
    :getPlageActivites="getPlageActivite"
    :montantADecaisser="montantADecaisser"
    :trimestres="trimestres"
    :reciveYearsFromParent="trimestreYears"
    @send-sommeDesPlanDeDecaissement="receiveSommeDesPlanDeDecaissement"
    @send-montantRestantADecaisser="receiveMontantRestantADecaisser"
  />

  <div v-if="seeStatistique" class="flex flex-col sm:flex-row justify-evenly mt-4">
    <div class="flex flex-col items-center p-6 mb-3 bg-white rounded-md shadow">
      <p class="text-xl font-bold text-center">TEP DE L'ACTIVITE</p>

      <ChartJauge label="TEP" :temperature="`${activiteTep.toFixed(2) ?? 0} %`" />
    </div>
    <div class="flex flex-col items-center p-6 mb-3 bg-white rounded-md shadow">
      <p class="text-xl font-bold text-center">TEF DE L'ACTIVITE</p>
      <ChartJauge label="TEF" :temperature="`${activiteTef.toFixed(2) ?? 0}%`" />
    </div>
  </div>

  <!-- END: Users Layout -->

  <Modal size="modal-xl" backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!isUpdate" class="mr-auto text-base font-medium">Ajouter une Activité</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un Activité</h2>
    </ModalHeader>
    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12 md:col-span-6">
          <InputForm v-model="formData.nom" class="col-span-12 mt-4" type="text" required="required" placeHolder="Nom de l'activité*" label="Nom" />
          <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
        </div>
        <div class="input-form mt-3 col-span-12 md:col-span-6">
          <label for="validation-form-6" class="form-label w-full"> Description </label>
          <textarea v-model="formData.description" class="form-control w-full" name="comment" placeholder="Ajouter une description"></textarea>
        </div>
        <div class="col-span-12 md:col-span-6">
          <InputForm v-model="formData.pret" class="col-span-12 mt-4" type="number" required="required" placeHolder="Subvention*" label="Subvention" />
          <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.pret">{{ messageErreur.pret }}</p>
        </div>
        <div class="col-span-12 md:col-span-6">
          <InputForm v-model="formData.budgetNational" class="col-span-12 mt-4" type="number" required="required" placeHolder="Ex : 2" label="Fond Propre" />
          <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.budgetNational">{{ messageErreur.budgetNational }}</p>
        </div>

        <div v-if="!isUpdate" class="flex flex-col col-span-12 md:col-span-6 mt-4">
          <label for="_input-wizard-10" class="form-label">OutCome*</label>
          <TomSelect
            v-model="formData.composanteId"
            :options="{
              placeholder: 'Choisir un Outcome',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option value="">Choisir un Outcome</option>

            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.codePta }} - {{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex col-span-12 md:col-span-6 mt-4" v-if="haveSousComposantes && !isUpdate">
          <div class="flex flex-col w-full">
            <label for="_input-wizard-10" class="form-label">Output*</label>
            <div class="flex">
              <TomSelect
                v-model="selectedIds.sousComposantId"
                :options="{
                  placeholder: 'Choisir un Output',
                  create: false,
                  onOptionAdd: text(),
                }"
                class="w-11/12 mr-4"
              >
                <option value="">Choisir un Output</option>
                <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">
                  {{ element.codePta }}
                  -
                  {{ element.nom }}
                </option>
              </TomSelect>
              <button type="button" class="btn btn-outline-primary inline-block" @click="resetSousComposantsId()" title="Rester dans le composant">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <InputForm v-model="formData.debut" class="col-span-12 mt-4" type="date" required="required" placeHolder="Entrer la date de début*" label="Début de l'activité" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.debut">{{ messageErreur.debut }}</p>
        </div>

        <div class="col-span-12 md:col-span-6">
          <InputForm v-model="formData.fin" class="col-span-12 mt-4" type="date" required="required" placeHolder="Entrer la date de fin*" label="Fin de l'activité" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.fin">{{ messageErreur.fin }}</p>
        </div>

        <div v-if="getPlageProjet" class="flex items-center mt-2 col-span-12">
          <ClockIcon class="w-4 h-4 mr-2" />
          <div>
            Durée du projet : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au
            <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
          </div>
        </div>

        <!-- Afficher fondPropreRestantOutcome et subventionRestantOutcome si haveSousComposantes = false -->
        <div v-if="!haveSousComposantes" class="col-span-12 mt-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold mb-3">Budget disponible (Outcome)</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <p class="text-sm text-gray-600">Fonds propres restants</p>
                <p class="text-xl font-bold text-primary">{{ fondRestantOutCome() === 0 ? "0" : $h.formatCurrency(fondRestantOutCome()) + " FCFA" }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600">Subventions restantes</p>
                <p class="text-xl font-bold text-green-600">{{ SubventionRestantOutcome() === 0 ? "0" : $h.formatCurrency(SubventionRestantOutcome()) + " FCFA" }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Afficher fondPropreRestantOutput et subventionRestantOutput si haveSousComposantes = true -->
        <div v-if="haveSousComposantes" class="col-span-12 mt-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold mb-3">Budget disponible (Output)</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <p class="text-sm text-gray-600">Fonds propres restants</p>
                <p class="text-xl font-bold text-primary">{{ fondRestantOutput() === 0 ? "0" : $h.formatCurrency(fondRestantOutput()) + " FCFA" }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600">Subventions restantes</p>
                <p class="text-xl font-bold text-green-600">{{ subventionRestantOutput() === 0 ? "0" : $h.formatCurrency(subventionRestantOutput()) + " FCFA" }}</p>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" :label="labels" :loading="isLoading" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <Modal backdrop="static" :show="showDeleteModal" @hidden="showDeleteModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Etes vous sûr?</div>
        <div class="mt-2 text-slate-500">Voulez vous supprimer l'activité ? <br />Cette action ne peut être annulé</div>
      </div>
      <div class="flex gap-2 px-5 pb-8 text-center">
        <button type="button" @click="showDeleteModal = false" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton :loading="deleteLoader" label="Supprimer" @click="deleteComposants" />
      </div>
    </ModalBody>
  </Modal>

  <Modal backdrop="static" :show="showModalProlongement" @hidden="showModalProlongement = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ editDuree ? "Modifier l'activite" : "Prolonger l'activite" }}</h2>
    </ModalHeader>

    <form @submit.prevent="submitDuree">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="dateDebut" :min="dateDebutOld" class="col-span-12" type="date" :required="true" placeHolder="Entrer la nouvelle date debut" label="Nouvelle date debut de l'activite" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurProlongation != null && erreurProlongation.debut">{{ erreurProlongation.debut }}</p>

        <InputForm v-model="dateFin" :min="dateFinOld" class="col-span-12 mt-4" type="date" :required="true" placeHolder="Entrer la nouvelle date fin" label="Nouvelle date fin de l'activite" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurProlongation != null && erreurProlongation.fin">
          {{ erreurProlongation.fin }}
        </p>

        <div class="col-span-12 mt-4" v-if="getPlageActivite">
          <div class="flex items-center mt-2" v-for="(plage, t) in getPlageActivite.durees" :key="t">
            <ClockIcon class="w-4 h-4 mr-2" />
            <div>
              Plage de date {{ t + 1 }} : Du
              <span class="pr-1 font-bold"> {{ $h.reformatDate(plage.debut) }}</span>
              au
              <span class="font-bold"> {{ $h.reformatDate(plage.fin) }} </span>
            </div>
          </div>
        </div>

        <div v-if="getPlageProjet" class="flex items-center mt-2 col-span-12">
          <ClockIcon class="w-4 h-4 mr-2" />
          <div>
            Durée du projet : Du <span class="px-1 font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au
            <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModalProlongement = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" :label="editDuree ? 'Modifier' : 'Prolonger'" :loading="loadingProlonger" :type="submit" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <Modal backdrop="static" size="modal-lg" :show="showModalPlanDeDecaissement" @hidden="showModalPlanDeDecaissement = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Plan de décaissement</h2>
    </ModalHeader>

    <form @submit.prevent="planDeDecaissementActivite">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div v-for="(plan, index) in planDeDecaissement" :key="plan.id" class="col-span-12 p-4 bg-gray-50 rounded-lg mb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-gray-800">Plan {{ index + 1 }}</h3>
            <button type="button" @click="removePlan(index)" class="text-red-600 text-sm font-medium hover:text-red-800 flex items-center"><TrashIcon class="w-4 h-4 mr-1" /> Supprimer</button>
          </div>

          <!-- Formulaire en deux colonnes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Année -->
            <div>
              <label class="form-label">Sélectionner l'année de décaissement</label>
              <TomSelect v-model="plan.annee" :options="{ placeholder: 'Sélectionnez une année' }" class="w-full">
                <option v-for="(year, yearIndex) in trimestreYears" :key="yearIndex" :value="year">{{ year }}</option>
              </TomSelect>
              <p class="text-red-500 text-[12px] mt-1" v-if="erreurPlanDeDecaissement?.[index]?.annee">
                {{ erreurPlanDeDecaissement[index].annee }}
              </p>
            </div>

            <!-- Trimestre -->
            <div>
              <label class="form-label">Sélectionner le trimestre</label>
              <TomSelect v-model="plan.trimestre" :options="{ placeholder: 'Sélectionnez le trimestre' }" class="w-full">
                <option v-for="trimestre in filteredTrimestresForPlan(plan.annee)" :key="trimestre.value" :value="trimestre.value">Trimestre {{ trimestre.trimestre }} ({{ trimestre.annee }})</option>
              </TomSelect>
              <p class="text-red-500 text-[12px] mt-1" v-if="erreurPlanDeDecaissement?.[index]?.trimestre">
                {{ erreurPlanDeDecaissement[index].trimestre }}
              </p>
            </div>

            <!-- Fond propre -->
            <div>
              <InputForm v-model="plan.budgetNational" :min="0" type="number" :required="true" placeHolder="Saisissez le fond propre" label="Fond propre" />
              <p class="text-red-500 text-[12px] mt-1" v-if="erreurPlanDeDecaissement?.[index]?.budgetNational">
                {{ erreurPlanDeDecaissement[index].budgetNational }}
              </p>
            </div>

            <!-- Subvention -->
            <div>
              <InputForm v-model="plan.pret" :min="0" type="number" :required="true" placeHolder="Saisissez la subvention" label="Subvention" />
              <p class="text-red-500 text-[12px] mt-1" v-if="erreurPlanDeDecaissement?.[index]?.pret">
                {{ erreurPlanDeDecaissement[index].pret }}
              </p>
            </div>
          </div>
        </div>

        <!-- Informations contextuelles en bas -->
        <div class="col-span-12 space-y-4 mt-4">
          <!-- Durée du projet -->
          <div v-if="getPlageProjet" class="p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <ClockIcon class="w-4 h-4 mr-2 text-primary" />
              <div class="text-sm text-gray-700">
                <span class="font-semibold">Durée du projet :</span><br />
                Du <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au
                <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
              </div>
            </div>
          </div>

          <!-- Durée de l'activité -->
          <div v-if="dureeActivite.debut && dureeActivite.fin" class="p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center">
              <ClockIcon class="w-4 h-4 mr-2 text-primary" />
              <div class="text-sm text-gray-700">
                <span class="font-semibold">Durée de l'activité :</span><br />
                Du <span class="font-bold"> {{ $h.reformatDate(dureeActivite.debut) }}</span> au
                <span class="font-bold"> {{ $h.reformatDate(dureeActivite.fin) }}</span>
              </div>
            </div>
          </div>

          <!-- Plages de prolongation -->
          <div v-if="plageDureeActivite.length > 0" class="p-3 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-semibold mb-2 text-gray-700">Plages de prolongation :</h4>
            <div v-for="(plage, plageIndex) in plageDureeActivite" :key="plage.id" class="flex items-start mt-2">
              <ClockIcon class="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
              <div class="text-xs text-gray-600">
                <span class="font-medium">Prolongation {{ plageIndex + 1 }} :</span><br />
                Du <span class="font-bold"> {{ $h.reformatDate(plage.debut) }}</span> au
                <span class="font-bold"> {{ $h.reformatDate(plage.fin) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Affiche montantRestantADeecaisser en fonction de loaderListePlan -->
        <div class="col-span-12 mt-4">
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 class="text-lg font-semibold mb-3 text-blue-800">Résumé financier</h3>
            <div v-if="loaderListePlan" class="flex justify-center items-center py-4">
              <LoaderSnipper />
            </div>
            <div v-else class="grid grid-cols-1 gap-3">
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-600">Montant total à décaisser:</p>
                <p class="text-lg font-bold text-gray-900">{{ montantADecaisser ? $h.formatCurrency(montantADecaisser) : 0 }} FCFA</p>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-600">Somme des plans de décaissement:</p>
                <p class="text-lg font-bold text-gray-900">{{ sommeDesPlanDeDecaissement ? $h.formatCurrency(sommeDesPlanDeDecaissement) : 0 }} FCFA</p>
              </div>
              <div class="flex justify-between items-center pt-3 border-t border-blue-300">
                <p class="text-sm font-semibold text-gray-700">Montant restant à décaisser:</p>
                <p class="text-xl font-bold" :class="montantRestantADecaisser >= 0 ? 'text-green-600' : 'text-red-600'">{{ $h.formatCurrency(montantRestantADecaisser) }} FCFA</p>
              </div>
            </div>
          </div>
        </div>

        <button type="button" @click="addPlan" class="col-span-12 btn btn-outline-primary">Ajouter un autre plan</button>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModalPlanDeDecaissement = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Enregistrer" :loading="loadingPlanDeDecaissement" :disabled="loaderListePlan" :type="submit" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation pour l'accordéon */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
