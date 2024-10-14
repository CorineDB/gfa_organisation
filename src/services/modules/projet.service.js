import ApiService from "@/services/configs/api.service";

const ProjetsService = {
  query(type, params) {
    return ApiService.query("projets", {
      params: params,
    });
  },

  get() {
    return ApiService.get("/gfa/projets");
  },

  create(params) {
    return ApiService.post("/gfa/projets", params);
  },

  update(slug, params) {
    return ApiService.put(`/gfa/projets/${slug}/update`, params);
  },

  destroy(slug) {
    return ApiService.delete(`/gfa/projets/${slug}`);
  },
  getDetailProjet(slug) {
    return ApiService.get(`/gfa/projets/${slug}`);
  },

  programme(slug) {
    return ApiService.get(`projets/${slug}/programme`);
  },

  composantes(slug) {
    return ApiService.get(`projets/${slug}/composantes`);
  },

  statistiques(slug) {
    return ApiService.get(`projets/${slug}/statistiques`);
  },

  prolonger(slug, params) {
    return ApiService.post(`projets/${slug}/prolonger`, params);
  },
};

export default ProjetsService;
