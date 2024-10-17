import ApiService from "@/services/configs/api.service";

const SiteService = {
  query(type, params) {
    return ApiService.query("sites", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("sites", slug);
  },

  create(params) {
    return ApiService.post("sites", params);
  },

  update(slug, params) {
    return ApiService.update("sites", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`sites/${slug}`);
  },

  programme(slug) {
    return ApiService.get(`programmes/${slug}/sites`);
  },
};

export default SiteService;
