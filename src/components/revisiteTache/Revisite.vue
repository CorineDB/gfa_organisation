<template>
  <div class="w-full p-4">
    <nav
      class="text-xs md:text-sm font-semibold flex justify-between items-center flex-wrap"
      aria-label="Breadcrumb"
    >
      <div>
        <ol class="inline-flex p-0 list-none">
          <li class="flex items-center">
            <router-link to="" class="text-gray-600">dashboard</router-link>
            <svg
              class="w-3 h-3 mx-3 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
              />
            </svg>
          </li>
          <li class="flex items-center">
            <router-link to="/dashboard/projets" class="text-gray-600"
              >projets</router-link
            >
            <svg
              class="w-3 h-3 mx-3 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
              />
            </svg>
          </li>
          <li class="flex items-center text-blue-500">
            <router-link to="/dashboard/projets/taches-globale" class=""
              >taches</router-link
            >
          </li>
        </ol>
      </div>
      <div>
        <search-bar  @search="getSearchValue"></search-bar>
      </div>
    </nav>

    <div class="flex items-center justify-between my-2" >
      <div class="flex space-x-4">
        <span
          :class="{ 'border-primary border-b-8 font-bold': seeTache }"
          @click="gotoTache()"
          class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase border-primary py-2"
          >Taches</span
        >
       <!--  <span
          :class="{ 'border-primary border-b-8 font-bold': seeSuivi }"
          @click="gotoSuivi()"
          class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase border-primary py-2"
          >Suivi tache</span -->
        >
      </div>
    </div>

    <div class="p-2">
          <!--Filtre sur projet -->
          <div class="w-full grid sm:grid-cols-2 sm:gap-2">
           <div class="mb-3">
            <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un projet</label>
            <multiselect  @input="changeProjet(projetFiltre)" v-model="projetFiltre" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" :options="projets" :custom-label="customLabel" :preselect-first="true" placeholder="selectionnez un projet" label="nom" track-by="id"></multiselect>
           </div>

           <div class="mb-3">
              <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un composant</label>
             <multiselect v-model="composanteFiltre"   @input="changeComposante(composanteFiltre)" :options="composantes" :custom-label="customLabel" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" :preselect-first="true" placeholder="selectionnez une composante" label="nom" track-by="id"></multiselect>
           </div>
          
            <div class="mb-3">
              <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un sous composant</label>
              <multiselect
                v-model="sousComposanteFiltre"
                :options="sousComposantes"
                @input="changeSC(sousComposanteFiltre)"
                :preselect-first="true"
                :custom-label="customLabel" 
                :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné"
                placeholder="selectionnez une sous composante"
                label="nom"
                track-by="id">
              </multiselect>
            </div>

            <div class="mb-3">
              <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez une activité</label>
              <multiselect
                v-model="valueFiltre"
                :options="activites"
                @input="changeActivite(valueFiltre)"
                :custom-label="customLabel" 
                placeholder="selectionnez l'activite"
                label="nom"
                track-by="id">
              </multiselect>
            </div>
              
          </div>
    </div>

    <!-- le filtre -->
    <div v-if="seeTache && tacheVisible ">
      <div  v-if="!isSearch" >
        <div class="py-2 px-4 mt-4 rounded-sm shadow-md relative bg-white">
          <div class="flex   justify-between flex-wrap items-center">
             <!--Filtre sur projet -->
             <h2 class="uppercase font-bold w-full sm:w-2/5 mb-2">Listes des taches </h2>
            <nav class="flex text-sm align-middle justify-evenly ">
                <span
                  @click="toggle2"
                  :class="{ 'border-yellow-600 text-yellow-600': pending }"
                  class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
                >
                Non demarrer
                  <span
                    class="px-2 text-base text-yellow-600 border border-yellow-600 rounded-full undefined "
                  >
                    {{enAttente.length}}
                  </span>
                </span>
                <span
                  @click="toggle3"
                  :class="{ 'border-indigo-600 text-indigo-600': inProgress }"
                  class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
                >
                  en cours
                  <span
                    class="px-2 text-base text-indigo-600 border border-indigo-600 rounded-full undefined"
                  >
                    {{enCours.length}}
                  </span>
                </span>
                <span
                  @click="toggle"
                  :class="{ 'border-green-600 text-green-600': success }"
                  class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
                >
                  terminer
                  <span
                    class="px-2 text-base text-green-600 border border-green-600 rounded-full undefined"
                  >
                    {{terminer.length}}
                  </span>
                </span>
                <span
                  @click="toggle4"
                  :class="{ 'border-red-600 text-red-600': retard }"
                  class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
                >
                  en retard
                  <span
                    class="px-2 text-base text-red-600 border border-red-600 rounded-full undefined"
                  >
                    {{retardData.length}}
                  </span>
                </span>
              
            </nav>
          </div>
        </div>
     
        <div v-if="inProgress">
          <empty v-if="enCours.length === 0">Tache vide !!!</empty>
          <div v-else>
            <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(tache, index) in enCours" :key="index">
                <card-tache
                  :id="tache.id"
                  :bailleur="tache.bailleur.sigle"
                  :statut="getStatus(tache.statut)"
                  :poids="tache.poids"
                  :poidsActuel="tache.poidsActuel"
                  :libelle="tache.nom"
                  :montantNE="tache.montantNE"
                  :montantEPM="tache.montantEPM"
                  @supprimer="supprimer(tache)"
                  @dupliquer="dupliquer(tache)"
                  :debut="tache.debut"
                  :fin="tache.fin"
                  @modifier="modifier(tache)"
                  @prolonger="prolonger(tache)"
                  @suivre="suivreMyTache(tache)"
                  @commentaire="showComment = true"
                  :isDelete="tacheDelete"
                  :isUpdate="tacheUpdate"
                  :isSuivi="tacheSuivi"
                ></card-tache>
              </div>
            </div>
          </div>
        </div>

        <div v-if="pending">
          <empty v-if="enAttente.length === 0">Tache vide !!!</empty>
          <div v-else>
            <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(tache, index) in enAttente" :key="index">
                <card-tache
                  :id="tache.id"
                  :bailleur="tache.bailleur.sigle"
                  :statut="getStatus(tache.statut)"
                  :poids="tache.poids"
                  :poidsActuel="tache.poidsActuel"
                  :libelle="tache.nom"
                  :montantNE="tache.montantNE"
                  :montantEPM="tache.montantEPM"
                  :debut="tache.debut"
                  :fin="tache.fin"
                  @supprimer="supprimer(tache)"
                  @dupliquer="dupliquer(tache)"
                  @modifier="modifier(tache)"
                  @prolonger="prolonger(tache)"
                  @suivre="suivreMyTache(tache)"
                  @commentaire="showComment = true"
                  :isDelete="tacheDelete"
                  :isUpdate="tacheUpdate"
                  :isSuivi="tacheSuivi"
                ></card-tache>
              </div>
            </div>
          </div>
        </div>

         <div v-if="success">
          <empty v-if="terminer.length === 0">Tache vide !!!</empty>
          <div v-else>
            <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(tache, index) in terminer" :key="index">
                <card-tache
                  :id="tache.id"
                  :bailleur="tache.bailleur.sigle"
                  :statut="getStatus(tache.statut)"
                  :poids="tache.poids"
                  :poidsActuel="tache.poidsActuel"
                  :libelle="tache.nom"
                  :montantNE="tache.montantNE"
                  :debut="tache.debut"
                  :fin="tache.fin"
                  :montantEPM="tache.montantEPM"
                  @supprimer="supprimer(tache)"
                  @dupliquer="dupliquer(tache)"
                  @modifier="modifier(tache)"
                  @prolonger="prolonger(tache)"
                  @suivre="suivreMyTache(tache)"
                  @commentaire="showComment = true"
                  :isDelete="tacheDelete"
                  :isUpdate="tacheUpdate"
                  :isSuivi="tacheSuivi"
                ></card-tache>
              </div>
            </div>
          </div>
        </div>
         <div v-if="retard">
          <empty v-if="retardData.length === 0">Tache vide !!!</empty>
          <div v-else>
            <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(tache, index) in retardData" :key="index">
                <card-tache
                  :id="tache.id"
                  :bailleur="tache.bailleur.sigle"
                  :statut="getStatus(tache.statut)"
                  :poids="tache.poids"
                  :poidsActuel="tache.poidsActuel"
                  :libelle="tache.nom"
                  :montantNE="tache.montantNE"
                  :montantEPM="tache.montantEPM"
                  :debut="tache.debut"
                  :fin="tache.fin"
                  @supprimer="supprimer(tache)"
                  @dupliquer="dupliquer(tache)"
                  @modifier="modifier(tache)"
                  @prolonger="prolonger(tache)"
                  @suivre="suivreMyTache(tache)"
                  @commentaire="showComment = true"
                  :isDelete="tacheDelete"
                  :isUpdate="tacheUpdate"
                  :isSuivi="tacheSuivi"
                ></card-tache>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <empty v-if="filtere.length === 0">Tache vide !!!</empty>
        <div v-else>
            <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(tache, index) in filtere" :key="index">
                <card-tache
                  :id="tache.id"
                  :bailleur="tache.bailleur.sigle"
                  :statut="getStatus(tache.statut)"
                  :poids="tache.poids"
                  :poidsActuel="tache.poidsActuel"
                  :libelle="tache.nom"
                  :montantNE="tache.montantNE"
                  :montantEPM="tache.montantEPM"
                  @supprimer="supprimer(tache)"
                  @dupliquer="dupliquer(tache)"
                  :debut="tache.debut"
                  :fin="tache.fin"
                  @modifier="modifier(tache)"
                  @prolonger="prolonger(tache)"
                  @suivre="suivreMyTache(tache)"
                  @commentaire="showComment = true"
                  :isDelete="tacheDelete"
                  :isUpdate="tacheUpdate"
                  :isSuivi="tacheSuivi"
                ></card-tache>
              </div>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Vtable from "@/components/Vtable";
