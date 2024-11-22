import ApiService from "@/services/configs/api.service";

const OptionReponse = {
  query(type, params) {
    return ApiService.query("gfa/recommandations", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/recommandations", slug);
  },

  create(params) {
    return ApiService.post("gfa/recommandations", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/recommandations", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/recommandations/${slug}`);
  },
};

export default OptionReponse;
