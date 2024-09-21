<template>
  <div class="w-full">

    <div v-if="showModal">
      <modal-top-right :title="title" v-on:close="close2">
        <div class="p-4 overflow-auto">
          <vform template="default" :champs="champs"  :savedInput="savedInput"  :cols="cols" :submitText="submitText" :sendRequest="sendRequest"
            @sendForm="sendForm" @closeModal="close"></vform>
        </div>
      </modal-top-right>
    </div>

    <delete-alert v-if="deleteModal" type="danger" title="Confirm Action" width="sm" v-on:close="deleteModal = false">
      <p class="text-gray-800">
        voulez vous supprimer cet sous composant?
      </p>

      <div class="text-right mt-4">
        <button @click="deleteModal = false"
          class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline">Annuler</button>
        <button class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
          @click="deleteComposante(deleteData)">Supprimer</button>
      </div>
    </delete-alert>

    <nav class="text-xs md:text-sm font-semibold flex justify-between items-center flex-wrap" aria-label="Breadcrumb">
      <div class="mb-2">
        <ol class="inline-flex p-0 list-none">
          <li class="flex items-center ">
            <router-link to="#" class="text-gray-600">dashboard</router-link>
            <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li class="flex items-center text-blue-500 ">
            <router-link to="/dashboard/projets" class="text-gray-600">projets</router-link>
            <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li class="flex items-center text-blue-500 ">
            <router-link to="/dashboard/projets/sous-composantes-globale" class="">sous composantes</router-link>
          </li>
        </ol>
      </div>
      <div>
        <search-bar @search="getSearchValue"></search-bar>
      </div>
    </nav>


    <div class="flex items-center justify-between my-2">
      <div class="flex space-x-4">
        <span :class="{ 'border-primary border-b-8 font-bold': seeSousComposantes }" @click="gotoSousComposante()"
          class="inline-block cursor-pointer  text-xs sm:text-sm  md:text-base  uppercase    border-primary py-2">Sous
          composantes </span>

      </div>

      <button v-if="composanteAdd" @click="addSousComposante" title="ajouter un projet"
        class="px-4 py-2 flex overflow-hidden items-center text-xs font-semibold text-white uppercase  bg-primary focus:outline-none focus:shadow-outline">
        <span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
          </svg></span>
        <span class="mx-1 md:mx-2 text-xs font-semibold">ajouter</span>
      </button>

    </div>

    <div v-if="!isSearch">
      <div class="p-2 my-4 rounded-sm shadow-md bg-gray-50">
        <div class=" mx-auto">
          <div class="mb-4">
            <ul class="flex flex-wrap -mb-px items-end  space-y-4" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">

              <li class="mr-2" role="presentation">

                <div>
                  <label class="block mb-2 uppercase " for="">Selectionnez un projet</label>
                  <multiselect v-model="projetFiltre" :options="projets" :custom-label="customLabelP" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné"  :preselect-first="true" placeholder="selectionnez un projet" label="nom" track-by="id"></multiselect>
                </div>

              </li>
              <li class=" mr-2" role="presentation">
                <div>
                  <label class="block mb-2 uppercase " for="">Selectionnez un composant</label>
                  <multiselect v-model="valueFiltre" :options="composantes" :custom-label="customLabel"  :preselect-first="true" placeholder="selectionnez une composante" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" label="nom" track-by="id"></multiselect>
                </div>

              </li>
              
              <li class="mr-2" role="presentation">
                <button @click="toggle2" :class="{ 'active': pending }"
                  class="inline-block text-yellow-500 hover:text-yellow-600 hover:border-yellow-300 rounded-t-lg p-2 text-sm font-medium text-center border-transparent border-b-2 dark:text-yellow-400 dark:hover:text-yellow-300 "
                  id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile"
                  aria-selected="true">Non démarré

                  <span
                    class="px-2 py-1 text-sm font-medium leading-normal text-center align-middle  text-white bg-yellow-600 rounded-full undefined ">
                    {{ enAttente.length }}
                  </span>

                </button>
              </li>
              <li class="mr-2" role="presentation">
                <button @click="toggle3" :class="{ 'active': inProgress }"
                  class="inline-block text-blue-500 hover:text-blue-600 hover:border-blue-300 rounded-t-lg p-2 text-sm font-medium text-center border-transparent border-b-2 dark:text-blue-400 dark:hover:text-blue-300 "
                  id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard"
                  aria-selected="false">En cours

                  <span
                    class="px-2 py-1 text-sm text-center align-middle font-medium leading-normal  text-white bg-indigo-600 rounded-full undefined">
                    {{ enCours.length }}
                  </span>
                </button>
              </li>
              <li class="mr-2" role="presentation">
                <button @click="toggle" :class="{ 'active': success }"
                  class="inline-block text-green-500 hover:text-green-600 hover:border-green-300 rounded-t-lg p-2 text-sm font-medium text-center border-transparent border-b-2 dark:text-green-400 dark:hover:text-green-300"
                  id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings"
                  aria-selected="false">Terminé

                  <span
                    class="px-2 py-1 text-sm font-medium leading-normal  text-white  text-center align-middle  bg-green-600 rounded-full undefined">
                    {{terminer.length}}
                  </span>
                </button>
              </li>
              <li role="presentation">
                <button @click="toggle4" :class="{ 'active': retard }"
                  class="inline-block text-red-500 hover:text-red-600 hover:border-red-300 rounded-t-lg p-2 text-sm font-medium text-center border-transparent border-b-2 dark:text-red-400 dark:hover:text-red-300"
                  id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts"
                  aria-selected="false">En retard

                  <span
                    class="px-2 py-1 text-sm font-medium leading-normal  text-white bg-red-600 text-center align-middle  rounded-full undefined">
                    {{retardData.length}}
                  </span>

                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="pending">
        <empty v-if="enAttente.length === 0">sous composant vide !!!</empty>
        <div v-else>
          <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
            <div v-for="(sousComposante, index) in enAttente" :key="index">
              <card-composante :isComposante="false" :data="sousComposante" :libelle="sousComposante.nom"
                :code="sousComposante.code" composanteName="Sous Composante" :statut="getStatus(sousComposante.statut)"
                :montantEPM="sousComposante.pret" :position="sousComposante.position" :poids="sousComposante.poids"
                :bailleur="sousComposante.sigle" @modifier="modifier(sousComposante)"
                @dupliquer="dupliquer(sousComposante)" @supprimer="supprimer(sousComposante)"
                @suivre="suivreMyComposant(sousComposante)" @validation="validation" @gotoNext="gotoNext(sousComposante)"
                :isDelete="composanteDelete" :isUpdate="composanteUpdate"></card-composante>
            </div>
          </div>
        </div>
      </div>

      <div v-if="retard">
        <empty v-if="retardData.length === 0">sous composant vide !!!</empty>
        <div v-else>
          <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
            <div v-for="(sousComposante, index) in retardData" :key="index">
              <card-composante :isComposante="false"  :data="sousComposante" :libelle="sousComposante.nom"
                :code="sousComposante.codePta" composanteName="Sous Composante"
                :statut="getStatus(sousComposante.statut)" :montantEPM="sousComposante.pret"
                :position="sousComposante.position" :poids="sousComposante.poids" :bailleur="sousComposante.sigle"
                @modifier="modifier(sousComposante)" @dupliquer="dupliquer(sousComposante)"
                @supprimer="supprimer(sousComposante)" @validation="validation" @suivre="suivreMyComposant(sousComposante)"
                @gotoNext="gotoNext(sousComposante)" :isDelete="composanteDelete"
                :isUpdate="composanteUpdate"></card-composante>
            </div>
          </div>
        </div>
      </div>


      <div v-if="inProgress">
        <empty v-if="enCours.length === 0">sous composant vide !!!</empty>
        <div v-else>
          <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
            <div v-for="(sousComposante, index) in enCours" :key="index">
              <card-composante :isComposante="false" :data="sousComposante" :libelle="sousComposante.nom"
                :code="sousComposante.codePta" composanteName="Sous Composante"
                :statut="getStatus(sousComposante.statut)" :montantEPM="sousComposante.pret"
                :position="sousComposante.position" :poids="sousComposante.poids" :bailleur="sousComposante.sigle"
                @modifier="modifier(sousComposante)" @dupliquer="dupliquer(sousComposante)"
                @supprimer="supprimer(sousComposante)" @validation="validation" @suivre="suivreMyComposant(sousComposante)"
                @gotoNext="gotoNext(sousComposante)" :isDelete="composanteDelete"
                :isUpdate="composanteUpdate"></card-composante>
            </div>
          </div>
        </div>
      </div>

      <div v-if="success">
        <empty v-if="terminer.length === 0">sous composant vide !!!</empty>
        <div v-else>
          <div class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
            <div v-for="(sousComposante, index) in terminer" :key="index">
              <card-composante :isComposante="false" :data="sousComposante" :libelle="sousComposante.nom"
                :code="sousComposante.codePta" composanteName="Sous Composante"
                :statut="getStatus(sousComposante.statut)" :montantEPM="sousComposante.pret"
                :position="sousComposante.position" :poids="sousComposante.poids" :bailleur="sousComposante.sigle"
                @modifier="modifier(sousComposante)" @dupliquer="dupliquer(sousComposante)"
                @supprimer="supprimer(sousComposante)" @validation="validation" @suivre="suivreMyComposant(sousComposante)"
                @gotoNext="gotoNext(sousComposante)" :isDelete="composanteDelete"
                :isUpdate="composanteUpdate"></card-composante>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div>
        <empty v-if="filtere.length === 0">Ce sous composant est vide !!!</empty>
        <div v-else>
          <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
            <div v-for="(sousComposante, index) in filtere" :key="index">
              <card-composante :isComposante="false" :data="sousComposante" :libelle="sousComposante.nom"
                :code="sousComposante.code" composanteName="Sous Composante" :statut="getStatus(sousComposante.statut)"
                :montantEPM="sousComposante.pret" :position="sousComposante.position" :poids="sousComposante.poids"
                :bailleur="sousComposante.sigle" @modifier="modifier(sousComposante)"
                @dupliquer="dupliquer(sousComposante)" @validation="validation" @supprimer="supprimer(sousComposante)"
                @suivre="suivreMyComposant(sousComposante)" @gotoNext="gotoNext(sousComposante)"
                :isDelete="composanteDelete" :isUpdate="composanteUpdate"></card-composante>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import Vtable from '@/components/Vtable'