import Multiselect from "vue-multiselect";
import SearchBar from "@/components/SearchBar";
import Titre from "@/components/Titre";
import Vmodal from "@/components/Vmodal";
import Vform from "@/components/Vform";
import ModalTopRight from "@/components/ModalTopRight";
import Dashboard from "@/layouts/Dashboard";
import CardTache from "@/components/CardTache.vue";
import { mapGetters, mapActions } from "vuex";
import { getStringValueOfStatutCode } from "@/utils/index";
import Composante from "@/store/modules/composantes/composante";
import Empty from '@/components/Empty.vue'
import Activite from "@/store/modules/activites/activite";
import ProgrammeService from "@/services/modules/programme.service.js";
import Suivi from "@/components/revisiteTache/Suivi.vue";
export default {
  components: {
    Dashboard,
    Vmodal,
    Titre,
    SearchBar,
    ModalTopRight,
    Multiselect,
    CardTache,
    Vtable,
    Suivi,
    Empty,
    Vform,
  },
  props:['version'],
  data() {
    return {
      dates: { debut: "", fin: "" },
      suivis: [],
      chargement: false,
      showProlonger: false,
      showModalSuivi: false,
      valueFiltre: null,
      composanteId: null,
      projetFiltre: null,
      composanteFiltre: null,
      sousComposanteFiltre: null,
      pending: false,
      success: true,
      inProgress: false,
      retard: false,
      rangeValue: 0,
      programmeId: this.currentUser?.programme.id,
      sendRequest: false,
      submitText: "Enregistrer",
      showFiltre: false,
      line: false,
      mosaique: true,
      isStateChange: false,
      seeSuivi: false,
      seeTache: true,
      options:[
        {name:'activite 1'},
        {name:'activite 2'},
        {name:'activite 3'},
        {name:'activite 4'},
        {name:'activite 5'},
      ],
      tacheId:'',
      tacheAttributs : ['nom', 'description', 'debut', 'fin', 'tepPrevu', 'poids'],

      champs:[

        {name: 'Nom de la tâche', key: "nom", type: 'text', placeholdere: "Nom de la tâche", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Taux d\'execution physique', key: "tepPrevu", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Date de debut', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Date de fin', key: "fin", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Description', type: '', key: "description", placeholdere: 'Description de la tâche', isSelect: false, isTextArea: true, data:'', required: false, errors : []},
        
      ],
      champsSuiviTache:[
        {name: 'Tache ', key: "statut", type: '', placeholdere: 'Selectionnez une tache ', isSelect: true, isTextArea: false, data:'', required: true, options: [{nom:'tache 1'},{nom:'tache 2'}], cle: 'etat', value: 'nom',  errors : []},
        {name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        
      ],
      tacheVisible:false,
      tacheAdd:false,
      tacheDelete:false,
      tacheUpdate:false,
      tacheSuivi:false,
      actions: [
       
      ],
      
      tacheId: "",

      projets: [],
      composantes: [],
      sousComposantes: [],
      activites: [],
      taches: [],
      suivis: [],
      results: [],
      search:'',
      programmeId:'',
      isSearch:false,
    };
  },

  computed: {
    ...mapGetters({
      currentUser: "auths/GET_AUTHENTICATE_USER",
    }),
    allData() {
      if(this.terminer != undefined || this.enAttente != undefined || this.enCours != undefined || this.retardData != undefined) {
        return  [].concat(this.terminer,this.enAttente,this.enCours,this.retardData)
      }
    },
    filtere: function () {
        var self = this;
          return this.allData.filter(function (data) {
          return data.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      });
    },
    terminer() {
      if(this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if(element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },

    enAttente() {
      if(this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if(element.statut == -1 || element.statut == -2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enCours() {
      if(this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if(element.statut == 0) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    retardData() {
      if(this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if(element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },
  
  },

  methods: {
    ...mapActions({
      getPtabReviser: "revisionPtab/GET_PTAB_REVISER",
    }),
    getSearchValue(data) {
      if(data != '') {
        this.isSearch = true
        this.search = data
      }
      else {
        this.isSearch = false
        this.search = data
      }
      
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
          if(element.slug ==='voir-une-tache') {
            this.tacheVisible = true
          }
          if(element.slug === 'creer-une-tache') {
            this.tacheAdd = true
          }
            if(element.slug === 'modifier-une-tache') {
              this.tacheUpdate = true
            }
            if(element.slug ==='supprimer-une-tache') {
              this.tacheDelete = true
            }
            if(element.slug ==='voir-revision-ptab') {
              this.tacheSuivi = true
            } 
      });
    },
    customLabel({ codePta, nom }) {
      return `${codePta} – ${nom}`;
    },

    filtreRange(value) {
      this.rangeValue = value;
    },

    selectActivite({ name }) {
      return `${name}`;
    },

    getNom(nom, prenom) {
      let name = "";

      if (nom !== undefined && nom !== null) name += nom;

      if (prenom !== undefined && prenom !== null) name += prenom;

      return name;
    },

    gotoNext() {
      this.$router.push(
        "/dashboard/projets/composantes/sous-composantes/activites/taches"
      );
    },

    toggle() {
      this.pending = false;
      this.inProgress = false;
      this.success = true;
      this.retard = false
    },

    toggle2() {
      this.success = false;
      this.inProgress = false;
      this.pending = true;
      this.retard = false
    },

    toggle3() {
      this.pending = false;
      this.success = false;
      this.inProgress = true;
      this.retard = false
    },
    toggle4() {
      this.pending = false;
      this.success = false;
      this.inProgress = false;
      this.retard = true
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },

    gotoSuivi() {
      this.seeSuivi = true;
      this.seeTache = false;
    },

    gotoTache() {
      this.seeSuivi = false;
      this.seeTache = true;
    },
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


  watch: {
    version: function (version) {
      const params = {
        "version": version,
        "composantes": null,
        "sous-composantes": null,
        "activites": null,
        "taches": null,
      };

      this.getPtabReviser(params).then((value) => {
        this.results = value.data.data;
      });
    },

    results: function (results) {
      this.projets = results["projets"];

      if (results["projets"].length > 0) {
        this.projetFiltre = results[0];
      }
    },

    projets: function (projets) {
      if (projets.length > 0) {
        this.projetFiltre = projets[0];
      }
    },

    projetFiltre: function (valeur) {
      if (valeur instanceof Composante || valeur instanceof Object) {
        this.composantes = this.results["composantes"].filter((value) => {
          if (value.projetId === valeur.id) return value;
        });
      } else if (
        valeur !== null &&
        typeof valeur !== "undefined" &&
        valeur.length !== 0
      ) {
        this.composantes = this.results["composantes"].filter((value) => {
          if (value.projetId === valeur) return value;
        });
      } else {
        this.composantes = [];
      }
    },

    composantes: function (composantes) {
      if (composantes.length > 0) {
        this.composanteFiltre = composantes[0];
      } else {
        this.composanteFiltre = null;
      }
    },

    composanteFiltre: function (valeur) {
      if (valeur instanceof Composante || valeur instanceof Object) {
        this.sousComposantes = this.results["sous-composantes"].filter(
          (value) => {
            if (value.composanteId === valeur.id) return value;
          }
        );
      } else if (
        valeur !== null &&
        typeof valeur !== "undefined" &&
        valeur.length !== 0
      ) {
        this.sousComposantes = this.results["sous-composantes"].filter(
          (value) => {
            if (value.composanteId === valeur) return value;
          }
        );
      } else {
        this.setSousComposantes = [];
      }
    },

    sousComposantes: function (sousComposantes) {
      if (sousComposantes.length > 0) {
        this.sousComposanteFiltre = sousComposantes[0];
      } else if (
        this.composanteFiltre !== null &&
        typeof this.composanteFiltre !== "undefined" &&
        this.composanteFiltre.length !== 0
      ) {
        this.activites = this.results["activites"].filter((value) => {
          if (value.composanteId === this.composanteFiltre.id) return value;
        });

        this.composanteId = this.composanteFiltre.id;
        this.sousComposanteFiltre = null;
        this.valueFiltre = null;
      } else {
        this.sousComposanteFiltre = null;
      }
    },

    sousComposanteFiltre: function (valeur) {
      if (valeur instanceof Composante || valeur instanceof Object) {
        this.activites = this.results["activites"].filter((value) => {
          if (value.composanteId === valeur.id) return value;
        });

        this.composanteId = valeur.id;
      } else if (
        valeur !== null &&
        typeof valeur !== "undefined" &&
        valeur.length !== 0
      ) {
        this.activites = this.results["activites"].filter((value) => {
          if (value.composanteId === valeur) return value;
        });

        this.composanteId = valeur;
      } else {
        this.activites = [];
      }
      
    },

    activites: function (activites) {
      if (activites.length > 0) {
        this.valueFiltre = activites[0];
      } else {
        this.valueFiltre = null;
      }
    },

    valueFiltre: function (valeur) {
      if (valeur instanceof Activite || valeur instanceof Object) {
        this.taches = this.results["taches"].filter((value) => {
          if (value.activiteId === valeur.id) return value;
        });
      } else if (
        valeur !== null &&
        typeof valeur !== "undefined" &&
        valeur.length !== 0
      ) {
        this.taches = this.results["taches"].filter((value) => {
          if (value.activiteId === valeur) return value;
        });
      }
    },
  },

  created() {
    this.getPermission()
    const params = {
      "version": this.version,
      "composantes": null,
      "sous-composantes": null,
      "activites": null,
      "taches": null,
    };
    this.programmeId = this.currentUser.programme.id
    this.getPtabReviser(params).then((value) => {
      this.results = value.data.data;
      if(this.programmeId){
        this.fetchProjets(this.programmeId)
      } 
    });
  },
};
</script>

<style></style>
