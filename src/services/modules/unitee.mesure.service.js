import ApiService from "@/services/configs/api.service";

const UniteeDeMesureService = {
  query(type, params) {
    return ApiService.query("/gfa/unitees-de-mesure", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("/gfa/unitees-de-mesure", slug);
  },

  create(params) {
    return ApiService.post("/gfa/unitees-de-mesure", params);
  },

  update(slug, params) {
    return ApiService.update("/gfa/unitees-de-mesure", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`/gfa/unitees-de-mesure/${slug}`);
  },
};

export default UniteeDeMesureService;
