import ApiService from "@/services/configs/api.service";

const TypeGouvernaceService = {
  query(type, params) {
    return ApiService.query("gfa/types-de-gouvernance", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/types-de-gouvernance", slug);
  },

  getAllProgrammes() {
    return ApiService.get("programmes");
  },

  create(params) {
    return ApiService.post("gfa/types-de-gouvernance", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/types-de-gouvernance", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/types-de-gouvernance/${slug}`);
  },
};

export default TypeGouvernaceService;
