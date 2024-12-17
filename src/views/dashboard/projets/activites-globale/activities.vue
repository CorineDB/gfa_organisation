<script>
import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from "@/utils/index";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
import ActiviteService from "@/services/modules/activite.service";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import NoRecordsMessage from "@/components/NoRecordsMessage.vue";
import { toast } from "vue3-toastify";
export default {
  name: "ActivitiesComponent",
  components: {
    InputForm,
    VButton,
    NoRecordsMessage
  },
  props: {

    sousComposantsId: {
      type: String,
      required: true,
    },
    composantId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      projets: [],
      //projetId: "",
      composants: [],
      sousComposants: [],
      activites: [],
      haveSousComposantes: false,
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,

      seeStatistique: false,
      seePlan: false,
      seeActivite: true,
      seeActivitiesOfState: 0,

      formData: {
        nom: "",
        poids: "",
        debut: "",
        fin: "",
        type: "pta",
        composanteId: "",
        pret: 0,
        budgetNational: 0,
      },
      composantsId: "",
      sousComposantId: "",
      activiteId: "",
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
  },
  watch: {
    composantId(newValue, oldValue) {
      this.composantsId = newValue;
    },
    composantsId(newValue, oldValue) {
      //if (this.composants.length > 0) {
        this.getComposantById(newValue);
      //}
    },
    sousComposantId(newValue, oldValue) {
      //if (this.sousComposants.length > 0) {
      if (newValue!=null) {
        this.getComposantById(newValue);
        //this.getComposantById(newValue);
      }
      //}
    },
    sousComposantsId(newValue, oldValue) {
      this.sousComposantId = newValue;
    }
  },

  methods: {
    text() { },
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
    supprimerActivite(data) {
      this.showDeleteModal = true;
      this.sousComposantId = data.id;
    },
    deleteActivite() {
      this.deleteLoader = true;
      ActiviteService.destroy(this.activiteId)
        .then((data) => {
          this.deleteLoader = false;
          this.showDeleteModal = false;
          toast.success("Suppression  éffectuée avec succès");
          this.getComposantById(this.composantsId);
        })
        .catch((error) => {
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },

    addActivite() {
      this.triggerGetProjetDetailsById();
      this.showModal = true;
      this.isUpdate = false;
      this.formData.type = "pta";
      if (this.haveSousComposantes) {
        this.formData.composanteId = this.sousComposantId;
      } else {
        this.formData.composanteId = this.composantsId;
      }

      this.labels = "Ajouter";
    },

    modifierActivite(data) {
      this.labels = "Modifier";
      this.showModal = true;
      this.update = true;
      this.formData.nom = data.nom;
      this.formData.poids = data.poids;
      this.formData.debut = data.debut;
      this.formData.fin = data.fin;
      this.formData.type = "pta";
      this.formData.composanteId = data.composanteId;
      this.formData.pret = data.pret;
      this.formData.budgetNational = data.budgetNational;
      this.activiteId = data.id;
    },
    sendForm() {
      if (this.update) {
        this.formData.budgetNational = parseInt(this.formData.budgetNational);
        this.formData.pret = parseInt(this.formData.pret);
        this.formData.type = "pta";
        this.isLoading = true;
        ActiviteService.update(this.activiteId, this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.composantsId = this.formData.composanteId;
              this.clearObjectValues(this.formData);
              this.getComposantById(this.composantsId);
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            this.isLoading = false;
            toast.error(error.message);
          });
      } else {
        this.isLoading = true;
        this.formData.pret = parseInt(this.formData.pret);
        this.formData.budgetNational = parseInt(this.formData.budgetNational);
        this.formData.type = "pta";
        console.log(this.formData);
        ActiviteService.create(this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              toast.success("Ajout éffectué");
              this.showModal = false;
              this.clearObjectValues(this.formData);

              this.getComposantById(this.composantsId);
            }
          })
          .catch((error) => {
            this.isLoading = false;
            toast.error("Erreur lors de la modification");
          });
      }
    },

    triggerGetProjetDetailsById() {
      // Emit the event with the projetId as payload
      console.log("Emit");
      this.$emit('getProjetById');
    },
    getComposantById(data) {
      ComposantesService.detailComposant(data)
        .then((data) => {

          /* this.activites = data.data.data.activites;
          console.log(this.activites); */

          if (data.data.data.souscomposantes.length > 0) {
            this.sousComposants = data.data.data.souscomposantes;

            if ((this.sousComposantsId == "") && (this.sousComposants.length > 0) ) {
              this.sousComposantId = this.sousComposants[0].id;
            }
            this.haveSousComposantes = true;
          }
          else{
            console.log("Fetch sous composantes");
            console.log(data.data.data.activites);
            this.activites = data.data.data.activites;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    filter() { },

    seeActivities(state = 0) {
      this.seeActivitiesOfState = state;
    },
  },

  created() { },
  mounted() {
    //this.getComposantById(this.composantsId);
  },
};
</script>

<template>

    <!-- Filtre -->
    <div class="container mx-auto">
      <!-- Combined Filter Section -->
      <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">

        <div class="flex flex-wrap items-center justify-between col-span-12 sm:flex-nowrap">
          <div class="flex">
            <h2 class="text-base font-bold">Activites</h2>
          </div>
          <div class="flex">
            <button class="mr-2 shadow-md btn btn-primary" @click="addActivite()">
              <PlusIcon class="w-4 h-4 mr-3" />Ajouter une Activité
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between col-span-12 sm:flex-nowrap xs:flex-nowrap space-y-4 md:space-y-0">
          <div class="flex space-x-2 md:space-x-4">
            
            <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == -1 }" @click="seeActivities(-1)"
                class="inline-block cursor-pointer text-xs sm:text-sm uppercase border-primary py-2 mb-2">Non demarre</span>
              <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 0 }" @click="seeActivities()"
                class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">En cours
              </span>

              <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 1 }" @click="seeActivities(1)"
                class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">En retard
              </span>

              <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 2 }" @click="seeActivities(2)"
                class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Termine
              </span>
          </div>
          <div class="flex">
            <div class="relative text-slate-500">
                <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
                <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
            </div>
          </div>
        </div>

      </div>

      <!-- Results or other components -->
      <div class="mt-6">
        <!-- Place the table or grid component here -->
      </div>
    </div>

    <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
      <!-- BEGIN: Users Layout -->
      <!-- <pre>{{sousComposants}}</pre>   -->

      <div v-if="activites.length > 0" v-for="(item, index) in activites" :key="index" class="col-span-12 intro-y md:col-span-6 lg:col-span-4">
        <div class="p-5 box">
          <div class="flex items-start pt-5 _px-5">
            <div class="flex flex-col items-center w-full lg:flex-row">
              <div class="flex items-center justify-center w-16 h-16 text-white rounded-full image-fit bg-primary">
                {{ item.type }}
                <!-- <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" /> -->
              </div>
              <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0">
                <a href="" class="font-medium">{{ item.nom }}</a>
                <div class="mt-2 text-xs text-slate-500">
                  <span class="px-2 py-1 m-5 text-xs text-white rounded bg-primary/80" v-if="item.statut == -2"> Non
                    validé
                  </span>
                  <span class="px-2 py-1 m-5 text-xs text-white rounded bg-success/80" v-else-if="item.statut == -1">
                    Validé
                  </span>
                  <span class="px-2 py-1 m-5 text-xs text-white rounded bg-pending/80" v-else-if="item.statut == 0"> En
                    cours </span>
                  <span class="px-2 py-1 m-5 text-xs text-white rounded bg-danger/80" v-else-if="item.statut == 1"> En
                    retard </span>
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
                  <DropdownItem @click="modifierActivite(item)">
                    <Edit2Icon class="w-4 h-4 mr-2" /> Modifier
                  </DropdownItem>
                  <DropdownItem @click="supprimerActivite(item)">
                    <TrashIcon class="w-4 h-4 mr-2" /> Supprimer
                  </DropdownItem>
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
              <div class="flex items-center">
                <LinkIcon class="w-4 h-4 mr-2" /> Fond propre: {{ item.pret }}
              </div>
              <div class="flex items-center">
                <LinkIcon class="w-4 h-4 mr-2" /> Budget: {{ item.budgetNational }}
              </div>
              <div class="flex items-center">
                <GlobeIcon class="w-4 h-4 mr-2" /> Taux d'exécution physique: {{ item.tep }}
              </div>

              <div class="flex items-center mt-2">
                <CheckSquareIcon class="w-4 h-4 mr-2" /> Statut :
                <span class="pl-2" v-if="item.statut == -2"> Non validé </span>
                <span class="pl-2" v-else-if="item.statut == -1"> Validé </span>
                <span class="pl-2" v-else-if="item.statut == 0"> En cours </span>
                <span class="pl-2" v-else-if="item.statut == 1"> En retard </span>
                <span class="pl-2" v-else-if="item.statut == 2">Terminé</span>
              </div>
              <div class="flex items-center mt-2">
                <CheckSquareIcon class="w-4 h-4 mr-2" /> Poids : {{ item.poids }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NoRecordsMessage v-if="!activites.length" 
      title="No Activities Found"
      description="It seems there are no activities to display. Please check back later."
    />

    <!-- END: Users Layout -->
    <LoaderSnipper v-if="isLoadingData" />

    <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
      <ModalHeader>
        <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter une Activité</h2>
        <h2 v-else class="mr-auto text-base font-medium">Modifier un Activité</h2>
      </ModalHeader>
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required"
          placeHolder="Nom de l'activité" label="Nom" />
        <InputForm v-model="formData.poids" class="col-span-12" type="number" required="required"
          placeHolder="Poids de l'activité " label="Poids" />
        <InputForm v-model="formData.debut" class="col-span-12" type="date" required="required"
          placeHolder="Entrer la date de début" label="Début de l'activité" />
        <InputForm v-model="formData.fin" class="col-span-12" type="date" required="required"
          placeHolder="Entrer la date de fin" label="Fin de l'activité" />

        <!--<div class="col-span-12">
          <label for="modal-form-6" class="form-label">Type d'activité</label>
          <div class="mt-2">
            <TomSelect
              v-model="formData.type"
              :options="{
                placeholder: 'Choisir un type d\'activité',
              }"
              class="w-full"
            >
              <option>Choisir un type d'activité</option>
              <option value="pta">PTA</option>
              <option value="ppm">PPM</option>
            </TomSelect>
          </div>
        </div>-->
        <div class="flex col-span-12" v-if="haveSousComposantes">
          <label for="_input-wizard-10"
            class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtPut</label>
          <TomSelect v-model="formData.composanteId" :options="{
          placeholder: 'Choisir un Output',
          create: false,
          onOptionAdd: text(),
        }" class="w-full">
            <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>
        <div class="flex col-span-12">
          <label for="_input-wizard-10"
            class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutComes</label>
          <TomSelect v-model="formData.composanteId" :options="{
            placeholder: 'Choisir un OutCome',
            create: false,
            onOptionAdd: text(),
          }" class="w-full">
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>
        <InputForm v-model="formData.pret" class="col-span-12" type="number" required="required" placeHolder="Ex : 2"
          label="Fond propre" />

        <InputForm v-model="formData.budgetNational" class="col-span-12" type="number" required="required"
          placeHolder="Ex : 2" label="Montant financier" />
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
          <div class="mt-2 text-slate-500">Voulez vous supprimer l'activité ? <br />Cette action ne peut être annulé</div>
        </div>
        <div class="flex gap-2 px-5 pb-8 text-center">
          <button type="button" @click="showDeleteModal = false"
            class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Supprimer" @click="deleteActivite" />
        </div>
      </ModalBody>
    </Modal>
</template>
