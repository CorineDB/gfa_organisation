import ApiService from "@/services/configs/api.service";

const FormulaireFactuel = {
  query(type, params) {
    return ApiService.query("gfa/enquete-de-gouvernance/formulaires-factuel-de-gouvernance", {
      params: params,
    });
  },

  get(slug = "factuel") {
    return ApiService.get(`gfa/enquete-de-gouvernance/formulaires-factuel-de-gouvernance`);
    return ApiService.get(`gfa/enquete-de-gouvernance/formulaires-de-gouvernance?filters[type__eq]=${slug}`);
  },
  getAll() {
    return ApiService.get(`gfa/enquete-de-gouvernance/formulaires-factuel-de-gouvernance`);
  },
  getOne(id) {
    return ApiService.get(`gfa/enquete-de-gouvernance/formulaires-factuel-de-gouvernance/${id}`);
  },

  create(payload) {
    return ApiService.post(`gfa/enquete-de-gouvernance/formulaires-factuel-de-gouvernance`, payload);
  },

  update(id, payload) {
    return ApiService.update(`gfa/enquete-de-gouvernance/formulaires-factuel-de-gouvernance`, id, payload);
  },

  destroy(id) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/formulaires-factuel-de-gouvernance/${id}`);
  },
};

export default FormulaireFactuel;
