import ApiService from "@/services/configs/api.service";

const IndicateurGouvernance = {
  query(type, params) {
    return ApiService.query("gfa/indicateurs-de-gouvernance", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/indicateurs-de-gouvernance", slug);
  },

  create(params) {
    return ApiService.post("gfa/indicateurs-de-gouvernance", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/indicateurs-de-gouvernance", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/indicateurs-de-gouvernance/${slug}`);
  },
};

export default IndicateurGouvernance;
