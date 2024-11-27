<script>
import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from "@/utils/index";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import { toast } from "vue3-toastify";
export default {
  components: {
    InputForm,
    VButton,
  },
  data() {
    return {
      projets: [],
      projetId: "",
      composants: [],
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,
      formData: {
        nom: "",
        poids: "",
        projetId: "",
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
          //this.getListeProjet();
        })
        .catch((error) => {
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },
    modifierComposante(data) {
      this.labels = "Modifier";
      this.showModal = true;
      this.update = true;
      this.formData.nom = data.nom;
      this.formData.poids = data.poids;
      this.formData.projetId = data.projetId;
      this.formData.budgetNational = data.budgetNational;
      this.composantsId = data.id;
    },
    addComposants() {
      this.showModal = true;
      this.isUpdate = false;
      this.formData.projetId = this.projetId;
      this.labels = "Ajouter";
    },
    sendForm() {
      console.log(this.formData)
      
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
              //this.getListeProjet();
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.isLoading = false;
            toast.error(error.message);
          });
      } else {
        this.isLoading = true;
        this.formData.budgetNational = parseInt(this.formData.budgetNational);
        ComposantesService.create(this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              toast.success("Ajout éffectué");
              this.showModal = false;
              this.clearObjectValues(this.formData);

              //this.getListeProjet();
            }
          })
          .catch((error) => {
            this.isLoading = false;
            toast.error("Erreur lors de la modification");
          });
      }
    },
    getListeProjet() {
      ProjetService.get()
        .then((data) => {
          this.projets = data.data.data;
          this.getProjetById();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getProjetById() {
      if (this.projetId == "") {
        this.projetId = this.currentUser.projet.id;
        //this.projetId = this.projets[0].id;
      }

      ProjetService.getDetailProjet(this.projetId)
        .then((data) => {
          this.composants = data.data.data.composantes;
        })
        .catch((error) => {
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
    //this.getListeProjet();

    this.projetId = this.currentUser.projet.id;

    this.getProjetById();
  },
};
</script>

<template>
<h2 class="mt-10 text-lg font-medium intro-y">Outcomes</h2>

<!-- Filtre -->
<div class="container mx-auto px-4">
  <!-- Combined Filter Section -->
  <div class="bg-white p-6 rounded-lg shadow-md mt-3">
    <h2 class="text-base font-bold mb-4">Filtrer les Projets</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div class="relative flex flex-col w-full">
        <v-select class="w-full" :reduce="(projet) => projet.id" v-model="projetId" label="nom" :options="projets">
          <template #search="{ attributes, events }">
            <input class="vs__search form-input" :required="!projetId" v-bind="attributes" v-on="events" />
          </template>
        </v-select>
        <label for="_input-wizard-10" class="absolute top-0 left-2 px-2 py-1 bg-white text-sm font-medium text-slate-600 transform -translate-y-5">
          Projets
        </label>
      </div>
    </div>

    <button class="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 w-full sm:w-auto sm:mt-0 sm:absolute sm:-translate-x-1/2 sm:left-1/2 sm:bottom-[-15px] hover:bg-blue-600 transition-all duration-300 ease-in-out" @click="filter()">Filtrer</button>
  </div>

  <!-- Results Section -->
  <div class="mt-8">
    <!-- Placeholder for table or grid results -->
    <p class="text-center text-slate-600">Aucun résultat trouvé</p>
  </div>
</div>

<!-- Titre de la page et Actions -->
<div class="grid grid-cols-12 gap-6 mt-5">
  <div class="intro-y col-span-12 sm:flex sm:justify-between items-center">
    <!-- Recherche -->
    <div class="relative sm:w-56 w-full">
      <input type="text" class="form-control box w-full pr-10" placeholder="Recherche..." />
      <SearchIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
    </div>

    <!-- Bouton Ajouter -->
    <div class="flex mt-3 sm:mt-0">
      <button class="bg-primary text-white flex items-center py-2 px-4 rounded-md shadow-md hover:bg-primary-dark transition-all duration-300">
        <PlusIcon class="w-4 h-4 mr-2" /> Ajouter un Outcome
      </button>
    </div>
  </div>
</div>

<h2 class="mt-10 text-lg font-medium intro-y">OutComes</h2>

  <!-- Filtre -->
  <div class="container px-4 mx-auto">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-base font-bold">Filtre</h2>

      <div class="grid grid-cols-3 gap-4">
        <div class="flex w-full">
          <v-select class="w-full" :reduce="(projet) => projet.id" v-model="projetId" label="nom" :options="projets">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!projetId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
        </div>
      </div>

      <button class="absolute px-4 py-2 text-white transform -translate-x-1/2 bg-blue-500 rounded -bottom-3 left-1/2" @click="filter()">Filtrer</button>
    </div>

    <!-- Results or other components -->
    <div class="mt-6">
      <!-- Place the table or grid component here -->
    </div>
  </div>

  <!-- Titre de la page -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="addComposants()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un OutCome</button>
      </div>
    </div>
  </div>

  <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
    <div v-for="(item, index) in composants" :key="index" class="col-span-12 md:col-span-6 lg:col-span-4 p-4">
  <div class="p-5 box shadow-lg rounded-lg border-l-4 border-primary transition-transform transform hover:scale-105 bg-white hover:bg-gray-50">
    <!-- En-tête avec sigle et titre -->
    <div class="flex items-start pt-5 relative">
      <div class="flex flex-col items-center w-full lg:flex-row">
        <!-- Circle with initial or image -->
        <div class="flex items-center justify-center w-16 h-16 text-white rounded-full bg-primary shadow-md">
          {{ item.sigle }}
        </div>
        <!-- Item details -->
        <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0">
          <a href="" class="font-semibold text-lg text-gray-800 hover:text-primary transition-colors">
            {{ item.nom }}
          </a>
          <div class="mt-2 text-xs text-gray-500">
            <!-- Status badges -->
            <span v-if="item.statut == -2" class="px-2 py-1 text-xs font-medium text-white bg-primary rounded-md">
              Non validé
            </span>
            <span v-else-if="item.statut == -1" class="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-md">
              Validé
            </span>
            <span v-else-if="item.statut == 0" class="px-2 py-1 text-xs font-medium text-white bg-yellow-500 rounded-md">
              En cours
            </span>
            <span v-else-if="item.statut == 1" class="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md">
              En retard
            </span>
            <span v-else-if="item.statut == 2" class="pl-2 font-medium">Terminé</span>
          </div>
        </div>
      </div>
      <!-- Dropdown for actions -->
      <Dropdown class="absolute top-0 right-0 mt-2 mr-2">
        <DropdownToggle tag="a" class="block w-5 h-5 cursor-pointer">
          <MoreVerticalIcon class="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
        </DropdownToggle>
        <DropdownMenu class="w-40 shadow-lg rounded-md bg-white">
          <DropdownContent>
            <DropdownItem @click="modifierComposante(item)">
              <Edit2Icon class="w-4 h-4 mr-2 text-gray-600" /> Modifier
            </DropdownItem>
            <DropdownItem @click="supprimerComposant(item)">
              <TrashIcon class="w-4 h-4 mr-2 text-red-500" /> Supprimer
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </div>

    <!-- Description section with distinct styling -->
    <div class="text-center lg:text-left mt-5">
      <p class="text-lg font-semibold mb-3 text-primary">Description</p>
      <p class="text-gray-600 bg-gray-50 p-3 rounded-lg shadow-sm">{{ item.description }}</p>

      <!-- Other details with iconized section headers -->
      <div class="mt-5 text-gray-600 space-y-3">
        <div class="flex items-center text-sm font-medium text-gray-700">
          <LinkIcon class="w-4 h-4 mr-2 text-primary" /> Budget: 
          <span class="ml-2 text-gray-900 font-semibold">{{ item.budgetNational }}</span>
        </div>
        <div class="flex items-center text-sm font-medium text-gray-700">
          <GlobeIcon class="w-4 h-4 mr-2 text-primary" /> Taux d'exécution physique: 
          <span class="ml-2 text-gray-900 font-semibold">{{ item.tep }}</span>
        </div>
        <div class="flex items-center text-sm font-medium text-gray-700">
          <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Statut: 
          <span v-if="item.statut == -2" class="ml-2 text-gray-900">Non validé</span>
          <span v-else-if="item.statut == -1" class="ml-2 text-gray-900">Validé</span>
          <span v-else-if="item.statut == 0" class="ml-2 text-gray-900">En cours</span>
          <span v-else-if="item.statut == 1" class="ml-2 text-gray-900">En retard</span>
          <span v-else-if="item.statut == 2" class="ml-2 text-gray-900">Terminé</span>
        </div>
        <div class="flex items-center text-sm font-medium text-gray-700">
          <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Poids: 
          <span class="ml-2 text-gray-900 font-semibold">{{ item.poids }}</span>
        </div>
      </div>
    </div>
  </div>
</div>


  </div>
  <!-- END: Users Layout -->
  <LoaderSnipper v-if="isLoadingData" />

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter un Outcome</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un OutCome</h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom de l'organisation" label="Nom" />
      <InputForm v-model="formData.poids" class="col-span-12" type="number" required="required" placeHolder="Poids de l'activité " label="Poids" />
      <div v-if="this.currentUser.type == 'unitee-de-gestion'" class="flex col-span-12">
        <v-select class="w-full" :reduce="(projet) => projet.id" v-model="formData.projetId" label="nom" :options="projets">
          <template #search="{ attributes, events }">
            <input class="vs__search form-input" :required="!formData.projetId" v-bind="attributes" v-on="events" />
          </template>
        </v-select>
        <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-bold duration-100 ease-linear -translate-y-3 bg-white _font-medium form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
      </div>

      <InputForm v-model="formData.budgetNational" class="col-span-12" type="number" required="required" placeHolder="Ex : 2" label="Budget national" />
    </ModalBody>
    <ModalFooter>
      <div class="flex items-center justify-center">
        <button type="button" @click="showModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton class="inline-block" :label="labels" :loading="isLoading" @click="sendForm" />
      </div>
    </ModalFooter>
  </Modal>

  <Modal :show="showDeleteModal" @hidden="showDeleteModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Etes vous sûr?</div>
        <div class="mt-2 text-slate-500">Voulez vous supprimer l'organisation ? <br />Cette action ne peut être annulé</div>
      </div>
      <div class="flex gap-2 px-5 pb-8 text-center">
        <button type="button" @click="showDeleteModal = false" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton :loading="isLoading" label="Supprimer" @click="deleteComposants" />
      </div>
    </ModalBody>
  </Modal>
</template>

<style></style>
