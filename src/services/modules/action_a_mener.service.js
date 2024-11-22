import ApiService from "@/services/configs/api.service";

const OptionReponse = {
  query(type, params) {
    return ApiService.query("gfa/actions-a-mener", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/actions-a-mener", slug);
  },

  create(params) {
    return ApiService.post("gfa/actions-a-mener", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/actions-a-mener", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/actions-a-mener/${slug}`);
  },
};

export default OptionReponse;
