import ApiService from "@/services/configs/api.service";

const RecommandationService = {
  query(type, params) {
    return ApiService.query("gfa/enquete-de-gouvernance/recommandations", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/enquete-de-gouvernance/recommandations", slug);
  },

  create(params) {
    return ApiService.post("gfa/enquete-de-gouvernance/recommandations", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/enquete-de-gouvernance/recommandations", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/recommandations/${slug}`);
  },
};

export default RecommandationService;
