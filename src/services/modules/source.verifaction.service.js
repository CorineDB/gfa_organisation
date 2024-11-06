import ApiService from "@/services/configs/api.service";

const SourceService = {
  query(type, params) {
    return ApiService.query("gfa/sources-de-verification", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/sources-de-verification", slug);
  },

  create(params) {
    return ApiService.post("gfa/sources-de-verification", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/sources-de-verification", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/sources-de-verification/${slug}`);
  },
};

export default SourceService;
