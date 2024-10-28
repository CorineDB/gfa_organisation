import ApiService from "@/services/configs/api.service";

const FormulaireFactuel = {
  query(type, params) {
    return ApiService.query("gfa/formulaires-de-gouvernance", {
      params: params,
    });
  },

  get() {
    return ApiService.get(`gfa/formulaires-de-gouvernance`);
  },

  create(payload) {
    return ApiService.post(`gfa/formulaires-de-gouvernance`, payload);
  },

  update(slug, params) {
    return ApiService.update("gfa/formulaires-de-gouvernance", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/formulaires-de-gouvernance/${slug}`);
  },
};

export default FormulaireFactuel;
