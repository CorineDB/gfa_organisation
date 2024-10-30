import ApiService from "@/services/configs/api.service";

const EvaluationService = {
  query(type, params) {
    return ApiService.query("gfa/evaluations-de-gouvernance/", {
      params: params,
    });
  },

  getOneEvaluation(id) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${id}/soumissions`);
  },

  create(params) {
    return ApiService.post("gfa/evaluations-de-gouvernance/", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/evaluations-de-gouvernance/", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/evaluations-de-gouvernance/${slug}`);
  },

  prolonger(slug, params) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${slug}/ajouterDuree`, params);
  },
};

export default EvaluationService;
