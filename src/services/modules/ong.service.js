
import ApiService from '@/services/configs/api.service'

const OngService = {

    query(type, params) {
      return ApiService.query("gfa/organisations", {
        params: params,
      });
    },

    get(slug) {
      return ApiService.get("gfa/organisations", slug);
    },

    create(params) {
      return ApiService.post("gfa/organisations", params);
    },

    update(slug, params) {
      return ApiService.update("gfa/organisations", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`gfa/organisations/${slug}`);
    }

  };

  export default OngService;
  