import ApiService from "@/services/configs/api.service";

const IndicateursService = {
  query(type, params) {
    return ApiService.query("indicateurs", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("/gfa/indicateurs", slug);
  },
  getAll() {
    return ApiService.get("/gfa/indicateurs");
  },
  getIndicateurBailleur() {
    return ApiService.get("/gfa/bailleur/indicateurs");
  },

  create(params) {
    return ApiService.post("/gfa/indicateurs", params);
  },
  createSuivi(params) {
    return ApiService.post("/gfa/suivi-indicateurs", params);
  },
  getAllSuivis() {
    return ApiService.get(`/gfa/suivi-indicateurs`);
  },
  detailSuivi(id) {
    return ApiService.get(`/gfa/indicateurs/${id}/suivis`);
  },
  validateSuivi(id) {
    return ApiService.post(`/gfa/suivi-indicateurs/${id}/valider`);
  },
  filtre(params) {
    return ApiService.post("/gfa/indicateurs/filtres", params);
  },

  update(slug, params) {
    return ApiService.update("/gfa/indicateurs", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`/gfa/indicateurs/${slug}`);
  },

  programmes(slug) {
    return ApiService.get(`/gfa/indicateurs/${slug}/programmes`);
  },
};

export default IndicateursService;