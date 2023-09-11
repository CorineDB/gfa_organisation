
import ApiService from '@/services/configs/api.service'

const IndicateurService = {

    query(type, params) {
      return ApiService.query("indicateurs", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get(`groupe/${slug}/indicateurs`);
    },
    getAll(slug) {
      return ApiService.get(`indicateurs`);
    },
    
    create(params) {
      return ApiService.post("indicateurs", params);
    },

    update(slug, params) {
      return ApiService.update("indicateurs", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`indicateurs/${slug}`);
    },


  };

  export default IndicateurService;
  