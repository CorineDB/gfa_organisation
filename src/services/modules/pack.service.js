
import ApiService from '@/services/configs/api.service'

const PackService = {

    get() {
      return ApiService.get("packs");
    },
   
   
    create(params) {
      return ApiService.post("packs", params);
    },

    update(slug, params) {
      return ApiService.update("packs", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`packs/${slug}`);
    },


  };

  export default PackService;
  