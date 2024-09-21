<template>
  <div class="w-full">
    <vmodal v-if="showProlonger" title="prolonger la date d'echeance " @close="showProlonger = false">
      <div style="width:60vw" class="p-0 w-full">
        <form @submit.prevent="saveProlongerDate(tacheId, dates)" action="">
          <div class="grid grid-cols-2 gap-2 my-2">
            <div class="form-group my-2">
              <label class="text-xs font-semibold block text-gray-500 uppercase md:text-sm text-light">Date debut<span
                  class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
              <input v-model="dates.debut" required
                class="px-3 py-2 mt-1 border-2 border-gray-300  focus:outline-none focus:ring-2 w-full  focus:border-transparent"
                type="date" />
            </div>
            <div class="form-group my-2">
              <label class="text-xs font-semibold block text-gray-500 uppercase md:text-sm text-light">Date fin <span
                  class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
              <input v-model="dates.fin" required
                class="px-3 py-2 mt-1 border-2 border-gray-300  focus:outline-none focus:ring-2 w-full  focus:border-transparent"
                type="date" />
            </div>
          </div>
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
        </form>
      </div>
    </vmodal>

    <vmodal v-if="doSuiviOld" title="Suivre la tache " @close="doSuiviOld = false">
      <div style="width:60vw" class="p-0 w-full">
        <form @submit.prevent="saveSuiviOld(tacheId, date)" action="">
          <div class="grid grid-cols-2 gap-2 my-2">
            <div class="form-group my-2">
              <label class="text-xs font-semibold block text-gray-500 uppercase md:text-sm text-light">Date<span
                  class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
              <input v-model="date" required
                class="px-3 py-2 mt-1 border-2 border-gray-300  focus:outline-none focus:ring-2 w-full  focus:border-transparent"
                type="date" />
            </div>
          </div>
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
        </form>
      </div>
    </vmodal>

    <delete-alert v-if="deleteModal" type="danger" title="Confirm Action" width="sm" v-on:close="deleteModal = false">
      <p class="text-gray-800">
        voulez vous supprimer cette activité?
      </p>

      <div class="text-right mt-4">
        <button @click="deleteModal = false"
          class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline">Annuler</button>
        <button class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
          @click="deleteTaches(deleteData)">Supprimer</button>
      </div>
    </delete-alert>

    <modal-chat v-if="showComment" title="espace commentaire" v-on:close="showComment = false">
      <commentaire module="tache" :datas="commentaires"></commentaire>
    </modal-chat>

    <modal-top-right v-if="showModal" :title="title" v-on:close="close2">
      <div class="p-4 w-full">
        <vform template="default" :savedInput="savedInput" :champs="champs" :cols="cols" :submitText="submitText"
          :sendRequest="sendRequest" @sendForm="sendForm" @closeModal="close">
        </vform>
      </div>
    </modal-top-right>

    <nav class="text-xs md:text-sm font-semibold flex justify-between items-center flex-wrap" aria-label="Breadcrumb">
      <div class="mb-2">
        <ol class="inline-flex p-0 list-none">
          <li class="flex items-center">
            <router-link to="" class="text-gray-600">dashboard</router-link>
            <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li class="flex items-center">
            <router-link to="/dashboard/projets" class="text-gray-600">projets</router-link>
            <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li class="flex items-center text-blue-500">
            <router-link to="/dashboard/projets/taches-globale" class="">taches</router-link>
          </li>
        </ol>
      </div>
      <div>
        <search-bar @search="getSearchValue"></search-bar>
      </div>
    </nav>

    <div class="flex items-center justify-between my-2">
      <div class="flex space-x-4">
        <span :class="{ 'border-primary border-b-8 font-bold': seeTache }" @click="gotoTache()"
          class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase border-primary py-2">Taches</span>
        <!--  <span :class="{ 'border-primary border-b-8 font-bold': seeSuivi}" @click="gotoSuivi()" class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase border-primary py-2">Suivi tache</span> -->
      </div>

      <button v-if="tacheAdd" @click="addTache" title="ajouter une tache"
        class="px-4 py-2 flex overflow-hidden items-center text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: ">
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
          </svg>
        </span>
        <span class="mx-1 md:mx-2 text-xs font-semibold">ajouter</span>
      </button>

    </div>
    <div class="p-2 my-4 rounded-sm shadow-md bg-gray-50">
      <!--Filtre sur projet -->
      <div class=" mx-auto">
        <div class="mb-4">
          <ul class="flex flex-wrap justify-start -mb-px items-end  space-y-2" id="myTab" data-tabs-toggle="#myTabContent"
            role="tablist">

            <li class="mr-2" role="presentation">

              <div>
                <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un projet</label>
                <multiselect v-model="projetFiltre" :options="projets" :custom-label="customLabelP"
                  :preselect-first="true" placeholder="selectionnez un projet"
                  :selectLabel="'Appuyez sur Entrée pour sélectionner'"
                  :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" label="nom"
                  track-by="id"></multiselect>
              </div>

            </li>
            <li class=" mr-2" role="presentation">
              <div>
                <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un composant</label>
                <multiselect v-model="composanteFiltre" :options="composantes" :custom-label="customLabel"
                  :preselect-first="true" :selectLabel="'Appuyez sur Entrée pour sélectionner'"
                  :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné"
                  placeholder="selectionnez une composante" label="nom" track-by="id"></multiselect>
              </div>

            </li>
            <li class="mr-2 " role="presentation">
              <div>
                <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un sous composant</label>
                <multiselect v-model="sousComposanteFiltre" :options="sousComposantes" :preselect-first="true"
                  :custom-label="customLabel" :selectLabel="'Appuyez sur Entrée pour sélectionner'"
                  :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné"
                  placeholder="selectionnez une sous composante" label="nom" track-by="id">
                </multiselect>
              </div>

            </li>
            <li class="mr-2 " role="presentation">
              <div>
                <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez une activité</label>
                <multiselect v-model="valueFiltre" :options="activites" :custom-label="customLabel"
                  placeholder="selectionnez l'activite" :selectLabel="'Appuyez sur Entrée pour sélectionner'"
                  :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" label="nom"
                  track-by="id">
                </multiselect>
              </div>

            </li>

          </ul>
          <ul class="flex flex-wrap justify-end -mb-px">
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
                  {{ terminer.length }}
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
                  {{ retardData.length }}
                </span>

              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- le filtre -->
    <div v-if="seeTache && tacheVisible">
      <div v-if="!isSearch">


        <div v-if="inProgress">
          <empty v-if="enCours.length === 0">tache vide !!!</empty>
          <div v-else>
            <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(tache, index) in enCours" :key="index">
                <card-tache :id="tache.id" :bailleur="tache.bailleur.sigle" :statut="getStatus(tache.statut)"
                  :poids="tache.poids" :poidsActuel="tache.poidsActuel" :libelle="tache.nom"
                  :montantNE="tache.montantNE" :debut="tache.debut" :fin="tache.fin" :montantEPM="tache.montantEPM" :durees="tache.durees"
                  @supprimer="supprimer(tache)" @dupliquer="dupliquer(tache)" @modifier="modifier(tache)"
                  @prolonger="prolonger(tache)" @suivre="suivreMyTache(tache)" @suivreOld="suiviOld(tache)" @validation="validation" @commentaire="showComment = true"
                  :isDelete="tacheDelete" :isUpdate="tacheUpdate" :isSuivi="tacheSuivi"></card-tache>
              </div>
            </div>
          </div>
        </div>
        <div v-if="pending">
          <empty v-if="enAttente.length === 0">tache vide !!!</empty>
          <div v-else>
            <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(tache, index) in enAttente" :key="index">
                <card-tache :id="tache.id" :bailleur="tache.bailleur.sigle" :statut="getStatus(tache.statut)"
                  :poids="tache.poids" :poidsActuel="tache.poidsActuel" :libelle="tache.nom"
                  :montantNE="tache.montantNE" :codePta="tache.codePta" :montantEPM="tache.montantEPM" :durees="tache.durees"
                  @supprimer="supprimer(tache)" @dupliquer="dupliquer(tache)" @modifier="modifier(tache)"
                  @prolonger="prolonger(tache)" @suivre="suivreMyTache(tache)" @suivreOld="suiviOld(tache)" @validation="validation" :debut="tache.debut" :fin="tache.fin"
                  @commentaire="showComment = true" :isDelete="tacheDelete" :isUpdate="tacheUpdate"
                  :isSuivi="tacheSuivi"></card-tache>
              </div>
            </div>
          </div>
        </div>

        <div v-if="success">
          <empty v-if="terminer.length === 0">tache vide !!!</empty>
          <div v-else>
            <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(tache, index) in terminer" :key="index">
                <card-tache :id="tache.id" :bailleur="tache.bailleur.sigle" :statut="getStatus(tache.statut)"
                  :poids="tache.poids" :poidsActuel="tache.poidsActuel" :libelle="tache.nom"
                  :montantNE="tache.montantNE" :codePta="tache.codePta" :montantEPM="tache.montantEPM" :durees="tache.durees"
                  @supprimer="supprimer(tache)" @dupliquer="dupliquer(tache)" @modifier="modifier(tache)"
                  @prolonger="prolonger(tache)" @suivre="suivreMyTache(tache)" @suivreOld="suiviOld(tache)" @validation="validation" :debut="tache.debut" :fin="tache.fin"
                  @commentaire="showComment = true" :isDelete="tacheDelete" :isUpdate="tacheUpdate"
                  :isSuivi="tacheSuivi"></card-tache>
              </div>
            </div>
          </div>
        </div>
        <div v-if="retard">
          <empty v-if="retardData.length === 0">tache vide !!!</empty>
          <div v-else>
            <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(tache, index) in retardData" :key="index">
                <card-tache :id="tache.id" :bailleur="tache.bailleur.sigle" :statut="getStatus(tache.statut)"
                  :poids="tache.poids" :poidsActuel="tache.poidsActuel" :libelle="tache.nom"
                  :montantNE="tache.montantNE" :codePta="tache.codePta" :montantEPM="tache.montantEPM" :durees="tache.durees"
                  @supprimer="supprimer(tache)" @dupliquer="dupliquer(tache)" @modifier="modifier(tache)"
                  @prolonger="prolonger(tache)" @suivre="suivreMyTache(tache)" @suivreOld="suiviOld(tache)" @validation="validation" :debut="tache.debut" :fin="tache.fin"
                  @commentaire="showComment = true" :isDelete="tacheDelete" :isUpdate="tacheUpdate"
                  :isSuivi="tacheSuivi"></card-tache>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <empty v-if="filtere.length === 0">tache vide !!!</empty>
        <div v-else>
          <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
            <div v-for="(tache, index) in filtere" :key="index">
              <card-tache :id="tache.id" :bailleur="tache.bailleur.sigle" :statut="getStatus(tache.statut)"
                :poids="tache.poids" :poidsActuel="tache.poidsActuel" :libelle="tache.nom" :montantNE="tache.montantNE"
                :codePta="tache.codePta" :montantEPM="tache.montantEPM" @supprimer="supprimer(tache)"
                @dupliquer="dupliquer(tache)" @modifier="modifier(tache)" @validation="validation"
                @prolonger="prolonger(tache)" @suivre="suivreMyTache(tache)" @suivreOld="suiviOld(tache)" :debut="tache.debut" :fin="tache.fin"
                @commentaire="showComment = true" :isDelete="tacheDelete" :isUpdate="tacheUpdate"
                :isSuivi="tacheSuivi"></card-tache>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- <div v-if="seeSuivi">
            <vtable
              id="datatable"
              :headers="headers"
              :datas="dataTable"
              :actions="actions"

              >
            </vtable>
        </div> -->

  </div>
