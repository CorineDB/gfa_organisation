import ApiService from "@/services/configs/api.service";

const EnqueteDeCollecteService = {
  query(type, params) {
    return ApiService.query("gfa/enquetes-de-collecte", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/enquetes-de-collecte", slug);
  },

  create(params) {
    return ApiService.post("gfa/enquetes-de-collecte", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/enquetes-de-collecte", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/enquetes-de-collecte/${slug}`);
  },
};

export default EnqueteDeCollecteService;
