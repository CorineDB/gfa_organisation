<template>
  <dashboard>
    <div class="w-full">
      <delete-alert v-if="deleteModal1" type="danger" title="Confirm Action" width="sm"
        v-on:close="deleteModal1 = false">
        <p class="text-gray-800">
          voulez vous supprimer cet objectif global?
        </p>

        <div class="text-right mt-4">
          <button @click="deleteModal1 = false"
            class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline">Annuler</button>
          <button class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
            @click="delete1(deleteData)">Supprimer</button>
        </div>
      </delete-alert>
      <delete-alert v-if="deleteModal2" type="danger" title="Confirm Action" width="sm"
        v-on:close="deleteModal2 = false">
        <p class="text-gray-800">
          voulez vous supprimer cet objectif specifique?
        </p>

        <div class="text-right mt-4">
          <button @click="deleteModal2 = false"
            class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline">Annuler</button>
          <button class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
            @click="delete2(deleteData)">Supprimer</button>
        </div>
      </delete-alert>
      <delete-alert v-if="deleteModal3" type="danger" title="Confirm Action" width="sm"
        v-on:close="deleteModal3 = false">
        <p class="text-gray-800">
          voulez vous supprimer cet résultat?
        </p>

        <div class="text-right mt-4">
          <button @click="deleteModal3 = false"
            class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline">Annuler</button>
          <button class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
            @click="delete3(deleteData)">Supprimer</button>
        </div>
      </delete-alert>
      <nav class="mb-2 text-sm font-semibold" aria-label="Breadcrumb">
        <div>
          <ol class="inline-flex p-0 list-none">
            <li class="flex items-center text-blue-500">
              <router-link to="#" class="text-gray-600">dashboard</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path
                  d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li class="flex items-center text-blue-500">
              <router-link to="#" class="text-gray-600">projet</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path
                  d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li class="flex items-center text-blue-500">
              <router-link to="/dasboard/projet" class="">details</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path
                  d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li class="flex items-center text-blue-500">
              <router-link to="/dasboard/projet" class="">Cadre logique</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path
                  d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
          </ol>
        </div>
      </nav>
      <div v-if="showModal">
        <modal-top-right :title="title" v-on:close="close">
          <div class="px-8">
            <div>
              <form @submit.prevent="sendForm" action="">
                <div class="flex justify-between">
                  <div>
                    <label class="block py-2 text-sm font-semibold" for="">Objectifs spécifiques</label>
                    <input type="radio" @click="check1" name="choice" id="objectifs_spécifiques" />
                  </div>
                  <div>
                    <label class="block py-2 text-sm font-semibold" for="">Objectifs global</label>
                    <input type="radio" @click="check2" name="choice" id="objectifs_globale" />
                  </div>
                  <div>
                    <label class="block py-2 text-sm font-semibold" for="Résultats">Résultats</label>
                    <input type="radio" @click="check3" name="choice" id="resultat" />
                  </div>
                </div>

                <div class="my-2">
                  <label class="block py-2 text-sm font-semibold" for="">
                    Nom
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span>
                  </label>
                  <input required v-model="cadreLogique.nom" type="text"
                    class="px-2 py-1 md:px-4 md:py-2 mt-1 border-2 border-gray-300 outile-none focus:outline-none focus:ring-2 w-full focus:ring-blue-500/50 focus:border-transparent placeholder:text-xs md:placeholder:text-sm" />
                </div>
                <div class="form-group my-2">
                  <label class="text-xs font-semibold text-gray-500 block uppercase md:text-sm text-light">Indicateurs
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
                  <multiselect v-model="cadreLogique.indicateurId" :options="indicateurs" :preselect-first="true"
                    placeholder="selectionnez un indicateur" label="nom" track-by="id"></multiselect>
                </div>
                <div class="my-2">
                  <label class="block py-2 text-sm font-semibold" for="">
                    Description
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span>
                  </label>
                  <textarea name="" v-model="cadreLogique.description" id=""
                    class="px-3 py-2 mt-1 border-2 border-gray-300 w-full focus:outline-none focus:ring-2  focus:border-transparent"
                    rows="3"></textarea>

                </div>
                <div class="py-2 my-4 flex justify-center space-x-8">
                  <button type="submit"
                    class="bg-primary  flex space-x-2  items-center text-white px-4 py-2 border border-primary font-semibold uppercase">
                    <span class="text-sm font-semibold uppercase" v-if="!chargement">
                      enregistrer
                    </span>
                    <span v-else class="flex items-center space-x-2">
                      <span class="text-xs px-4 font-semibold ">
                        envoi ...
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-center animate-spin" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </span>
                  </button>
                  <vbutton type="reset" template="danger" @close="close"> annuler </vbutton>
                </div>
              </form>
              <!-- <vform
                template="default"
                :champs="champs"
                :cols="cols"
                submitText="Enregistrer"
                @sendForm="sendForm"
              ></vform> -->
            </div>

          </div>
        </modal-top-right>

      </div>
      <div v-if="showModal2">
        <modal-top-right :title="title" v-on:close="close">
          <div class="px-8">
            <div>
              <form @submit.prevent="editForm" action="">
                <div class="flex justify-between">
                  <div>
                    <label class="block py-2 text-sm font-semibold" for="">Objectifs spécifiques</label>
                    <input type="radio" :disabled="specific_disable" :checked="isObjectif" name="choice"
                      id="objectifs_spécifiques2" />
                  </div>
                  <div>
                    <label class="block py-2 text-sm font-semibold" for="">Objectifs global</label>
                    <input type="radio" :disabled="global_disable" :checked="isObjectifGlobale" name="choice"
                      id="objectifs_globale2" />
                  </div>
                  <div>
                    <label class="block py-2 text-sm font-semibold" for="Résultats">Résultats</label>
                    <input type="radio" :disabled="result_disable" :checked="isResultat" name="choice" id="resultat2" />
                  </div>
                </div>

                <div class="my-2">
                  <label class="block py-2 text-sm font-semibold" for="">
                    Nom
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span>
                  </label>
                  <input required v-model="editCadreLogique.nom" type="text"
                    class="px-2 py-1 md:px-4 md:py-2 mt-1 border-2 border-gray-300 outile-none focus:outline-none focus:ring-2 w-full focus:ring-blue-500/50 focus:border-transparent placeholder:text-xs md:placeholder:text-sm" />
                </div>
                <div class="form-group my-2">
                  <label class="text-xs font-semibold text-gray-500 block uppercase md:text-sm text-light">Indicateurs
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
                  <multiselect v-model="editCadreLogique.indicateurId" :options="indicateurs" :preselect-first="true"
                    placeholder="selectionnez un indicateur" label="nom" track-by="id"></multiselect>
                </div>
                <div class="my-2">
                  <label class="block py-2 text-sm font-semibold" for="">
                    Description
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span>
                  </label>
                  <textarea name="" v-model="editCadreLogique.description" id=""
                    class="px-3 py-2 mt-1 border-2 border-gray-300 w-full focus:outline-none focus:ring-2  focus:border-transparent"
                    rows="3"></textarea>

                </div>
                <div class="py-2 my-4 flex justify-center space-x-8">
                  <button type="submit"
                    class="bg-primary  flex space-x-2  items-center text-white px-4 py-2 border border-primary font-semibold uppercase">
                    <span class="text-sm font-semibold uppercase" v-if="!chargement">
                      Modifier
                    </span>
                    <span v-else class="flex items-center space-x-2">
                      <span class="text-xs px-4 font-semibold ">
                        envoi ...
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-center animate-spin" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </span>
                  </button>
                  <vbutton type="reset" template="danger" @close="close"> annuler </vbutton>
                </div>
              </form>
              <!-- <vform
                template="default"
                :champs="champs"
                :cols="cols"
                submitText="Enregistrer"
                @sendForm="sendForm"
              ></vform> -->
            </div>

          </div>
        </modal-top-right>

      </div>

      <div class="flex items-center justify-between flex-wrap">
        <titre>Cadre logique </titre>
        <button @click="ajouter" title="ajouter "
          class="px-2 py-1  md:px-4 md:py-2 flex overflow-hidden items-center text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: ">
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
          </svg>
          <span class="mx-2 text-xs  md:text-sm font-semibold">ajouter</span>
        </button>
      </div>

      <div class="my-2">
        <titre>Objectif global </titre>
        <vtable :headers="headers" :datas="objectifGlobals" :actions="[{ name: 'supprimer' }, { name: 'modifier' }]"
          @supprimer="supprimer1" @modifier="modifier1"></vtable>
      </div>
      <div class="my-2">
        <titre>Objectif specifique </titre>
        <vtable :headers="headers" :datas="objectifSpecifiques" :actions="[{ name: 'supprimer' }, { name: 'modifier' }]"
          @supprimer="supprimer2" @modifier="modifier2"></vtable>
      </div>
      <div class="my-2">
        <titre>Resultat </titre>
        <vtable :headers="headers" :datas="resultats" :actions="[{ name: 'supprimer' }, { name: 'modifier' }]" @supprimer="supprimer3"
          @modifier="modifier3"></vtable>
      </div>
    </div>
  </dashboard>
