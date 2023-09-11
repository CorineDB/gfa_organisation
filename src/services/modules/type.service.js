
import ApiService from '@/services/configs/api.service'

const TypeService = {

    get(slug) {
      return ApiService.get("types", slug);
    },
   
   
    create(params) {
      return ApiService.post("types", params);
    },

    update(slug, params) {
      return ApiService.update("types", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`types/${slug}`);
    },


  };

  export default TypeService;
  