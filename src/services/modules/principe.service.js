
import ApiService from '@/services/configs/api.service'

const PrincipeService = {
  query(type, params) {
    return ApiService.query("principes", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get(`gouvernance/${slug}/principes`);
  },
  getAll() {
    return ApiService.get(`principes`);
  },

  create(params) {
    return ApiService.post("principes", params);
  },
  submit(params) {
    return ApiService.post("reponses", params);
  },

  update(slug, params) {
    return ApiService.update("principes", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`principes/${slug}`);
  },
};

  export default PrincipeService;
  