import axios from "axios";
//import Vue from 'vue';
import { API_BASE_URL } from "@/services/configs/environment";
import { SET_LOADER, SET_ERRORS_MESSAGE } from "../stores/mutations.type";
import store from "../stores/index";
//import router from "../router/index";

// Fonction pour gérer le loader
// const chargement = (bool) => {
//     Vue.$store.dispatch('SET_LOADER', bool);
// };

/**
 * Axios basic configuration
 * Configuration générale : timeout, headers, params, etc.
 */

function determineContentType(payLoad) {
  if (payLoad instanceof FormData) {
    return undefined;
  } else {
    return "application/json";
  }
}

const config = {
  baseURL: `${API_BASE_URL}/api/`,
  timeout: 60 * 100000000, // Timeout
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, X-Token-Auth, Authorization",
    },
  },
};

/**
 * Création d'une instance Axios
 * Utiliser cette instance au lieu d'axios directement dans l'application
 */
const httpClient = axios.create(config);

/**
 * Auth interceptor
 * Ajout du token d'authentification si disponible
 */
const authInterceptor = (config) => {
  console.log("🔴 [authInterceptor] - Config avant modification:", config);
  console.log("🔴 [authInterceptor] - Headers avant:", config.headers);
  console.log("🔴 [authInterceptor] - Data type:", typeof config.data);
  console.log("🔴 [authInterceptor] - Data instanceof FormData:", config.data instanceof FormData);

  let token = store.getters["auths/GET_ACCESS_TOKEN"];
  if (token) {
    token = token.slice(0, -1); // Optionnel : si besoin de modifier le token
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Protection spéciale pour FormData - supprimer Content-Type si présent
  if (config.data instanceof FormData && config.headers['Content-Type']) {
    console.log("🔴 [authInterceptor] - Suppression Content-Type pour FormData");
    delete config.headers['Content-Type'];
  }

  // Réinitialisation des erreurs
  store.commit(SET_ERRORS_MESSAGE, { message: null, errors: [] });

  console.log("🔴 [authInterceptor] - Headers après:", config.headers);
  console.log("🔴 [authInterceptor] - Config final:", config);

  return config;
};

 
/** Ajout des interceptors à l'instance Axios */
httpClient.interceptors.request.use(authInterceptor);

httpClient.interceptors.response.use(
  (response) => {
    store.commit(SET_LOADER, false); // Désactiver le loader après la réponse
    return response;
  }
  // responseErrorInterceptor
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Supprimez "authenticated" && access_token de localStorage
      localStorage.removeItem("authenticateUser");
      localStorage.removeItem("access_token");
      // // Redirigez vers "/"
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export { httpClient, determineContentType };
