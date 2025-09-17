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

    "formData.composanteId": "mettreAjoutOutcome",

    //"formData.composanteId": "loadComposantDetails",
  },

  methods: {
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
    changeActiviteId(id) {
      this.selectedIds.activiteId = id;

      console.log("this.selectedIds.activiteId", this.selectedIds.activiteId);
    },
    getInfoActivite(id) {
      if (id !== null || id !== "") {
        ActiviteService.get(id)
          .then((response) => {
            console.log(response.data.data);
            this.activiteTep = response.data.data.tep;
            this.activiteTef = response.data.data.tef;
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

      if (state == 3) {
        this.activites = this.allActivite;
      } else {
        console.log("state", state);

        this.activites = this.allActivite.filter((item) => item.statut == state);

        console.log("activites", this.activites);
      }
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
        this.isLoadingData = false;
        this.sousComposants = composantData.souscomposantes || [];
        console.log("this.sousComposants", this.sousComposants);
        this.activites = composantData.activites || [];

        if (this.sousComposants.length > 0) {
          this.haveSousComposantes = true;
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
      this.allActivite = this.activites;
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
    text() { },

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
          if (response.status == 200 || response.status == 201) {
            this.showModalProlongement = false;
            this.loadingProlonger = false;

            this.dateDebut = "";
            this.dateDebutOld = "";
            this.dateFin = "";
            this.dateFinOld = "";

            toast.success("Prolongation éffectuée avec succès");

            this.loadSousComposantDetails();
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

            this.loadSousComposantDetails();
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

    submitDuree(){
      if(this.editDuree ) {
        this.modifierDureeActivite();
      }else{
         this.prolongementActivite();
      }
    },

changerStatut(item, statut = 2) {
  this.loaderStatut = true;

  const nouveauStatut = statut;//item.statut === 0 ? 2 : 0;

  const payLoad = {
    statut: nouveauStatut,
  };

  this.changerStatutActivite({ statut: payLoad, id: item.id })
    .then((response) => {
      this.loaderStatut = false;
      if (response.status == 200 || response.status == 201) {
        toast.success("Statut changer  avec succès");

        this.loadSousComposantDetails();
        //this.fetchProjets(this.programmeId);
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
      this.planDeDecaissementPayload.activiteId = item.id;
      this.planDeDecaissement.push(this.planDeDecaissementPayload);
      this.showModalPlanDeDecaissement = true;
    },

    addPlan() {
      this.planDeDecaissement.push(this.planDeDecaissementPayload);
    },
    removePlan(index) {
      this.planDeDecaissement.splice(index, 1);
    },

    planDeDecaissementActivite() {
      this.loadingPlanDeDecaissement = true;

      console.log(this.planDeDecaissement);

      for (let index = 0; index < this.planDeDecaissement.length; index++) {
        this.storePlanDecaissement(this.planDeDecaissement[index])
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.showModalPlanDeDecaissement = false;
              this.loadingPlanDeDecaissement = false;

              toast.success("Plan de decaissement enrégistré avec succès");
              if (index === this.planDeDecaissement.length - 1) {
                this.planDeDecaissement = [];
              }

              this.loadSousComposantDetails();
              //this.fetchProjets(this.programmeId);
            }
          })
          .catch((error) => {
            this.loadingPlanDeDecaissement = false;

            toast.error("Une erreur s'est produite");

            // Mettre à jour les messages d'erreurs dynamiquement
            if (error.response && error.response.data && error.response.data.errors) {
              this.erreurPlanDeDecaissement = error.response.data.errors;
            } else {
              toast.error(error.response.data.errors.message);
            }
          });
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
      <span :class="{ 'border-primary border-b-8 font-bold': seeActivite }" @click="seeActivities()"
        class="inline-block cursor-pointer text-xs sm:text-sm md:text-base uppercase border-primary py-2 mb-2">Activités</span>
      <span :class="{ 'border-primary border-b-8 font-bold': seePlan }" @click="seePlanDecaissement()"
        class="inline-block cursor-pointer text-xs sm:text-sm md:text-base uppercase py-2 mb-2">Plan de décaissement
      </span>
      <span :class="{ 'border-primary border-b-8 font-bold': seeStatistique }" @click="seeStats()"
        class="inline-block cursor-pointer text-xs sm:text-sm md:text-base uppercase py-2 mb-2">Statistiques </span>
    </div>
    <div>
      <button v-if="seeActivite && activiteAdd" @click="addActivite" title="ajouter une activite"
        class="px-4 py-2 flex overflow-hidden items-center text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: ">
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
          </svg></span>
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
        <!-- <div class="flex col-span-6">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
          <TomSelect
            v-model="projetId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option value="">Choisir un projet</option>
            <option v-for="(element, index) in projets" :key="index" :value="element.id">{{ element.codePta }} - {{ element.nom }}</option>
          </TomSelect>
        </div> -->
        <!--  v-if="composants.length > 0" -->
        <div class="flex col-span-6">
          <label for="_input-wizard-10"
            class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Outcomes</label>
          <TomSelect v-model="selectedIds.composantId" :options="{
            placeholder: 'Choisir un Outcome',
            create: false,
            onOptionAdd: text(),
          }" class="w-full">
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.codePta }} - {{
              element.nom }}</option>
          </TomSelect>
        </div>

        <div class="col-span-6 flex items-center justify-center">
          <div class="flex w-full mr-4">
            <label for="_input-wizard-10"
              class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Output</label>
            <TomSelect v-model="selectedIds.sousComposantId" :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }" class="w-full">
              <option value="">Choisir un Output</option>

              <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.codePta }}
                - {{ element.nom }}</option>
            </TomSelect>
          </div>
          <button v-if="sousComposants.length > 0" type="button" class="btn btn-outline-primary"
            @click="resetSousComposantsId()" title="Rester dans le composant">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="flex col-span-6" v-if="seePlan || seeStatistique">
          <label for="_input-wizard-10"
            class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Activités</label>
          <TomSelect v-model="selectedIds.activiteId" :options="{
            placeholder: 'Choisir une activité',
            create: false,
            onOptionAdd: text(),
          }" @change="getInfoActivite(selectedIds.activiteId)" class="w-full"
            title="Veuillez sélectionner une activité pour afficher son plan de décaissement">
            <option value="">Choisir une activité</option>

            <option v-for="(element, index) in activites" :key="index" :value="element.id">{{ element.codePta }} - {{
              element.nom }}</option>
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
          <button class="mr-2 shadow-md btn btn-primary" v-permission="['creer-une-activite']" @click="addActivite()">
            <PlusIcon class="w-4 h-4 mr-3" />Ajouter une Activité
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between col-span-12">
        <div class="flex flex-wrap space-x-2 md:space-x-4">
          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 3 }"
            @click="seeTypeActivities(3)"
            class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Tout</span>

          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == -1 }"
            @click="seeTypeActivities(-1)"
            class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Non demarre</span>
          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 0 }"
            @click="seeTypeActivities(0)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">En
            cours </span>

          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 1 }"
            @click="seeTypeActivities(1)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">En
            retard </span>

          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 2 }"
            @click="seeTypeActivities(2)"
            class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Termine </span>
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

      <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
        <NoRecordsMessage class="col-span-12" v-if="!paginatedAndFilteredData.length" title="Aucune activité trouvée"
          description="Il semble qu'il n'y ait pas d'activités à afficher. Veuillez en créer un." />
        <div v-else v-for="(item, index) in paginatedAndFilteredData" :key="index"
          class="col-span-12 p-4 md:col-span-6 lg:col-span-4">
          <div v-if="verifyPermission('voir-une-activite')"
            class="p-5 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
            <div class="relative flex items-start pt-5">
              <div class="flex flex-col items-center w-full lg:flex-row">
                <div
                  class="flex items-center justify-center w-[90px] h-[90px] text-white rounded-full shadow-md bg-primary flex-shrink-0 mr-4">
                  {{ item.codePta }}
                  <!-- <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" /> -->
                </div>
                <div
                  class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary _truncate text-center lg:text-left">
                  <a href="" class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary">{{
                    item.nom }} </a>
                </div>
              </div>
              <Dropdown class="absolute top-0 right-0 mt-3 mr-5">
                <DropdownToggle tag="a" class="block w-5 h-5" href="javascript:;">
                  <MoreVerticalIcon class="w-5 h-5 text-slate-500" />
                </DropdownToggle>
                <DropdownMenu class="w-40">
                  <DropdownContent>
                    <DropdownItem v-if="verifyPermission('modifier-une-activite')" @click="modifierActivite(item)">
                      <Edit2Icon class="w-4 h-4 mr-2" /> Modifier
                    </DropdownItem>
                    <DropdownItem v-if="verifyPermission('prolonger-une-activite')"
                      @click="ouvrirModalProlongerActivite(item)">
                      <CalendarIcon class="w-4 h-4 mr-2" /> Prolonger
                    </DropdownItem>

                    <DropdownItem title="cliquer pour marquer l'activité comme terminer"
                      v-if="verifyPermission('modifier-une-activite') && item.statut == 0"
                      @click="changerStatut(item, 2)">
                      <CalendarIcon class="w-4 h-4 mr-2" /> Terminer
                    </DropdownItem>
                    
                    <DropdownItem title="cliquer pour marquer l'activité comme pas démarré"
                      v-if="verifyPermission('modifier-une-activite') && item.statut == 0"
                      @click="changerStatut(item, -1)">
                      <CalendarIcon class="w-4 h-4 mr-2" /> Pas Démarrer
                    </DropdownItem>

                    <DropdownItem title="cliquer pour démarré l'activité"
                      v-else-if="verifyPermission('modifier-une-activite') && (item.statut !== 0)"
                      @click="changerStatut(item, 0)">
                      <CalendarIcon class="w-4 h-4 mr-2" /> Démarrer
                    </DropdownItem>

                    <DropdownItem v-if="verifyPermission('creer-un-plan-de-decaissement')"
                      @click="ouvrirModalPlanDeDecaissementActivite(item)">
                      <CalendarIcon class="w-4 h-4 mr-2" /> Plan de decaissement
                    </DropdownItem>

                    <!-- <a v-if="verifyPermission('prolonger-un-projet')" class="flex items-center mr-auto text-primary" href="javascript:;" @click="ouvrirModalProlongerProjet(item)" title="Prolonger la date du projet"> <CalendarIcon class="w-4 h-4 mr-1" /><span class="hidden sm:block"> Étendre </span></a> -->

                    <DropdownItem v-if="verifyPermission('supprimer-une-activite')" @click="supprimerComposant(item)">
                      <TrashIcon class="w-4 h-4 mr-2" /> Supprimer
                    </DropdownItem>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
            </div>

            <div class="mt-5 text-center lg:text-left">
              <p class="mb-3 text-lg font-semibold text-primary">Description</p>
              <p class="p-3 text-gray-600 rounded-lg shadow-sm bg-gray-50">{{ item.description == null ? "Aucune description" : item.description }}</p>

              <div class="mt-5 space-y-3 text-gray-600">
                <div class="flex items-center">
                  <LinkIcon class="w-4 h-4 mr-2" /> Fonds propre: {{ item.budgetNational ? $h.formatCurrency(item.budgetNational) : 0 }}
                  <div class="ml-2 italic font-bold">Fcfa</div>
                </div>

                <div class="flex items-center">
                  <LinkIcon class="w-4 h-4 mr-2" /> Subvention: {{ item.pret ? $h.formatCurrency(item.pret): 0
                  }}
                  <div class="ml-2 italic font-bold">Fcfa</div>
                </div>

                <!-- <div class="flex items-center text-sm font-medium text-gray-700">
                  <GlobeIcon class="w-4 h-4 mr-2 text-primary" /> Taux d'exécution physique:
                  <span class="ml-2 font-semibold text-gray-900">{{ item.tep }}</span>
                </div> -->

                <div class="flex items-center text-sm font-medium text-gray-700">
                  <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Statut:
                  <span v-if="item.statut == -2" class="ml-2 text-gray-900">Non validé</span>
                  <span v-else-if="item.statut == -1" class="ml-2 text-gray-900">Validé</span>
                  <span v-else-if="item.statut == 0" class="ml-2 text-gray-900">En cours</span>
                  <span v-else-if="item.statut == 1" class="ml-2 text-gray-900">En retard</span>
                  <span v-else-if="item.statut == 2" class="ml-2 text-gray-900">Terminé</span>
                </div>
                <div class="flex items-center mt-2">
                  <ClockIcon class="w-4 h-4 mr-2" />
                  <div>
                    Date : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(item.debut) }}</span> au <span
                      class="font-bold"> {{ $h.reformatDate(item.fin) }}</span>
                  </div>
                </div>
                
                <div class="flex items-center mt-2" v-for="(plage, t) in item.durees" :key="t">
                  
                  <ClockIcon class="w-4 h-4 mr-2" v-if="t <= item.durees.length - 1" />
                  
                  <div v-if="t <= item.durees.length - 1">
                    Plage de date {{ t + 1 }} : Du 
                    <span class="pr-1 font-bold"> {{ $h.reformatDate(plage.debut) }}</span>
                    au
                    <span class="font-bold"> {{ $h.reformatDate(plage.fin) }}</span>
                  </div>

                  <button class="p-1.5 text-primary" @click="editModalProlongerActivite(item, plage)">
                    <Edit3Icon class="size-5" />
                  </button>
                </div>
                
                <!-- <div class="flex items-center mt-2" v-for="(plage, t) in item.durees" :key="t">
                  <ClockIcon class="w-4 h-4 mr-2" />
                  <div>
                    Plage de date {{ t + 1 }} : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(plage.debut)
                      }}</span> au <span class="font-bold"> {{ $h.reformatDate(plage.fin) }}</span>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pagination class="col-span-12" :total-items="totalItems" :items-per-page="itemsPerPage"
      :is-loading="isLoadingProjets" @page-changed="onPageChanged" @items-per-page-changed="onItemsPerPageChanged">
      <!-- Slots personnalisés (facultatif) -->
      <template #prev-icon>
        <span>&laquo; Précédent</span>
      </template>
      <template #next-icon>
        <span>Suivant &raquo;</span>
      </template>
    </pagination>
  </div>

  <PlanDecaissementComponent v-if="seePlan" :activiteId="selectedIds.activiteId" :activites="activites"
    @send-activiteId="changeActiviteId" :getPlageActivites="getPlageActivite" />

  <div v-if="seeStatistique" class="flex flex-col sm:flex-row justify-evenly mt-4">
    <div class="flex flex-col items-center p-6 mb-3 bg-white rounded-md shadow">
      <p class="text-xl font-bold text-center">TEP DE L'ACTIVITE</p>

      <ChartJauge label="TEP" :temperature="`${activiteTep.toFixed(2)  ?? 0} %`"/>

    </div>
    <div class="flex flex-col items-center p-6 mb-3 bg-white rounded-md shadow">
      <p class="text-xl font-bold text-center">TEF DE L'ACTIVITE</p>
      <ChartJauge label="TEF" :temperature="`${activiteTef.toFixed(2)  ?? 0}%`"/>
    </div>
  </div>

  <!-- END: Users Layout -->

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!isUpdate" class="mr-auto text-base font-medium">Ajouter une Activité</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un Activité</h2>
    </ModalHeader>
    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="formData.nom" class="col-span-12 mt-4" type="text" required="required"
          placeHolder="Nom de l'activité*" label="Nom" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

        <div class="input-form mt-3 col-span-12">
          <label for="validation-form-6" class="form-label w-full"> Description </label>
          <textarea v-model="formData.description" class="form-control w-full" name="comment"
            placeholder="Ajouter une description"></textarea>
        </div>

        <InputForm v-model="formData.pret" class="col-span-12 mt-4" type="number" required="required"
          placeHolder="Subvention*" label="Subvention" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pret">{{ messageErreur.pret }}</p>

        <InputForm v-model="formData.budgetNational" class="col-span-12 mt-4" type="number" required="required"
          placeHolder="Ex : 2" label="Fond Propre" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.budgetNational">{{
          messageErreur.budgetNational }}</p>

        <div class="flex col-span-12 mt-4">
          <label for="_input-wizard-10"
            class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutCome*</label>
          <TomSelect v-model="formData.composanteId" :options="{
            placeholder: 'Choisir un Outcome',
            create: false,
            onOptionAdd: text(),
          }" class="w-full">
            <option value="">Choisir un Outcome</option>

            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.codePta }} - {{
              element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex col-span-12 mt-4" v-if="haveSousComposantes">
          <div class="flex w-11/12 mr-2">
            <label for="_input-wizard-10"
              class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutPut*</label>
            <TomSelect v-model="selectedIds.sousComposantId" :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }" class="w-full">
              <option value="">Choisir un Output</option>
              <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.codePta }}
                -
                {{ element.nom }}</option>
            </TomSelect>
          </div>

          <button type="button" class="btn btn-outline-primary" @click="resetSousComposantsId()"
            title="Rester dans le composant">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <InputForm v-model="formData.debut" class="col-span-12 mt-4" type="date" required="required"
          placeHolder="Entrer la date de début*" label="Début de l'activité" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.debut">{{ messageErreur.debut }}</p>

        <InputForm v-model="formData.fin" class="col-span-12 mt-4" type="date" required="required"
          placeHolder="Entrer la date de fin*" label="Fin de l'activité" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.fin">{{ messageErreur.fin }}</p>

        <div v-if="getPlageProjet" class="flex items-center mt-2 col-span-12">
          <ClockIcon class="w-4 h-4 mr-2" />
          <div>
            Durée du projet : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au
            <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModal = false"
            class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
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
        <button type="button" @click="showDeleteModal = false"
          class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton :loading="deleteLoader" label="Supprimer" @click="deleteComposants" />
      </div>
    </ModalBody>
  </Modal>

  <Modal backdrop="static" :show="showModalProlongement" @hidden="showModalProlongement = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ editDuree ? "Modifier l'activite" : "Prolonger l'activite"}}</h2>
    </ModalHeader>

    <form @submit.prevent="submitDuree">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="dateDebut" :min="dateDebutOld" class="col-span-12" type="date" :required="true"
          placeHolder="Entrer la nouvelle date debut" label="Nouvelle date debut de l'activite" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12"
          v-if="erreurProlongation != null && erreurProlongation.debut">{{ erreurProlongation.debut }}</p>

        <InputForm v-model="dateFin" :min="dateFinOld" class="col-span-12 mt-4" type="date" :required="true"
          placeHolder="Entrer la nouvelle date fin" label="Nouvelle date fin de l'activite" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12"
          v-if="erreurProlongation != null && erreurProlongation.fin">
          {{ erreurProlongation.fin }}</p>


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
          <button type="button" @click="showModalProlongement = false"
            class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" :label="editDuree ? 'Modifier' : 'Prolonger'" :loading="loadingProlonger" :type="submit" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <Modal backdrop="static" :show="showModalPlanDeDecaissement" @hidden="showModalPlanDeDecaissement = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Plan de décaissement</h2>
    </ModalHeader>

    <form @submit.prevent="planDeDecaissementActivite">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div v-for="(plan, index) in planDeDecaissement" :key="index" class="col-span-12 border-b pb-4 mb-4">
          <h3 class="text-sm font-medium mb-2">Plan {{ index + 1 }}</h3>            

          <div class="col-span-12 mt-3">
            <label class="form-label">Sélectionnner l'année de décaissement</label>
            <TomSelect v-model="plan.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.annee">
              {{ erreurPlanDeDecaissement[index].annee }}
            </p>
          </div>

          <div class="col-span-12 mt-4">

            <label class="form-label">Sélectionnner le trimestre</label>
            <TomSelect v-model="plan.trimestre" :options="{ placeholder: 'Choisir un trimestre' }" class="w-full">
              <option value="">Choisir un trimestre</option>
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
              <option value="4">Trimestre 4</option>
            </TomSelect>
          </div>
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.trimestre">
            {{ erreurPlanDeDecaissement[index].trimestre }}
          </p>


          <InputForm v-model="plan.budgetNational" :min="0" class="col-span-12 mt-4" type="number" :required="true"
            placeHolder="Saisissez le fond propre" label="Saisissez le fond propre" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12"
            v-if="erreurPlanDeDecaissement?.[index]?.budgetNational">
            {{ erreurPlanDeDecaissement[index].budgetNational }}
          </p>

          <InputForm v-model="plan.pret" :min="0" class="col-span-12 mt-4" type="number" :required="true"
            placeHolder="Saisissez la subvention" label="Saisissez la subvention" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.pret">
            {{ erreurPlanDeDecaissement[index].pret }}
          </p>

          <button type="button" @click="removePlan(index)" class="mt-4 text-red-600 text-sm underline">Supprimer ce
            plan</button>
        </div>

        <button type="button" @click="addPlan" class="col-span-12 btn btn-outline-primary">Ajouter un autre
          plan</button>

          <div class="col-span-12 mt-4" v-if="getPlageActivite">
            <div class="flex items-center mt-2" v-for="(plage, t) in getPlageActivite.durees" :key="t">
              <ClockIcon class="w-4 h-4 mr-2" />
              <div>
                Plage de date {{ t + 1 }} : Du <span class="pr-1 font-bold"> {{
                  $h.reformatDate(plage.debut) }}</span> au <span
                  class="font-bold"> {{ $h.reformatDate(plage.fin)
                  }}</span>
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
          <button type="button" @click="showModalPlanDeDecaissement = false"
            class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Enregistrer" :loading="loadingPlanDeDecaissement" :type="submit" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
</template>

<style></style>