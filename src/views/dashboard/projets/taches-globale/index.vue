<script>
import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from "@/utils/index";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
import ActiviteService from "@/services/modules/activite.service";
import TachesService from "@/services/modules/tache.service";
import verifyPermission from "@/utils/verifyPermission";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import { toast } from "vue3-toastify";
import pagination from "@/components/news/pagination.vue";
import { helper as $h } from "@/utils/helper";

export default {
  components: {
    InputForm,
    VButton,
    pagination,
  },
  data() {
    return {
      search: "",
      isLoadingTaches: false,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: null,
      currentPage: 1, // Page courante
      messageErreur: {},
      projets: [],
      projetId: null,
      composants: [],
      sousComposants: [],
      selectedIds: {
        composantId: "",
        sousComposantId: "",
        activiteId: "",
      },
      activites: [],
      // allActivite: [],
      haveSousComposantes: false,
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,
      formData: this.getInitialFormData(),
      composantsId: {},
      sousComposantId: {},
      activitesId: {},
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,
      taches: [],
      tacheId: "",
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    paginatedAndFilteredData() {
      const { paginatedData, totalFilteredItems } = $h.filterData({
        itemsPerPage: this.itemsPerPage,
        search: this.search,
        data: this.taches,
        currentPage: this.currentPage,
        keys: ["nom"],
      });

      // Mettre à jour le total pour recalculer la pagination
      this.totalItems = totalFilteredItems;

      return paginatedData;
    },
  },
  watch: {
    // projetId(newValue, oldValue) {
    //   if (this.projets.length > 0) {
    //     console.log(newValue);

    //     this.getProjetById(newValue.id);
    //   }
    // },
    // composantsId(newValue, oldValue) {
    //   if (this.composants.length > 0) {
    //     this.getComposantById(newValue.id);
    //   }
    // },
    // sousComposantId(newValue, oldValue) {
    //   if (this.sousComposants.length > 0) {
    //     this.getComposantById(newValue.id);
    //   }
    // },
    // activitesId(newValue, oldValue) {
    //   if (this.activites.length > 0) {
    //     this.getActiviteById(newValue.id);
    //   }
    // },
    projetId(newId) {
      if (newId) {
        this.loadProjetDetails(newId);
      }
    },

    "selectedIds.composantId": "loadComposantDetails",

    "selectedIds.sousComposantId": "loadSousComposantDetails",

    "selectedIds.activiteId": "loadActiviteDetails",
  },

  methods: {
    onPageChanged(newPage) {
      this.currentPage = newPage;
      console.log("Page actuelle :", this.currentPage);
      // Charger les données pour la page actuelle
      // this.loadDataForPage(newPage);
    },
    onItemsPerPageChanged(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
    },
    text() {},
    verifyPermission,
    clearObjectValues(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let value = obj[key];

          if (typeof value === "string") {
            obj[key] = "";
          } else if (typeof value === "number") {
            obj[key] = 0;
          } else if (typeof value === "boolean") {
            obj[key] = false;
          } else if (Array.isArray(value)) {
            obj[key] = [];
          } else if (typeof value === "object" && value !== null) {
            obj[key] = {}; // ou appliquer récursion pour vider les objets imbriqués
            this.clearObjectValues(obj[key]); // récursion pour les objets imbriqués
          } else {
            obj[key] = null; // pour les autres types (null, undefined, etc.)
          }
        }
      }
    },
    supprimerTache(data) {
      this.showDeleteModal = true;
      this.tacheId = data.id;
    },
    deleteTache() {
      this.deleteLoader = true;
      TachesService.destroy(this.tacheId)
        .then((data) => {
          this.deleteLoader = false;
          this.showDeleteModal = false;
          toast.success("Suppression  éffectuée avec succès");
          // this.getListeProjet();
          this.loadActiviteDetails();
        })
        .catch((error) => {
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },
    modifierTache(data) {
      this.messageErreur = {};
      this.labels = "Modifier";
      this.showModal = true;
      this.update = true;
      this.formData.nom = data.nom;
      this.formData.poids = data.poids;
      this.formData.debut = data.debut;
      this.formData.fin = data.fin;
      this.formData.activiteId = this.selectedIds.activiteId;
      //this.formData.budgetNational = data.budgetNational;
      this.tacheId = data.id;
    },
    addTache() {
      console.log(this.isUpdate);
      this.update = false;
      this.messageErreur = {};
      this.resetFormData();
      // this.clearObjectValues(this.formData);
      this.showModal = true;
      this.isUpdate = false;

      // this.formData.activiteId = this.activitesId;

      this.labels = "Ajouter";
    },
    sendForm() {
      let data = {
        nom: this.formData.nom,
        poids: this.formData.poids,
        debut: this.formData.debut,
        fin: this.formData.fin,
        activiteId: this.formData.activiteId,
      };
      if (this.update) {
        //this.formData.budgetNational = parseInt(this.formData.budgetNational);
        // this.formData.projetId = this.projetId
        this.isLoading = true;
        TachesService.update(this.tacheId, data)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.activitesId = this.formData.activiteId;
              this.clearObjectValues(this.formData);
              // delete this.formData.projetId;
              this.getActiviteById(this.activitesId.id);
              // this.getListeProjet();
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            this.isLoading = false;
            if (error.response && error.response.data && error.response.data.errors) {
              this.messageErreur = error.response.data.errors;
              Object.keys(this.messageErreur).forEach((key) => {
                this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
              });
              toast.error("Une erreur s'est produite.Vérifier le formulaire de soumission");
            } else {
              toast.error(error.message);
            }
          });
      } else {
        this.isLoading = true;
        this.selectedIds.activiteId = this.formData.activiteId;
        //this.formData.budgetNational = parseInt(this.formData.budgetNational);
        TachesService.create(data)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              toast.success("Ajout éffectué");
              this.showModal = false;
              this.loadActiviteDetails;
              this.resetFormData();

              // this.getListeProjet();
            }
          })
          .catch((error) => {
            this.isLoading = false;
            if (error.response && error.response.data && error.response.data.errors) {
              this.messageErreur = error.response.data.errors;
              Object.keys(this.messageErreur).forEach((key) => {
                this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
              });
              toast.error("Une erreur s'est produite.Vérifier le formulaire de soumission");
            } else {
              toast.error(error.message);
            }
          });
      }
    },
    getInitialFormData() {
      return {
        nom: "",
        poids: 0,
        debut: "",
        fin: "",
        activiteId: "",
      };
    },
    resetFormData() {
      this.formData = this.getInitialFormData();
    },

    // async loadProjets() {
    //   this.isLoadingData = true;
    //   try {
    //     const response = await ProjetService.get();
    //     this.projets = response.data.data;
    //     this.projetId = this.projets[0]?.id || null;
    //     this.isLoadingData = false;
    //   } catch (error) {
    //     console.error("Erreur lors du chargement des projets", error);
    //   } finally {
    //     this.isLoadingData = false;
    //   }
    // },
    async loadProjets() {
      // console.log("this.selectedIds.composantId1", this.selectedIds.composantId);
      try {
        const response = await ProjetService.get();
        this.composants = response.data.data.composantes;
        this.selectedIds.composantId = this.composants[0]?.id || "";

        console.log("this.selectedIds.composantId2", this.selectedIds.composantId);
        // alert("ok");
      } catch (error) {
        console.error("Erreur lors du chargement des détails du projet", error);
      }
    },
    async loadComposantDetails() {
      if (!this.selectedIds.composantId || this.selectedIds.composantId == "") return;

      try {
        const response = await ComposantesService.detailComposant(this.selectedIds.composantId);
        const composantData = response.data.data;

        // Mettre à jour les sous-composants et activités du composant
        this.sousComposants = composantData.souscomposantes || [];
        console.log("this.sousComposants", this.sousComposants);
        this.activites = composantData.activites || [];
        // this.currentPage = 1;
        // this.allActivite = this.activites;

        // Vérifier s'il y a des sous-composants
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
      // this.allActivite = this.activites;
      // this.currentPage = 1;
      // console.log(this.activites);
    },
    text() {},
    async loadActiviteDetails() {
      if (!this.selectedIds.activiteId || this.selectedIds.activiteId == "") return;

      try {
        const response = await ActiviteService.get(this.selectedIds.activiteId);
        this.taches = response.data.data.taches;
        // this.paginatedAndFilteredData();

        // console.log("sousComposantData", sousComposantData);

        // // Mettre à jour les activités du sous-composant
        // this.updateActivitesList(sousComposantData.activites || []);
      } catch (error) {
        console.log("erreur", error);
        console.error("Erreur lors du chargement des détails du sous-composant", error);
      }
    },
    resetSousComposantsId() {
      this.selectedIds.sousComposantId = "";
      this.loadComposantDetails();
    },
    // getListeProjet() {
    //   this.isLoadingData = true;
    //   ProjetService.get()
    //     .then((data) => {
    //       this.isLoadingData = false;
    //       this.projets = data.data.data;
    //       if (Object.keys(this.projetId).length === 0) {
    //         this.projetId = this.projets[0];
    //       }

    //       this.getProjetById(this.projetId.id);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    // getProjetById(data) {
    //   ProjetService.getDetailProjet(data)
    //     .then((datas) => {
    //       this.composants = datas.data.data.composantes;
    //       this.composantsId = this.composants[0];
    //       // if (Object.keys(this.composantsId).length === 0) {

    //       // }
    //       this.getComposantById(this.composantsId.id);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    // getComposantById(data) {
    //   ComposantesService.detailComposant(data)
    //     .then((data) => {
    //       this.activites = data.data.data.activites;

    //       if (data.data.data.souscomposantes.length > 0) {
    //         this.sousComposants = data.data.data.souscomposantes;
    //         this.sousComposantId = this.sousComposants[0];
    //         this.haveSousComposantes = true;
    //       }

    //       this.activitesId = this.activites[0];
    //       this.getActiviteById(this.activitesId.id);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },

    // getActiviteById(data) {
    //   ActiviteService.get(data)
    //     .then((response) => {
    //       this.taches = response.data.data.taches;
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },

    filter() {},
  },

  created() {},
  mounted() {
    this.loadProjets();
  },
};
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Taches</h2>

  <!-- Filtre -->
  <div class="container px-4 mx-auto">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-base font-bold">Filtre</h2>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex col-span-6" v-if="projets.length > 0">
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

            <option v-for="(element, index) in projets" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex col-span-6" v-if="composants.length > 0">
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
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="col-span-6 flex items-center justify-center" v-if="composants.length > 0 && sousComposants.length > 0">
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

              <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.nom }}</option>
            </TomSelect>
          </div>
          <button v-if="sousComposants.length > 0" type="button" class="btn btn-outline-primary" @click="resetSousComposantsId()" title="Rester dans le composant"><TrashIcon class="w-4 h-4" /></button>
        </div>

        <div class="flex col-span-6" v-if="activites.length > 0 && (sousComposants.length > 0 || composants.length > 0)">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Activités</label>
          <TomSelect
            v-model="selectedIds.activiteId"
            :options="{
              placeholder: 'Choisir une activité',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
            title="Veuillez sélectionner une activité pour afficher son plan de décaissement"
          >
            <option value="">Choisir une activité</option>

            <option v-for="(element, index) in activites" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>
      </div>

      <!-- <button class="absolute px-4 py-2 text-white transform -translate-x-1/2 bg-blue-500 rounded -bottom-3 left-1/2" @click="filter()">Filtrer</button> -->
    </div>
  </div>

  <!-- Titre de la page -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y">
      <div class="w-auto">
        <div class="relative w-56 text-slate-500">
          <input type="text" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div v-if="verifyPermission('creer-une-tache')" class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="addTache()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une tâche</button>
      </div>
    </div>
  </div>

  <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Users Layout -->
    <!-- <pre>{{sousComposants}}</pre>   -->

    <div v-for="(item, index) in paginatedAndFilteredData" :key="index" class="col-span-12 intro-y md:col-span-6 xl:col-span-4">
      <div v-if="verifyPermission('voir-une-tache')" class="p-5 box">
        <div class="flex items-start pt-5 _px-5">
          <div class="_flex _flex-col _items-center w-full _lg:flex-row">
            <div class="mt-3 text-left _lg:ml-4 _lg:text-left lg:mt-0">
              <span class="pr-2 font-bold">Nom :</span><a href="" class="font-medium">{{ item.nom }}</a>
            </div>
          </div>
          <Dropdown class="absolute top-0 right-0 mt-3 mr-5">
            <DropdownToggle tag="a" class="block w-5 h-5" href="javascript:;">
              <MoreVerticalIcon class="w-5 h-5 text-slate-500" />
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem v-if="verifyPermission('modifier-une-tache')" @click="modifierTache(item)"> <Edit2Icon class="w-4 h-4 mr-2" /> Modifier </DropdownItem>
                <DropdownItem v-if="verifyPermission('supprimer-une-tache')" @click="supprimerTache(item)"> <TrashIcon class="w-4 h-4 mr-2" /> Supprimer </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="text-center lg:text-left mt-4">
          <p class="mb-3 text-md font-semibold text-primary">Description</p>
          <p class="p-3 text-gray-600 rounded-lg shadow-sm bg-gray-50">{{ item.description == null ? "Aucune description" : item.description }}</p>
          <div class="m-5 text-slate-600 dark:text-slate-500">
            <div class="flex items-center"><GlobeIcon class="w-4 h-4 mr-2" /> Taux d'exécution physique: {{ item.tep }}</div>

            <div class="flex items-center mt-2">
              <CheckSquareIcon class="w-4 h-4 mr-2" /> Statut :
              <span class="px-2 py-1 m-5 text-xs text-white rounded bg-primary/80" v-if="item.statut == -2"> Non validé </span>
              <span class="px-2 py-1 m-5 text-xs text-white rounded bg-success/80" v-else-if="item.statut == -1"> Validé </span>
              <span class="px-2 py-1 m-5 text-xs text-white rounded bg-pending/80" v-else-if="item.statut == 0"> En cours </span>
              <span class="px-2 py-1 m-5 text-xs text-white rounded bg-danger/80" v-else-if="item.statut == 1"> En retard </span>
              <span class="pl-2" v-else-if="item.statut == 2">Terminé</span>
            </div>
            <!-- <div class="flex items-center mt-2"><CheckSquareIcon class="w-4 h-4 mr-2" /> Poids : {{ item.poids }}</div> -->
          </div>
        </div>
      </div>
    </div>
    <pagination class="col-span-12" :total-items="totalItems" :items-per-page="itemsPerPage" :is-loading="isLoadingData" @page-changed="onPageChanged" @items-per-page-changed="onItemsPerPageChanged">
      <!-- Slots personnalisés (facultatif) -->
      <template #prev-icon>
        <span>&laquo; Précédent</span>
      </template>
      <template #next-icon>
        <span>Suivant &raquo;</span>
      </template>
    </pagination>
  </div>

  <!-- END: Users Layout -->
  <LoaderSnipper v-if="isLoadingData" />

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter une tache</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier une tache</h2>
    </ModalHeader>
    <form>
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom de la tache" label="Nom" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

        <InputForm v-model="formData.debut" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de début" label="Début de la tâche" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.debut">{{ messageErreur.debut }}</p>

        <InputForm v-model="formData.fin" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de fin " label="Fin de la tâche " />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.fin">{{ messageErreur.fin }}</p>

        <div class="col-span-12 mt-4">
          <div class="flex col-span-12" v-if="projets.length > 0 && !update">
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

              <option v-for="(element, index) in projets" :key="index" :value="element.id">{{ element.nom }}</option>
            </TomSelect>
          </div>
        </div>

        <div class="flex col-span-12 mt-4" v-if="composants.length > 0 && !update">
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
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex col-span-12 mt-4" v-if="composants.length > 0 && sousComposants.length > 0 && !update">
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

            <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex col-span-12 mt-4" v-if="!update">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Activités</label>
          <TomSelect
            v-model="formData.activiteId"
            :options="{
              placeholder: 'Choisir une activité',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
            title="Veuillez sélectionner une activité pour afficher son plan de décaissement"
          >
            <option value="">Choisir une activité</option>

            <option v-for="(element, index) in activites" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
          <!-- <v-select class="w-full" v-model="formData.activiteId" label="nom" :options="activites">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!formData.activiteId" v-bind="attributes" v-on="events" />
            </template>
          </v-select> -->
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.activiteId">{{ messageErreur.activiteId }}</p>

          <!-- <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-bold duration-100 ease-linear -translate-y-3 bg-white _font-medium form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Activites</label> -->
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" :label="labels" :loading="isLoading" @click="sendForm" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <Modal backdrop="static" :show="showDeleteModal" @hidden="showDeleteModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Etes vous sûr?</div>
        <div class="mt-2 text-slate-500">Voulez vous supprimer la tache ? <br />Cette action ne peut être annulé</div>
      </div>
      <div class="flex gap-2 px-5 pb-8 text-center">
        <button type="button" @click="showDeleteModal = false" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton :loading="deleteLoader" label="Supprimer" @click="deleteTache" />
      </div>
    </ModalBody>
  </Modal>
</template>

<style></style>
