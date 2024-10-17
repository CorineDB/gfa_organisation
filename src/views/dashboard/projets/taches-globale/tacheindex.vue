<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Taches</h2>

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
        <!-- <div class="flex w-full" v-if="haveSousComposantes">
          <v-select class="w-full" :reduce="(souscomposant) => souscomposant.id" v-model="sousComposantId" label="nom" :options="sousComposants">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!sousComposantId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtComes</label>
        </div> -->

        <div class="flex w-full" v-if="haveSousComposantes">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtPut</label>
          <TomSelect
            v-model="sousComposantId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex w-full">
          <v-select class="w-full" :reduce="(activite) => activite.id" v-model="activitesId" label="nom" :options="activites">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!activitesId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Activites</label>
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
        <button class="mr-2 shadow-md btn btn-primary" @click="addSousComposants()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une tache</button>
      </div>
    </div>
  </div>

  <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Users Layout -->
    <!-- <pre>{{sousComposants}}</pre>   -->

    <div v-for="(item, index) in activites" :key="index" class="col-span-12 intro-y md:col-span-6 lg:col-span-4">
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
                <DropdownItem @click="modifierActivite(item)"> <Edit2Icon class="w-4 h-4 mr-2" /> Modifier </DropdownItem>
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
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter une tache</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier une tache</h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom de l'organisation" label="Nom" />
      <InputForm v-model="formData.poids" class="col-span-12" type="number" required="required" placeHolder="Poids de la " label="Poids" />
      <InputForm v-model="formData.debut" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de début" label="Début de la tache" />
      <InputForm v-model="formData.fin" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de fin" label="Fin de la tache " />
      <div class="col-span-12">
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
      </div>
        <div class="flex w-full">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Activites</label>
          <TomSelect
            v-model="formData.activiteId"
            :options="{
              placeholder: 'Choisir une activte',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option v-for="(element, index) in activites" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>
        <div class="flex w-full" v-if="haveSousComposantes">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtPut</label>
          <TomSelect
            v-model="formData.composanteId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>
      <div class="flex col-span-12">
        <v-select class="w-full" :reduce="(composant) => composant.id" v-model="formData.composanteId" label="nom" :options="composants">
          <template #search="{ attributes, events }">
            <input class="vs__search form-input" :required="!formData.composanteId" v-bind="attributes" v-on="events" />
          </template>
        </v-select>
        <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-bold duration-100 ease-linear -translate-y-3 bg-white _font-medium form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutComes</label>
      </div>

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

<script>

import ComposanteService from "@/services/modules/composante.service.js";

import ProjetService from "@/services/modules/projet.service.js";
import ActiviteService from "@/services/modules/activite.service.js";
import { getStringValueOfStatutCode } from '@/utils/index'
import { mapGetters, mapActions } from "vuex";
import TachesService from '@/services/modules/tache.service';

export default {
  components: {
  },
  data() {
    return {
      currentPage: true,
      version: 'current',
      tacheVisible: false,
      tacheReVisible: false,
      scopes: [],
      activites: [],
      composantes: [],
      sous_composantes: [],
      taches: [],
      value: '',
      valueSC: '',
      valueAc: '',
      activiteId: ''
    }
  },
  computed: {
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })
  },


  computed: {

    ...mapGetters({
      currentUser: 'auths/GET_AUTHENTICATE_USER',
    })
  },

  methods: {
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-une-tache') {
          this.tacheVisible = true
        }
        if (element.slug === 'voir-revision-ptab') {
          this.tacheReVisible = true
        }
      });
    },

    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),

    choiceVersion(version) {
      if (this.scopes.length > 0) {
        if ("" === version) {
          this.currentPage = true;
        } else {
          this.currentPage = false;
        }
      } else {
        this.currentPage = true;
      }
    },
    demoEcoute(value) {
      this.getSComposante(value.id)
    },
    demoEcouteSC(value) {
      this.getActivite(value.id)
    },
    demoEcouteAC(value) {
      this.activiteId = value.id
      this.getTache(value.id)
    },
    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),
    validation(data) {
      const id = data.id
      const datas = {
        statut: -1,
        activiteId: this.activiteId
      }
      TachesService.update(id, datas).then(() => {
        this.$toast.success('validation effectué')

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
    getNom(nom, prenom) {

      let name = ''

      if (nom !== undefined && nom !== null) name += nom

      if (prenom !== undefined && prenom !== null) name += prenom

      return name;
    },

    customLabel({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },
    customLabelSC({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },
    getComposante(id) {
      ProjetService.composantes(id).then((data) => {
        const datas = data.data.data
        this.composantes = datas
        this.getSComposante(datas[0].id)
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
    getSComposante(id) {
      ComposanteService.sousComposantes(id).then((data) => {
        const datas = data.data.data
        this.sous_composantes = datas
        this.getActivite(datas[0].id)

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
    getActivite(id) {
      this.active()
      ComposanteService.activites(id).then((data) => {
        const datas = data.data.data
        this.activites = datas
        this.activiteId = datas[0].id
        this.getTache(datas[0].id)
        this.disabled()
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
        this.disabled()
      })
    },
    getTache(id) {
      ActiviteService.taches(id).then((data) => {
        const datas = data.data.data
        this.taches = datas

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

  },

  created() {
    if (this.currentUser.programme.id) {
      this.currentRole = this.currentUser.type
      const bailleurInfo = JSON.parse(localStorage.getItem("bailleurInfo"));
      if (bailleurInfo) {
        const idProjet = bailleurInfo.id
        this.getComposante(idProjet)
      }
      else {
        this.fetchProgrammeScopes(this.currentUser.programme.id).then((response) => {
          this.scopes = response.data.data
        });
      }

    }
  },
  mounted() {
    this.getPermission()
    if (!this.tacheVisible) {
      this.$router.push('/401-non-autorise')
    }
  }
};
</script>

<style>

</style>
