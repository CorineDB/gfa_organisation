import ApiService from "@/services/configs/api.service";

const OptionReponse = {
  query(type, params) {
    return ApiService.query("gfa/options-de-reponse", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/options-de-reponse", slug);
  },

  create(params) {
    return ApiService.post("gfa/options-de-reponse", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/options-de-reponse", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/options-de-reponse/${slug}`);
  },
};

export default OptionReponse;
