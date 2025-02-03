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
    return "multipart/form-data";
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
  let token = store.getters["auths/GET_ACCESS_TOKEN"];
  if (token) {
    token = token.slice(0, -1); // Optionnel : si besoin de modifier le token
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Réinitialisation des erreurs
  store.commit(SET_ERRORS_MESSAGE, { message: null, errors: [] });

  return config;
};

/**
 * Response Interceptor
 * Gestion des erreurs de réponse et du loader
 */
// const responseErrorInterceptor = error => {
//     store.commit(SET_LOADER, false); // Désactiver le loader en cas d'erreur

//     const statusCode = parseInt(error.response ? .status ? ? 500);
//     const errorMessage = error.response ? .data ? .message;
//     const errorDetails = error.response ? .data ? .errors;

//     store.commit(SET_ERRORS_MESSAGE, { message: errorMessage, errors: errorDetails });

//     switch (statusCode) {
//         case 400:
//             // Redirection ou traitement spécifique pour le statut 400
//             break;

//         case 401:
//             store.commit("auths/RESET_AUTH_DATA");
//             router.push("/");
//             break;

//         case 404:
//             chargement(false);
//             break;

//         case 422:
//             // Traitement des erreurs de validation (422)
//             break;

//         default:
//             Vue.$toast.error(errorMessage);
//             chargement(false);
//             break;
//     }

//     return Promise.reject(error);
// };

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
