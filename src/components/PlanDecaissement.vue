<script>
import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from "@/utils/index";
import ProjetService from "@/services/modules/projet.service.js";
import PlanDeCaissement from "@/services/modules/plan.decaissement.service";
import InputForm from "@/components/news/InputForm.vue";
import verifyPermission from "@/utils/verifyPermission";
import VButton from "@/components/news/VButton.vue";
import pagination from "@/components/news/pagination.vue";
import ActiviteService from "@/services/modules/activite.service";
import NoRecordsMessage from "@/components/NoRecordsMessage.vue";

import { helper as $h } from "@/utils/helper";

import { toast } from "vue3-toastify";
export default {
  emits: ["send-activiteId"],
  props: {
    activiteId: {
      type: String, // Type attendu (String, Number, Boolean, Array, Object, etc.)
      required: false, // Indique si la prop est obligatoire
      default: "", // Définit une valeur par défaut
    },
    activites: {
      type: Array, // Type attendu (String, Number, Boolean, Array, Object, etc.)
      required: false, // Indique si la prop est obligatoire
      default: [], // Définit une valeur par défaut
    },
  },
  components: {
    InputForm,
    VButton,
    pagination,
    NoRecordsMessage,
  },
  data() {
    return {
      activiteIdLocal: this.activiteId,

      search: "",
      isLoading: false,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: null,
      currentPage: 1, // Page courante
      messageErreur: {},

      planDeDecaissement: [],
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,
      formData: {
        annee: "",
        trimestre: "",
        pret: "0",
        budgetNational: "0",
        activiteId: "",
      },

      planDeDecaissementId: "",
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    paginatedAndFilteredDataPlan() {
      const { paginatedData, totalFilteredItems } = $h.filterData({
        itemsPerPage: this.itemsPerPage,
        search: this.search,
        data: this.planDeDecaissement,
        currentPage: this.currentPage,
        keys: ["activite.nom"],
      });

      // Mettre à jour le total pour recalculer la pagination
      this.totalItems = totalFilteredItems;

      return paginatedData;
    },
  },

  methods: {
    obtenirDate(annee) {
      // Convertir l'année en chaîne et concaténer avec "-01-01"
      let myDate = `${annee}-01-01`;
      console.log("myDate", myDate);

      const date = new Date(myDate); // Exemple de date
      const dateISO = date.toISOString().split("T")[0];
      return dateISO;
    },
    updateActiviteId(id) {
      const details = { id: 1, nom: "Exemple" };
      this.$emit("send-activiteId", id);
    },
    text() {},
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
    supprimerPlanDeDecaissement(data) {
      this.showDeleteModal = true;
      console.log("this.planDeDecaissementId", this.planDeDecaissementId);
      this.planDeDecaissementId = data.id;
    },
    deleteplanDeDecaissement() {
      this.deleteLoader = true;
      PlanDeCaissement.destroy(this.planDeDecaissementId)
        .then((data) => {
          this.deleteLoader = false;
          this.showDeleteModal = false;
          toast.success("Suppression  éffectuée avec succès");
          this.getListePlanDeDecaissement(this.activiteId);
          setTimeout(() => {
            this.planDeDecaissementId = "";
          }, 100);
        })
        .catch((error) => {
          console.log("error", error);
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },
    modifierPlanDeDecaissement(data) {
      this.messageErreur = {};
      console.log(data);
      this.labels = "Modifier";
      this.showModal = true;
      console.log("showModal", this.showModal);
      this.update = true;

      this.formData.pret = data.pret ?? "";
      this.formData.activiteId = data.activiteId;
      this.formData.budgetNational = data.budgetNational;
      this.formData.trimestre = data.trimestre.toString();

      console.log("data.annee", data.annee);

      this.formData.annee = this.obtenirDate(data.annee);
      this.planDeDecaissementId = data.id;

      console.log("planDeDecaissementId", this.planDeDecaissementId);

      console.log("this.formData", this.formData);
    },
    addPlanDeDecaissement() {
      this.showModal = true;
      this.isUpdate = false;
      this.formData.activiteId = this.activiteId;
      this.labels = "Ajouter";
    },
    sendForm() {
      let oldDate = this.formData.annee;

      if (this.formData.annee) {
        const dateObj = new Date(this.formData.annee); // Convertir la chaîne en objet Date
        this.formData.annee = dateObj.getFullYear(); // Extraire l'année
      }

      if (this.update) {
        PlanDeCaissement.update(this.planDeDecaissementId, this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.getListePlanDeDecaissement(this.formData.activiteId);
              // this.formData.projetId = this.projetId;

              this.clearObjectValues(this.formData);
              this.getListePlanDeDecaissement();
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            this.formData.annee = new Date(oldDate).toISOString().split("T")[0];
            console.log(error);
            this.isLoading = false;
            if (error.response && error.response.data && error.response.data.errors) {
              this.messageErreur = error.response.data.errors;

              Object.keys(this.messageErreur).forEach((key) => {
                this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
              });
              toast.error("Une erreur s'est produite.Vérifier le formulaire de soumission");
            } else {
              toast.error(error.message);
              //
            }
          });
      } else {
        this.isLoading = true;
        this.formData.budgetNational = parseInt(this.formData.budgetNational);
        this.formData.pret = parseInt(this.formData.pret);

        if (this.formData.annee) {
          const dateObj = new Date(this.formData.annee); // Convertir la chaîne en objet Date
          this.formData.annee = dateObj.getFullYear(); // Extraire l'année
        }

        console.log("this.activiteId", this.activiteId);

        PlanDeCaissement.create(this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              console.log("this.formData.activiteId", this.formData.activiteId);
              //this.activiteIdLocal = this.formData.activiteId;

              this.getListePlanDeDecaissement(this.formData.activiteId);
              this.isLoading = false;
              toast.success("Ajout éffectué");
              this.showModal = false;

              setTimeout(() => {
                this.clearObjectValues(this.formData);
              }, 100);
            }
          })
          .catch((error) => {
            console.log("error", error);

            this.formData.annee = new Date(oldDate).toISOString().split("T")[0];
            this.isLoading = false;

            toast.error(error.message);

            if (error.response && error.response.data && error.response.data.errors) {
              this.messageErreur = error.response.data.errors;

              Object.keys(this.messageErreur).forEach((key) => {
                this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
              });

              if (error.response.data.message !== "") toast.error(error.response.data.message);
            } else {
              toast.error(error.message);
            }
          });
      }
    },
    getListePlanDeDecaissement(id) {
      ActiviteService.plansDeDecaissement(id)
        .then((data) => {
          console.log(data.data.data);
          this.planDeDecaissement = data.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // getListeplanDeDecaissement(data) {
    //   this.planDeDecaissement = data.composantes;
    // },
    filter() {},
  },
  watch: {
    activiteId(newId) {
      this.activiteIdLocal = newId;
      if (newId && newId !== "") {
        this.getListePlanDeDecaissement(newId);
      }
    },
  },

  created() {},
  mounted() {
    if (this.activiteId !== "") {
      this.getListePlanDeDecaissement(this.activiteId);
    }
  },
};
</script>

<template>
  <!-- <h2 class="mt-10 text-lg font-medium intro-y">Plan de décaissements</h2> -->

  <!-- Titre de la page -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y">
      <div class="w-auto">
        <div class="relative w-56 text-slate-500">
          <input type="text" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div v-if="verifyPermission('creer-un-plan-de-decaissement')" class="flex mt-4 sm:mt-0">
        <button class="mr-2 shadow-md btn btn-primary" @click="addPlanDeDecaissement()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un plan de décaissement</button>
      </div>
    </div>
  </div>
  <!-- <pre>{{isLoadingData}}</pre>
v-if="!isLoadingData"
v-if="verifyPermission('voir-un-plan-de-decaissement')" -->
  <!-- <pre>{{ planDeDecaissement }}</pre> -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <NoRecordsMessage class="col-span-12" v-if="!planDeDecaissement.length" title="Aucun plan de décaissement disponible" description="Il semble qu'il n'y ait pas de plan de décaissement à afficher. Veuillez sélectionner une activité dans le filtre ci-dessus." />

    <div v-for="(item, index) in paginatedAndFilteredDataPlan" :key="index" class="col-span-12 p-4 md:col-span-6 xl:col-span-4">
      <div class="p-5 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
        <!-- En-tête avec sigle et titre -->
        <div class="relative flex items-start pt-5">
          <div class="relative flex flex-col items-center w-full pt-5 lg:flex-row lg:items-start">
            <!-- Circle with initial or image -->
            <!-- <div class="flex items-center justify-center w-[90px] h-[90px] text-white rounded-full shadow-md bg-primary flex-shrink-0">
              {{ item.annee }}
            </div> -->
            <!-- Item details -->
            <div class="w-full">
              <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0 flex-1">
                <a href="" class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary _truncate text-center lg:text-left"> {{ item.activite.nom }}</a>
              </div>
              <!-- <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0 flex-1">
                <a href="" class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary _truncate text-center lg:text-left"> {{ item.annee }}</a>
              </div> -->
            </div>
          </div>
          <!-- Dropdown for actions -->
          <Dropdown class="absolute top-0 right-0 mt-2 mr-2">
            <DropdownToggle tag="a" class="block w-5 h-5 cursor-pointer">
              <MoreVerticalIcon class="w-5 h-5 text-gray-400 transition-colors hover:text-gray-600" />
            </DropdownToggle>
            <DropdownMenu class="w-40 bg-white rounded-md shadow-lg">
              <DropdownContent>
                <DropdownItem v-if="verifyPermission('modifier-un-plan-de-decaissement')" @click="modifierPlanDeDecaissement(item)"> <Edit2Icon class="w-4 h-4 mr-2 text-gray-600" /> Modifier </DropdownItem>
                <DropdownItem v-if="verifyPermission('supprimer-un-plan-de-decaissement')" @click="supprimerPlanDeDecaissement(item)"> <TrashIcon class="w-4 h-4 mr-2 text-red-500" /> Supprimer </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>

        <!-- Description section with distinct styling -->
        <div class="mt-5 text-center lg:text-left">
          <!-- <p class="mb-3 text-lg font-semibold text-primary">Description</p>
          <p class="p-3 text-gray-600 rounded-lg shadow-sm bg-gray-50">{{ item.description == null ? "Aucune description" : item.description }}</p> -->

          <!-- Other details with iconized section headers -->
          <div class="mt-5 space-y-3 text-gray-600">
            <div class="flex items-center">
              <LinkIcon class="w-4 h-4 mr-2" /> Fonds propre: {{ $h.formatCurrency(item.budgetNational) }}
              <div class="ml-2 italic font-bold">Fcfa</div>
            </div>

            <div class="flex items-center">
              <LinkIcon class="w-4 h-4 mr-2" /> Montant financé: {{ $h.formatCurrency(item.pret) }}
              <div class="ml-2 italic font-bold">Fcfa</div>
            </div>
            <div class="flex items-center">
              <CalendarIcon class="w-4 h-4 mr-2" /> Trimestre: {{ item.trimestre }}
              <!-- <div class="ml-2 italic font-bold">Fcfa</div> -->
            </div>
            <div class="flex items-center">
              <CalendarIcon class="w-4 h-4 mr-2" /> Annee: {{ item.annee }}
              <!-- <div class="ml-2 italic font-bold">Fcfa</div> -->
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

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter un Plan de décaissement</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un Plan de décaissement</h2>
    </ModalHeader>
    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="flex col-span-12">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Activités</label>
          <TomSelect
            v-model="formData.activiteId"
            :options="{
              placeholder: 'Choisir une activité',
              create: false,
              onOptionAdd: text(),
            }"
            @change="updateActiviteId(formData.activiteId)"
            class="w-full"
            title="Veuillez sélectionner une activité pour afficher son plan de décaissement"
          >
            <option value="">Choisir une activité</option>

            <option v-for="(element, index) in activites" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex col-span-12 mt-4">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Trimestre</label>
          <TomSelect
            v-model="formData.trimestre"
            :options="{
              placeholder: 'Choisir un trimestre',
              create: false,
            }"
            class="w-full"
          >
            <option value="">Choisir un trimestre</option>
            <option value="1">Trimestre 1</option>
            <option value="2">Trimestre 2</option>
            <option value="3">Trimestre 3</option>
            <option value="4">Trimestre 4</option>
          </TomSelect>
        </div>
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.trimestre">{{ messageErreur.trimestre }}</p>

        <InputForm v-model="formData.annee" class="col-span-12" type="date" required="required" placeHolder="Annee de base" label="Année de base" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.annee">{{ messageErreur.annee }}</p>

        <InputForm v-model="formData.budgetNational" class="col-span-12 no-spin" type="number" required="required" placeHolder="Ex : 2" label="Fond propre" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.budgetNational">{{ messageErreur.budgetNational }}</p>

        <InputForm v-model="formData.pret" class="col-span-12" type="number" required="required" placeHolder="Ex : 2" label="Montant financé" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pret">{{ messageErreur.pret }}</p>
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
        <VButton :loading="deleteLoader" label="Supprimer" @click="deleteplanDeDecaissement" />
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
