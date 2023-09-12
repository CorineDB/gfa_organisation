
import ApiService from '@/services/configs/api.service'

const CritereService = {

    query(type, params) {
      return ApiService.query("criteres", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get(`principes/${slug}/criteres`);
    },
    getAll(slug) {
      return ApiService.get(`criteres`);
    },
    
    create(params) {
      return ApiService.post("criteres", params);
    },

    update(slug, params) {
      return ApiService.update("criteres", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`criteres/${slug}`);
    },


  };

  export default CritereService;
  