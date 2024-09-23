import Vue from "vue";

import Vuex from "vuex";

// import auths from "@/store/modules/auths/index";

import auths from "./modules/auths/index";

import agencesDeCommunication from "./modules/agencesDeCommunication/index";

import ongs from "./modules/ongs/index";

import bailleurs from "./modules/bailleurs/index";

import entreprisesExecutante from "./modules/entreprisesExecutante/index";

import institutions from "./modules/institutions/index";

import projets from "./modules/projets/index";

import programmes from "./modules/programmes/index";

import mods from "./modules/mods/index";

import missionDeControles from "./modules/missionDeControles/index";

import uniteeDeGestions from "./modules/uniteeDeGestions/index";

import uniteesDeMesure from "./modules/uniteesDeMesure/index";

import composantes from "./modules/composantes/index";

import sousComposantes from "./modules/sousComposantes/index";

import activites from "./modules/activites/index";

import categories from "./modules/categories/index";

import taches from "./modules/taches/index";

import paps from "./modules/paps/index";

import suiviIndicateurs from "./modules/suiviIndicateurs/index";

import utilisateurs from "./modules/utilisateurs/index";

import roles from "./modules/roles/index";

import indicateurs from "./modules/indicateurs/index";

import anos from "./modules/anos/index";

import typeAnos from "./modules/typeAnos/index";

import eActivites from "./modules/eActivites/index";

import formulaires from "./modules/formulaires/index";

import suiviFinanciers from "./modules/suiviFinanciers/index";

import decaissements from "./modules/decaissements/index";

import pointFinancier from "./modules/pointFinancier/index";

import planDeDecaissements from "./modules/planDeDecaissements/index";

import eSuivis from "./modules/eSuivis/index";

import sites from "./modules/sites/index";

import revisionPtab from "./modules/revisionPtab/index";

import passations from "./modules/passations/index";

import reponses from "./modules/reponses/index";

import structures from "./modules/structures/index";

import gouvernements from "./modules/gouvernements/index";

import indicateurs_mod from "./modules/indicateurs_mod/index";


import { SET_LOADER, SET_ERRORS_MESSAGE, RESET_ERROR_MESSAGE_MUTATIONS } from "./mutations.type";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sideBarOpen: false,
    counter: 0,
    loading: false,
    messageErreur: null,
    errors: [],
    isActive: false,
    accountValidate: false,
    modSelect: "",
    missionDeControleSelect: "",
    types: [
      {
        nom: "pta",
        type: "pta",
      },

      {
        nom: "PPM",
        type: "ppm",
      },
    ],

    trimestres: [
      {
        valeur: 1,
        trimestre: "Trimestre 1",
      },

      {
        valeur: 2,
        trimestre: "Trimestre 2",
      },

      {
        valeur: 3,
        trimestre: "Trimestre 3",
      },

      {
        valeur: 4,
        trimestre: "Trimestre 4",
      },
    ],

    statuts: [
      {
        nom: "Non validé",
        etat: -2,
      },
      {
        nom: "Validé",
        etat: -1,
      },
      {
        nom: "En cours",
        etat: 0,
      },
      {
        nom: "En retard",
        etat: 1,
      },
      {
        nom: "Terminé",
        etat: 2,
      },
    ],
    statutsAno: [
      {
        nom: "Non validé",
        etat: -1,
      },
      {
        nom: "Validé",
        etat: 1,
      },
    ],
    modePaiement: [
      {
        id: 0,
        nom: "Paiement direct",
      },
      {
        id: 1,
        nom: "Avance au compte designé",
      },
      {
        id: 2,
        nom: "Remboursement",
      },
      {
        id: 3,
        nom: "Engagement special",
      },
    ],

    sources: [
      {
        id: 0,
        nom: "Pret",
      },
      {
        id: 1,
        nom: "Budget National",
      },
    ],
    questionnaire: {},
  },
  getters: {
    getCount: (state) => {
      return state.counter;
    },
    sideBarOpen: (state) => {
      return state.sideBarOpen;
    },

    HAS_ERROR: (state) => {
      return state.messageErreur != null ? true : false;
    },

    IS_LOADING: (state) => {
      return state.loading;
    },

    GET_MESSAGE_ERREUR: (state) => {
      return state.messageErreur;
    },

    GET_ERREURS: (state) => {
      return state.errors;
    },

    getModSelect: (state) => {
      return state.modSelect;
    },

    getMissionDeControleSelect: (state) => {
      return state.missionDeControleSelect;
    },
    getquestionnaire: (state) => {
      return state.questionnaire;
    },
  },
  mutations: {
    active(state) {
      state.isActive = true;
    },
    disabled(state) {
      state.isActive = false;
    },
    accountV(state) {
      state.accountValidate = true;
    },
    accountD(state) {
      state.accountValidate = false;
    },
    toggleSidebar(state) {
      state.sideBarOpen = !state.sideBarOpen;
    },
    updateCounter(state, value) {
      state.counter = value;
    },

    setModSelect(state, value) {
      state.modSelect = value;
    },

    setMissionDeControleSelect(state, value) {
      state.missionDeControleSelect = value;
    },
    setQuestionnaire(state, payload) {
      state.questionnaire = payload;
    },

    [SET_LOADER](state, value) {
      if (typeof value === "boolean")
        // vérifie si le LOADER est vraiement de type boolean
        state.loading = value;
    },

    [SET_ERRORS_MESSAGE](state, { message, errors }) {
      //si erreur, cette fonction permet de récuperer les erreurs et de les stockés pour la vue
      state.messageErreur = message;
      state.errors = errors;
    },

    [RESET_ERROR_MESSAGE_MUTATIONS](state) {
      state.messageErreur = null;
      state.errors = [];
    },
  },

  actions: {
    active(context) {
      context.commit("active");
    },
    disabled(context) {
      context.commit("disabled");
    },
    accountV(context) {
      context.commit("accountV");
    },
    accountD(context) {
      context.commit("accountD");
    },
    toggleSidebar(context) {
      context.commit("toggleSidebar");
    },
  },

  modules: {
    auths,
    agencesDeCommunication,
    programmes,
    uniteeDeGestions,
    bailleurs,
    entreprisesExecutante,
    institutions,
    mods,
    ongs,
    missionDeControles,
    projets,
    uniteesDeMesure,
    composantes,
    sousComposantes,
    revisionPtab,
    activites,
    taches,
    paps,
    indicateurs,
    categories,
    suiviIndicateurs,
    anos,
    typeAnos,
    eActivites,
    utilisateurs,
    roles,
    formulaires,
    suiviFinanciers,
    decaissements,
    pointFinancier,
    planDeDecaissements,
    eSuivis,
    sites,
    passations,
    reponses,
    structures,
    indicateurs_mod,
    gouvernements,
  },
});