</template>

<script>
import Vtable from '@/components/Vtable'
import Multiselect from 'vue-multiselect'
import SearchBar from '@/components/SearchBar'
import Titre from '@/components/Titre'
import Vmodal from '@/components/Vmodal'
import Vform from '@/components/Vform'
import ModalTopRight from '@/components/ModalTopRight'
import Dashboard from '@/layouts/Dashboard'
import CardTache from '@/components/CardTache.vue'
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { extractFormData, getStringValueOfStatutCode } from "@/utils/index";
import Composante from "@/store/modules/composantes/composante";
import Activite from "@/store/modules/activites/activite";
import ComposanteService from "@/services/modules/composante.service.js";
import TacheService from "@/services/modules/tache.service.js";
import ActiviteService from '@/services/modules/activite.service';
import ProgrammeService from "@/services/modules/programme.service.js";
import Empty from '@/components/Empty.vue'
import ModalChat from '@/components/ModalChat'
import DeleteAlert from "@/components/DeleteAlert.vue";
import Commentaire from '@/components/Commentaire.vue'
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
    Vform,
    ModalChat,
    DeleteAlert,
    Composante,
    Empty,
    Commentaire
  },
  props: ['valeurProjet', 'valueProfondeur', 'valueComposante', 'valueSC'],
  data() {
    return {
      savedInput: [],
      dates: { debut: '', fin: '' },
      date:'',
      suivis: [],
      commentaires: [
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Yann olou', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere asperiores, ipsa enim eos impedit facilis eveniet doloribus quo veniam perferendis nam nostrum eius tempore quae architecto alias nobis amet vel.', date: '20 septembre' }
      ],
      chargement: false,
      showComment: false,
      showProlonger: false,
      showModalSuivi: false,
      valueFiltre: null,
      composanteId: null,
      projetFiltre: null,
      composanteFiltre: null,
      sousComposanteFiltre: null,
      pending: false,
      success: true,
      retard: false,
      inProgress: false,
      rangeValue: 0,
      programmeId: this.currentUser?.programme.id,
      cols: 1,
      sendRequest: false,
      submitText: "Enregistrer",
      showFiltre: false,
      showModal: false,
      showModal2: false,
      doSuiviOld: false,
      line: false,
      mosaique: true,
      isStateChange: false,
      seeSuivi: false,
      seeTache: true,
      options: [
        { name: 'activite 1' },
        { name: 'activite 2' },
        { name: 'activite 3' },
        { name: 'activite 4' },
        { name: 'activite 5' },
      ],
      tacheId: '',
      tacheAttributs: ['nom', 'description', 'debut', 'fin', 'poids'],

      champs: [
        { name: 'Nom de la tâche', key: "nom", type: 'text', placeholdere: "Nom de la tâche", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Date de debut', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Date de fin', key: "fin", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Description', type: '', key: "description", placeholdere: 'Description de la tâche', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },
      ],
      champsSuiviTache: [
        { name: 'Tache ', key: "statut", type: '', placeholdere: 'Selectionnez une tache ', isSelect: true, isTextArea: false, data: '', required: true, options: [{ nom: 'tache 1' }, { nom: 'tache 2' }], cle: 'etat', value: 'nom', errors: [] },
        { name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
      ],

      headers: [
        { name: "Tache", cle: "tache" },
        { name: "code pta", cle: "codePta" },
        { name: "poids initial", cle: 'poidsInitial' },
        { name: "poids actuel", cle: 'poidsActuel' },
        { name: "date de creation", cle: 'created_at' },

      ],

      dataTable: [],

      actions: [

      ],
      tacheVisible: false,
      tacheAdd: false,
      tacheDelete: false,
      tacheUpdate: false,
      tacheSuivi: false,
      idProjet: '',
      idComposante: '',
      idSC: '',
      idActivite: '',
      newProjet: null,
      newComponent: null,
      newSC: null,
      newActivite: null,
      isClick: false,
      isShow: true,
      search: '',
      isSearch: false,
      projets: [],
      deleteData: {},
      deleteModal: false,
    };
  },

  computed: {
    //importation des variables du module activites
    ...mapState({
      tache: (state) => state.taches.tache,
      loading: (state) => state.loading,
      errors: (state) => state.errors,
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

    ...mapGetters({
      composantes: "composantes/getComposantes",
      sousComposantes: "sousComposantes/getSousComposantes",
      activites: "activites/getActivites",
      taches: "taches/getTaches",
      tache: "taches/getTache",
      currentUser: 'auths/GET_AUTHENTICATE_USER'
    }),

    terminer() {
      if (this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if (element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },

    enAttente() {
      if (this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if (element.statut == -1 || element.statut == -2) {
            datas.push(element)
          }
        })
        return datas
      }
    },

    retardData() {
      if (this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if (element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },

    enCours() {
      if (this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
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
      if (this.isClick) {
        this.projetFiltre = this.newProjet
        this.composanteFiltre = this.newComponent
        this.fetchComposantes(this.idProjet);
        localStorage.removeItem('profondeurActivite');
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

        if (composantes[0] != null) {
          let code = composantes[0].codePta
          let nom = composantes[0].nom
          this.composanteFiltre = { codePta: code, nom: nom }
          let indexComposante = composantes[0].id
          ComposanteService.sousComposantes(indexComposante).then((data) => {
            const sous_composantes = data.data.data
            if (sous_composantes[0] != null) {
              let code = sous_composantes[0].codePta
              let nom = sous_composantes[0].nom
              this.sousComposanteFiltre = { codePta: code, nom: nom }
              let indexSC = sous_composantes[0].id
              //this.fetchActivites(indexSC)
              ComposanteService.activites(indexSC).then((data) => {
                const activites = data.data.data
                if (activites[0] != null) {
                  const idActivite = activites[0].id
                  let code = activites[0].codePta
                  let nom = activites[0].nom
                  this.valueFiltre = { id: idActivite, codePta: code, nom: nom }
                  this.fetchTaches(idActivite);
                  this.isShow = true
                }
                else {
                  this.isShow = false
                  this.valueFiltre = null
                }
              })

            }
            else {
              ComposanteService.activites(indexComposante).then((data) => {
                const activites = data.data.data
                if (activites[0] != null) {
                  const idActivite = activites[0].id
                  let code = activites[0].codePta
                  let nom = activites[0].nom
                  this.valueFiltre = { id: idActivite, codePta: code, nom: nom }
                  this.fetchTaches(idActivite);
                  this.isShow = true
                  this.sousComposanteFiltre = null
                  //this.composanteFiltre = null 

                }
              })

            }

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
        }
        else {
          this.isShow = false
          this.composanteFiltre = null
          this.valueFiltre = null
          this.sousComposanteFiltre = null
        }

        //this.fetchActivites(Scomposante.id);
      }

    },
    changeComposante(composante) {
      if (this.isClick) {
        this.fetchSousComposantes(this.idComposante);
        localStorage.removeItem('profondeurActivite');
      } else {
        this.fetchSousComposantes(composante.id);
      }


    },
    changeSC(Scomposante) {
      if (this.isClick) {
        this.sousComposanteFiltre = this.newSC
        this.valueFiltre = this.newActivite
        this.fetchTaches(this.idActivite);
        this.fetchActivites(this.idSC);

        localStorage.removeItem('profondeurActivite');
      } else {
        this.fetchActivites(Scomposante.id);

      }

    },
    changeActivite(activite) {
      if (this.isClick) {

        this.fetchTaches(this.idActivite);
        this.isClick = false
        localStorage.removeItem('profondeurActivite');
      } else {
        this.fetchTaches(activite.id);
        this.isShow = true
      }

    },
    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setTache: "taches/FILL", // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
      setTaches: "taches/SET_LIST_TACHE_OF_ACTIVITE",
      setActivites: 'activites/SET_LIST_ACTIVITES',
      setComposantes: 'composantes/SET_LIST_COMPOSANTES',
      setSousComposantes: 'sousComposantes/SET_LIST_SOUSCOMPOSANTE'
    }),

    ...mapActions("taches", {
      fetchTaches: "FETCH_LIST_TACHE_OF_ACTIVITE",
      saveTache: "STORE_TACHE",
      updateTache: "UPDATE_TACHE",
      deleteTache: "DESTROY_TACHE",
    }),

    ...mapActions({
      fetchActivites: "activites/FETCH_LIST_ACTIVITE_OF_COMPOSANTE",
      fetchComposantes: "composantes/FETCH_LIST_COMPOSANTE_OF_PROJET",
      fetchSousComposantes: "sousComposantes/FETCH_LIST_SOUS_COMPOSANTE_OF_COMPOSANTE",
    }),

    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-une-tache') {
          this.tacheVisible = true
        }
        if (element.slug === 'creer-une-tache') {
          this.tacheAdd = true
        }
        if (element.slug === 'modifier-une-tache') {
          this.tacheUpdate = true
        }
        if (element.slug === 'supprimer-une-tache') {
          this.tacheDelete = true
        }
        if (element.slug === 'voir-un-suivi-tache') {
          this.tacheSuivi = true
        }
      });
    },
    customLabel({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },
    customLabelP({ bailleur, nom }) {
      return `${bailleur.sigle} – ${nom}`
    },


    filtreRange(value) {
      this.rangeValue = value
    },
    selectActivite({ name }) {
      return `${name}`
    },

    addDate() {
      this.dates.push({});
    },
    deleteItem(item) {
      this.dates.splice(item, 1);
      alert(item)
    },
    prolonger(tache) {
      this.tacheId = tache.id
      this.showProlonger = true
    },
    suiviOld(tache) {
      this.tacheId = tache.id
      this.doSuiviOld = true
    },
    saveProlongerDate(id, data) {
      this.chargement = true
      TacheService.addDate(id, data).then((data) => {
        this.$toast.success('Operation éffectué avec succès')
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
      this.chargement = false
    },
    saveSuiviOld(id, data) {
      this.chargement = true
      var form = {
        date:data,
        tacheId:id
      }
      TacheService.myOldSuivis(form).then((data) => {
        this.doSuiviOld = false
        this.$toast.success('Operation éffectué avec succès')
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
      this.chargement = false
    },
    getSuivi() {
      TacheService.getSuivi().then((data) => {
        const datas = data.data.data
        datas.forEach(element => {
          const tache = element.tache.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({ tache: tache, codePta: codePta, poidsInitial: poidsInitial, poidsActuel: poidsActuel, created_at: created_at })
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
    suivreMyTache(tache) {
      if (this.tacheSuivi)
        this.$router.push({ name: 'dashboard_projets_taches_globale_suivis', params: { id: tache.id } })
    },
    close() {
      this.showModal = false;
      this.resetForm()
    },
    close2() {
      this.showModal = false;
      this.savedInput = []
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);
    },
    
    addPlan() {
      this.title = "Ajouter un plan decaissement";
      this.showModal2 = true;
    },
    modifierPlan() {
      this.title = "Modifier un plan de decaissement";
      this.showModal2 = true;
    },
    dupliquerPlan() {
      this.title = "Dupliquer un plan decaissement";
      this.showModal2 = true;
    },

    addTache() {

      this.title = "Ajouter"

      this.submitText = "Enregistrer",

        this.showCloseModal(true)

    },

    suivreTache(data) {
      this.title = "Suivre une tache "

      this.submitText = "Enregistrer",

        this.showModalSuivi = true
    },

    getNom(nom, prenom) {

      let name = ''

      if (nom !== undefined && nom !== null) name += nom

      if (prenom !== undefined && prenom !== null) name += prenom

      return name;
    },

    supprimer(tache, index) {
      this.deleteModal = true
      this.deleteData.data = tache
      this.deleteData.index = index
    },

    deleteTaches(data) {
      //this.filteredBailleur.splice(data.index,1)
      this.deleteModal = false
      TacheService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.fetchTaches(this.valueFiltre.id);

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



    dupliquer(tache) {

      this.title = 'Ajouter une tache'

      this.tacheAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if (value.key === item) {
            this.champs[index]['data'] = tache[item]
          }

        });

      });

      this.submitText = "Enregistrer",

        this.showCloseModal(true)
    },

    modifier(tache) {
      localStorage.removeItem('formData')

      this.title = 'Modifier une tache'

      this.setTache(tache)

      this.tacheAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if (value.key === item) {
            this.champs[index]['data'] = tache[item]
          }

        });

      });

      this.submitText = "Modifier",

        this.showCloseModal(true)
    },

    dupliquer() {
      this.title = "Dupliquer une activité";
      this.showModal = true;
    },

    gotoNext() {
      this.$router.push(
        "/dashboard/projets/composantes/sous-composantes/activites/taches"
      );
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

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },

    validation() {
      this.fetchTaches(this.valueFiltre.id);
    },


    sendForm() {
      if (this.sendRequest === false) {
        this.sendRequest = true;

        /* this.champs = this.champs.map((item) => {
          item.errors = [];
          return item;
        }); */

        let tache = extractFormData(this.champs, this.tacheAttributs);
        if (this.valueFiltre == undefined || this.valueFiltre == null) {
          this.$toast.error('Activité non definit  ')
          this.sendRequest = false;
          this.close()
        } else {
          tache['activiteId'] = this.valueFiltre.id;
          if (this.tache?.id) {
            this.updateTache({ tache: tache, id: this.tache?.id })
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  this.fetchTaches(this.valueFiltre.id);
                  this.close();
                }
              })
              .finally((error) => {
                this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
                this.sendRequest = false;
                this.champs2.map(value => value.errors = this.erreurs[value.key])

              });
          } else {
            this.saveTache(tache)
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  this.fetchTaches(this.valueFiltre.id);
                  this.close();
                  this.resetForm()
                  localStorage.removeItem('formData');

                }
              })
              .finally((error) => {
                this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
                this.sendRequest = false;
                this.champs2.map(value => value.errors = this.erreurs[value.key])
              });
          }
        }

      }
    },

    close() {
      this.showCloseModal();

      this.sendRequest = false;
    },

    resetForm() {

      this.champs = this.champs.map(item => { item['data'] = ''; item['errors'] = []; return item })

      window.document.getElementById('vform').reset()

      this.setTache({})
    },

    showCloseModal(value = false) {
      this.showModal = value;
    },

    gotoSuivi() {
      this.seeSuivi = true
      this.seeTache = false
    },

    gotoTache() {
      this.seeSuivi = false
      this.seeTache = true
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

      if (errors.length > 0) {
        this.champs.forEach((value) => {
          if (errors[value.key] instanceof Array || errors[value.key] !== undefined) {
            value.errors = errors[value.key]
            if (value.key === "types") {

              value.errors = errors["type"];

            }
            else value.errors = errors[value.key];
          }
        })
      }
      else {
        this.champs = this.champs.map(item => { item['errors'] = []; return item })
      }

    },

    projets: function (projets) {
      if (projets.length > 0) {
        this.projetFiltre = projets[0]
      }
    },

    projetFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchComposantes(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchComposantes(valeur);
      }
      else {
        this.setComposantes([])
      }
    },

    composantes: function (composantes) {
      if (composantes.length > 0) {
        this.composanteFiltre = composantes[0]
      }
      else {
        this.composanteFiltre = null
      }
    },

    composanteFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchSousComposantes(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchSousComposantes(valeur);
      }
      else {
        this.setSousComposantes([])
      }
    },

    sousComposantes: function (sousComposantes) {
      if (sousComposantes.length > 0) {
        this.sousComposanteFiltre = sousComposantes[0];
      }
      else if (this.composanteFiltre !== null && typeof this.composanteFiltre !== 'undefined' && this.composanteFiltre.length !== 0) {
        this.fetchActivites(this.composanteFiltre.id);
        this.composanteId = this.composanteFiltre.id
        this.sousComposanteFiltre = null
        this.valueFiltre = null;
      }
      else {
        this.sousComposanteFiltre = null;
      }
    },

    sousComposanteFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchActivites(valeur.id);
        this.composanteId = valeur.id
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchActivites(valeur);
        this.composanteId = valeur
      }
      else {
        this.setActivites([])
      }

    },

    activites: function (activites) {
      if (activites.length > 0) {
        this.valueFiltre = activites[0]
      }
      else {
        this.valueFiltre = null
      }
    },

    valueFiltre: function (valeur) {
      if (valeur instanceof Activite || valeur instanceof Object) {
        this.fetchTaches(valeur.id);
      }

      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchTaches(valeur);
      }

    }

  },

  created() {
    const profondeurActivite = JSON.parse(localStorage.getItem('profondeurActivite'))

    if (profondeurActivite != undefined || profondeurActivite != null) {
      this.isClick = profondeurActivite.isClick
      if (this.isClick) {

        this.idProjet = profondeurActivite.id
        this.idSC = profondeurActivite.idSC
        this.idComposante = profondeurActivite.idC
        this.idActivite = profondeurActivite.idActivite

        this.newProjet = profondeurActivite.projet
        this.newComponent = profondeurActivite.composente
        this.newSC = profondeurActivite.sousComposante
        this.newActivite = profondeurActivite.activite
      }

    }
    if (this.tacheSuivi) {
      this.getSuivi()
    }

    this.getPermission()
    this.programmeId = this.currentUser.programme.id

    if (this.programmeId) {
      Promise.all([this.fetchProjets(this.programmeId)]);
    }

  }

};
</script>

<style></style>
