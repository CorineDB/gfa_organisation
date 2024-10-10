import ApiService from "@/services/configs/api.service";

const PrincipeGouvernance = {
  query(type, params) {
    return ApiService.query("gfa/principes-de-gouvernance", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/principes-de-gouvernance", slug);
  },

  create(params) {
    return ApiService.post("gfa/principes-de-gouvernance", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/principes-de-gouvernance", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/principes-de-gouvernance/${slug}`);
  },
};

export default PrincipeGouvernance;
