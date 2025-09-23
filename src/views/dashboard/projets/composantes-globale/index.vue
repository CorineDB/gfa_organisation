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
import NoRecordsMessage from "@/components/NoRecordsMessage.vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";

import { toast } from "vue3-toastify";
export default {
  components: {
    InputForm,
    VButton,
    pagination,
    LoaderSnipper,
    NoRecordsMessage,
  },
  data() {
    return {
      search: "",
      isLoadingOutcome: true,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: null,
      currentPage: 1, // Page courante
      messageErreur: {},
      projets: [],
      projetId: "",
      composants: [],
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,
      formData: {
        nom: "",
        description: "",
        poids: 0,
        projetId: "",
        pret: 0,
        budgetNational: 0,
      },
      composantsId: "",
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
        data: this.composants,
        currentPage: this.currentPage,
        keys: ["nom"],
      });

      // Mettre à jour le total pour recalculer la pagination
      this.totalItems = totalFilteredItems;

      return paginatedData;
    },
    getPlageProjet() {
      let obj = null;

      if (this.projetId !== "") {
        //obj = this.projets.find((item) => item.id === this.projetId);
        obj = this.projets;
      }

      return obj ? obj : null;
    },
  },
  watch: {
    projetId(newValue, oldValue) {
      if (this.projets.length > 0) {
        if (newValue == "") {
          this.composants = this.projets[0].composantes;
        } else {
          const projetFiltre = this.projets.filter((item) => item.id == newValue);

          if (projetFiltre.length > 0) {
            this.composants = projetFiltre[0].composantes;
          } else {
            this.composants = [];
          }
        }
      }
    },
  },

  methods: {
    text() {},
    cancel() {
      this.formData = {
        nom: "",
        poids: 0,
        projetId: "",
        pret: 0,
        budgetNational: 0,
      };

      this.showModal = false;
    },
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
      this.composantsId = data.id;
    },
    deleteComposants() {
      this.deleteLoader = true;
      ComposantesService.destroy(this.composantsId)
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
    modifierComposante(data) {
      this.messageErreur = {};
      console.log(data);
      this.labels = "Modifier";
      this.showModal = true;
      console.log("showModal", this.showModal);
      this.update = true;
      this.formData.nom = data.nom;
      this.formData.description = data.description;
      this.formData.poids = data.poids;
      this.formData.pret = data.pret ?? "";
      this.formData.projetId = data.projetId;
      this.formData.budgetNational = data.budgetNational;
      console.log("formData", this.formData);
      this.composantsId = data.id;
      console.log("composantsId", this.composantsId);
    },
    addComposants() {
      this.showModal = true;
      this.isUpdate = false;
      this.formData.projetId = this.projetId;
      this.labels = "Ajouter";
    },
    sendForm() {
      this.formData.projetId = this.projets.id;
      console.log(this.formData);

      if (this.update) {
        ComposantesService.update(this.composantsId, this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.formData.projetId = this.projetId;

              this.clearObjectValues(this.formData);
              this.getListeProjet();
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.isLoading = false;
            if (error.response && error.response.data && Object.keys(error.response.data.errors).length > 0) {
              this.messageErreur = error.response.data.errors;

              Object.keys(this.messageErreur).forEach((key) => {
                this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
              });
              toast.error("Une erreur s'est produite.Vérifier le formulaire de soumission");
            } else {
              toast.error(error.response.data.message);
              //
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
            console.log("error", error);

            if (error.response && error.response.data && Object.keys(error.response.data.errors).length > 0) {
              this.messageErreur = error.response.data.errors;

              Object.keys(this.messageErreur).forEach((key) => {
                this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
              });

              console.log("this.messageErreur", this.messageErreur);
              toast.error("Une erreur s'est produite.Vérifier le formulaire de soumission");
            } else {
              toast.error(error.response.data.message);
            }
          });
      }
    },
    getListeProjet() {
      this.isLoadingOutcome = true;

      // ProjetService.get()
      //   .then((data) => {
      //     this.projets = data.data.data;
      //     this.composants = data.data.data.composantes;
      //     this.formData.projetId = data.data.data.id;

      //     console.log(data.data.data.id);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      ProjetService.get()
        .then((data) => {
          this.projets = data.data.data;
          this.getProjetById();
        })
        .catch((error) => {
          this.isLoadingOutcome = false;
          console.log(error);
        });
    },
    getProjetById() {
      if (this.projetId == "") {
        this.projetId = this.projets.id;
      }

      ProjetService.getDetailProjet(this.projetId)
        .then((data) => {
          this.composants = data.data.data.composantes;
          this.isLoadingOutcome = false;
        })
        .catch((error) => {
          this.isLoadingOutcome = false;
          console.log(error);
        });
    },
    getListeComposants(data) {
      this.composants = data.composantes;
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
  <h2 class="mt-10 text-lg font-medium intro-y">OutComes</h2>

  <!-- Titre de la page -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y">
      <div class="w-auto">
        <div class="relative w-56 text-slate-500">
          <input type="text" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div v-if="verifyPermission('creer-un-outcome')" class="flex mt-4 sm:mt-0">
        <button class="mr-2 shadow-md btn btn-primary" @click="addComposants()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un OutCome</button>
      </div>
    </div>
  </div>

  <LoaderSnipper v-if="isLoadingOutcome" />
  <div v-if="!isLoadingOutcome" class="grid grid-cols-12 gap-6 mt-5">
    <NoRecordsMessage class="col-span-12" v-if="!paginatedAndFilteredData.length" title="Aucun outCome trouvée" description="Il semble qu'il n'y ait pas d'outComes à afficher. Veuillez en créer un. " />
    <div v-for="(item, index) in paginatedAndFilteredData" :key="index" class="col-span-12 p-4 md:col-span-6 xl:col-span-4">
      <div v-if="verifyPermission('voir-un-outcome')" class="p-5 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
        <!-- En-tête avec sigle et titre -->
        <div class="relative flex items-start pt-5">
          <div class="relative flex flex-col items-center w-full pt-5 lg:flex-row lg:items-start">
            <!-- Circle with initial or image -->
            <div class="flex items-center justify-center w-[90px] h-[90px] text-white rounded-full shadow-md bg-primary flex-shrink-0">
              {{ item.codePta }}
            </div>
            <!-- Item details -->
            <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0 flex-1">
              <a href="" class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary _truncate text-center lg:text-left"> {{ item.nom }}</a>
            </div>
          </div>
          <!-- Dropdown for actions -->
          <Dropdown class="absolute top-0 right-0 mt-2 mr-2">
            <DropdownToggle tag="a" class="block w-5 h-5 cursor-pointer">
              <MoreVerticalIcon class="w-5 h-5 text-gray-400 transition-colors hover:text-gray-600" />
            </DropdownToggle>
            <DropdownMenu class="w-40 bg-white rounded-md shadow-lg">
              <DropdownContent>
                <DropdownItem v-if="verifyPermission('modifier-un-outcome')" @click="modifierComposante(item)"> <Edit2Icon class="w-4 h-4 mr-2 text-gray-600" /> Modifier </DropdownItem>
                <DropdownItem v-if="verifyPermission('supprimer-un-outcome')" @click="supprimerComposant(item)"> <TrashIcon class="w-4 h-4 mr-2 text-red-500" /> Supprimer </DropdownItem>
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
              <LinkIcon class="w-4 h-4 mr-2" /> Fonds propre: {{ item.budgetNational == 0 ? 0 : $h.formatCurrency(item.budgetNational) }}
              <div class="ml-2 italic font-bold">Fcfa</div>
            </div>

            <div class="flex items-center">
              <LinkIcon class="w-4 h-4 mr-2" /> Subvention: {{ item.pret == 0 ? 0 : $h.formatCurrency(item.pret) }}
              <div class="ml-2 italic font-bold">Fcfa</div>
            </div>

            <div class="flex items-center text-sm font-medium text-gray-700">
              <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Statut:
              <span v-if="item.statut == -2" class="ml-2 text-gray-900">Non validé</span>
              <span v-else-if="item.statut == -1" class="ml-2 text-gray-900">Validé</span>
              <span v-else-if="item.statut == 0" class="ml-2 text-gray-900">En cours</span>
              <span v-else-if="item.statut == 1" class="ml-2 text-gray-900">En retard</span>
              <span v-else-if="item.statut == 2" class="ml-2 text-gray-900">Terminé</span>
            </div>
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

  <Modal size="modal-xl" backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter un Outcome</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un OutCome</h2>
    </ModalHeader>
    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12 md:col-span-6">
          <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom de l'organisation" label="Nom" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
        </div>

        <div class="input-form _mt-3 col-span-12 md:col-span-6">
          <label for="validation-form-6" class="form-label w-full"> Description </label>
          <textarea v-model="formData.description" class="form-control w-full" name="comment" placeholder="Ajouter une description"></textarea>
        </div>

        <div class="col-span-12 md:col-span-6">
          <InputForm v-model="formData.budgetNational" class="col-span-12 no-spin" type="number" required="required" placeHolder="Ex : 2" label="Fond propre" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.budgetNational">{{ messageErreur.budgetNational }}</p>
        </div>

        <div class="col-span-12 md:col-span-6">
          <InputForm v-model="formData.pret" class="col-span-12" type="number" required="required" placeHolder="Ex : 2" label="Subvention" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pret">{{ messageErreur.pret }}</p>
        </div>

        <div v-if="getPlageProjet" class="flex items-center mt-2 col-span-12">
          <ClockIcon class="w-4 h-4 mr-2" />
          <div>
            Durée du projet : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="cancel" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
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