</template>

<script>
import ModalTopRight from "@/components/ModalTopRight";
import SearchBar from "@/components/SearchBar";
import Titre from "@/components/Titre";
import Vtable from "@/components/Vtable";
import Vform from "@/components/VformC";
import Vmodal from "@/components/Vmodal";
import Dashboard from "@/layouts/Dashboard";
import Multiselect from "vue-multiselect";
import Vbutton from "@/components/Vbutton";
import indicateurService from "@/services/modules/indicateur.service.js";
import objectifSpecifiqueService from "@/services/modules/objectif.specifique.service.js";
import objectifGlobaux from "@/services/modules/objectif.global.service.js";
import ResultatService from "@/services/modules/resultat.service.js";
import CadreLogiqueService from "@/services/modules/cadre.logique.service.js";
import DeleteAlert from "@/components/DeleteAlert.vue";
export default {
  components: {
    Vtable,
    Dashboard,
    Vmodal,
    Vform,
    Titre,
    SearchBar,
    ModalTopRight,
    Vbutton,
    DeleteAlert,
    Multiselect,
  },
  data() {
    return {
      showModal: false,
      showModal2: false,
      title: "",
      global_disable: false,
      specific_disable: false,
      result_disable: false,
      checkbox: false,
      isObjectif: true,
      isObjectifGlobale: false,
      isResultat: false,
      cadreLogique: {
        nom: '',
        description: '',
        indicateurId: ''
      },
      editCadreLogique: {
        nom: '',
        description: '',
        indicateurId: '',

      },

      indicateurs: [],
      cols: 1,

      headers: [],
      cadreLogique: [],
      chargement: false,
      objectifGlobals: [],
      objectifSpecifiques: [],
      resultats: [],
      deleteModal1: false,
      deleteModal2: false,
      deleteModal3: false,
      deleteData: {}
    };
  },
  computed: {

  },

  mounted() {
    this.getCadreLogique()
    this.getIndicateur()
    this.headers = [
      { name: "Nom", cle: "nom" },
      { name: "Description du projet", cle: "description" },
      { name: "Indicateurs", props: 'indicateur', cle: "nom" },
      { name: "Sources de vérification", props: 'indicateur', cle: "sourceDeVerification" },
      { name: "Hypothèse", props: 'indicateur', cle: "hypothese" },

    ]
  },
  methods: {
    sendForm() {
      if (this.chargement == false) {

        this.chargement = true
        const data = this.cadreLogique
        data.indicateurId = data.indicateurId.id
        data.projetId = this.$route.params.id
        if (this.isObjectif) {

          objectifSpecifiqueService.create(data).then((data) => {
            this.chargement = false
            this.$toast.success('nouveau element')
            this.showModal = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null

          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        } else if (this.isObjectifGlobale) {
          objectifGlobaux.create(data).then((data) => {
            this.chargement = false
            this.$toast.success('nouveau element')
            this.showModal = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null

          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        } else  {
          ResultatService.create(data).then((data) => {
            this.chargement = false
            this.$toast.success('element modifié')
            this.showModal2 = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null

          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        }


      }
    },
    check1() {
      this.isObjectif = true
      this.isObjectifGlobale = false
      this.isResultat = false
    },
    check2() {
      this.isObjectif = false
      this.isObjectifGlobale = true
      this.isResultat = false
    },
    check3() {
      this.isObjectif = false
      this.isObjectifGlobale = false
      this.isResultat = true
    },
    save() {
      this.$emit("sendForm");
    },

    close() {
      this.showModal = false;
      this.showModal2 = false;
    },
    ajouter() {
      this.title = "Ajouter un cadre logique";
      this.showModal = true;
    },
    modifier1(data) {

      this.isObjectifGlobale = true;
      this.isObjectif = false;
      this.isResultat = false;
      this.title = "Modifier un objectif global";
      this.showModal2 = true;
      this.specific_disable = true
      this.result_disable = true
      this.global_disable = false,
      this.editCadreLogique.nom = data.nom
      this.editCadreLogique.description = data.description
      this.editCadreLogique.id = data.id
      this.editCadreLogique.indicateurId = data.indicateur

    },
    modifier2(data) {

      this.isObjectifGlobale = false;
      this.isObjectif = true;
      this.isResultat = false;
      this.title = "Modifier un objectif spécifique";
      this.showModal2 = true;
      this.global_disable = true,
      this.result_disable = true,
      this.specific_disable = false
      this.editCadreLogique.nom = data.nom
      this.editCadreLogique.description = data.description
      this.editCadreLogique.id = data.id
      this.editCadreLogique.indicateurId = data.indicateur

    },
    modifier3(data) {
      this.isObjectif = false;
      this.isObjectifGlobale = false;
      this.isResultat = true;
      this.title = "Modifier un résultat";
      this.showModal2 = true;
      this.result_disable = false,
      this.global_disable = true, 
      this.specific_disable = true
      this.editCadreLogique.nom = data.nom
      this.editCadreLogique.description = data.description
      this.editCadreLogique.id = data.id
      this.editCadreLogique.indicateurId = data.indicateur

    },


    editForm() {
      if (this.chargement == false) {

        this.chargement = true
        const data = this.editCadreLogique
        data.indicateurId = this.editCadreLogique.indicateurId.id
        data.projetId = this.$route.params.id

        console.log(this.isResultat)

        if (this.isObjectifGlobale) {
          objectifGlobaux.update(data.id, data).then((data) => {
            this.chargement = false
            this.$toast.success('élément modifier')
            this.showModal2 = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null
          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        } else if (this.isObjectif) {
          objectifSpecifiqueService.update(data.id, data).then((data) => {
            this.chargement = false
            this.$toast.success('élément modifier')
            this.showModal2 = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null
          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        }else if(this.isResultat) {
          
          ResultatService.update(data.id , data).then((data) => {
            this.chargement = false
            this.$toast.success('nouveau element')
            this.showModal2 = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null

          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        }

      }
    },


    supprimer(data) {
      alert(data + " à ete bien supprimer");
    },
    getCadreLogique() {
      CadreLogiqueService.get(this.$route.params.id).then((data) => {
        this.cadreLogique = data.data.data
        this.objectifGlobals = this.cadreLogique.objectifGlobaux,
          this.objectifSpecifiques = this.cadreLogique.objectifSpecifique
        this.resultats = this.cadreLogique.resultat
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
    getIndicateur() {
      indicateurService.get().then((data) => {
        this.indicateurs = data.data.data
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
    supprimer1(objectifGlobaux, index) {
      this.deleteModal1 = true
      this.deleteData.data = objectifGlobaux
      this.deleteData.index = index
    },
    supprimer2(objectifSpecifique, index) {
      this.deleteModal2 = true
      this.deleteData.data = objectifSpecifique
      this.deleteData.index = index
    },
    supprimer3(resultat, index) {
      this.deleteModal3 = true
      this.deleteData.data = resultat
      this.deleteData.index = index
    },

    delete1(data) {
      //this.filteredIndicateur.splice(data.index,1)
      this.deleteModal1 = false
      objectifGlobaux.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.getCadreLogique()
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
    delete2(data) {
      //this.filteredIndicateur.splice(data.index,1)
      this.deleteModal2 = false
      objectifSpecifiqueService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.getCadreLogique()

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
    delete3(data) {
      //this.filteredIndicateur.splice(data.index,1)
      this.deleteModal3 = false
      ResultatService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.getCadreLogique()

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
  },
};
</script>

<style scoped>

</style>
