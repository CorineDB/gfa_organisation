import ApiService from "@/services/configs/api.service";

const TachesService = {
  query(type, params) {
    return ApiService.query("gfa/taches", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/taches", slug);
  },

  create(params) {
    return ApiService.post("gfa/taches", params);
  },

  addDate(slug, params) {
    return ApiService.post(`gfa/taches/${slug}/ajouterDuree`, params);
    //return ApiService.post(`gfa/taches/ajouterDuree/${slug}`, params);
  },
  suiviTache(params) {
    return ApiService.post(`suivis`, params);
  },
  mySuivis(slug) {
    return ApiService.get(`gfa/taches/${slug}/suivis`);
  },
  myOldSuivis(params) {
    return ApiService.post(`suivisV2`, params);
  },
  deleteSuivis(slug) {
    return ApiService.get(`gfa/taches/${slug}/changeStatut`);
  },
  getSuivi() {
    const params = {
      type: "tache",
    };
    return ApiService.post(`suivis/filterByModule`, params);
  },

  update(slug, params) {
    return ApiService.update("gfa/taches", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/taches/${slug}`);
  },

  activite(slug) {
    return ApiService.get(`gfa/taches/${slug}/activite`);
  },
};

export default TachesService;
