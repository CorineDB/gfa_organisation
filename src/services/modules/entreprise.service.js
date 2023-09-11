
import ApiService from '@/services/configs/api.service'

const EntrepriseService = {

    query(type, params) {
      return ApiService.query("entreprises", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("entreprises", slug);
    },
  
     
    update(slug, params) {
      return ApiService.update("entreprises", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`entreprises/${slug}`);
    },

    updateRefresh(params) {
      return ApiService.post("entreprise/updateRefresh", params);
    },

    programmationRapports() {
      return ApiService.get(`entreprise/programmationRapports`);
    },

    programmationRapport(params) {
      return ApiService.post("entreprise/programmationRapport", params);
    },

    programmationRapportUpdate(slug, params) {
      return ApiService.put(`entreprise/programmationRapport/${slug}`, params);
    },

    votes() {
      return ApiService.get(`entreprise/votes`);
    },

    // 

    getApiClient() {
      return ApiService.get("oauth/clients", );
    },
  
    createApiClient(params) {
      return ApiService.post("oauth/clients", params);
    },
  
    destroyApiClient(slug) {
      return ApiService.delete(`oauth/clients/${slug}`);
    },
  };

  export default EntrepriseService;
  