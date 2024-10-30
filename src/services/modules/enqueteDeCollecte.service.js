import ApiService from "@/services/configs/api.service";

const EnqueteDeCollecteService = {
  query(type, params) {
    return ApiService.query("gfa/evaluations-de-gouvernance", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/evaluations-de-gouvernance", slug);
  },

  create(params) {
    return ApiService.post("gfa/evaluations-de-gouvernance", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/evaluations-de-gouvernance", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/evaluations-de-gouvernance/${slug}`);
  },

  soumissions(slug) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${slug}/reponses-collecter`);
    return ApiService.get("gfa/evaluations-de-gouvernance", slug);
  },
};

export default EnqueteDeCollecteService;
