import ApiService from "@/services/configs/api.service";

const ResultatCadreRendementService = {
  query(type, params) {
    return ApiService.query("gfa/resultats-cadre-de-rendement", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/resultats-cadre-de-rendement", slug);
  },
  getCadreRendement(id) {
    return ApiService.get(`gfa/programmes/${id}/cadre-de-mesure-rendement`);
  },

  create(params) {
    return ApiService.post("gfa/resultats-cadre-de-rendement", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/resultats-cadre-de-rendement", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/resultats-cadre-de-rendement/${slug}`);
  },
};

export default ResultatCadreRendementService;
