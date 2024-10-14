
import ApiService from '@/services/configs/api.service'

const ComposantesService = {
  query(type, params) {
    return ApiService.query("/gfa/composantes", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("/gfa/composantes", slug);
  },
  detailComposant(slug) {
    return ApiService.get(`/gfa/composantes/${slug}` );
  },

  create(params) {
    return ApiService.post("/gfa/composantes", params);
  },

  mySuivis(slug) {
    return ApiService.get(`/gfa/composantes/${slug}/suivis`);
  },
  getSuivi() {
    const params = {
      type: "composante",
    };
    return ApiService.post(`suivis/filterByModule`, params);
  },

  update(slug, params) {
    return ApiService.update("/gfa/composantes", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`/gfa/composantes/${slug}`);
  },

  activites(slug) {
    return ApiService.get(`/gfa/composantes/${slug}/activites`);
  },

  sousComposantes(slug) {
    return ApiService.get(`/gfa/composantes/${slug}/sousComposantes`);
  },

  projet(slug) {
    return ApiService.get(`/gfa/composantes/${slug}/projet`);
  },
};

  export default ComposantesService;
  