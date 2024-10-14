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
      sousComposants: [],
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,
      formData: {
        nom: "",
        poids: "",
        composanteId: "",
        budgetNational: 0,
      },
      composantsId: "",
      sousComposantId: "",
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
        console.log(newValue);

        this.getProjetById(newValue);
      }
    },
    composantsId(newValue, oldValue) {
      if (this.composants.length > 0) {
        this.getComposantById(newValue);
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
          this.getListeProjet();
        })
        .catch((error) => {
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },
    modifierSousComposante(data) {
      this.labels = "Modifier";
      this.showModal = true;
      this.update = true;
      this.formData.nom = data.nom;
      this.formData.poids = data.poids;
      this.formData.composanteId = data.composanteId;
      this.formData.budgetNational = data.budgetNational;
      this.sousComposantId = data.id;
    },
    addSousComposants() {
      this.showModal = true;
      this.isUpdate = false;
      this.formData.composanteId = this.composantsId;
      this.labels = "Ajouter";
    },
    sendForm() {
      if (this.update) {
        this.formData.projetId = this.projetId
         this.isLoading = true;
        ComposantesService.update(this.sousComposantId, this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.composantsId = this.formData.composanteId
              this.clearObjectValues(this.formData);
              delete this.formData.projetId;
              this.getListeProjet();
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            delete this.formData.projetId;
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

              this.getListeProjet();
            }
          })
          .catch((error) => {
            this.isLoading = false;
            toast.error("Erreur lors de la modification");
          });
      }
    },
    getListeProjet() {
      this.isLoadingData = true
      ProjetService.get()
        .then((data) => {
          this.isLoadingData = false
          this.projets = data.data.data;
          if (this.projetId == "") {
            this.projetId = this.projets[0].id;
          }

          //this.getProjetById(this.projetId);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getProjetById(data) {
      ProjetService.getDetailProjet(data)
        .then((datas) => {
          this.composants = datas.data.data.composantes;
          if (this.composantsId == "") {
            this.composantsId = this.composants[0].id;
          }
          //this.getComposantById(this.composantsId);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getComposantById(data) {
      ComposantesService.detailComposant(data)
        .then((data) => {
          this.sousComposants = data.data.data.souscomposantes
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
        <div class="flex w-full">
          <v-select class="w-full" :reduce="(projet) => projet.id" v-model="projetId" label="nom" :options="projets">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!projetId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
        </div>
        <div class="flex w-full">
          <v-select class="w-full" :reduce="(composant) => composant.id" v-model="composantsId" label="nom" :options="composants">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!composantsId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtComes</label>
        </div>
      </div>

      <!-- <button class="absolute px-4 py-2 text-white transform -translate-x-1/2 bg-blue-500 rounded -bottom-3 left-1/2" @click="filter()">Filtrer</button> -->
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
        <button class="mr-2 shadow-md btn btn-primary" @click="addSousComposants()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un OutPut</button>
      </div>
    </div>
  </div>

  <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Users Layout -->
     <!-- <pre>{{sousComposants}}</pre>   -->
    <div v-for="(item, index) in sousComposants" :key="index" class="col-span-12 intro-y md:col-span-6 lg:col-span-4">
      <div class="p-5 box">
        <div class="flex items-start pt-5 _px-5">
          <div class="flex flex-col items-center w-full lg:flex-row">
            <div class="flex items-center justify-center w-16 h-16 text-white rounded-full image-fit bg-primary">
              {{ item.sigle }}
              <!-- <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" /> -->
            </div>
            <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0">
              <a href="" class="font-medium">{{ item.nom }}</a>
              <div class="mt-2 text-xs text-slate-500">
                <span class="px-2 py-1 m-5 text-xs text-white rounded bg-primary/80" v-if="item.statut == -2"> Non validé </span>
                <span class="px-2 py-1 m-5 text-xs text-white rounded bg-success/80" v-else-if="item.statut == -1"> Validé </span>
                <span class="px-2 py-1 m-5 text-xs text-white rounded bg-pending/80" v-else-if="item.statut == 0"> En cours </span>
                <span class="px-2 py-1 m-5 text-xs text-white rounded bg-danger/80" v-else-if="item.statut == 1"> En retard </span>
                <span class="pl-2" v-else-if="item.statut == 2">Terminé</span>
              </div>
            </div>
          </div>
          <Dropdown class="absolute top-0 right-0 mt-3 mr-5">
            <DropdownToggle tag="a" class="block w-5 h-5" href="javascript:;">
              <MoreVerticalIcon class="w-5 h-5 text-slate-500" />
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem @click="modifierSousComposante(item)"> <Edit2Icon class="w-4 h-4 mr-2" /> Modifier </DropdownItem>
                <DropdownItem @click="supprimerComposant(item)"> <TrashIcon class="w-4 h-4 mr-2" /> Supprimer </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="text-center lg:text-left">
          <div class="my-5 text-left">
            <p class="mx-auto font-semibold text-center">Description</p>

            {{ item.description }}
          </div>
          <div class="m-5 text-slate-600 dark:text-slate-500">
            <div class="flex items-center"><LinkIcon class="w-4 h-4 mr-2" /> Budget: {{ item.budgetNational }}</div>
            <div class="flex items-center"><GlobeIcon class="w-4 h-4 mr-2" /> Taux d'exécution physique: {{ item.tep }}</div>

            <div class="flex items-center mt-2">
              <CheckSquareIcon class="w-4 h-4 mr-2" /> Statut :
              <span class="pl-2" v-if="item.statut == -2"> Non validé </span>
              <span class="pl-2" v-else-if="item.statut == -1"> Validé </span>
              <span class="pl-2" v-else-if="item.statut == 0"> En cours </span>
              <span class="pl-2" v-else-if="item.statut == 1"> En retard </span>
              <span class="pl-2" v-else-if="item.statut == 2">Terminé</span>
            </div>
            <div class="flex items-center mt-2"><CheckSquareIcon class="w-4 h-4 mr-2" /> Poids : {{ item.poids }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Users Layout -->
  <LoaderSnipper v-if="isLoadingData" />

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter un Output</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un Output</h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom de l'organisation" label="Nom" />
      <InputForm v-model="formData.poids" class="col-span-12" type="number" required="required" placeHolder="Poids de l'activité " label="Poids" />
      <div class="flex col-span-12">
        <v-select class="w-full" :reduce="(composant) => composant.id" v-model="formData.composanteId" label="nom" :options="composants">
          <template #search="{ attributes, events }">
            <input class="vs__search form-input" :required="!formData.composanteId" v-bind="attributes" v-on="events" />
          </template>
        </v-select>
        <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-bold duration-100 ease-linear -translate-y-3 bg-white _font-medium form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutComes</label>
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