import ModalTopRight from '@/components/ModalTopRight'
import Multiselect from 'vue-multiselect'
import SearchBar from '@/components/SearchBar'
import Titre from '@/components/Titre'
import Vmodal from '@/components/Vmodal'
import Vform from '@/components/Vform'
import Dashboard from '@/layouts/Dashboard'
import Dropdown from '@/components/Dropdown.vue'
import Empty from '@/components/Empty.vue'
import CardComposante from '@/components/CardComposante.vue'
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { extractFormData, getStringValueOfStatutCode } from '@/utils/index'
import DeleteAlert from "@/components/DeleteAlert.vue";
import Composante from '@/store/modules/composantes/composante'
import ComposanteService from "@/services/modules/composante.service.js";
import ProgrammeService from "@/services/modules/programme.service.js";
export default {
  props: ['valeurProjet', 'valueProfondeur'],
  components: {
    Dashboard,
    Vmodal,
    Titre,
    Vform,
    SearchBar,
    Multiselect,
    ModalTopRight,
    Dropdown,
    CardComposante,
    DeleteAlert,
    Vtable,
    Empty,
  },
  data() {
    return {
      savedInput: [],
      valueFiltre: null,
      projetFiltre: null,
      projetId: '',
      composanteId: '',
      pending: false,
      success: true,
      inProgress: false,
      retard: false,
      rangeValue: 0,
      showFiltre: false,
      programmeId: '',
      cols: 1,
      sendRequest: false,
      submitText: "Enregistrer",
      showModal: false,
      line: false,
      mosaique: true,
      isStateChange: false,
      seeSousComposantes: true,
      seeSuivi: false,
      showInput: true,
      seeStatistique: false,
      option: [
        { name: "supprimer" },
        { name: "modifier" },
        { name: "dupliquer" },
        { name: "continuer" },
      ],
      sousComposanteAttributs: ['nom', 'description', 'budgetNational', 'pret', 'poids'],
      champs: [
        { name: 'Nom ', key: "nom", type: 'text', placeholdere: "Nom ", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Prêt', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Description', type: '', key: "description", placeholdere: 'Description du projet', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },

      ],

      headers: [
        { name: "Composante", cle: "composante" },
        { name: "code pta", cle: "codePta" },
        { name: "poids initial", cle: 'poidsInitial' },
        { name: "poids actuel", cle: 'poidsActuel' },
        { name: "date de création", cle: 'created_at' },
      ],
      dataTable: [],
      actions: [
        { name: "supprimer", iconne: "" },
      ],
      dates: [
        {}
      ],
      suivis: [],
      composanteAdd: false,
      composanteDelete: false,
      composanteUpdate: false,
      positionP: 0,
      idProjet: '',
      positionC: 0,
      idComposante: '',
      newProjet: null,
      newComponent: null,
      isClick: false,
      isShow: true,
      search: '',
      isSearch: false,
      projets: [],
      deleteData: {},
      deleteModal: false,
    }

  },

  computed: {

    //importation des variables du module auths
    ...mapState({
      sousComposante: state => state.sousComposantes.composante,
      loading: state => state.loading,
      errors: state => state.errors
    }),

    ...mapGetters({
      composantes: "composantes/getComposantes",
      sousComposante: "sousComposantes/getSousComposante",
      sousComposantes: "sousComposantes/getSousComposantes",
      currentUser: 'auths/GET_AUTHENTICATE_USER'
    }),
    allData() {
      if (this.terminer != undefined || this.enAttente != undefined || this.enCours != undefined || this.retardData != undefined) {
        return [].concat(this.terminer, this.enAttente, this.enCours, this.retardData)
      }
    },
    filtere: function () {
      var self = this;
      return this.allData.filter(function (data) {
        return data.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      });
    },
    terminer() {
      if (this.sousComposantes != undefined) {
        const datas = []
        this.sousComposantes.forEach(element => {
          if (element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enAttente() {
      if (this.sousComposantes != undefined) {
        const datas = []
        this.sousComposantes.forEach(element => {
          if (element.statut == -1 || element.statut == -2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    retardData() {
      if (this.sousComposantes != undefined) {
        const datas = []
        this.sousComposantes.forEach(element => {
          if (element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enCours() {
      if (this.sousComposantes != undefined) {
        const datas = []
        this.sousComposantes.forEach(element => {
          if (element.statut == 0) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })

  },

  methods: {
    getSearchValue(data) {
      if (data != '') {
        this.isSearch = true
        this.search = data
      }
      else {
        this.isSearch = false
        this.search = data
      }

    },

    changeProjet(projet) {
      this.projetId = projet.id
      if (this.isClick) {
        this.projetFiltre = this.newProjet
        this.fetchComposantes(this.idProjet);
        this.isClick = false
        localStorage.removeItem('profondeurComposante');
      } else {
        this.fetchComposantes(projet.id);
        let indexProjet = 0
        for (let index = 0; index < this.projets.length; index++) {
          const element = this.projets[index];
          if (projet.id == element.id) {
            indexProjet = index
          }
        }
        let composantes = this.projets[indexProjet].composantes
        let indexComposante = ''
        if (composantes[0] != null || composantes[0] != undefined) {
          let code = composantes[0].codePta
          let nom = composantes[0].nom
          this.valueFiltre = { codePta: code, nom: nom }
          indexComposante = composantes[0].id
          this.composanteId = indexComposante
          this.fetchSousComposantes(indexComposante);
          this.isShow = true
        }
        else {
          this.isShow = false
          this.valueFiltre = null
        }


        //this.fetchSousComposantes(composante.id);
      }

    },
    changeComposante(composante) {
      if (this.isClick) {
        this.valueFiltre = this.newComponent
        this.composanteId = this.idComposante
        this.fetchSousComposantes(this.idComposante);
        this.isClick = false
        localStorage.removeItem('profondeurComposante');
      } else {
        this.composanteId = composante.id
        this.fetchSousComposantes(composante.id);
      }
    },
    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: 'SET_ERRORS_MESSAGE', // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setSousComposante: 'sousComposantes/FILL', // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
      setSousComposantes: 'sousComposantes/SET_LIST_SOUS_COMPOSANTE'
    }),

    ...mapActions('sousComposantes', {
      fetchSousComposantes: "FETCH_LIST_SOUS_COMPOSANTE_OF_COMPOSANTE",
      saveSousComposante: "STORE_SOUS_COMPOSANTE",
      updateSousComposante: "UPDATE_SOUS_COMPOSANTE",
      deleteSousComposante: "DESTROY_SOUS_COMPOSANTE"
    }),

    ...mapActions({
      fetchComposantes: "composantes/FETCH_LIST_COMPOSANTE_OF_PROJET",
    }),

    suivreMyComposant(sousComposante) {
      this.$router.push({ name: 'dashboard_projets_sous_composantes_globale_suivis', params: { id: sousComposante.id } })
    },

    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {

        if (element.slug === 'creer-une-composante') {
          this.composanteAdd = true
        }
        if (element.slug === 'modifier-une-composante') {
          this.composanteUpdate = true
        }
        if (element.slug === 'supprimer-une-composante') {
          this.composanteDelete = true
        }

      });
    },

    getSuivi() {
      ComposanteService.getSuivi().then((data) => {
        const datas = data.data.data
        datas.forEach(element => {
          const composante = element.composante.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({ composante: composante, codePta: codePta, poidsInitial: poidsInitial, poidsActuel: poidsActuel, created_at: created_at })
        })
       

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


    customLabelP({ bailleur, nom }) {
      return `${bailleur.sigle} – ${nom}`
    },
    customLabel({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },

    getIntervale(val) {
      return val - 25;
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },

    filtreRange(value) {

      this.rangeValue = value

      /* let composantes = this.composantes.map((composante) => {
        
        if(composante.tep >= this.getIntervale(value) &&  composante.tep <= value){
            return composante;
        }
      }); */

    },

    selectProjet({ nom }) {
      return `${nom}`
    },

    addDate() {
      this.dates.push({})
    },

    gotoSuivi() {
      this.seeSuivi = true
      this.seeSousComposantes = false
    },

    gotoSousComposante() {
      this.seeSuivi = false
      this.seeSousComposantes = true
    },

    gotoNext(sousComposante, index) {

      let codeP = ''
      let nomP = ''
      let codeC = ''
      let nomC = ''
      let codeSC = soussousComposante.codePta
      let nomSC = sousComposante.nom
      for (let index = 0; index < this.projets.length; index++) {
        const element = this.projets[index];
        if (element.id == sousComposante.projetId) {
          codeP = element.codePta
          nomP = element.nom
        }
      }
      for (let index = 0; index < this.composantes.length; index++) {
        const element = this.composantes[index];
        if (element.id == sousComposante.composanteId) {
          codeC = element.codePta
          nomC = element.nom
        }

      }

      const profondeurSC = {
        isClick: true,
        idP: sousComposante.projetId,
        idC: sousComposante.composanteId,
        idSC: sousComposante.id,
        projet: { codePta: codeP, nom: nomP },
        composante: { codePta: codeC, nom: nomC },
        sousComposante: { codePta: codeSC, nom: nomSC }
      }

      localStorage.setItem('profondeurSC', JSON.stringify(profondeurSC));

      this.$router.push({ name: 'dashboard_projets_activites_globale' })
    },

    editerSuivi(index) {
      this.showInput = false
    },

    toggle() {
      this.pending = false
      this.inProgress = false
      this.success = true
      this.retard = false

    },

    toggle2() {
      this.success = false
      this.inProgress = false
      this.pending = true
      this.retard = false
    },

    toggle3() {
      this.pending = false
      this.success = false
      this.inProgress = true
      this.retard = false
    },
    toggle4() {
      this.pending = false
      this.success = false
      this.inProgress = false
      this.retard = true
    },

    addSousComposante() {
      this.title = "Ajouter"

      this.submitText = "Enregistrer",

        this.showCloseModal(true)

    },

    dupliquer(sousComposante) {

      this.title = "Ajouter un nouveau composant"

      this.sousComposanteAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if (value.key === item) {
            this.champs[index]['data'] = sousComposante[item]
          }

        });

      });

      this.submitText = "Enregistrer",

        this.showCloseModal(true)
    },


    modifier(sousComposante) {
      localStorage.removeItem('formData')

      this.title = 'Modifier un sous composant'

      this.setSousComposante(sousComposante)

      this.sousComposanteAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if (value.key === item) {
            this.champs[index]['data'] = sousComposante[item]
          }

        });

      });

      this.submitText = "Modifier",

        this.showCloseModal(true)
    },

    supprimer(sousComposante, index) {
      this.deleteModal = true
      this.deleteData.data = sousComposante
      this.deleteData.index = index
    },
    deleteComposante(data) {
      //this.filteredBailleur.splice(data.index,1)
      this.deleteModal = false
      ComposanteService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.fetchSousComposantes(this.valueFiltre.id);

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



    dupliquer(sousComposante) {

      this.title = "Ajouter un nouveau  composant";

      this.submitText = "Enrégistrer";

      this.sousComposanteAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if (value.key === item) {
            this.champs[index]['data'] = sousComposante[item]
          }

        });

      });

      this.showCloseModal(true);

    },

    resetForm() {

      this.champs = this.champs.map(item => { item['data'] = ''; item['errors'] = []; return item })

      window.document.getElementById('vform').reset()

      this.setSousComposante({})
    },
    validation() {
      this.fetchSousComposantes(this.valueFiltre.id);
    },

    sendForm() {

      if (this.sendRequest === false) {

        this.sendRequest = true;

        this.champs = this.champs.map(item => { item.errors = []; return item })

        let sousComposante = extractFormData(this.champs, this.sousComposanteAttributs)
        if (this.valueFiltre == undefined || this.valueFiltre == null) {
          this.$toast.error('Composante indefinit ')
          this.sendRequest = false;
          this.close()
        }
        else {
          sousComposante.composanteId = this.valueFiltre.id

          if (this.sousComposante?.id) {
            this.updateSousComposante({ sousComposante: sousComposante, id: this.sousComposante?.id })
              .then(response => {

                if (response.status === 200 || response.status === 201) {
                  this.fetchSousComposantes(this.valueFiltre.id);
                  this.close()
                }

              })
              .finally((error) => {
                this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
                this.sendRequest = false;
                this.champs.map(value => value.errors = this.erreurs[value.key])
              })

          }
          else {

            this.saveSousComposante(sousComposante)

              .then(response => {
                if (response.status === 200 || response.status === 201) {
                  this.fetchSousComposantes(this.valueFiltre.id);
                  this.close()
                  this.resetForm()
                 localStorage.removeItem('formData');
                }

              })
              .finally((error) => {
                this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
                this.sendRequest = false;
                this.champs.map(value => value.errors = this.erreurs[value.key])
              })
          }
        }
      }
    },

    close() {
      this.showCloseModal()
      this.sendRequest = false;
      this.resetForm()
    },
    close2() {
      this.showCloseModal();
      this.sendRequest = false;
      this.savedInput = []
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);
    },

    showCloseModal(value = false) {
      this.showModal = value
    },
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    fetchProjets(programme) {
      this.active()
      ProgrammeService.projets(programme).then((data) => {
        const datas = data.data.data
        this.projets = datas
        this.disabled()
      }).catch((error) => {
        this.disabled()
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

  },
  watch: {
    loading: function (value) {
      //this.loading = value
    },

    errors: function (errors) {

      this.champs.forEach((value) => {
        if (errors[value.key] instanceof Array || errors[value.key] !== undefined) {
          value.errors = errors[value.key]
        }
      })
      //this.errors = errors
    },

    valueFiltre: function (valeur) {
      if (valeur instanceof Composante || valeur instanceof Object) {
        if (this.isClick == false) {

          this.fetchSousComposantes(valeur.id);

        }
        else {

          this.fetchSousComposantes(this.idComposante);
          //this.isClick = false

        }

      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchSousComposantes(valeur);
      }
    },

    projetFiltre: function (valeur) {
      if (valeur instanceof Composante || valeur instanceof Object) {
        if (this.isClick == false) {
          this.fetchComposantes(valeur.id);
        }
        else {
          this.fetchComposantes(this.idProjet);

        }

      }
      else if (valeur !== null) {

        this.fetchComposantes(valeur);
      }
    },

    composantes: function (composantes) {
      if (this.isClick == false) {

        this.valueFiltre = composantes[0]

      } else {

        this.valueFiltre = composantes[this.positionC]


      }

    }


  },

  created() {
    this.fetchComposantes()
    this.programmeId = this.currentUser.programme.id
    const profondeurComposante = JSON.parse(localStorage.getItem('profondeurComposante'))
    
    if (profondeurComposante != undefined || profondeurComposante != null) {
      this.isClick = profondeurComposante.isClick
      if (this.isClick) {
       
        this.idProjet = profondeurComposante.id
        this.positionP = profondeurComposante.positionP
        this.idComposante = profondeurComposante.idC
        this.positionC = profondeurComposante.positionC
        this.newProjet = profondeurComposante.projet
        this.newComponent = profondeurComposante.composante

      } else {
        this.positionP = 0
        this.positionC = 0
      }

    }

    this.getPermission()
    if (this.programmeId) {
      this.fetchProjets(this.programmeId)
    }
  }

}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css">

</style>
<style>

</style>