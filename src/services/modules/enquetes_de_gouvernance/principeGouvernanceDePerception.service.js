import ApiService from "@/services/configs/api.service";

const PrincipeDeGouvernanceDePerception = {
  query(type, params) {
    return ApiService.query("gfa/enquete-de-gouvernance/principes-de-gouvernance-de-perception", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/enquete-de-gouvernance/principes-de-gouvernance-de-perception", slug);
  },

  create(params) {
    return ApiService.post("gfa/enquete-de-gouvernance/principes-de-gouvernance-de-perception", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/enquete-de-gouvernance/principes-de-gouvernance-de-perception", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/principes-de-gouvernance-de-perception/${slug}`);
  },
};

export default PrincipeDeGouvernanceDePerception;
