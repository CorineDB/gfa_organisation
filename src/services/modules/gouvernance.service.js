
import ApiService from '@/services/configs/api.service'

const GouvernanceService = {

    query(type, params) {
      return ApiService.query("gouvernances", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("gouvernances", slug);
    },
    getGouvernanceByEntreprise(slug){
      return ApiService.get("entreprise/gouvernances", slug);
    },
   
   
    create(params) {
      return ApiService.post("gouvernances", params);
    },

    update(slug, params) {
      return ApiService.update("gouvernances", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`gouvernances/${slug}`);
    },


  };

  export default GouvernanceService;
  