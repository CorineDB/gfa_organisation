
import ApiService from '@/services/configs/api.service'

const GrilleTarifaireService = {

    get() {
      return ApiService.get("grilleTarifaires");
    },
   
   
    create(params) {
      return ApiService.post("grilleTarifaires", params);
    },

    update(slug, params) {
      return ApiService.update("grilleTarifaires", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`grilleTarifaires/${slug}`);
    },


  };

  export default GrilleTarifaireService;
  