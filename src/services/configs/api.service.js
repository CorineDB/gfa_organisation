import { httpClient, determineContentType } from "@/plugins/http-client";
const ApiService = {
  query(resource, params) {
    return httpClient.get(resource, params).catch((error) => {
      // throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  get(resource, slug = "") {
    return new Promise(async (resolve, reject) => {
      if (slug == "" || slug == null) {
        await httpClient
          .get(`${resource}`)
          .then((response, status) => resolve(response, status))
          .catch((response, status) => {
            reject(response, status);
          });
      } else {
        await httpClient
          .get(`${resource}/${slug}`)
          .then((response, status) => resolve(response, status))
          .catch((response, status) => {
            reject(response, status);
          });
      }
    });
  },

  post(resource, params , config = {}) {
    return new Promise(async (resolve, reject) => {
      console.log("🟠 [ApiService.post] - Début fonction");
      console.log("🟠 [ApiService.post] - Resource:", resource);
      console.log("🟠 [ApiService.post] - Type de params:", typeof params);
      console.log("🟠 [ApiService.post] - params instanceof FormData:", params instanceof FormData);
      console.log("🟠 [ApiService.post] - Config reçu:", config);
      console.log("🟠 [ApiService.post] - params:", params);

      let headers = { Accept: "application/json" };

      console.log("Config dans ApiService.post:", config.headers);

      // Étape 2 : Corriger pour respecter FormData
      if (config.headers) {
        console.log("🟠 [ApiService.post] - Config.headers existe");
        // Si config.headers existe ET c'est FormData avec preserveFormData
        if (config.preserveFormData && params instanceof FormData) {
          console.log("🟢 [ApiService.post] - FORMDATA avec preserveFormData - pas de Content-Type");
          // Pour FormData, on ne veut PAS de Content-Type du tout
          headers = { ...headers };
          // Forcer l'absence de Content-Type pour FormData
          delete headers['Content-Type'];
        } else {
          console.log("🟡 [ApiService.post] - Merger headers normalement");
          // Merger normalement pour JSON ou autres cas
          headers = { ...headers, ...config.headers };
        }
      } else {
        console.log("🟠 [ApiService.post] - Pas de config.headers - utiliser determineContentType");
        // Logique originale quand pas de config.headers
        const contentType = determineContentType(params);
        console.log("🟠 [ApiService.post] - ContentType déterminé:", contentType);
        if (contentType) {
          headers["Content-Type"] = contentType;
        }
      }

      console.log("🟠 [ApiService.post] - Headers finaux:", headers);

      const requestConfig = { ...config, headers };
      // Nettoyer le flag preserveFormData avant envoi
      delete requestConfig.preserveFormData;

      console.log("🟠 [ApiService.post] - RequestConfig final:", requestConfig);
      console.log("🟠 [ApiService.post] - Params avant envoi httpClient:", params);
      console.log("🟠 [ApiService.post] - params instanceof FormData avant httpClient:", params instanceof FormData);

      await httpClient
        .post(`${resource}`, params, requestConfig)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },

  update(resource, slug, params) {
    return new Promise(async (resolve, reject) => {
      const contentType = determineContentType(params);

      const headers = {
        Accept: "application/json",
        "Content-Type": contentType,
      };

      const requestConfig = {
        headers,
      };

      await httpClient
        .put(`${resource}/${slug}`, params, requestConfig)
        .then((response, status) => resolve(response, status))
        .catch((response, status) => {
          reject(response, status);
        });
    });
  },

  put(resource, params) {
    return new Promise(async (resolve, reject) => {
      const contentType = determineContentType(params);

      const headers = {
        Accept: "application/json",
        "Content-Type": contentType,
      };

      const requestConfig = {
        headers,
      };

      await httpClient
        .put(`${resource}`, params, requestConfig)
        .then((response, status) => resolve(response, status))
        .catch((response, status) => {
          reject(response, status);
        });
    });
  },

  delete(resource) {
    return new Promise(async (resolve, reject) => {
      await httpClient
        .delete(resource)
        .then((response, status) => resolve(response, status))
        .catch((response, status) => {
          reject(response, status);
        });
    });
  },
};

export default ApiService;
