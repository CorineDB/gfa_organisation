import ApiService from "@/services/configs/api.service";

const ActionsAMenerService = {
  query(type, params) {
    return ApiService.query("gfa/enquete-de-gouvernance/actions-a-mener", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/enquete-de-gouvernance/actions-a-mener", slug);
  },

  create(params) {
    return ApiService.post("gfa/enquete-de-gouvernance/actions-a-mener", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/enquete-de-gouvernance/actions-a-mener", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/actions-a-mener/${slug}`);
  },
};

export default ActionsAMenerService;
