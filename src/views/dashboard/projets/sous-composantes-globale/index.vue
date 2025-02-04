<script>
import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from "@/utils/index";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
import InputForm from "@/components/news/InputForm.vue";
import verifyPermission from "@/utils/verifyPermission";
import VButton from "@/components/news/VButton.vue";
import pagination from "@/components/news/pagination.vue";
import { helper as $h } from "@/utils/helper";

import { toast } from "vue3-toastify";
export default {
  components: {
    InputForm,
    VButton,
    pagination,
  },
  data() {
    return {
      search: "",
      isLoadingOutput: false,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: null,
      currentPage: 1, // Page courante
      messageErreur: {},
      projets: [],
      projetId: {},
      composants: [],
      sousComposants: [],
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,
      formData: {
        nom: "",
        poids: 0,
        pret: "",
        composanteId: "",
        budgetNational: 0,
      },
      composantsId: {},
      sousComposantId: {},
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    paginatedAndFilteredData() {
      const { paginatedData, totalFilteredItems } = $h.filterData({
        itemsPerPage: this.itemsPerPage,
        search: this.search,
        data: this.sousComposants,
        currentPage: this.currentPage,
        keys: ["nom"],
      });

      // Mettre à jour le total pour recalculer la pagination
      this.totalItems = totalFilteredItems;

      return paginatedData;
    },
  },
  watch: {
    projetId(newValue, oldValue) {
      if (this.projets.length > 0) {
        this.getProjetById(newValue.id);
      }
    },
    composantsId(newValue, oldValue) {
      if (this.composants.length > 0) {
        this.getComposantById(newValue.id);
      }
    },
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
            clearObjectValues(obj[key]); // récursion pour les objets imbriqués
          } else {
            obj[key] = null; // pour les autres types (null, undefined, etc.)
          }
        }
      }
    },
    verifyPermission,
    supprimerComposant(data) {
      this.showDeleteModal = true;
      this.sousComposantId.id = data.id;
    },
    deleteComposants() {
      this.deleteLoader = true;
      ComposantesService.destroy(this.sousComposantId.id)
        .then((data) => {
          this.deleteLoader = false;
          this.showDeleteModal = false;
          toast.success("Suppression  éffectuée avec succès");
          this.getListeProjet();
        })
        .catch((error) => {
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },
    modifierSousComposante(data) {
      console.log(data);
      this.messageErreur = {};
      this.labels = "Modifier";
      this.showModal = true;
      this.update = true;

      this.formData.nom = data.nom;
      this.formData.poids = data.poids;
      this.formData.pret = data.pret;
      this.formData.composanteId = data.composanteId;
      this.formData.budgetNational = data.budgetNational;

      this.sousComposantId.id = data.id;
    },
    addSousComposants() {
      this.messageErreur = {};
      this.showModal = true;
      this.isUpdate = false;
      this.formData.composanteId = this.composantsId.id;
      this.labels = "Ajouter";
    },
    sendForm() {
      if (this.update) {
        // this.formData.projetId = this.projetId.id
        this.isLoading = true;
        ComposantesService.update(this.sousComposantId.id, this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.composantsId.id = this.formData.composanteId;
              this.clearObjectValues(this.formData);

              this.getListeProjet();
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
        this.formData.budgetNational = parseInt(this.formData.budgetNational);
        this.formData.pret = parseInt(this.formData.pret);
        ComposantesService.create(this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              toast.success("Ajout éffectué");
              this.showModal = false;
              this.clearObjectValues(this.formData);

              this.getListeProjet();
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
    getListeProjet() {
      this.isLoadingData = true;
      ProjetService.get()
        .then((datas) => {
          this.isLoadingData = false;
          this.composants = datas.data.data.composantes;

          this.composantsId.id = this.composants[0].id;
          this.composantsId.nom = this.composants[0].nom;

          // if (Object.keys(this.composantsId).length === 0) {
          //
          //   alert("ok");
          //   console.log("this.composantsId", this.composantsId);
          // }

          this.getComposantById(this.composantsId.id);
        })
        .catch((error) => {
          this.isLoadingData = false;
          console.log(error);
        });
    },
    getComposantById(data) {
      ComposantesService.detailComposant(data)
        .then((data) => {
          this.sousComposants = data.data.data.souscomposantes;
          console.log(this.sousComposants);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    filter() {},
  },

  created() {},
  mounted() {
    this.getListeProjet();
  },
};
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">OutPut</h2>

  <!-- Filtre -->
  <div class="container px-4 mx-auto">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-base font-bold">Filtre</h2>

      <div class="grid grid-cols-2 gap-4">
        <!-- <div class="flex col-span-12 md:col-span-6">
          :reduce="(projet) => projet.id"
          <v-select class="w-full" v-model="projetId" label="nom" :options="projets">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!projetId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
        </div> -->
        <div class="flex col-span-12 md:col-span-6">
          <!-- :reduce="(composant) => composant.id" -->
          <v-select class="w-full" v-model="composantsId" label="nom" :options="composants">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!composantsId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtComes</label>
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
      <div v-if="verifyPermission('creer-un-output')" class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="addSousComposants()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un Output</button>
      </div>
    </div>
  </div>

  <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Users Layout -->
    <!-- <pre>{{sousComposants}}</pre>   -->
    <div v-for="(item, index) in paginatedAndFilteredData" :key="index" class="col-span-12 intro-y md:col-span-6 xl:col-span-4">
      <div v-if="verifyPermission('voir-un-output')" class="p-5 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
        <!-- En-tête avec sigle et titre -->
        <div class="relative flex items-start pt-5">
          <div class="relative flex flex-col items-center w-full pt-5 lg:flex-row lg:items-start">
            <!-- Circle with initial or image -->
            <div class="flex items-center justify-center w-16 h-16 text-white rounded-full shadow-md bg-primary flex-shrink-0">
              {{ item.sigle }}
            </div>
            <!-- Item details -->
            <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0">
              <a href="" class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary _truncate text-center lg:text-left"> {{ item.nom }} </a>
            </div>
          </div>
          <!-- Dropdown for actions -->
          <Dropdown class="absolute top-0 right-0 mt-2 mr-2">
            <DropdownToggle tag="a" class="block w-5 h-5 cursor-pointer">
              <MoreVerticalIcon class="w-5 h-5 text-gray-400 transition-colors hover:text-gray-600" />
            </DropdownToggle>
            <DropdownMenu class="w-40 bg-white rounded-md shadow-lg">
              <DropdownContent>
                <DropdownItem v-if="verifyPermission('modifier-un-output')" @click="modifierSousComposante(item)"> <Edit2Icon class="w-4 h-4 mr-2 text-gray-600" /> Modifier </DropdownItem>
                <DropdownItem v-if="verifyPermission('supprimer-un-output')" @click="supprimerComposant(item)"> <TrashIcon class="w-4 h-4 mr-2 text-red-500" /> Supprimer </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>

        <!-- Description section with distinct styling -->
        <div class="mt-5 text-center lg:text-left">
          <p class="mb-3 text-lg font-semibold text-primary">Description</p>

          <p class="p-3 text-gray-600 rounded-lg shadow-sm bg-gray-50">{{ item.description == null ? "Aucune description" : item.description }}</p>

          <!-- Other details with iconized section headers -->
          <div class="mt-5 space-y-3 text-gray-600">
            <div class="flex items-center">
              <LinkIcon class="w-4 h-4 mr-2" /> Fonds propre: {{ $h.formatCurrency(item.budgetNational) }}
              <div class="ml-2 italic font-bold">Fcfa</div>
            </div>

            <div class="flex items-center">
              <LinkIcon class="w-4 h-4 mr-2" /> Montant financé: {{ $h.formatCurrency(item.pret == null ? 0 : item.pret) }}
              <div class="ml-2 italic font-bold">Fcfa</div>
            </div>
            <div class="flex items-center text-sm font-medium text-gray-700">
              <GlobeIcon class="w-4 h-4 mr-2 text-primary" /> Taux d'exécution physique:
              <span class="ml-2 font-semibold text-gray-900">{{ item.tep }}</span>
            </div>
            <div class="flex items-center text-sm font-medium text-gray-700">
              <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Statut:
              <span v-if="item.statut == -2" class="ml-2 text-gray-900">Non validé</span>
              <span v-else-if="item.statut == -1" class="ml-2 text-gray-900">Validé</span>
              <span v-else-if="item.statut == 0" class="ml-2 text-gray-900">En cours</span>
              <span v-else-if="item.statut == 1" class="ml-2 text-gray-900">En retard</span>
              <span v-else-if="item.statut == 2" class="ml-2 text-gray-900">Terminé</span>
            </div>
            <!-- <div class="flex items-center text-sm font-medium text-gray-700">
              <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Poids:
              <span class="ml-2 font-semibold text-gray-900">{{ item.poids }}</span>
            </div> -->
          </div>
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
  <!-- END: Users Layout -->
  <LoaderSnipper v-if="isLoadingData" />

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter un Output</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un Output</h2>
    </ModalHeader>
    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" label="Nom" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

        <InputForm v-model="formData.budgetNational" class="col-span-12 no-spin" type="number" required="required" placeHolder="Ex : 2" label="Fond propre" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.budgetNational">{{ messageErreur.budgetNational }}</p>

        <InputForm v-model="formData.pret" class="col-span-12 no-spin" type="number" required="required" placeHolder="Fond propre" label="Montant financé" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pret">{{ messageErreur.pret }}</p>

        <div class="flex col-span-12" v-if="!update">
          <v-select class="w-full" :reduce="(composant) => composant.id" v-model="formData.composanteId" label="nom" :options="composants">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!formData.composanteId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.composanteId">{{ messageErreur.composanteId }}</p>

          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-bold duration-100 ease-linear -translate-y-3 bg-white _font-medium form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutComes</label>
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
        <div class="mt-2 text-slate-500">Voulez vous supprimer l'organisation ? <br />Cette action ne peut être annulé</div>
      </div>
      <div class="flex gap-2 px-5 pb-8 text-center">
        <button type="button" @click="showDeleteModal = false" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton :loading="deleteLoader" label="Supprimer" @click="deleteComposants" />
      </div>
    </ModalBody>
  </Modal>
</template>

<style>
.no-spin {
  /* Cacher les icônes pour Chrome, Edge, et Safari */
  -webkit-appearance: none;
  margin: 0;

  /* Cacher les icônes pour Firefox */
  -moz-appearance: textfield;

  /* Compatibilité supplémentaire */
  appearance: none;

  /* Optionnel : personnaliser les styles du champ */
  /* border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px; */
}
</style>
