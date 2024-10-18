import ApiService from "@/services/configs/api.service";

const IndicateurValueKeys = {
  query(type, params) {
    return ApiService.query("/gfa/indicateur-value-keys", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("/gfa/indicateur-value-keys", slug);
  },

  create(params) {
    return ApiService.post("/gfa/indicateur-value-keys", params);
  },

  update(slug, params) {
    return ApiService.update("/gfa/indicateur-value-keys", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`/gfa/indicateur-value-keys/${slug}`);
  },
};

export default IndicateurValueKeys;
