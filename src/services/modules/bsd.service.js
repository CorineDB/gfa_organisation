
import ApiService from '@/services/configs/api.service'

const BsdService = {

    query(type, params) {
      return ApiService.query("bsds", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("bsds", slug);
    },
    getBsdByEntreprise(slug) {
      return ApiService.get("entreprise/bsds", slug);
    },
   
    create(params) {
      return ApiService.post("bsds", params);
    },

    update(slug, params) {
      return ApiService.update("bsds", slug, params);
    },

    voter(slug, params) {
      return ApiService.post(`bsd/${slug}/voter`, params);
    },

    destroy(slug) {
      return ApiService.delete(`bsds/${slug}`);
    },

    getStatistique(){
      return ApiService.get("entreprise/statistiques");
    },

    campagnes(slug) {
      return ApiService.get(`bsd/${slug}/campagnes`);
    },

    reabonnement(slug,params) {
      return ApiService.post(`bsd/${slug}/reabonnement`, params);
    },

    payPack(slug) {
      return ApiService.get(`transactions/${slug}/payer`)
    },

    payReabonnementPack(slug, bsdId) {
      return ApiService.get(`transactions/${slug}/reabonnement/${bsdId}/payer`)
    },

    getInformation(slug) {
      return ApiService.get(`kit/${slug}/informations`)
    }

  };

  export default BsdService;
  