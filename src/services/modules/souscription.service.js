
import ApiService from '@/services/configs/api.service'

const SouscriptionService = {

    get() {
      return ApiService.get("souscriptions");
    },
   
   
    create(params) {
      return ApiService.post("souscriptions", params);
    },

    update(slug, params) {
      return ApiService.update("souscriptions", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`souscriptions/${slug}`);
    },


  };

  export default SouscriptionService;
  