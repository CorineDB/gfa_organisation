
import ApiService from '@/services/configs/api.service'

const PromotionService = {

    query(type, params) {
      return ApiService.query("bsds", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("promotions", slug);
    },
   
   
    create(params) {
      return ApiService.post("promotions", params);
    },

    update(slug, params) {
      return ApiService.update("promotions", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`promotions/${slug}`);
    },


  };

  export default PromotionService;
  