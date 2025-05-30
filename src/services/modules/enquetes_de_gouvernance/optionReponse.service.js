import ApiService from "@/services/configs/api.service";

const OptionReponse = {
  query(type, params) {
    return ApiService.query("gfa/enquete-de-gouvernance/options-de-reponse-gouvernance", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/enquete-de-gouvernance/options-de-reponse-gouvernance", slug);
  },

  create(params) {
    return ApiService.post("gfa/enquete-de-gouvernance/options-de-reponse-gouvernance", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/enquete-de-gouvernance/options-de-reponse-gouvernance", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/options-de-reponse-gouvernance/${slug}`);
  },

  factuel() {
    return ApiService.get("gfa/enquete-de-gouvernance/options-de-reponse-gouvernance-factuel");
  },

  perception() {
    return ApiService.get("gfa/enquete-de-gouvernance/options-de-reponse-gouvernance-de-perception");
  },
};

export default OptionReponse;
