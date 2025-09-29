import ApiService from "@/services/configs/api.service";

const TypeGouvernaceFactuelService = {
  query(type, params) {
    return ApiService.query("gfa/enquete-de-gouvernance/types-de-gouvernance-factuel", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/enquete-de-gouvernance/types-de-gouvernance-factuel", slug);
  },

  getAllProgrammes() {
    return ApiService.get("programmes");
  },

  create(params) {
    return ApiService.post("gfa/enquete-de-gouvernance/types-de-gouvernance-factuel", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/enquete-de-gouvernance/types-de-gouvernance-factuel", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/types-de-gouvernance-factuel/${slug}`);
  },
};

export default TypeGouvernaceFactuelService;
